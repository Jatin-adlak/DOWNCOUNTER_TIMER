// ── Config ──
const INITIAL_MINUTES = 18;
const INITIAL_SECONDS = 0;
const WARNING_SECONDS = 5 * 60;
const DANGER_SECONDS = 1 * 60;

// ── DOM ──
const timerDisplay = document.getElementById('timerDisplay');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const timerArea = document.getElementById('timerArea');
const controls = document.getElementById('controls');
const resumeBtn = document.getElementById('resumeBtn');
const reloadBtn = document.getElementById('reloadBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

const colorBtn = document.getElementById('colorBtn');
const colorOptions = document.getElementById('colorOptions');
const colorWrapper = document.getElementById('colorPickerWrapper');

const tedxLogo = document.getElementById('tedxLogo');
const ufLogo = document.getElementById('ufLogo');

// ── State ──
let totalSeconds = INITIAL_MINUTES * 60 + INITIAL_SECONDS;
let running = false;
let intervalId = null;

// ── Helpers ──
function pad(n) {
  return String(n).padStart(2, '0');
}

function render() {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  minutesEl.textContent = pad(m);
  secondsEl.textContent = pad(s);

  timerDisplay.classList.toggle(
    'warning',
    totalSeconds <= WARNING_SECONDS && totalSeconds > DANGER_SECONDS
  );

  timerDisplay.classList.toggle(
    'danger',
    totalSeconds <= DANGER_SECONDS && totalSeconds > 0
  );
}

function tick() {
  if (totalSeconds <= 0) {
    stop();
    return;
  }
  totalSeconds--;
  render();
}

function start() {
  if (running) return;
  running = true;
  timerDisplay.classList.remove('paused');
  controls.classList.remove('visible');
  intervalId = setInterval(tick, 1000);
}

function stop() {
  running = false;
  clearInterval(intervalId);
  intervalId = null;
  timerDisplay.classList.add('paused');
  controls.classList.add('visible');
}

// RESET WITHOUT AUTO START
function reload() {
  stop();
  totalSeconds = INITIAL_MINUTES * 60 + INITIAL_SECONDS;
  timerDisplay.classList.remove('warning', 'danger');
  render();
  controls.classList.add('visible');
}

// ── Timer Click ──
timerArea.addEventListener('click', () => {
  if (running) stop();
});

// ── Buttons ──
resumeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  start();
});

reloadBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  reload();
});

// ── Fullscreen ──
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

fullscreenBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleFullscreen();
});

// ── Theme Logic + BOTH Logo Switch ──
colorBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  colorOptions.classList.toggle('open');
});

document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', (e) => {
    e.stopPropagation();

    const bg = swatch.dataset.bg;
    const text = swatch.dataset.text;

    document.documentElement.style.setProperty('--bg', bg);
    document.documentElement.style.setProperty('--text', text);

    const isLightTheme =
      bg.toLowerCase() === '#ffffff' ||
      bg.toLowerCase() === '#fdf6e3';

    if (isLightTheme) {
      // Light background
      tedxLogo.src = 'tedx logo.png';
      ufLogo.src = 'Unclutterd.png';
    } else {
      // Dark background
      tedxLogo.src = 'TEDX_white.png';
      ufLogo.src = 'unclutter_white.png';
    }

    colorOptions.classList.remove('open');
  });
});

// Close color picker when clicking elsewhere
document.addEventListener('click', (e) => {
  if (!colorWrapper.contains(e.target)) {
    colorOptions.classList.remove('open');
  }
});

// ── Keyboard Shortcuts ──
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    running ? stop() : start();
  }
  if (e.code === 'KeyR') reload();
  if (e.code === 'KeyF') toggleFullscreen();
});

// ── Init ──
render();
controls.classList.add('visible');
timerDisplay.classList.add('paused');

//service worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("Service Worker Registered"));

}
