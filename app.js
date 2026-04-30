const video = document.getElementById("camera");

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}

async function main() {
  await startCamera();
  await loadModel();
  await loadReferenceImages();
  initPhysics();

  const offscreen = document.createElement("canvas");
  const ctx = offscreen.getContext("2d");
  offscreen.width = 224;
  offscreen.height = 224;

  setInterval(async () => {
    ctx.drawImage(video, 0, 0, 224, 224);
    const frame = tf.browser.fromPixels(offscreen).toFloat().expandDims();

    const { best, score } = await recognize(frame);

    if (score > 0.75) {
      dropBlocks();
    }

    frame.dispose();
  }, 500);
}

main();
