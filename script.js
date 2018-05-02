const remaining = document.getElementById('remaining');
const startStop = document.getElementById('startStop'); // button
const breakBtn = document.getElementById('breakBtn');
const message = document.getElementById('message');

let beginTime;

let workMins = 15;
let workSecs = workMins * 60;
let workMils = workSecs * 1000;
let endWorkTime;

let breakTime = 300000; // 5 minutes (in miliseconds)

remaining.textContent = '15:00';
startStop.onclick = startTimer;

function startTimer() {
	startStop.textContent = 'pause';

	beginTime = Date.now();
	endWorkTime = beginTime + workMils;

	function updateTimer() {
		let now = Date.now();
		let remainTime = (endWorkTime - now) / 1000 / 60;
		let min = Math.floor(remainTime);
		let sec = Math.round((remainTime - min) * 60);
		remaining.textContent = min + ':' + sec;
		if (remainTime <= 0) {
			clearInterval(i);
			message.textContent = 'Time for a Break!';
			breakBtn.style.visibility = 'visible';
		}
	}

	let i = setInterval(updateTimer, 1000);
	let paused;
	let pausedAt;

	function togglePause() {
		if (paused) {
			let now = Date.now();
			let pausedFor = now - pausedAt;
			endWorkTime += pausedFor;
			i = setInterval(updateTimer, 1000);
			paused = false;
			startStop.textContent = 'pause';
			return;
		}
		clearInterval(i);
		startStop.textContent = 'continue';
		paused = true;
		pausedAt = Date.now();
	}
	startStop.onclick = togglePause;
}
