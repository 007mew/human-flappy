// Human Flappy PWA Service Worker
const CACHE_NAME = 'human-flappy-pwa-v4'

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/maskable-icon-512.png',
  '/favicon.png',
  '/apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('PWA: Some core assets could not be pre-cached yet:', err)
      })
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  // Skip chrome-extension or other non-http schemes
  if (!req.url.startsWith('http')) return

  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        // Cache successful responses for offline use
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone)
          })
        }
        return networkRes
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(req).then((cached) => {
          if (cached) return cached
          if (req.headers.get('accept')?.includes('text/html')) {
            return caches.match('/')
          }
        })
      })
  )
})
