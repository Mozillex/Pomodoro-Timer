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

let countMins = 25;
let timeRemaining = countMins * 60000;


let onBreak = false;

let started = false;
let paused = false;

let timerInterval;
let flasherInterval;
let delay = 0;
let loop = 0;

increase.onclick = () => {
	if (!started) {
		countMins ++;
		timeRemaining +=60000;
		countdown.textContent = countMins + ':00';
		return;
	}
		countMins ++;
		timeRemaining +=60000;
		endTime += 60000;
		updateTimer();
};

decrease.onclick = () => {
	if (timeRemaining <= 60000) return;
	if (!started) {
		countMins --;
		timeRemaining -= 60000;
		countdown.textContent = countMins + ':00';
		return;
	}
		countMins --;
		timeRemaining -= 60000;
		endTime -= 60000;
		updateTimer();
};

countdown.textContent = countMins + ':' + '00';
startStop.onclick = startTimer;

function startTimer() {
	started = true;
	startStop.textContent = 'pause';
	beginTime = Date.now();
	endTime = beginTime + countMins * 60000;
	timeRemaining = endTime - Date.now();
	timerInterval = setInterval(updateTimer, 1000);
	startStop.onclick = togglePause;
	// reset.onclick = ()=>{
	// 	paused = false;
	// 	onBreak = false;
	// 	started = false;
	// 	clearInterval(flasherInterval);
	// 	setupCounter();
	// }
	message.textContent = '';
}

function togglePause() {
	let pausedFor;

	if (paused) {
		message.textContent =  '';
		// then unpause and start updating the timer
		timerInterval = setInterval(updateTimer, 1000);
		pausedFor = Date.now() - pausedAt;
		endTime += pausedFor;
		pausedAt = undefined;
		startStop.textContent = 'pause';
		paused = false;
		return;
	}
	// if NOT paused, then make it paused
	message.textContent = '• PAUSED •';
	clearInterval(timerInterval); //stop updating the timer
	startStop.textContent = 'cont.';
	paused = true;
	pausedAt = Date.now();
}

function updateTimer() {
	let now = Date.now();
	let degrees;

	timeRemaining = (paused ? timeRemaining :  endTime - now);

	let t = timeRemaining/60000;
	min = Math.floor(t);
	sec = Math.round((t - min) * 60);

	if (sec < 10) sec = '0' + String(sec);

	if (timeRemaining <= 0) {// * * * * * * *  TIMER ENDED

		started = false;
		clearInterval(timerInterval);
		beep.play();
		startStop.className = 'off';


		if (!onBreak) {
			onBreak = true;
			breakBtn.className = 'alert';
			breakBtn.textContent = 'BREAK';
			message.textContent = 'Take a Break!';
			flasherInterval = setInterval(toggleFlash, 800);
		}

		else {
			onBreak = false;
		}

		setupCounter();
		startStop.focus();
		degrees = 0;
	}

	else {
		countdown.textContent = min + ':' + sec;
		degrees = Math.round(timeRemaining/60000 / countMins * 180);
	}

	needle.style.transform = 'rotate(' + degrees + 'deg)';

}

function toggleFlash() {
	if(breakBtn.className === 'off' && loop>10) {
		clearInterval(flasherInterval);
		return;
	}
	breakBtn.className = breakBtn.className === 'alert' ? 'off' : 'alert';
	loop++
}

let cells = document.querySelectorAll('.cell');


function systemCheck() {
	delay++;
	if (delay < 20) return;
	cells[loop].style.backgroundColor = 'blue';
	if (loop === 5) clearInterval(sysTest);
	loop++;
}

let sysTest = setInterval(systemCheck, 100);

function setupCounter() {
	clearInterval(timerInterval);
	if (paused) togglePause();
	beginTime = undefined;
	endTime = undefined;

	pausedAt = undefined;
	countMins = onBreak ? 5 : 25;
	timeRemaining = countMins * 60000;

	delay = 0;
	loop = 0;

	startStop.textContent = 'start';
	countdown.textContent = countMins + ':00';
	startStop.className = 'green';
	startStop.onclick = startTimer;

	needle.style.transform = 'rotate(0deg)';

}
reset.onclick = ()=>{
	paused = false;
	onBreak = false;
	started = false;
	clearInterval(flasherInterval);
	setupCounter();
}
reset.onmouseover = ()=> reset.innerText = 'RESET';
reset.onmouseleave = ()=> reset.innerText = 'reverse';
