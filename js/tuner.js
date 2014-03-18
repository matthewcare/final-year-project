(function () {

    var pageLoaded = function () {
        var liveInputToggleBtn = document.getElementById('liveInputToggleBtn');

        liveInputToggleBtn.addEventListener('click', function (e) {
            stream.startMedia('tuner');
            liveInputToggleBtn.value = "Running";
            e.preventDefault();
        }, false);
    };

    window.addEventListener('load', function loaded() {
        pageLoaded();
    }, false);
}());