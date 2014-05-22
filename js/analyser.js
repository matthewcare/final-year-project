var analyser = {
    // Constants
    MINVAL: 134,  // 128 is the zero crossing value. MINVAL is the minimum value that the analyser will detect

    // Variables
    frequencyArray: [],

    // Find the next zero crossing position
    findZeroCrossing: function (param) {
        var i = Math.ceil(param),
            bufferValue = 0,
            previousZeroPosition = -1;

        // Increment i until 0 or negative
        while (i < stream.BUFFERLENGTH && (stream.buffer[i] > 128)) {
            i++;
        }

        if (i >= stream.BUFFERLENGTH) {
            return -1;
        }

        // Remember the last zero whilst incrementing i until above MINVAL
        while (i < stream.BUFFERLENGTH && ((bufferValue = stream.buffer[i]) < this.MINVAL)) {
            if (bufferValue >= 128) {
                if (previousZeroPosition === -1) {
                    previousZeroPosition = i;
                }
            } else {
                previousZeroPosition = -1;
            }
            i++;
        }

        // Check to see if MINVAL was skipped
        if (previousZeroPosition === -1) {
            previousZeroPosition = i;
        }

        // No crossings found
        if (i === stream.BUFFERLENGTH) {
            return -1;
        }

        // Check to see if first sample was 0
        if (previousZeroPosition === 0) {
            return 0;
        }

        // If 0 was between two values
        return previousZeroPosition + (128 - stream.buffer[previousZeroPosition - 1]) / (stream.buffer[previousZeroPosition] - stream.buffer[previousZeroPosition - 1]);
    },

    // Use zero crossing values to determine the frequency
    frequencyLoop: function () {
        var cycleArray = [],
            previousZeroPosition = this.findZeroCrossing(0),
            nextZeroPosition = 0,
            numberOfCycles = null,
            i = 0,
            j = 0,
            store = 0,
            frequency = 0;

        stream.analyser.getByteTimeDomainData(stream.buffer);

        // Find crossing, push the cycle lengths to the cycleArray
        for (j = 0; j < 1000; j++) {
            if (previousZeroPosition === -1) {
                break;
            }
            nextZeroPosition = this.findZeroCrossing(previousZeroPosition + 1);
            if (nextZeroPosition > -1) {
                cycleArray.push(nextZeroPosition - previousZeroPosition);
            }
            previousZeroPosition = nextZeroPosition;
        }

        numberOfCycles = cycleArray.length;

        for (i = 0; i < numberOfCycles; i++) {
            store = store + cycleArray[i];
        }

        if (numberOfCycles) {
            store = store / numberOfCycles;
            frequency = stream.audioContext.sampleRate / store;
        }

        this.dataStore(frequency);
        setTimeout(this.frequencyLoop.bind(this), 4);
    },

    // Store the frequencies in an array and when the array size is 
    // equal to, or more than the maximum value of the progress bar
    // update the display based on task.
    dataStore: function (frequency) {
        var progressBar = document.getElementById('progressBar');
        if (this.frequencyArray.length >= progressBar.max && frequency === 0) {
            modeValue = theMath.mode(this.frequencyArray);
            note = theMath.modeValue

            if (stream.task === 'scales') {
                scales.updateScaleDisplay(note);
            } else if (stream.task === 'tuner') {
                tuner.updateTunerDisplay(modeValue);
            } else if (stream.task === 'sight') {
                sight.updateSightDisplay(note);
            }

            this.frequencyArray.length = 0;
        } else if (frequency === 0 && this.frequencyArray.length > 0) {
            this.frequencyArray.length = 0;
        } else if (frequency !== 0) {
            this.frequencyArray.push(Math.round(frequency));
            progressBar.value = this.frequencyArray.length;
        }
    }
};