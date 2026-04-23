const bassSlider = document.getElementById('bass');
const midSlider = document.getElementById('mid');
const trebleSlider = document.getElementById('treble');
const bypassBtn = document.getElementById('bypass');
const loudnessBtn = document.getElementById('loudness-btn'); // Nouveau
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const popoutBtn = document.getElementById('popout-btn');

let isBypass = false;
let isLoudness = false; // Nouveau

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

// --- LOGIQUE LOUDNESS (+6 Bass / +6 Treble) ---
loudnessBtn.onclick = () => {
  isLoudness = !isLoudness;
  
  if (isLoudness) {
    bassSlider.value = 6;
    midSlider.value = 0;
    trebleSlider.value = 6;
    loudnessBtn.innerText = "LOUDNESS: ON";
    loudnessBtn.classList.add('active');
    
    // Si le bypass était activé, on le coupe pour entendre l'effet
    if (isBypass) {
      isBypass = false;
      bypassBtn.innerText = "BYPASS: OFF";
      bypassBtn.classList.remove('active');
    }
  } else {
    bassSlider.value = 0;
    midSlider.value = 0;
    trebleSlider.value = 0;
    loudnessBtn.innerText = "LOUDNESS: OFF";
    loudnessBtn.classList.remove('active');
  }
  sendUpdate();
};

// --- LOGIQUE BOUTONS STANDARDS ---
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

popoutBtn.onclick = () => {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    width: 280,
    height: 480 // Augmenté un peu pour le nouveau bouton
  });
};

document.querySelectorAll('.rst-btn').forEach(btn => {
  btn.onclick = () => {
    const target = document.getElementById(btn.getAttribute('data-target'));
    target.value = 0;
    isLoudness = false; // On reset le mode loudness si on touche aux RST
    loudnessBtn.innerText = "LOUDNESS: OFF";
    loudnessBtn.classList.remove('active');
    sendUpdate();
  };
});

[bassSlider, midSlider, trebleSlider].forEach(s => {
  s.oninput = () => {
    isLoudness = false; // Si l'utilisateur bouge un curseur, on sort du mode Loudness auto
    loudnessBtn.innerText = "LOUDNESS: OFF";
    loudnessBtn.classList.remove('active');
    sendUpdate();
  };
});

bypassBtn.onclick = () => {
  isBypass = !isBypass;
  bypassBtn.innerText = `BYPASS: ${isBypass ? 'ON' : 'OFF'}`;
  bypassBtn.classList.toggle('active', isBypass);
  
  if (isBypass && isLoudness) {
    isLoudness = false;
    loudnessBtn.innerText = "LOUDNESS: OFF";
    loudnessBtn.classList.remove('active');
  }
  sendUpdate();
};

const canvas = document.getElementById('eq-curve');
const ctx = canvas.getContext('2d');

function drawCurve() {
    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;
    
    // Récupération des valeurs (inversées car le gain positif monte)
    // On divise par 20 (le max) pour avoir un ratio, puis on multiplie par le demi-canvas
    const b = midY - (parseInt(bassSlider.value) / 20) * (h / 2.5);
    const m = midY - (parseInt(midSlider.value) / 20) * (h / 2.5);
    const t = midY - (parseInt(trebleSlider.value) / 20) * (h / 2.5);

    // Nettoyer le canvas
    ctx.clearRect(0, 0, w, h);

    // Dessiner la ligne de base (0dB)
    ctx.beginPath();
    ctx.strokeStyle = '#444';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dessiner la courbe
    ctx.beginPath();
    ctx.strokeStyle = '#27ae60'; // Vert comme ton bouton Start
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';

    // Point de départ (Basses)
    ctx.moveTo(0, b);
    
    // Courbe vers les Médiums (Point de contrôle au milieu)
    ctx.bezierCurveTo(w * 0.25, b, w * 0.25, m, w * 0.5, m);
    
    // Courbe vers les Aigus
    ctx.bezierCurveTo(w * 0.75, m, w * 0.75, t, w, t);

    ctx.stroke();

    // Ajouter un dégradé sous la courbe (optionnel mais joli)
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(39, 174, 96, 0.3)');
    gradient.addColorStop(1, 'rgba(39, 174, 96, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
}

// Appelle drawCurve() dans ta fonction sendUpdate() existante
// pour que la courbe se mette à jour à chaque mouvement.
function sendUpdate() {
  drawCurve(); // <--- Ajout ici
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

// Initialise la courbe au chargement
drawCurve();