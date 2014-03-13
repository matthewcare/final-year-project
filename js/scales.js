var scales = {

    activeScale: null,

    // Constants
    gradeOne: {
        CMAJOR:                 ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B", "C", "B", "A", "G", "F", "E", "D", "C", "B", "A", "G", "F", "E", "D", "C"],
        GMAJOR:                 ["G", "A", "B", "C", "D", "E", "F#", "G", "A", "B", "C", "D", "E", "F#", "G", "F#", "E", "D", "C", "B", "A", "G", "F#", "E", "D", "C", "B", "A", "G"],
        DMAJOR:                 ["D", "E", "F#", "G", "A", "B", "C#", "D", "E", "F#", "G", "A", "B", "C#", "D", "C#", "B", "A", "G", "F#", "E", "D", "C#", "B", "A", "G", "F#", "E", "D"],
        FMAJOR:                 ["F", "G#", "A#", "B#", "C#", "D#", "E#", "F", "G#", "A#", "B#", "C#", "D#", "E#", "F", "E#", "D#", "C#", "B#", "A#", "G#", "F", "E#", "D#", "C#", "B#", "A#", "G#", "F"],

        AMINORHARMONIC:         ["A", "B", "C", "D", "E", "F", "G#", "A", "B", "C", "D", "E", "F", "G#", "A", "G#", "F", "E", "D", "C", "B", "A", "G#", "F", "E", "D", "C", "B", "A"],
        DMINORHARMONIC:         ["D", "E", "F", "G", "A", "B", "C#", "D", "E", "F", "G", "A", "B", "C#", "D", "C#", "B", "A", "G", "F", "E", "D", "C#", "B", "A", "G", "F", "E", "D"],

        CMAJORCONTRARYLEFT:     ["C",  "B", "A", "G", "F", "E", "D", "C", "D", "E", "F", "G", "A", "B", "C"],
        CMAJORCONTRARYRIGHT:    ["C", "D", "E", "F", "G", "A", "B", "C",  "B", "A", "G", "F", "E", "D", "C"],

        CMAJORBROKENCHORDS:     ["C", "E", "G", "E", "G", "C", "G", "C", "E", "C", "E", "C", "G", "C", "G", "E", "G", "E", "C", "G"],
        //STOPED HERE THROUGH BOREDOM
        GMAJORBROKENCHORDS:     ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B", "C", "B", "A", "G", "F", "E", "D", "C", "B", "A", "G", "F", "E", "D", "C"],
        FMAJORBROKENCHORDS:     ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B", "C", "B", "A", "G", "F", "E", "D", "C", "B", "A", "G", "F", "E", "D", "C"],
        AMINORBROKENCHORDS:     ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B", "C", "B", "A", "G", "F", "E", "D", "C", "B", "A", "G", "F", "E", "D", "C"],
        DMINORBROKENCHORDS:     ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B", "C", "B", "A", "G", "F", "E", "D", "C", "B", "A", "G", "F", "E", "D", "C"],
    }

};



(function () {

    var location = document.getElementById('currentScale');

    var addEventListenerByClass = function () {
        var list = document.getElementsByClassName('scales');
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].addEventListener('click', function (e) {
                location.innerHTML = (scales.gradeOne[this.id]);
                scales.activeScale = scales.gradeOne[this.id];
                e.preventDefault();
            }, false);;
        };
    };

    window.addEventListener('load', function loaded() {
        addEventListenerByClass();
    }, false);

}());