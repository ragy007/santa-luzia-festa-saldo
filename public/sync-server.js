
// Service Worker para simular servidor local
// Em um ambiente real, seria um servidor Node.js simples

const CACHE_NAME = 'festa-sync-v1';
let connectedClients = new Set();

self.addEventListener('install', (event) => {
  console.log('Sync Server Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Sync Server Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  if (type === 'BROADCAST_DATA') {
    // Simular broadcast para todos os clientes
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        if (client !== event.source) {
          client.postMessage({
            type: 'SYNC_DATA',
            data: data
          });
        }
      });
    });
  }
  
  if (type === 'GET_CLIENTS_COUNT') {
    self.clients.matchAll().then(clients => {
      event.source.postMessage({
        type: 'CLIENTS_COUNT',
        count: clients.length
      });
    });
  }
});

// Fallback para requisições de rede (offline-first)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/sync-api/')) {
    event.respondWith(
      new Response(JSON.stringify({ 
        status: 'ok', 
        message: 'Sync server running via Service Worker' 
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    );
  }
});
