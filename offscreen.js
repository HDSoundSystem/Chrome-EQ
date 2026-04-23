let audioCtx, source, bassFilter, midFilter, trebleFilter;

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.type === "START_AUDIO") {
    if (audioCtx) return;

    audioCtx = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: request.streamId } }
    });

    source = audioCtx.createMediaStreamSource(stream);

    bassFilter = audioCtx.createBiquadFilter();
    bassFilter.type = "lowshelf";
    bassFilter.frequency.value = 250;

    midFilter = audioCtx.createBiquadFilter();
    midFilter.type = "peaking";
    midFilter.frequency.value = 1000;
    midFilter.Q.value = 1;

    trebleFilter = audioCtx.createBiquadFilter();
    trebleFilter.type = "highshelf";
    trebleFilter.frequency.value = 5000;

    source.connect(bassFilter);
    bassFilter.connect(midFilter);
    midFilter.connect(trebleFilter);
    trebleFilter.connect(audioCtx.destination);

    await audioCtx.resume();
  }

  if (request.type === "STOP_AUDIO") {
    if (source && source.mediaStream) {
      source.mediaStream.getTracks().forEach(t => t.stop());
    }
    if (audioCtx) {
      await audioCtx.close();
      audioCtx = null;
    }
  }

  if (request.type === "UPDATE_EQ" && audioCtx) {
    const { bass, mid, treble, bypass } = request.data;
    const time = audioCtx.currentTime + 0.05;
    bassFilter.gain.setTargetAtTime(bypass ? 0 : parseFloat(bass), time, 0.1);
    midFilter.gain.setTargetAtTime(bypass ? 0 : parseFloat(mid), time, 0.1);
    trebleFilter.gain.setTargetAtTime(bypass ? 0 : parseFloat(treble), time, 0.1);
  }
});