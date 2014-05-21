sight = {

	generatedNotes: [],

	loaded: function () {
		var randomiseButton = document.getElementById('randomise');
			

		randomiseButton.addEventListener('click', function (e) {
			sight.randomiseButtonPressed();
            e.preventDefault();
        }, false);

		window.addEventListener('resize', function() {
			sight.checkToRemoveLastChild();
        }, false);

        sight.calculateNotes();
	},

	randomiseButtonPressed: function () {
		var dataToClear = document.getElementById('drawArea');

			while (dataToClear.firstChild) {
			    dataToClear.removeChild(dataToClear.firstChild);
			};

			this.generatedNotes = [];

            this.calculateNotes();
	},

	notes: function () {
		return [
				["C", "4"],
				["D", "4"],
				["E", "4"],
				["F", "4"],
				["G", "4"],
				["A", "4"],
				["B", "4"],
				["C", "5"],
				["D", "5"],
				["E", "5"],
				["F", "5"],
				["G", "5"],
				["A", "5"],
				["B", "5"],
				["C", "6"],
				["B", "5"],
				["A", "5"],
				["G", "5"],
				["F", "5"],
				["E", "5"],
				["D", "5"],
				["C", "5"],
				["B", "4"],
				["A", "4"],
				["G", "4"],
				["F", "4"],
				["E", "4"],
				["D", "4"],
				["C", "4"]
			];
	},

	getValues: function (note) {
		var value
			= (note === 'C') ? 0
			: (note === 'D') ? 1
			: (note === 'E') ? 2
			: (note === 'F') ? 3
			: (note === 'G') ? 4
			: (note === 'A') ? 5
			: (note === 'B') ? 6
			: 'error';

		return value;
	},

	getSvgWindowValues: function () {
		var svgWindow = document.getElementById('svgWindow');
		svgWindowWidth = svgWindow.getBBox().width;
		return svgWindowWidth;
	},

	checkToRemoveLastChild: function () {
		var dataToClear = document.getElementById('drawArea'),
			numberOfChildren = dataToClear.childElementCount,
			gapBetweenNotes = 45,
			firstNoteGap = 80,
			svgWindowWidth = this.getSvgWindowValues(),
			numberToGenerate = Math.ceil((svgWindowWidth - firstNoteGap) / gapBetweenNotes) -1;

		if (numberToGenerate < numberOfChildren) {
			dataToClear.removeChild(dataToClear.lastChild);		
		}

	},

	calculateNotes: function () {
		var	notes = this.notes(),
			gapBetweenNotes = 45,
			firstNoteGap = 80,
			svgWindowWidth = this.getSvgWindowValues(),
			numberToGenerate = Math.ceil((svgWindowWidth - firstNoteGap) / gapBetweenNotes) -1,
			i = 0;

		for (i; i < numberToGenerate; i++) {
			var note = notes[Math.floor(Math.random()*notes.length)],
				value = this.getValues(note[0]),
				x = i * gapBetweenNotes,
				y = (value*(15) + ((note[1]-4)*105)),
				noteType = null,
				noteStrikeThrough = null,
				noteUnderscore = null,
				noteTailUp = null,
				noteTailDown = null;

			this.generatedNotes.push(note[0]);
			

			if (y % 30 === 0) {
				noteStrikeThrough = true;
				noteUnderscore = false;
			} else if (y % 30 === 15) {
				noteUnderscore = true;
				noteStrikeThrough = false;
			}

			if (y >= 120) {
				noteTailDown = true;
				noteTailUp = false;
			} else {
				noteTailUp = true;
				noteTailDown = false;
			}

			if (noteStrikeThrough && noteTailUp) {
				noteType = '#noteStrikeThroughTailUp';
			} else if (noteStrikeThrough && noteTailDown) {
				noteType = '#noteStrikeThroughTailDown';
			} else if (noteUnderscore && noteTailUp) {
				noteType = '#noteUnderscoreTailUp';
			} else if (noteUnderscore && noteTailDown) {
				noteType = '#noteUnderscoreTailDown';
			} else if (noteTailUp) {
				noteType = '#noteTailUp';
			} else if (noteTailDown) {
				noteType = '#noteTailDown';
			}

			this.renderNotes(x, -y, noteType);
		};
		console.log(this.generatedNotes);
	},

	renderNotes: function (x, y, noteType) {
		var drawArea = document.getElementById('drawArea'),
			noteToDraw = document.createElementNS("http://www.w3.org/2000/svg", 'use');

		noteToDraw.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', noteType);
		noteToDraw.setAttributeNS(null, 'transform', 'translate(' + x + ' ' + y +')');

		drawArea.appendChild(noteToDraw);
	}
};

window.addEventListener('load', function loaded() {
        sight.loaded();
    }, false);