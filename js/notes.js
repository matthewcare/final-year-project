var note = {
	CONSTANTFREQ: 440,
	notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
	get: function (freq, cb) {
		if (!freq)
			return cb('Enter something.');
		return cb(null, this.notes[(69 + Math.round(12 * ( Math.log(freq / this.CONSTANTFREQ) ) / Math.log(2) )) % 12]);
	}
};