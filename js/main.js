var submitBtn = document.getElementById('button'),
	liveInputToggleBtn = document.getElementById('liveInputToggleBtn'),
	freq = document.getElementById('freq'),
	output = document.getElementById('output'),
	toggle = 0;

submitBtn.addEventListener('click', function (e) {
	note.get(freq.value, function (err, note) {
		if (err)
			return output.value = 'you errored out';
		return output.value = 'You played ' + note;
	});
	e.preventDefault();
});

liveInputToggleBtn.addEventListener('click', function (e) {
	if (toggle === 0) {
		stream.startMedia();
		toggle = 1;
	} else {
		stream.stopMedia();
		toggle = 0;
	}
	e.preventDefault();
});