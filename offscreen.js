let audioCtx, source, bassNode, midNode, trebleNode, gainNode;

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "START_AUDIO") {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: message.streamId } },
      video: false
    });

    audioCtx = new AudioContext();
    source = audioCtx.createMediaStreamSource(stream);

    // Filtres
    bassNode = audioCtx.createBiquadFilter(); bassNode.type = "lowshelf"; bassNode.frequency.value = 250;
    midNode = audioCtx.createBiquadFilter(); midNode.type = "peaking"; midNode.frequency.value = 1000; midNode.Q.value = 1;
    trebleNode = audioCtx.createBiquadFilter(); trebleNode.type = "highshelf"; trebleNode.frequency.value = 4000;
    
    // Gain (Volume)
    gainNode = audioCtx.createGain();

    // Chaînage
    source.connect(bassNode);
    bassNode.connect(midNode);
    midNode.connect(trebleNode);
    trebleNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

  } else if (message.type === "UPDATE_EQ" && audioCtx) {
    const { volume, bass, mid, treble, bypass } = message.data;
    
    // Volume fonctionne toujours, même en bypass
    gainNode.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.01);

    if (bypass) {
      bassNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
      midNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
      trebleNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
    } else {
      bassNode.gain.setTargetAtTime(bass, audioCtx.currentTime, 0.01);
      midNode.gain.setTargetAtTime(mid, audioCtx.currentTime, 0.01);
      trebleNode.gain.setTargetAtTime(treble, audioCtx.currentTime, 0.01);
    }
  }
});