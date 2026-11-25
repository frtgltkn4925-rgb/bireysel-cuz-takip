// Bireysel Cüz Takip — internetsiz çalışma
const SURUM = "no-v9";
const KABUK = ["./", "./index.html", "./stil.css", "./veri.js", "./veri-ek.js", "./uygulama.js", "./okuyucu.js", "./ekler.js", "./grup.js", "./hadisler.js", "./acilis.js", "./sesli.js", "./kible.js", "./ayar.js", "./manifest.json", "./icon-192.png", "./icon-512.png", "./gizlilik.html"];
const KALICI = ["api.alquran.cloud", "cdn.jsdelivr.net", "fonts.googleapis.com", "fonts.gstatic.com", "cdnjs.cloudflare.com"];
const GUNCEL = ["api.aladhan.com", "api.open-meteo.com", "hadeethenc.com"];
const ATLA = ["script.google.com", "script.googleusercontent.com"];
self.addEventListener("install", e => { e.waitUntil(caches.open(SURUM).then(c => c.addAll(KABUK)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SURUM && k !== "no-veri").map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (ATLA.includes(u.hostname)) return;
  const agFirst = () => fetch(r).then(res => { if (res.ok) { const k = res.clone(); caches.open(u.origin === location.origin ? SURUM : "no-veri").then(c => c.put(r, k)); } return res; }).catch(() => caches.match(r).then(m => m || (r.mode === "navigate" ? caches.match("./index.html") : Response.error())));
  if (u.origin === location.origin || GUNCEL.includes(u.hostname)) { e.respondWith(agFirst()); return; }
  if (KALICI.includes(u.hostname)) {
    e.respondWith(caches.open("no-veri").then(c => c.match(r).then(m => m || fetch(r).then(res => { if (res.ok || res.type === "opaque") c.put(r, res.clone()); return res; }))));
  }
});
