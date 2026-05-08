export function breakImage(img, canvas) {
  const ctx = canvas.getContext("2d");

  const rect = img.getBoundingClientRect();

  canvas.style.position = "fixed"; 
  canvas.style.left = rect.left + "px";
  canvas.style.top = rect.top + "px";


  const dpr = window.devicePixelRatio || 1;

  // ==========================
  // CANVAS SIZE = DISPLAY SIZE
  // ==========================
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  // reset + scale to match CSS pixels
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = rect.width;
  const height = rect.height;

  // ==========================
  // DRAW IMAGE INTO TEMP CANVAS
  // ==========================
  const temp = document.createElement("canvas");
  const tctx = temp.getContext("2d");

  temp.width = width;
  temp.height = height;

  tctx.drawImage(img, 0, 0, width, height);

  // ==========================
  // CONFIG (più controllato)
  // ==========================
  const PIECE_SIZE = 13;

  const GRAVITY = 2;
  const FRICTION = 0.99;

  const pieces = [];

  // ==========================
  // CREATE PIECES (CENTER SAFE)
  // ==========================
  for (let y = 0; y < height; y += PIECE_SIZE) {
    for (let x = 0; x < width; x += PIECE_SIZE) {

      const w = Math.min(PIECE_SIZE, width - x);
      const h = Math.min(PIECE_SIZE, height - y);

      pieces.push({
        x,
        y,
        w,
        h,

        // start EXACTLY on image position
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * -1,

        rotation: Math.random() * 0.2,
        vr: (Math.random() - 0.5) * 0.03
      });
    }
  }

  // clear canvas
  ctx.clearRect(0, 0, width, height);

  // ==========================
  // ANIMATION
  // ==========================
  function animate() {
    ctx.clearRect(0, 0, width, height);

    let active = false;

    for (const p of pieces) {

      p.vy += GRAVITY;
      p.vx *= FRICTION;

      p.x += p.vx;
      p.y += p.vy;

      p.rotation += p.vr;

      if (p.y < height + 200) active = true;

      ctx.save();

      ctx.translate(
        p.x + p.w / 2,
        p.y + p.h / 2
      );

      ctx.rotate(p.rotation);

      // draw correct slice from temp canvas
      ctx.drawImage(
        temp,
        p.x, p.y, p.w, p.h,
        -p.w / 2, -p.h / 2, p.w, p.h
      );

      ctx.restore();
    }

    if (active) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}