async function setupOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['USER_MEDIA'], // Changé pour USER_MEDIA pour la capture
    justification: 'Traitement audio via Web Audio API'
  });
}

chrome.runtime.onMessage.addListener((message) => {
  setupOffscreen().then(() => {
    // On transmet simplement tous les messages à l'offscreen
    chrome.runtime.sendMessage(message);
  });
  return true; 
});