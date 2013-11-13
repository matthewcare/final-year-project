navigator.getMedia = (navigator.getUserMedia ||
                      navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia ||
                      navigator.msGetUserMedia);

var stream = {

    analyser: null,
    audioContext: null,
    localStream: null,
    animationFrameId: null,
    tracks: null,
    buffer: null,
    bufferLength: 1024,
    MINVAL: 134,
    detectorElement: null,
    pitchElement: null,
    noteElement: null,
    centElement: null,
    centAmount: null,
    noteStrings: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    avarageArray: [],

    startMedia: function () {
        this.pitchElement = document.getElementById('pitch');
        this.noteElement = document.getElementById('note');
        this.centElement = document.getElementById('cent');
        this.centAmount = document.getElementById('centAmount');
        this.audioContext = new webkitAudioContext();
        this.buffer = new Uint8Array(this.bufferLength);
        this.initUserMedia({audio: true}, this.gotStream.bind(this), this.errorCb());
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

        while (i < this.bufferLength && (this.buffer[i] > 128)) {
            i++;
        }

        if (i >= this.bufferLength) {
            return -1;
        }

        while (i < this.bufferLength && ((t = this.buffer[i]) < this.MINVAL)) {
            if (t >= 128) {
                if (lastZero === -1) {
                    lastZero = i;
                }
            } else {
                lastZero = -1;
            }
            i++;
        }

        if (lastZero === -1) {
            lastZero = i;
        }

        if (i === this.bufferLength) {
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
            frequency = 0,
            note = 0,
            cent = 0;

        this.analyser.getByteTimeDomainData(this.buffer);
        while (lastZero !== -1) {
            nextZero = this.findNextPositiveZeroCrossing(lastZero + 1);
            if (nextZero > -1) {
                cycles.push(nextZero - lastZero);
            }
            lastZero = nextZero;

            n++;
            if (n > 1000) {
                break;
            }
        }

        numberOfCycles = cycles.length;

        for (i = 0; i < numberOfCycles; i++) {
            sum += cycles[i];
        }

        if (numberOfCycles) {
            sum /= numberOfCycles;
            frequency = this.audioContext.sampleRate / sum;
        }

        if (numberOfCycles === 0) {
            this.pitchElement.innerText = "--";
            this.noteElement.innerText = "-";
            this.centElement.className = "";
            this.centAmount.innerText = "--";
        } else {
            this.pitchElement.innerText = Math.floor(frequency);
            note =  this.noteFromPitch(frequency);
            cent = this.centsOffFromPitch(frequency, note);
            this.noteElement.innerText = this.noteStrings[note % 12];
            if (cent === 0) {
                this.centElement.className = "";
                this.centAmount.innerText = "--";
            } else {
                if (cent < 0) {
                    this.centElement.className = "flat";
                } else {
                    this.centElement.className = "sharp";
                }
                this.centAmount.innerText = Math.abs(cent);
            }
        }

        this.averaging(frequency);

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        }
        this.animationFrameId = window.requestAnimationFrame(this.updatePitch.bind(this));
    },


    averaging: function (frequency) {
        var average = null,
            sum = null;

        if (this.avarageArray.length === 60) {
            console.log(this.avarageArray);
            sum = this.avarageArray.reduce(function (a, b) {
                return a + b;
            });
            average = sum / this.avarageArray.length;
            console.log(this.noteStrings[this.noteFromPitch(frequency) % 12]);
            this.avarageArray.length = 0;
        } else if (frequency === 0) {
            this.avarageArray.length = 0;
        } else {
            this.avarageArray.push(frequency);
        }
    },

    errorCb: function (err) {
        if (err) {
            console.log('Massive error');
        }
    },

    stopMedia: function () {
        console.log('No idea yet');
    }
};