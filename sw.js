/* Service worker: la app funciona sin conexión. Red primero, caché como respaldo. */
const V='medallon-v1';
const SHELL=["./", "index.html", "manifest.json", "css/styles.css", "assets/icon.svg", "assets/icon-192.png", "assets/icon-512.png", "assets/apple-touch-icon.png", "js/config.js", "js/utils.js", "js/bronce.js", "js/plata.js", "js/oro.js", "js/ml.js", "js/views.js", "js/sheet.js", "js/export.js", "js/app.js"];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
