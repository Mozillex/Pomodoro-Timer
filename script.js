const countdown = document.getElementById('countdown');

/* ** BUTTONS  ** */
const startStop = document.getElementById('startStop');
const increase = document.getElementById('increase');
const decrease = document.getElementById('decrease');
const reset = document.getElementById('reset');
const breakBtn = document.getElementById('breakBtn');
const needle = document.getElementById('needle');
const message = document.getElementById('message');
const beep = document.getElementById('beep');

let beginTime;
let endTime;
let timeRemaining = 25;

let workMins = 25;

let breakMins = 5;
let takeBreak;

let started = false;
let countingDown;
let paused = false;

increase.onclick = () => {
	if (!started) {
		workMins += 1;
		timeRemaining += 1;
		countdown.textContent = workMins + ':00';
		return;
	}
	timeRemaining += 1;
	workMins += 1;
	endTime += 60000;
	updateTimer();
};

decrease.onclick = () => {
	if (timeRemaining <= 1) return;
	if (!started) {
		workMins -= 1;
		timeRemaining -= 1;
		countdown.textContent = workMins + ':00';
		return;
	}
	timeRemaining -= 1;
	workMins -= 1;
	endTime -= 60000;
	updateTimer();
};

countdown.textContent = workMins + ':' + '00';
startStop.onclick = startTimer;

function startTimer() {
	started = true;
	startStop.textContent = 'pause';
	beginTime = Date.now();
	endTime = beginTime + workMins * 60000;
	timeRemaining = endTime - Date.now();
	countingDown = setInterval(updateTimer, 1000);
	startStop.onclick = togglePause;
}

function togglePause() {
	let pausedLength;

	if (paused) {
		// then unpause and start updating the timer
		countingDown = setInterval(updateTimer, 1000);
		pausedLength = Date.now() - pausedAt;
		endTime += pausedLength;
		pausedAt = undefined;
		startStop.textContent = 'pause';
		paused = false;
		return;
	}
	// if NOT paused, then
	clearInterval(countingDown); //stop updating the timer
	startStop.textContent = 'cont.';
	paused = true;
	pausedAt = Date.now();
}

function updateTimer() {
	let now = Date.now();

	if (!paused) timeRemaining = (endTime - now) / 1000 / 60;

	min = Math.floor(timeRemaining);
	sec = Math.round((timeRemaining - min) * 60);
	if (sec < 10) sec = '0' + String(sec);

	if (timeRemaining <= 0) {
		clearInterval(countingDown);
		beep.play();
		takeBreak = true;
		message.textContent = 'Take a Break!';
		startStop.textContent = '<--';
		startStop.className = 'off';
		countdown.textContent = '0:00';
		breakBtn.className = 'alert';
		breakBtn.textContent = 'BREAK';
		setInterval(flashButton, 1000);
		resetCounter();
		breakBtn.focus();
	}

	countdown.textContent = started ?
	min + ':' + sec :
	takeBreak ?
	breakMins + ':00' :
	workMins + ':' + '00';

	let degrees = takeBreak ? 0 : timeRemaining / workMins * 180;
	needle.style.transform = 'rotate(' + degrees + 'deg)';
}

function flashButton() {
	breakBtn.className = breakBtn.className === 'alert' ? 'off' : 'alert';
}

let cells = document.querySelectorAll('.cell');
let delay = 0;
let loop = 0;

function systemCheck() {
	delay++;
	if (delay < 20) return;
	cells[loop].style.backgroundColor = 'blue';
	if (loop === 5) clearInterval(sysTest);
	loop++;
}
let sysTest = setInterval(systemCheck, 100);

function resetCounter() {
	beginTime = undefined;
	endTime = undefined;
	timeRemaining = undefined;

	started = false;
	paused = false;
	pausedAt = undefined;
	countingDown = undefined;

	reset.className = 'green';
	reset.textContent = 'RESET';
	startStop.textContent = 'start';
	startStop.className = 'off';
}
