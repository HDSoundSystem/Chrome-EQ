const canvas = document.getElementById('eq-curve');
const ctx = canvas.getContext('2d');
const volSlider = document.getElementById('volume');
const bassSlider = document.getElementById('bass');
const midSlider = document.getElementById('mid');
const trebleSlider = document.getElementById('treble');
const bypassBtn = document.getElementById('bypass');
const loudnessBtn = document.getElementById('loudness-btn');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');

let isBypass = false;
let isLoudness = false;

function drawCurve() {
  const w = canvas.width = canvas.clientWidth;
  const h = canvas.height = canvas.clientHeight;
  const midY = h / 2;
  
  const b = midY - (parseInt(bassSlider.value) / 20) * (h / 2.5);
  const m = midY - (parseInt(midSlider.value) / 20) * (h / 2.5);
  const t = midY - (parseInt(trebleSlider.value) / 20) * (h / 2.5);

  ctx.clearRect(0, 0, w, h);
  ctx.beginPath(); ctx.strokeStyle = '#444'; ctx.setLineDash([5, 5]);
  ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke(); ctx.setLineDash([]);

  ctx.beginPath(); ctx.strokeStyle = '#27ae60'; ctx.lineWidth = 3;
  ctx.moveTo(0, b);
  ctx.bezierCurveTo(w*0.2, b, w*0.35, m, w*0.5, m);
  ctx.bezierCurveTo(w*0.65, m, w*0.8, t, w, t);
  ctx.stroke();
}

function sendUpdate() {
  drawCurve();
  chrome.runtime.sendMessage({
    type: "UPDATE_EQ",
    data: {
      volume: parseFloat(volSlider.value) / 100,
      bass: parseInt(bassSlider.value),
      mid: parseInt(midSlider.value),
      treble: parseInt(trebleSlider.value),
      bypass: isBypass
    }
  });
}

startBtn.onclick = () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabCapture.getMediaStreamId({targetTabId: tabs[0].id}, (streamId) => {
      chrome.runtime.sendMessage({ type: "START_AUDIO", streamId: streamId });
      startBtn.style.display = "none";
      stopBtn.style.display = "block";
    });
  });
};

stopBtn.onclick = () => {
  chrome.runtime.sendMessage({ type: "STOP_AUDIO" });
  stopBtn.style.display = "none";
  startBtn.style.display = "block";
};

loudnessBtn.onclick = () => {
  isLoudness = !isLoudness;
  if (isLoudness) {
    bassSlider.value = 6; midSlider.value = 0; trebleSlider.value = 6;
    loudnessBtn.innerText = "LOUDNESS: ON"; loudnessBtn.classList.add('active');
    isBypass = false; bypassBtn.innerText = "BYPASS: OFF"; bypassBtn.classList.remove('active');
  } else {
    bassSlider.value = 0; midSlider.value = 0; trebleSlider.value = 0;
    loudnessBtn.innerText = "LOUDNESS: OFF"; loudnessBtn.classList.remove('active');
  }
  sendUpdate();
};

bypassBtn.onclick = () => {
  isBypass = !isBypass;
  bypassBtn.innerText = `BYPASS: ${isBypass ? 'ON' : 'OFF'}`;
  bypassBtn.classList.toggle('active', isBypass);
  sendUpdate();
};

document.querySelectorAll('.rst-btn').forEach(btn => {
  btn.onclick = () => {
    const target = document.getElementById(btn.getAttribute('data-target'));
    target.value = (target.id === "volume") ? 100 : 0;
    sendUpdate();
  };
});

[volSlider, bassSlider, midSlider, trebleSlider].forEach(s => s.oninput = sendUpdate);
drawCurve();