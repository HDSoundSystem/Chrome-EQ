const bassSlider = document.getElementById('bass');
const midSlider = document.getElementById('mid');
const trebleSlider = document.getElementById('treble');
const bypassBtn = document.getElementById('bypass');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');

let isBypass = false;

function sendUpdate() {
  chrome.runtime.sendMessage({
    type: "UPDATE_EQ",
    data: {
      bass: bassSlider.value,
      mid: midSlider.value,
      treble: trebleSlider.value,
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

document.querySelectorAll('.rst-btn').forEach(btn => {
  btn.onclick = () => {
    const target = document.getElementById(btn.getAttribute('data-target'));
    target.value = 0;
    sendUpdate();
  };
});

[bassSlider, midSlider, trebleSlider].forEach(s => s.oninput = sendUpdate);

bypassBtn.onclick = () => {
  isBypass = !isBypass;
  bypassBtn.innerText = `BYPASS: ${isBypass ? 'ON' : 'OFF'}`;
  bypassBtn.classList.toggle('active', isBypass);
  sendUpdate();
};