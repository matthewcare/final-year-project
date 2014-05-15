var scales = {

    // Variables
    activeScale: null,
    currentCharacter: 0,
    incorrect: false,
    userInputArray: [],

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
        var note =  theMath.noteString(frequency),
            currentScaleText = document.getElementById('currentScale');

        if (this.incorrect) {
            currentScaleText.innerHTML = scalesToString.returned();
        }

        this.userInputArray.push(note);
        this.compareArrays();
    },

    // Compares the input array against the 'known correct' array
    // Updates the display accordingly
    compareArrays: function () {
        var userInputArrayLength = (this.userInputArray.length) - 1,
            output = document.getElementById('outputParagraph');

        if (scales.activeScale === null) {
            output.innerHTML = ("You must select a scale");
            this.userInputArray = [];
        } else if (this.userInputArray[userInputArrayLength] === scales.activeScale[userInputArrayLength] && this.currentCharacter === (scales.activeScale.length - 1)) {
            document.getElementById('currentScale').innerHTML = "Correct, pick a new scale";
            this.currentCharacter = 0;
            this.userInputArray = [];
            this.incorrect = true;
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