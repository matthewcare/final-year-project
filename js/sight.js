sight = {
	loaded: function () {
		var button = document.getElementById('button');

		button.addEventListener('click', function (e) {
	            sight.fillContent()
	            e.preventDefault()
	        }, false);
	},

	weightings: function (value) {
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

	fillContent: function () {
		var display = document.getElementById('display'),
			note = document.getElementById('note'),
			noteStrikeThrough = document.getElementById('noteStrikeThrough'),
			noteUnderscore = document.getElementById('noteUnderscore'),
			noteTailUp = document.getElementById('noteTailUp'),
			noteTailDown = document.getElementById('noteTailDown'),
			items = [
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
					],


			item = items[Math.floor(Math.random()*items.length)],
			value = this.weightings(item[0]),
			x = value*(50) + ((item[1]-4)*350);

			if (x%100 === 0) {
				noteStrikeThrough.style.visibility="visible";
				noteUnderscore.style.visibility="hidden";
			} else if (x%100 === 50) {
				noteUnderscore.style.visibility="visible";
				noteStrikeThrough.style.visibility="hidden";
			}

			if (x >= 400) {
				noteTailDown.style.visibility="visible"
				noteTailUp.style.visibility="hidden"
			} else {
				noteTailUp.style.visibility="visible"
				noteTailDown.style.visibility="hidden"
			}
	

		note.setAttribute('transform', ('translate(0,' + (-x) + ')'))
	}
};

window.addEventListener('load', function loaded() {
        sight.loaded()
        sight.fillContent()
    }, false);