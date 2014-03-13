navigator.getMedia = (navigator.getUserMedia ||
                      navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia ||
                      navigator.msGetUserMedia);

var errorLogger = function (err) {
    if (err)
        console.log(err);
}

var analyser = {
    // Constants
    BUFFERLENGTH: 1024,
    MINVAL: 134,  // 128 === 0. MINVAL = minimum detected signal
    NOTESTRINGS: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],

    // Variables
    analyser: null,
    audioContext: null,
    localStream: null,
    animationFrameId: null,
    buffer: null,
    frequencyArray: [],
    userInputArray: [],

    startMedia: function () {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();          
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

    findNextPositiveZeroCrossing: function (start) {
        var i = Math.ceil(start),
            lastZero = -1,
            t = 0;

        // Increment i until 0 or negative
        while (i < this.BUFFERLENGTH && (this.buffer[i] > 128)) {
            i++;
        }

        if (i >= this.BUFFERLENGTH) {
            return -1;
        }

        // Increment i until above MINVAL
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

        // CHeck to see if MINVAL was jumped over
        if (lastZero === -1) {
            lastZero = i;
        }

        if (i === this.BUFFERLENGTH) {
            return -1;
        }

        //Check to see if first sample was 0
        if (lastZero === 0) {
            return 0;
        }

        // If 0 was between two values
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

        this.measuresOfCentralTendency(frequency);

        // if (!window.requestAnimationFrame) {
        //     window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        // }
        // this.animationFrameId = window.requestAnimationFrame(this.updatePitch.bind(this));

        setTimeout(this.updatePitch.bind(this), 4);

    },

    getElement: function (elementId) {
        return document.getElementById(elementId);
    },

    updateDisplay: function (numberOfCycles, frequency) {

        var note = 0,
            note =  math.noteFromPitch(frequency),
            display = document.getElementById('userInputArray');


        this.userInputArray.push(this.NOTESTRINGS[note % 12]);

        display.innerHTML = this.userInputArray.toString().replace(/,/g, ', ');

        this.compareArrays();
    },

    compareArrays: function () {
        var userInputArrayLength = (this.userInputArray.length) - 1,
            output = document.getElementById('outputParagraph');

        if (scales.activeScale === null) {
            output.innerHTML = ("You must select a scale");
            this.userInputArray = [];
        } else if (this.userInputArray[userInputArrayLength] === scales.activeScale[userInputArrayLength]) {
            output.innerHTML = ("Correct");
        } else {
            output.innerHTML = ("Incorrect");
            this.userInputArray = [];
        }
        
    },

    measuresOfCentralTendency: function (frequency) {
        if (this.frequencyArray.length > 50 && frequency === 0) {  //  consider creating maximim array length?
            //math.mean(this.frequencyArray);
            //math.median(this.frequencyArray);
            math.mode(this.frequencyArray);
            // console.log('Mean: ' + math.meanValue + ' ' +  this.NOTESTRINGS[this.noteFromPitch(this.meanValue) % 12]);
            // console.log('Median: ' + math.medianValue + ' ' +  this.NOTESTRINGS[this.noteFromPitch(this.medianValue) % 12]);
            // console.log('Mode: ' + math.modeValue + ' ' + this.NOTESTRINGS[this.noteFromPitch(this.modeValue) % 12] + '\n');
            this.updateDisplay(null, math.modeValue, 2);
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