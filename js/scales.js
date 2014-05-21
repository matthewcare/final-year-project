var scales = {

    // Variables
    activeScale: null,

    // Constants
    gradeOne: {
        CMAJOR:                 ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B", "C", "B", "A", "G", "F", "E", "D", "C", "B", "A", "G", "F", "E", "D", "C"],
        GMAJOR:                 ["G", "A", "B", "C", "D", "E", "F#", "G", "A", "B", "C", "D", "E", "F#", "G", "F#", "E", "D", "C", "B", "A", "G", "F#", "E", "D", "C", "B", "A", "G"],
        DMAJOR:                 ["D", "E", "F#", "G", "A", "B", "C#", "D", "E", "F#", "G", "A", "B", "C#", "D", "C#", "B", "A", "G", "F#", "E", "D", "C#", "B", "A", "G", "F#", "E", "D"],

        AMINORHARMONIC:         ["A", "B", "C", "D", "E", "F", "G#", "A", "B", "C", "D", "E", "F", "G#", "A", "G#", "F", "E", "D", "C", "B", "A", "G#", "F", "E", "D", "C", "B", "A"],
        DMINORHARMONIC:         ["D", "E", "F", "G", "A", "B", "C#", "D", "E", "F", "G", "A", "B", "C#", "D", "C#", "B", "A", "G", "F", "E", "D", "C#", "B", "A", "G", "F", "E", "D"],
    },

    // Takes the user input note and adds it to an array to be compared
    updateScaleDisplay: function (frequency) {
        var notePressed =  theMath.noteString(frequency),
            currentScaleText = document.getElementById('currentScale');

        // Add a reset button that uses this
        if (this.incorrect) {
            currentScaleText.innerHTML = scalesToString.returned();
        }

        this.userInputArray.push(note);
        compareArrays = theMath.compareArrays(notePressed, this.noteArray);
        correct = compareArrays[0];
        currentCharacter = compareArrays[1]


        if (correct === 'complete') {
            document.getElementById('currentScale').innerHTML = "Correct, pick a new scale";
        } else if (correct === 'correct') {
            document.getElementById(this.currentCharacter).id = "correct";
        } else if (correct === 'incorrect') {
            document.getElementById(this.currentCharacter).id = "incorrect";
        };
    }
};

// Takes the scale arrays and formats each element in the array into its own span
// so that its ID can be manipulated later on
var scalesToString = {
    returned: function () {
        var spanId = 0;

        locationText = scales.activeScale.toString().replace(/,/g, ' ');
        locationText = locationText.replace(/\S+/g, function (a) { return "<span id=" + (spanId++) + ">" + a + "</span>"; });
        return locationText;
    }
};

// Adds event listeners to the buttons on page load
// so that DOM manipulation can take place based on
// button click
(function () {

    var location = document.getElementById('currentScale'),

        addEventListenerByClass = function () {
            var list = document.getElementsByClassName('scales'),
                length = list.length,
                i = 0;
            for (i = 0, length; i < length; i++) {
                list[i].addEventListener('click', function (e) {
                    scales.activeScale = scales.gradeOne[this.id];
                    location.innerHTML = scalesToString.returned(scales.activeScale);
                    analyser.userInputArray = [];
                    scales.currentCharacter = 0;
                    if (stream.analyser === null) {
                        stream.startMedia('scales');
                    };
                    e.preventDefault();
                }, false);
            };
        };

    window.addEventListener('load', function loaded() {
        addEventListenerByClass();
    }, false);

}());