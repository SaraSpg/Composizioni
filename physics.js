export function breakImage(img, canvas) {
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;

    // ==========================
    // REAL IMAGE SIZE (IMPORTANT)
    // ==========================
    const rect = img.getBoundingClientRect();

    const displayW = rect.width;
    const displayH = rect.height;

    // canvas match display size
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;

    canvas.style.width = displayW + "px";
    canvas.style.height = displayH + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ==========================
    // FIX: draw EXACT same size as displayed image
    // ==========================
    const temp = document.createElement("canvas");
    const tctx = temp.getContext("2d");

    temp.width = displayW;
    temp.height = displayH;

    tctx.drawImage(img, 0, 0, displayW, displayH);

    const PIECE = 16;

    const pieces = [];

    // ==========================
    // CREATE PIECES (LOCKED TO DISPLAY SPACE)
    // ==========================
    for (let y = 0; y < displayH; y += PIECE) {
        for (let x = 0; x < displayW; x += PIECE) {

            const w = Math.min(PIECE, displayW - x);
            const h = Math.min(PIECE, displayH - y);

            pieces.push({
                x,
                y,
                w,
                h,

                vx: (Math.random() - 0.5) * 1.2,
                vy: Math.random() * -2.5,

                rotation: Math.random() * 0.3,
                vr: (Math.random() - 0.5) * 0.03
            });
        }
    }

    ctx.clearRect(0, 0, displayW, displayH);

    function animate() {
        ctx.clearRect(0, 0, displayW, displayH);

        let alive = false;

        for (const p of pieces) {

            p.vy += 0.22;
            p.vx *= 0.985;

            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.vr;

            if (p.y < displayH + 100) alive = true;

            ctx.save();

            ctx.translate(
                p.x + p.w / 2,
                p.y + p.h / 2
            );

            ctx.rotate(p.rotation);

            ctx.drawImage(
                temp,
                p.x, p.y, p.w, p.h,
                -p.w / 2, -p.h / 2, p.w, p.h
            );

            ctx.restore();
        }

        if (alive) requestAnimationFrame(animate);
    }

    animate();
}