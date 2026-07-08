import { el, group, create } from '../js/modules/lib.js';

el('.btn-new').style.visibility = 'hidden';

function sensoGame() {
	// Variablen
	let colors,
		randomSequence,
		userSequence,
		level,
		randomColor,
		randomNumber,
		soundEffects,
		soundSwitch,
		musicSwitch,
		player;

	function initVars() {
		colors = ['red', 'blue', 'green', 'yellow'];
		randomSequence = []; // vorgegebene Sequenz
		userSequence = []; // Sequenz, die der Spieler klickt
		level = 0; // Spielstufe
		randomColor = ''; // vom Spiel gewählte Farbe
		randomNumber = 0; // Zufallszahl
		soundEffects = {
			red: 'sounds/red.mp3',
			blue: 'sounds/blue.mp3',
			green: 'sounds/green.mp3',
			yellow: 'sounds/yellow.mp3',
			gameOver: 'sounds/gameOver.mp3',
		};
		soundSwitch = true;
		musicSwitch = true;
		player = el('input').value;
	}

	el('.btn-music').classList.remove('disabled');
	el('.btn-sound').classList.remove('disabled');

	// ################ Spielsequenz #####################
	function gameSequence() {
		// Spielersequenz leeren
		userSequence = [];

		// Zufallszahl zw. 0 und 4
		randomNumber = Math.floor(Math.random() * 4);

		// Zufällige Farbe aus colors-Array
		randomColor = colors[randomNumber];

		// ------------- Aufleuchten --------
		function white() {
			el('#' + randomColor).style.backgroundColor = 'white';
		}

		// Soundeffekt für die jeweilige zufällige Farbe
		sound(soundEffects[randomColor]);

		function color() {
			el('#' + randomColor).style.backgroundColor = '';
		}

		setTimeout(white, 250);
		setTimeout(color, 500);
		// ----------------------------------

		// Farbe in Array für die vorgegebene Sequenz hinzufügen
		randomSequence.push(randomNumber);

		// Nächstes Level: Level um 1 erhöhen
		level++;

		// Level anzeigen
		el('#level').innerText = `Level ${level}`;
	}

	// ################ Spieler-Sequenz ##################
	function userClick() {
		const divs = group('.container div');

		// Anklicken der Farben ermöglichen
		divs.forEach(function (divs) {
			divs.classList.remove('disabled');
		});

		// Anklicken von Sound/Musik ermöglichen
		const btns = group('.buttons button');

		btns.forEach(function (btns) {
			btns.classList.remove('disabled');
		});

		function click(e) {
			// id des angeklickten divs
			let id = this.getAttribute('id');

			// Hintergrund der geklickten Farbe in weiß ändern
			el(`#${id}`).style.backgroundColor = 'white';

			// Zurück zur ursprünglichen Farbe
			setTimeout(function () {
				el(`#${id}`).style.backgroundColor = '';
			}, 200);

			// jeweiligen Sound abspielen
			sound(soundEffects[id]);

			// Gewählte Farbe in userSequence speichern
			switch (id) {
				case 'red':
					userSequence.push(0);
					break;
				case 'blue':
					userSequence.push(1);
					break;
				case 'green':
					userSequence.push(2);
					break;
				case 'yellow':
					userSequence.push(3);
					break;
			}

			// Spieler-Sequenz mit der vorgegebenen Sequenz vergleichen
			compare(userSequence.length - 1); // currentLevel = userSequence.length-1
		}

		// click-Event für die einzelnen color-divs
		divs.forEach(function (colors) {
			colors.addEventListener('click', click);
		});
	}

	// ################ Sequenzen vergleichen ############
	function compare(currentLevel) {
		// Prüfen ob Spiel- und Spieler-Sequenz auf dem gleichen Level sind
		if (randomSequence[currentLevel] === userSequence[currentLevel]) {
			// Prüfen ob beide Sequenzen gleich lang sind
			if (randomSequence.length === userSequence.length) {
				// nächstes aufleuchten um 1 Sek. verzögern
				setTimeout(function () {
					gameSequence();
				}, 1000);
			}
		} else {
			// Bei falscher Spieler-Sequenz: Spiel vorbei
			setTimeout(function () {
				gameOver();
			}, 600);
		}
	}

	el('#level').style.visibility = 'visible';
	el('.btn-start').style.visibility = 'hidden';

	// ################ Game Over ########################
	function gameOver() {
		// -------- Highscores speichern --------
		const key = player;
		const value = level;

		// Speichern wenn neuer Wert > alter Wert
		if (level > localStorage.getItem(player)) {
			window.localStorage.setItem(key, value);
		}
		// --------------------------------------
		el('.btn-music').classList.add('disabled');
		el('.btn-sound').classList.add('disabled');

		// Nach Spielende Musik aus
		music.pause();

		// Game Over Sound
		sound(soundEffects['gameOver']);

		// Game Over anzeigen
		el('#level').innerText = 'Game Over';

		// Neu-Button anzeigen
		el('.btn-new').style.visibility = 'visible';

		// Neu-Button ausblenden, Start-Button einblenden, reload
		el('.btn-new').addEventListener('click', function () {
			el('.btn-new').style.visibility = 'hidden';
			el('.btn-start').style.visibility = 'visible';
			location.reload();
		});

		// Anklicken der Farben verhindern
		const divs = group('.container div');

		divs.forEach(function (divs) {
			divs.classList.add('disabled');
		});

		// button border Farbe zurücksetzen
		const btnSoundMusic = group('.buttons button');
		btnSoundMusic.forEach(function (btns) {
			btns.style.borderColor = 'grey';
		});
	}

	// ################ Sounds ###########################
	function sound(path) {
		if (soundSwitch) {
			const sound = new Audio();
			sound.src = path;
			sound.volume = 0.1;
			sound.play();
		}
	}

	// Sound an/aus
	function soundOnOff() {
		soundSwitch = !soundSwitch;
		console.log(soundSwitch);
		if (soundSwitch) {
			el('.btn-sound').style.borderColor = 'green';
		} else {
			el('.btn-sound').style.borderColor = 'red';
		}
	}

	// Sound-Button
	el('.btn-sound').addEventListener('click', soundOnOff);

	// ---------------------- Musik ----------------------
	const music = new Audio('sounds/music.mp3');
	music.loop = true; // music.mp3 in Schleife abspielen
	music.volume = 0.06; // Leiser als Soundeffekte
	music.play();

	// Musik an/aus
	function musicOnOff() {
		musicSwitch = !musicSwitch;

		if (musicSwitch) {
			music.muted = false;
			el('.btn-music').style.borderColor = 'green';
		} else {
			music.muted = true;
			el('.btn-music').style.borderColor = 'red';
		}
	}

	// Musik-Button
	el('.btn-music').addEventListener('click', musicOnOff);

	initVars();
	gameSequence();
	userClick();
}

// ##################### Countdown #######################
function countdown() {
	// Eingabefeld für Namen ausblenden
	el('input').style.visibility = 'hidden';

	// Sound für Countdown
	const cDown = new Audio('sounds/countdown.mp3');
	cDown.play();

	el('#level').innerText = '4';

	// 3,2,1, Spielstart jeweils um 1 Sek. verzögert anzeigen
	setTimeout(function three() {
		el('#level').innerText = '3';
	}, 1000);
	setTimeout(function two() {
		el('#level').innerText = '2';
	}, 2000);
	setTimeout(function one() {
		el('#level').innerText = '1';
	}, 3000);
	// Spielstart
	setTimeout(sensoGame, 4000);
}

// ################ Highscores ###########################
// localStorage.setItem('Max', '7');
// localStorage.setItem('Mia', '4');
// localStorage.setItem('Pia', '6');
// localStorage.setItem('Tim', '2');
// localStorage.setItem('Jim', '3');
// localStorage.setItem('Jane', '22');
// localStorage.setItem('John', '17');
// localStorage.setItem('Leo', '25');
// localStorage.setItem('Mike', '101');
// localStorage.setItem('Don', '47');
// localStorage.setItem('Spider', '24');
// localStorage.setItem('Claire', '61');
// localStorage.setItem('Martha', '223');
// localStorage.setItem('Matilda', '31');

const keys = Object.keys(localStorage);

const valuesInt = [];
const values = Object.values(localStorage);
values.forEach((val) => valuesInt.push(+val));

// Arrays zusammenfügen
const highscores = keys.map((key, i) => [key, valuesInt[i]]);

// Highscores sortieren
highscores.sort(function (a, b) {
	return b[1] - a[1]; // sortiert absteigend
});

// Highscores Tabelle
if (highscores.length === 0) el('.highscores').style.display = 'none';
if (highscores.length > 0) el('h2').style.display = 'none';
if (highscores.length > 0) el('.highscores-info').style.display = 'none';
if (highscores.length < 2) el('#btnCLearAll').style.display = 'none';

if (highscores.length === 0) el('.highscores').style.visibility = 'hidden';

highscores.forEach((hs) => {
	const tr = create('tr');

	const name = create('td');
	name.innerText = hs[0];
	name.classList.add('hs-name');

	const level = create('td');
	level.innerText = String(hs[1]);
	level.classList.add('hs-level');

	const del = create('td');
	const btn = create('button');
	btn.innerText = '❌';
	btn.classList.add('btn-delete');
	btn.setAttribute('data-key', hs[0]);
	btn.addEventListener('click', function () {
		const key = this.getAttribute('data-key');
		localStorage.removeItem(key);
		// this.closest('tr').remove();
		location.reload();
	});

	del.appendChild(btn);
	tr.appendChild(name);
	tr.appendChild(level);
	tr.appendChild(del);

	el('tbody').appendChild(tr);
});

group('.btn-delete').forEach((cell) => {
	cell.addEventListener('mouseover', function () {
		this.parentNode.parentNode.style.backgroundColor = 'rgb(223, 2, 2)';
		this.parentNode.parentNode.style.color = '#e5ddc5';
	});

	cell.addEventListener('mouseout', function () {
		this.parentNode.parentNode.style.backgroundColor = '';
		this.parentNode.parentNode.style.color = 'black';
	});
});

// Alle Highscores löschen
el('#btnCLearAll').addEventListener('click', function () {
	localStorage.clear();
	location.reload();
});

// ##################### Spiel starten ###################
el('.btn-start').addEventListener('click', countdown);
