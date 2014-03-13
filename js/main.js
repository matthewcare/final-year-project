(function () {

	var pageLoaded = function () {
		var liveInputToggleBtn = document.getElementById('liveInputToggleBtn'),
			toggle = 0;

		liveInputToggleBtn.addEventListener('click', function (e) {
			if (toggle === 0) {
				analyser.startMedia();
				toggle = 1;
				liveInputToggleBtn.value = "Live Input Off";
			} else {
				analyser.stopMedia();
				toggle = 0;
				liveInputToggleBtn.value = "Live Input On";
			}
			e.preventDefault();
		}, false);
	};

	window.addEventListener('load', function loaded() {
		pageLoaded();
	}, false);

}());