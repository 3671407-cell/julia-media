/* Анонимные события страницы для воронки: открыл, прокрутил, дошёл до блока, нажал, смотрел видео.
   Личных данных нет: только случайный номер посетителя в браузере и метка источника из адреса (?s=thr, tt, yt...).
   Пока адрес счётчика EP пустой, события никуда не отправляются. */
(function () {
  var EP = "https://funnel-events.3671407.workers.dev"; // счётчик событий (Cloudflare Worker)
  var q = new URLSearchParams(location.search);
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) {} return null; }
  var S = (q.get("s") || ss("s") || "").replace(/[^a-z0-9_]/gi, "").slice(0, 20); if (S) ss("s", S);
  var V = ls("tv"); if (!V) { V = Math.random().toString(36).slice(2, 12); ls("tv", V); }
  var L = (document.documentElement.lang || "ru").slice(0, 2);
  var page = location.pathname.replace(/index\.html$/, "");
  var sent = {};
  window.__events = window.__events || [];
  function ev(name, extra, once) {
    var key = name + "|" + (extra || ""); if (once && sent[key]) return; sent[key] = 1;
    var d = JSON.stringify({ e: name, x: extra || "", s: S, v: V, l: L, p: page, t: Date.now() });
    window.__events.push(name + (extra ? ":" + extra : ""));
    try { if (EP && navigator.sendBeacon) navigator.sendBeacon(EP, d); } catch (e) {}
  }
  function kind(a) {
    var h = a.getAttribute("href") || "";
    if (/mwrlifekz\.com\/.*\/join/i.test(h)) return "registration";
    if (/mwrlife\./i.test(h)) return "company_site";
    if (/t\.me\/IuliiaZharkova/i.test(h)) return "julia_telegram";
    if (/t\.me\/Travel_threads_bot/i.test(h)) return "bot";
    if (/t\.me\//i.test(h)) return "telegram_other";
    if (/vk\.(com|me)/i.test(h)) return "vk";
    if (/wa\.me|whatsapp/i.test(h)) return "whatsapp";
    if (/karta/i.test(h)) return "gift_map";
    if (/privacy|policy/i.test(h)) return "privacy";
    if (/mailto:/i.test(h)) return "email";
    if (/^#/.test(h)) return "anchor:" + h.slice(1, 20);
    if (/(en|tr)\/index\.html|index\.html/.test(h)) return "language";
    return "link_other";
  }
  ev("page_open", "", true);
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a,button"); if (!a) return;
    if (a.tagName === "A") ev("click", kind(a)); else ev("click", "btn:" + (a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 30));
  }, true);
  var marks = { 25: 0, 50: 0, 75: 0, 100: 0 };
  window.addEventListener("scroll", function () {
    var h = document.documentElement.scrollHeight - window.innerHeight; if (h <= 0) return;
    var p = window.scrollY / h * 100; [25, 50, 75, 100].forEach(function (m) { if (p >= m - 2 && !marks[m]) { marks[m] = 1; ev("scroll", String(m), true); } });
  }, { passive: true });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) ev("section", x.target.id, true); }); }, { threshold: 0.4 });
    [].forEach.call(document.querySelectorAll("section[id]"), function (s) { io.observe(s); });
  }
  [].forEach.call(document.querySelectorAll("video"), function (v, i) {
    if (v.loop || v.autoplay) return; // фоновое видео не считаем просмотром
    var n = ((v.currentSrc || v.getAttribute("src") || (v.querySelector("source") || {}).src || "video" + i).split("/").pop() || "video").replace(/\.\w+$/, "").slice(0, 24);
    var m = { 25: 0, 50: 0, 75: 0 };
    v.addEventListener("play", function () { ev("video_play", n, true); });
    v.addEventListener("timeupdate", function () { if (!v.duration) return; var p = v.currentTime / v.duration * 100; [25, 50, 75].forEach(function (k) { if (p >= k && !m[k]) { m[k] = 1; ev("video_" + k, n, true); } }); });
    v.addEventListener("ended", function () { ev("video_100", n, true); });
  });
  [30, 60, 120].forEach(function (sec) { setTimeout(function () { ev("time", String(sec), true); }, sec * 1000); });
})();
