/* Kho Chỉ Chính Hãng — service worker
   Giữ vỏ app trong máy để mở được cả khi mất mạng.
   KHÔNG bao giờ cache lời gọi lên Google Apps Script. */

const KHO = 'cch-v1';
const VO = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(KHO).then(c => c.addAll(VO)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== KHO).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // bán / nhập luôn đi thẳng ra mạng
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;             // Google Fonts, Apps Script: không đụng vào

  e.respondWith(
    caches.match(req).then(hit => {
      const mang = fetch(req).then(res => {
        if (res && res.status === 200) {
          const ban = res.clone();
          caches.open(KHO).then(c => c.put(req, ban));
        }
        return res;
      }).catch(() => hit);
      return hit || mang;                                 // có sẵn thì trả ngay, đồng thời làm mới ngầm
    })
  );
});
