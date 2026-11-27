// Bireysel Cüz Takip — internetsiz çalışma
const SURUM = "no-v38";
const KABUK = ["./", "./yazi/scheherazade-new-600.woff", "./index.html", "./stil.css", "./veri.js", "./veri-ek.js", "./uygulama.js", "./okuyucu.js", "./ekler.js", "./grup.js", "./hadisler.js", "./ogretmen.js", "./konu.js", "./bildirim.js", "./cevrimdisi.js", "./acilis.js", "./sesli.js", "./kible.js", "./ayar.js", "./manifest.json", "./icon-192.png", "./icon-512.png", "./rozet.png", "./gizlilik.html"];
const KALICI = ["api.alquran.cloud", "cdn.jsdelivr.net", "fonts.googleapis.com", "fonts.gstatic.com", "cdnjs.cloudflare.com"];
const GUNCEL = ["api.aladhan.com", "api.open-meteo.com", "hadeethenc.com"];
const ATLA = ["script.google.com", "script.googleusercontent.com"];
self.addEventListener("install", e => { e.waitUntil(caches.open(SURUM).then(c => c.addAll(KABUK)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  let eskiVardi = false;
  e.waitUntil(caches.keys().then(ks => { const eski = ks.filter(k => k !== SURUM && k !== "no-veri"); eskiVardi = eski.length > 0; return Promise.all(eski.map(k => caches.delete(k))); }).then(() => self.clients.claim()));
  // Eski sürümle açık kalan pencereleri (arka plandaki uygulama, Chrome sekmesi) etkinleşme bittikten sonra yenile;
  // yoksa eski kod eski bildirimi yeniden çizer. Beklenmez: etkinleşme bitmeden sayfa yüklenemez.
  setTimeout(() => { if (!eskiVardi) return; self.clients.matchAll({ type: "window" }).then(l => l.forEach(c => { if (c.url.startsWith(self.registration.scope)) c.navigate(c.url).catch(() => {}); })); }, 1500);
});
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

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const hedef = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(l => {
    for (const c of l) { if (c.url.startsWith(self.registration.scope)) { c.navigate(hedef).catch(() => {}); return c.focus(); } }
    return self.clients.openWindow(hedef);
  }));
});

// Günlük bildirim: uygulama açılmadan da yeni günün vakit ve derslerini göster (destekleyen telefonlarda)
async function gunlukBildirim() {
  try {
    const c = await caches.open("no-veri"), m = await c.match(new URL("bct-hafta.json", self.registration.scope).href);
    if (!m) return;
    const v = await m.json(), d = new Date(), p = n => String(n).padStart(2, "0");
    const t = v.gunler && v.gunler[`${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`];
    if (!t) return;
    const imza = "g1|" + `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` + "|" + t.govde;
    const eski = (await self.registration.getNotifications({ tag: "bct-vakit" }))[0];
    if (eski && eski.data && eski.data.imza === imza) return;
    await self.registration.showNotification(t.baslik, { body: t.govde, icon: "icon-192.png", tag: "bct-vakit", renotify: false, silent: true, requireInteraction: true, badge: "rozet.png", data: { imza, url: v.url || "./" } });
  } catch (e) {}
}
self.addEventListener("periodicsync", e => { if (e.tag === "bct-gun") e.waitUntil(gunlukBildirim()); });
