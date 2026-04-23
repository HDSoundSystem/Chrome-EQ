const bassSlider = document.getElementById('bass');
const midSlider = document.getElementById('mid');
const trebleSlider = document.getElementById('treble');
const bypassBtn = document.getElementById('bypass');
const startBtn = document.getElementById('start-btn');

let isBypass = false;

function updateFilters() {
  const settings = {
    bass: bassSlider.value,
    mid: midSlider.value,
    treble: trebleSlider.value,
    bypass: isBypass
  };
  chrome.runtime.sendMessage({ type: "UPDATE_EQ", data: settings });
}

// Bouton de démarrage
startBtn.onclick = () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabCapture.getMediaStreamId({targetTabId: tabs[0].id}, (streamId) => {
      chrome.runtime.sendMessage({ type: "START_AUDIO", streamId: streamId });
      startBtn.innerText = "Audio Captured ✓";
      startBtn.disabled = true;
    });
  });
};

// Gestion des boutons RST
document.querySelectorAll('.rst-btn').forEach(btn => {
  btn.onclick = () => {
    const target = document.getElementById(btn.getAttribute('data-target'));
    target.value = 0;
    updateFilters();
  };
});

// Événements sliders
[bassSlider, midSlider, trebleSlider].forEach(s => s.oninput = updateFilters);

// Bouton Bypass
bypassBtn.onclick = () => {
  isBypass = !isBypass;
  bypassBtn.innerText = `Bypass: ${isBypass ? 'ON' : 'OFF'}`;
  bypassBtn.classList.toggle('active', isBypass);
  updateFilters();
};