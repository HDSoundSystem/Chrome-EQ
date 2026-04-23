async function setupOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['USER_MEDIA'],
    justification: 'Process tab audio'
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "STOP_AUDIO") {
    chrome.offscreen.closeDocument();
  } else {
    setupOffscreen().then(() => {
      chrome.runtime.sendMessage(message);
    });
  }
  return true;
});