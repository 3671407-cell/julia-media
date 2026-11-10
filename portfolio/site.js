/* Общий слой для всех страниц сайта ZHAR: шапка, языки RU / EN / TR, созвездие, возврат на сайт агентства */
(() => {
  const SRC = document.currentScript ? document.currentScript.src : "";
  const BASE = SRC.replace(/site\.js.*$/, "");
  const path = location.pathname;
  const mm = path.match(/\/portfolio\/(en|tr)\//);
  const lang = mm ? mm[1] : "ru";
  const LB = BASE + (lang === "ru" ? "" : lang + "/");
  const i0 = path.indexOf("/portfolio/");
  const rest = (i0 < 0 ? "" : path.slice(i0 + 11)).replace(/^(en|tr)\//, "");
  const urlFor = l => BASE + (l === "ru" ? "" : l + "/") + rest + location.search + location.hash;
  const T = {
    ru: { services: "Услуги", work: "Работы", prices: "Цены", faq: "Вопросы", btn: "Разбор за 24 часа", site: "← На сайт агентства", all: "← Все работы" },
    en: { services: "Services", work: "Work", prices: "Prices", faq: "Questions", btn: "Review in 24 hours", site: "← To the agency site", all: "← All work" },
    tr: { services: "Hizmetler", work: "Çalışmalar", prices: "Fiyatlar", faq: "Sorular", btn: "24 saatte analiz", site: "← Ajans sitesine", all: "← Tüm çalışmalar" }
  }[lang];
  const A = LB + "works/agency/";
  const onAgency = /\/works\/agency\//.test(path);
  const isHome = onAgency && /\/works\/agency\/(index\.html)?$/.test(path);

  /* стили */
  const css = `
  .zs-top{position:fixed;top:0;left:0;right:0;z-index:2147483000;height:62px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:0 max(16px,calc((100vw - 1060px)/2));background:rgba(10,8,16,.78);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.09);font:400 14.5px/1 Manrope,system-ui,sans-serif;color:#f6f3f9}
  .zs-top a{color:inherit;text-decoration:none}
  .zs-logo{font:500 21px/1 Unbounded,Manrope,sans-serif;letter-spacing:.22em;background:linear-gradient(100deg,#e64fc4,#ff86d9);-webkit-background-clip:text;background-clip:text;color:transparent!important}
  .zs-back{margin-right:auto;margin-left:6px;padding:8px 14px;border-radius:999px;border:1px solid rgba(230,79,196,.55);color:#ffd2f1!important;font-size:13px;font-weight:600;white-space:nowrap}.zs-back:hover{background:rgba(230,79,196,.18)}
  .zs-nav{display:flex;gap:26px;color:#bdb5cc}.zs-nav a:hover{color:#fff}
  .zs-r{display:flex;align-items:center;gap:14px}
  .zs-lang{display:flex;gap:4px}
  .zs-lang a{padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.16);font-size:12.5px;color:#bdb5cc}
  .zs-lang a[aria-current="true"]{background:linear-gradient(100deg,#e64fc4,#ff86d9);border-color:transparent;color:#fff;font-weight:600}
  .zs-lang a:hover{color:#fff}.zs-lang a.zs-off{opacity:.35;pointer-events:none}
  .zs-btn{padding:11px 18px;border-radius:999px;background:linear-gradient(100deg,#e64fc4,#ff86d9);color:#fff!important;font-weight:600;font-size:13.5px}
  .zs-pill{position:fixed;left:14px;z-index:2147483000;padding:10px 16px;border-radius:999px;font:600 13.5px/1 system-ui,sans-serif;text-decoration:none;color:#fff;box-shadow:0 10px 30px -10px rgba(230,79,196,.65)}
  .zs-pill.site{bottom:62px;background:linear-gradient(100deg,#e64fc4,#8b5cf6)}
  .zs-pill.all{bottom:14px;background:#1a1426;border:1px solid rgba(255,255,255,.18);box-shadow:none}
  html{overflow-x:hidden}
  body.zs-pad{padding-top:62px}
  a.back,.lg,a[data-site="agency"]{display:none!important}
  .top .zs-lang{margin-left:auto;margin-right:14px}
  @media(max-width:1000px){.zs-nav{display:none}}
  @media(max-width:640px){.zs-top{height:56px;gap:8px;padding:0 12px}.zs-logo{font-size:16px;letter-spacing:.1em}.zs-back{margin-left:0;padding:6px 9px;font-size:11px}.zs-btn{display:none}body.zs-pad{padding-top:56px}.zs-lang{gap:3px}.zs-lang a{padding:5px 7px;font-size:11px}.zs-r{gap:0}}@media(max-width:380px){.zs-back{display:none}}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const RU_ONLY = /\/works\/german\//.test(path);
  const sw = () => `<div class="zs-lang" role="group" aria-label="Language">` + ["ru", "en", "tr"].map(l => (RU_ONLY && l !== "ru") ? `<a class="zs-off" title="Russian only" aria-disabled="true">${l.toUpperCase()}</a>` : `<a href="${urlFor(l)}" hreflang="${l}"${l === lang ? ' aria-current="true"' : ""}>${l.toUpperCase()}</a>`).join("") + `</div>`;

  const existing = document.querySelector("header.top .wrap");
  if (existing) {
    const btn = existing.querySelector(".btn");
    const holder = document.createElement("div"); holder.innerHTML = sw();
    existing.insertBefore(holder.firstChild, btn || null);
    /* ссылка «Работы» ведёт в портфолио выбранного языка */
    existing.querySelectorAll('.nav a').forEach(a => { if (/portfolio\.html$|^\.\.\/\.\.\/$/.test(a.getAttribute("href") || "")) a.href = LB; });
  } else {
    const h = document.createElement("div"); h.className = "zs-top"; h.setAttribute("role", "banner");
    h.innerHTML = `<a class="zs-logo" href="${A}">ZHAR</a>${onAgency ? "" : `<a class="zs-back" href="${A}">${T.site}</a>`}<nav class="zs-nav" aria-label="Menu"><a href="${A}#packs">${T.services}</a><a href="${LB}">${T.work}</a><a href="${A}price.html">${T.prices}</a><a href="${A}#faq">${T.faq}</a></nav><div class="zs-r">${sw()}<a class="zs-btn" href="${A}#quiz">${T.btn}</a></div>`;
    document.body.prepend(h); document.body.classList.add("zs-pad");
  }
  /* убрать старые кнопки возврата */
  document.querySelectorAll("a").forEach(a => { if (/^←/.test(a.textContent.trim()) && /^(\.\.\/)+$/.test(a.getAttribute("href") || "") && !a.classList.contains("zs-pill")) a.remove(); });
  /* на страницах с собственной шапкой (портфолио) прячем её: остаётся общая */
  document.querySelectorAll("body > header:not(.zs-top):not(.top)").forEach(h => { if (h.querySelector("nav#menu, nav .logo, .logo")) h.style.display = "none"; });
  const isPortfolioHome = /\/portfolio\/(en\/|tr\/)?(index\.html)?$/.test(path);
  if (isPortfolioHome) { const st2 = document.createElement("style"); st2.textContent = "#top,.hero{scroll-margin-top:70px}body.zs-pad{padding-top:62px}"; document.head.appendChild(st2); }

  /* кнопка «наверх» */
  (() => {
    const label = { ru: "Наверх", en: "Back to top", tr: "Yukarı çık" }[lang];
    const b = document.createElement("button"); b.type = "button"; b.className = "zs-up"; b.setAttribute("aria-label", label); b.title = label;
    b.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 16V4M4.5 9.5 10 4l5.5 5.5"/></svg>';
    const u = document.createElement("style");
    u.textContent = ".zs-up{position:fixed;right:18px;bottom:" + (onAgency ? "96px" : "22px") + ";z-index:2147482000;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,134,217,.55);background:rgba(10,8,16,.82);color:#ffd2f1;display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 10px 30px -10px rgba(230,79,196,.6);opacity:0;visibility:hidden;transform:translateY(10px);transition:opacity .25s,transform .25s,visibility .25s}.zs-up.on{opacity:1;visibility:visible;transform:none}.zs-up:hover{background:linear-gradient(100deg,#e64fc4,#ff86d9);color:#fff}.zs-up:focus-visible{outline:2px solid #ff86d9;outline-offset:3px}@media(max-width:640px){.zs-up{right:12px;width:42px;height:42px}}";
    document.head.appendChild(u); document.body.appendChild(b);
    const upd = () => b.classList.toggle("on", (window.scrollY || document.documentElement.scrollTop) > 300);
    addEventListener("scroll", upd, { passive: true }); upd();
    b.addEventListener("click", () => {
      const y0 = window.scrollY || document.documentElement.scrollTop;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches || y0 < 2) { window.scrollTo(0, 0); return; }
      const dur = Math.min(900, 350 + y0 / 25), t0 = performance.now(), html = document.documentElement, old = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      const step = t => { const p = Math.min(1, (t - t0) / dur); window.scrollTo(0, y0 * (1 - (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); else html.style.scrollBehavior = old; };
      requestAnimationFrame(step);
    });
  })();

  /* созвездие */
  const dust = document.getElementById("dust"); if (dust) dust.style.display = "none";
  if (!document.getElementById("particles")) {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cvs = document.createElement("canvas"); cvs.id = "particles"; cvs.setAttribute("aria-hidden", "true");
    cvs.style.cssText = "position:fixed;inset:0;z-index:-1;pointer-events:none";
    document.body.prepend(cvs);
    const ctx = cvs.getContext("2d"), colors = ["255,79,216", "138,92,255", "52,214,255"];
    let w, h, dpr, pts = []; const mouse = { x: -9999, y: -9999 };
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight;
      cvs.width = w * dpr; cvs.height = h * dpr; cvs.style.width = w + "px"; cvs.style.height = h + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 16000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.6 + .5, c: colors[(Math.random() * 3) | 0] }));
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 120) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${p.c},.8)`; ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) { ctx.strokeStyle = `rgba(${a.c},${(1 - d / 130) * .22})`; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      if (!reduce) requestAnimationFrame(frame);
    }
    addEventListener("resize", resize);
    addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
    resize(); frame();
  }
})();
