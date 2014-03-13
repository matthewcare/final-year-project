var math = {

	// Variables
	meanValue: null,
    medianValue: null,
    modeValue: null,

	noteFromPitch: function (frequency) {
        return Math.round(12 * (Math.log(frequency / 440) / Math.log(2))) + 69;
    },

    frequencyFromNoteNumber: function (note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    },

    centsOffFromPitch: function (frequency, note) {
        return Math.floor(1200 * Math.log(frequency / this.frequencyFromNoteNumber(note)) / Math.log(2));
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
}