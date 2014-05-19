sight = {
	loaded: function () {
		var button = document.getElementById('button');
			

		button.addEventListener('click', function (e) {
			var dataToClear = document.getElementById('drawArea');

			dataToClear.innerHTML = ''
			dataToClear.innerText = ''
            sight.getSvgWindowValues()
            e.preventDefault()
        }, false);

		// window.addEventListener('resize', function() {
		// 	sight.getSvgWindowValues();
  //       }, false);
        sight.getSvgWindowValues();
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
		svgWindowWidth = svgWindow.getBBox().width;
		this.calculateNotes(svgWindowWidth)
	},

	calculateNotes: function (svgWindowWidth) {
		var	notes = this.notes(),
			svgWindow = document.getElementById('svgWindow');

		svgWindowWidth = svgWindow.getBBox().width;
		numberToGenerate = svgWindowWidth/60;

		for (var i = 0; i < numberToGenerate; i++) {
			var item = notes[Math.floor(Math.random()*notes.length)],
				value = this.getValues(item[0]),
				x = i * 150,
				y = (value*(50) + ((item[1]-4)*350)),
				noteType = null,
				noteStrikeThrough = null,
				noteUnderscore = null,
				noteTailUp = null,
				noteTailDown = null


			if (y % 100 === 0) {
				noteStrikeThrough = true;
				noteUnderscore = false;
			} else if (y % 100 === 50) {
				noteUnderscore = true;
				noteStrikeThrough = false;
			}

			if (y >= 400) {
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

			this.renderNotes(x, -y, noteType)
		}

	},

	renderNotes: function (x, y, noteType) {
		var drawArea = document.getElementById('drawArea'),
			noteToDraw = document.createElementNS("http://www.w3.org/2000/svg", 'use');

		noteToDraw.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', noteType)
		noteToDraw.setAttributeNS(null, 'transform', 'translate(' + x + ' ' + y +')')

		drawArea.appendChild(noteToDraw)
	}
};

window.addEventListener('load', function loaded() {
        sight.loaded()
    }, false);