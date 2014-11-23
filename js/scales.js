var scales = {

    // Variables
    activeScale: null,

    // Constants
    gradeOne: {
        CMAJOR:                 ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B", "C", "B", "A", "G", "F", "E", "D", "C", "B", "A", "G", "F", "E", "D", "C"],
        GMAJOR:                 ["G", "A", "B", "C", "D", "E", "F#", "G", "A", "B", "C", "D", "E", "F#", "G", "F#", "E", "D", "C", "B", "A", "G", "F#", "E", "D", "C", "B", "A", "G"],
        DMAJOR:                 ["D", "E", "F#", "G", "A", "B", "C#", "D", "E", "F#", "G", "A", "B", "C#", "D", "C#", "B", "A", "G", "F#", "E", "D", "C#", "B", "A", "G", "F#", "E", "D"],

        AMINORHARMONIC:         ["A", "B", "C", "D", "E", "F", "G#", "A", "B", "C", "D", "E", "F", "G#", "A", "G#", "F", "E", "D", "C", "B", "A", "G#", "F", "E", "D", "C", "B", "A"],
        DMINORHARMONIC:         ["D", "E", "F", "G", "A", "B", "C#", "D", "E", "F", "G", "A", "B", "C#", "D", "C#", "B", "A", "G", "F", "E", "D", "C#", "B", "A", "G", "F", "E", "D"]
    },

    // Takes the user input note and adds it to an array to be compared
    updateScaleDisplay: function (note) {
        var currentScaleText = document.getElementById('currentScale'),
            compareArrays = theMath.compareArrays(note, this.activeScale),
            correct = compareArrays[0],
            currentCharacter = compareArrays[1],
            percentageCorrect = compareArrays [2];

        // Add a reset button that uses this?
        // if (this.incorrect) {
        //     currentScaleText.innerHTML = scalesToString.returned();
        // }

        if (correct === 'completeCorrect') {
            document.getElementById(currentCharacter).setAttribute('class', 'correct');
            theMath.resetArrays();
            // this.displayResults(percentageCorrect);
        } else if (correct === 'completeIncorrect') {
            document.getElementById(currentCharacter).setAttribute('class', 'incorrect');
            theMath.resetArrays();
            // this.displayResults(percentageCorrect);
        } else if (correct === 'correct') {
            document.getElementById(currentCharacter).setAttribute('class', 'correct');
        } else if (correct === 'incorrect') {
            document.getElementById(currentCharacter).setAttribute('class', 'incorrect');
        }
    }
};

// Takes the scale arrays and formats each element in the array into its own span
// so that its ID can be manipulated later on
var scalesToString = {
    returned: function () {
        var spanId = 0,
            locationText = scales.activeScale.toString().replace(/,/g, ' ');

        locationText = locationText.replace(/\S+/g, function (a) { return "<span id=" + (spanId++) + ">" + a + "</span>"; });
        return locationText;
    }
};

// Adds event listeners to the buttons on page load
// so that DOM manipulation can take place based on
// button click
(function () {

    addEventListenerByClass = function () {
        var list = document.getElementsByClassName('scales'),
            location = document.getElementById('currentScale'),
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
                }
                e.preventDefault();
            }, false);
        }
    };

    window.addEventListener('load', function loaded() {
        addEventListenerByClass();
    }, false);

}());