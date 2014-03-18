var analyser = {
    // Constants
    MINVAL: 134,  // 128 === 0. MINVAL = minimum detected signal
    NOTESTRINGS: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],

    // Variables
    animationFrameId: null,
    currentCharacter: 0,
    incorrect: false,
    frequencyArray: [],
    userInputArray: [],


    findNextPositiveZeroCrossing: function (start) {
        var i = Math.ceil(start),
            lastZero = -1,
            t = 0;

        // Increment i until 0 or negative
        while (i < stream.BUFFERLENGTH && (stream.buffer[i] > 128)) {
            i++;
        }

        if (i >= stream.BUFFERLENGTH) {
            return -1;
        }

        // Increment i until above MINVAL
        while (i < stream.BUFFERLENGTH && ((t = stream.buffer[i]) < this.MINVAL)) {
            if (t >= 128) {
                if (lastZero === -1) {
                    lastZero = i;
                }
            } else {
                lastZero = -1;
            }
            i++;
        }

        // while (i < stream.BUFFERLENGTH) {
        //     t = stream.buffer[i];
        //     if (t >= 128 && t < this.MINVAL) { // when t is between 128 and 133
        //         lastZero = (t === 128 && lastZero === -1) ? i : -1;
        //     }
        //     i++
        // }

        // CHeck to see if MINVAL was jumped over
        if (lastZero === -1) {
            lastZero = i;
        }

        if (i === stream.BUFFERLENGTH) {
            return -1;
        }

        //Check to see if first sample was 0
        if (lastZero === 0) {
            return 0;
        }

        // If 0 was between two values
        t = (128 - stream.buffer[lastZero - 1]) / (stream.buffer[lastZero] - stream.buffer[lastZero - 1]);
        return lastZero + t;
    },

    updatePitch: function (task) {
        var cycles = [],
            lastZero = this.findNextPositiveZeroCrossing(0),
            nextZero = 0,
            numberOfCycles = null,
            i = 0,
            n = 0,
            sum = 0,
            frequency = 0;

        stream.analyser.getByteTimeDomainData(stream.buffer);

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
            frequency = stream.audioContext.sampleRate / sum;
        }

        if (task === 'scales') {
            this.measuresOfCentralTendency(frequency);
        } else if (task === 'tuner'){
            this.updateTunerDisplay(numberOfCycles, frequency, 1);
            this.measuresOfCentralTendency(frequency);
        }
        
        // if (!window.requestAnimationFrame) {
        //     window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        // }
        // this.animationFrameId = window.requestAnimationFrame(this.updatePitch.bind(this));

        setTimeout(this.updatePitch.bind(this, task), 4);

    },

    getElement: function (elementId) {
        return document.getElementById(elementId);
    },

    updateScaleDisplay: function (frequency) {

        var note =  math.noteFromPitch(frequency),
            currentScaleText = document.getElementById('currentScale');

        if (this.incorrect) {
            currentScaleText.innerHTML = scalesToString.returned();
        }

        this.userInputArray.push(this.NOTESTRINGS[note % 12]);
        this.compareArrays();
    },

    updateTunerDisplay: function (numberOfCycles, frequency, id) {
        var note = 0,
            cent = 0;
        if (id === 1) {
            if (numberOfCycles === 0) {
                this.getElement('livePitch').innerHTML = "--";
                this.getElement('liveNote').innerHTML = "-";
                this.getElement('liveCent').className = "";
                this.getElement('liveCentAmount').innerHTML = "--";
            } else {
                note =  math.noteFromPitch(frequency);
                cent = math.centsOffFromPitch(frequency, note);
                this.getElement('livePitch').innerHTML = Math.floor(frequency);
                this.getElement('liveNote').innerHTML = this.NOTESTRINGS[note % 12];

                if (cent === 0) {
                    this.getElement('liveCent').className = "";
                    this.getElement('liveCentAmount').innerHTML = "--";
                } else {
                    if (cent < 0) {
                        this.getElement('liveCent').className = "flat";
                    } else {
                        this.getElement('liveCent').className = "sharp";
                    }
                    this.getElement('liveCentAmount').innerHTML = Math.abs(cent) + ' ';
                }
            }
        }

        if (id === 2) {
            note =  math.noteFromPitch(frequency);
            cent = math.centsOffFromPitch(frequency, note);
            this.getElement('wholeSamplePitch').innerHTML = Math.floor(frequency);
            this.getElement('wholeSampleNote').innerHTML = this.NOTESTRINGS[note % 12];

            if (cent === 0) {
                this.getElement('wholeSampleCent').className = "";
                this.getElement('wholeSampleCentAmount').innerHTML = "--";
            } else {
                if (cent < 0) {
                    this.getElement('wholeSampleCent').className = "flat";
                } else {
                    this.getElement('wholeSampleCent').className = "sharp";
                }
                this.getElement('wholeSampleCentAmount').innerHTML = Math.abs(cent) + ' ';
            }
        }
    },

    compareArrays: function () {
        var userInputArrayLength = (this.userInputArray.length) - 1,
            output = document.getElementById('outputParagraph');

        if (scales.activeScale === null) {
            output.innerHTML = ("You must select a scale");
            this.userInputArray = [];
        } else if (this.userInputArray[userInputArrayLength] === scales.activeScale[userInputArrayLength]) {
            document.getElementById(this.currentCharacter).id = "correct";
            this.currentCharacter = this.currentCharacter + 1;
            this.incorrect = false;
        } else {
            document.getElementById(this.currentCharacter).id = "incorrect";
            this.currentCharacter = 0;
            this.userInputArray = [];
            this.incorrect = true;
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
            if (stream.task === 'scales') {
                this.updateScaleDisplay(math.modeValue);
            } else if (stream.task === 'tuner') {
                this.updateTunerDisplay(null, math.modeValue, 2);
            };
            
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