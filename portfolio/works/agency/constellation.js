/* Созвездие на фоне, как на визитке: точки, линии между близкими, отталкиваются от курсора */
(() => {
  if (document.getElementById("particles")) return;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cvs = document.createElement("canvas");
  cvs.id = "particles"; cvs.setAttribute("aria-hidden", "true");
  cvs.style.cssText = "position:fixed;inset:0;z-index:-1;pointer-events:none";
  document.body.prepend(cvs);
  const ctx = cvs.getContext("2d");
  const colors = ["255,79,216", "138,92,255", "52,214,255"];
  let w, h, dpr, pts = [];
  const mouse = { x: -9999, y: -9999 };
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    cvs.width = w * dpr; cvs.height = h * dpr;
    cvs.style.width = w + "px"; cvs.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, (w * h) / 16000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.6 + .5, c: colors[(Math.random() * 3) | 0] }));
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 120) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${p.c},.8)`; ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 130) { ctx.strokeStyle = `rgba(${a.c},${(1 - d / 130) * .22})`; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    }
    if (!reduceMotion) requestAnimationFrame(frame);
  }
  addEventListener("resize", resize);
  addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  resize(); frame();
})();
