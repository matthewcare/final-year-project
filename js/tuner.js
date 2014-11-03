var tuner = {

    // Updates the tuner display with the modal value of user input
    updateTunerDisplay: function (frequency) {
        var note =  theMath.noteString(frequency),
            cent = theMath.centsFromFrequency(frequency),
            octave = theMath.octave(frequency);

        document.getElementById('wholeSamplePitch').innerHTML = Math.floor(frequency);
        document.getElementById('wholeSampleNote').innerHTML = note + octave;

        if (cent === 0) {
            document.getElementById('wholeSampleCent').className = "";
            document.getElementById('wholeSampleCentAmount').innerHTML = "--";
        } else {
            if (cent < 0) {
                document.getElementById('wholeSampleCent').className = "flat";
            } else {
                document.getElementById('wholeSampleCent').className = "sharp";
            }
            document.getElementById('wholeSampleCentAmount').innerHTML = Math.abs(cent) + ' ';
        }
    }
};

// Adds event listeners to the start button
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