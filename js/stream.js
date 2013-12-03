navigator.getMedia = (navigator.getUserMedia ||
                      navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia ||
                      navigator.msGetUserMedia);

var errorLogger = function (err) {
    if (err)
        console.log(err);
}

var stream = {
    // Constants
    BUFFERLENGTH: 1024,
    MINVAL: 134,
    NOTESTRINGS: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],

    // Variables
    analyser: null,
    audioContext: null,
    localStream: null,
    animationFrameId: null,
    tracks: null,
    buffer: null,
    livePitchElement: null,
    liveNoteElement: null,
    liveCentElement: null,
    liveCentAmount: null,
    wholeSamplePitchElement: null,
    wholeSampleNoteElement: null,
    wholeSampleCentElement: null,
    wholeSampleCentAmount: null,
    meanValue: null,
    medianValue: null,
    modeValue: null,
    frequencyArray: [],

    startMedia: function () {
        this.livePitchElement = document.getElementById('livePitch');
        this.liveNoteElement = document.getElementById('liveNote');
        this.liveCentElement = document.getElementById('liveCent');
        this.liveCentAmount = document.getElementById('liveCentAmount');
        this.wholeSamplePitchElement = document.getElementById('wholeSamplePitch');
        this.wholeSampleNoteElement = document.getElementById('wholeSampleNote');
        this.wholeSampleCentElement = document.getElementById('wholeSampleCent');
        this.wholeSampleCentAmount = document.getElementById('wholeSampleCentAmount');
        this.audioContext = new webkitAudioContext();
        this.buffer = new Uint8Array(this.BUFFERLENGTH);
        this.initUserMedia({audio: true}, this.gotStream.bind(this), errorLogger);
    },

    initUserMedia: function (obj, cb, err) {
        navigator.getMedia(obj, cb, err);
    },

    gotStream: function (localStream) {
        this.localStream = localStream;
        var mediaStreamSource = this.audioContext.createMediaStreamSource(localStream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        mediaStreamSource.connect(this.analyser);
        this.updatePitch();
    },

    noteFromPitch: function (frequency) {
        var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
        return Math.round(noteNum) + 69;
    },

    frequencyFromNoteNumber: function (note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    },

    centsOffFromPitch: function (frequency, note) {
        return Math.floor(1200 * Math.log(frequency / this.frequencyFromNoteNumber(note)) / Math.log(2));
    },

    findNextPositiveZeroCrossing: function (start) {
        var i = Math.ceil(start),
            lastZero = -1,
            t = 0;

        while (i < this.BUFFERLENGTH && (this.buffer[i] > 128)) {
            i++;
        }

        if (i >= this.BUFFERLENGTH) {
            return -1;
        }

        while (i < this.BUFFERLENGTH && ((t = this.buffer[i]) < this.MINVAL)) {
            if (t >= 128) {
                if (lastZero === -1) {
                    lastZero = i;
                }
            } else {
                lastZero = -1;
            }
            i++;
        }

        // while (i < this.BUFFERLENGTH) {
        //     t = this.buffer[i];
        //     if (t >= 128 && t < this.MINVAL) { // when t is between 128 and 133
        //         lastZero = (t === 128 && lastZero === -1) ? i : -1;
        //     }
        //     i++
        // }

        // lastZero = lastZero === -1 ? i : -1;

        if (lastZero === -1) {
            lastZero = i;
        }

        if (i === this.BUFFERLENGTH) {
            return -1;
        }

        if (lastZero === 0) {
            return 0;
        }

        t = (128 - this.buffer[lastZero - 1]) / (this.buffer[lastZero] - this.buffer[lastZero - 1]);
        return lastZero + t;
    },

    updatePitch: function () {
        var cycles = [],
            lastZero = this.findNextPositiveZeroCrossing(0),
            nextZero = 0,
            numberOfCycles = null,
            i = 0,
            n = 0,
            sum = 0,
            frequency = 0;

        this.analyser.getByteTimeDomainData(this.buffer);

        for (n = 0; n < 1000; n++) {
            if (lastZero === -1) {
                break;
            }
            nextZero = this.findNextPositiveZeroCrossing(lastZero + 1);
            if (nextZero > -1) {
                cycles.push(nextZero - lastZero);
            }
            lastZero = nextZero;
        }

        numberOfCycles = cycles.length;

        for (i = 0; i < numberOfCycles; i++) {
            sum += cycles[i];
        }

        if (numberOfCycles) {
            sum /= numberOfCycles;
            frequency = this.audioContext.sampleRate / sum;
        }

        this.updateDisplay(numberOfCycles, frequency, 1);
        this.measuresOfCentralTendancy(frequency);

        // if (!window.requestAnimationFrame) {
        //     window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        // }
        // this.animationFrameId = window.requestAnimationFrame(this.updatePitch.bind(this));

        setTimeout(this.updatePitch.bind(this), 4);

    },

    updateDisplay: function (numberOfCycles, frequency, id) {

        var note = 0,
            cent = 0;

        if (id === 1) {
            if (numberOfCycles === 0) {
                this.livePitchElement.innerText = "--";
                this.liveNoteElement.innerText = "-";
                this.liveCentElement.className = "";
                this.liveCentAmount.innerText = "--";
            } else {
                this.livePitchElement.innerText = Math.floor(frequency);
                note =  this.noteFromPitch(frequency);
                cent = this.centsOffFromPitch(frequency, note);
                this.liveNoteElement.innerText = this.NOTESTRINGS[note % 12];

                if (cent === 0) {
                    this.liveCentElement.className = "";
                    this.liveCentAmount.innerText = "--";
                } else {
                    if (cent < 0) {
                        this.liveCentElement.className = "flat";
                    } else {
                        this.liveCentElement.className = "sharp";
                    }
                    this.liveCentAmount.innerText = Math.abs(cent) + ' ';
                }
            }
        }

        if (id === 2) {
            this.wholeSamplePitchElement.innerText = Math.floor(frequency);
            note =  this.noteFromPitch(frequency);
            cent = this.centsOffFromPitch(frequency, note);
            this.wholeSampleNoteElement.innerText = this.NOTESTRINGS[note % 12];

            if (cent === 0) {
                this.wholeSampleCentElement.className = "";
                this.wholeSampleCentAmount.innerText = "--";
            } else {
                if (cent < 0) {
                    this.wholeSampleCentElement.className = "flat";
                } else {
                    this.wholeSampleCentElement.className = "sharp";
                }
                this.wholeSampleCentAmount.innerText = Math.abs(cent) + ' ';
            }
        }

    },


    mean: function (values) {
        var sumOfArray = null;

        sumOfArray = values.reduce(function (a, b) {return a + b;});
        this.meanValue = sumOfArray / values.length;
    },

    median: function (values) {
        values.sort(function (a, b) {return a - b;});

        var half = Math.floor(values.length / 2);

        if (values.length % 2) {
            this.medianValue = values[half];
        } else {
            this.medianValue = (values[half - 1] + values[half]) / 2.0;
        }
    },

    mode: function (values) {
        var frequency = {},
            v = null,          // array of frequency.
            max = null;        // holds the max frequency.

        for (v in values) {
            frequency[values[v]] = (frequency[values[v]] || 0) + 1; // increment frequency.
            if (frequency[values[v]] > max) {                       // is this frequency > max so far ?
                max = frequency[values[v]];                         // update max.
                this.modeValue = values[v];                         // update mode.
            }
        }
    },

    measuresOfCentralTendancy: function (frequency) {
        if (this.frequencyArray.length > 50 && frequency === 0) {  //  consider creating maximim array length?
            //this.mean(this.frequencyArray);
            //this.median(this.frequencyArray);
            this.mode(this.frequencyArray);
            // console.log('Mean: ' + this.meanValue + ' ' +  this.NOTESTRINGS[this.noteFromPitch(this.meanValue) % 12]);
            // console.log('Median: ' + this.medianValue + ' ' +  this.NOTESTRINGS[this.noteFromPitch(this.medianValue) % 12]);
            console.log('Mode: ' + this.modeValue + ' ' + this.NOTESTRINGS[this.noteFromPitch(this.modeValue) % 12] + '\n');
            this.updateDisplay(null, this.modeValue, 2);
            this.frequencyArray.length = 0;
        } else if (frequency === 0 && this.frequencyArray.length > 0) {
            this.frequencyArray.length = 0;
        } else {
            this.frequencyArray.push(Math.round(frequency));
        }
    },

    stopMedia: function () {
        console.log('No idea yet');
    }
};