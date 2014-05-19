sight = {
	loaded: function () {
		var button = document.getElementById('button'),
			svgWindow = document.getElementById('svgWindow');
		svgWindowHeight = svgWindow.offsetHeight;
		svgWindowWidth = svgWindow.offsetWidth;

		button.addEventListener('click', function (e) {
            sight.getSvgWindowValues()
            e.preventDefault()
        }, false);

		window.addEventListener('resize', function() {
			sight.getSvgWindowValues();
        }, false);

        this.getSvgWindowValues()
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
			]
	},

	getValues: function (value) {
		var value
			= (value === 'C') ? 0
			: (value === 'D') ? 1
			: (value === 'E') ? 2
			: (value === 'F') ? 3
			: (value === 'G') ? 4
			: (value === 'A') ? 5
			: (value === 'B') ? 6
			: 'error';

		return value
	},

	getSvgWindowValues: function () {
		var svgWindow = document.getElementById('svgWindow');
		svgWindowHeight = svgWindow.offsetHeight;
		svgWindowWidth = svgWindow.offsetWidth;
		this.calculateNotes(svgWindowWidth)
	},

	calculateNotes: function (svgWindowWidth) {
		var	noteStrikeThrough = document.getElementById('noteStrikeThrough'),
			noteUnderscore = document.getElementById('noteUnderscore'),
			noteTailUp = document.getElementById('noteTailUp'),
			noteTailDown = document.getElementById('noteTailDown'),

			notes = this.notes()

		for (var i = 0; i < 2; i++) {
			var item = notes[Math.floor(Math.random()*notes.length)],
				value = this.getValues(item[0]),
				x = i,
				y = value*(50) + ((item[1]-4)*350);


			// if (y % 100 === 0) {
			// 	noteStrikeThrough.style.visibility="visible";
			// 	noteUnderscore.style.visibility="hidden";
			// } else if (y % 100 === 50) {
			// 	noteUnderscore.style.visibility="visible";
			// 	noteStrikeThrough.style.visibility="hidden";
			// }

			// if (y >= 400) {
			// 	noteTailDown.style.visibility="visible"
			// 	noteTailUp.style.visibility="hidden"
			// } else {
			// 	noteTailUp.style.visibility="visible"
			// 	noteTailDown.style.visibility="hidden"
			// }
			this.renderNotes(x, y)
		}

	},

	renderNotes: function (x, y) {
		var drawArea = document.getElementById('drawArea'),
			noteToDraw = document.createElementNS("http://www.w3.org/2000/svg", 'use');

		noteToDraw.setAttribute('xlink:href', '#noteTailUp')
		noteToDraw.setAttribute('transform', 'translate(0 0)')

		drawArea.appendChild(noteToDraw)

	}
};

window.addEventListener('load', function loaded() {
        sight.loaded()
        sight.calculateNotes()
    }, false);