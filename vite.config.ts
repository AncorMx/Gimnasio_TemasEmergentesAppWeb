import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const api = (loadEnv(mode, '.', 'VITE_').VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
  const apiExpresion = api.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'script',
        includeAssets: ['icons/apple-touch-icon.png', 'logo.svg'],
        manifest: {
          name: 'Gimnasio Titanes',
          short_name: 'Titanes',
          description: 'Clases, horarios e inscripciones del Gimnasio Titanes',
          lang: 'es',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          theme_color: '#0f2233',
          background_color: '#f4f7fa',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
          navigateFallback: '/index.html',
          runtimeCaching: [
            {
              // Listado y detalles de las clases: consultar la API primero.
              urlPattern: new RegExp(`^${apiExpresion}/clases(?:/|\\?|$)`),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'gimnasio-clases',
                networkTimeoutSeconds: 3,
                expiration: { maxEntries: 30, maxAgeSeconds: 24 * 60 * 60 },
              },
            },
            {
              // Imágenes: evitar descargarlas cada vez que volvemos a verlas.
              urlPattern: new RegExp(`^${apiExpresion}/img/`),
              handler: 'CacheFirst',
              options: {
                cacheName: 'gimnasio-imagenes',
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
              },
            },
          ],
        },
      }),
    ],
  };
});
