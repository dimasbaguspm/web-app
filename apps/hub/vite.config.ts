import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import viteReact from '@vitejs/plugin-react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

dayjs.extend(utc);
dayjs.extend(timezone);

const buildTime = dayjs.tz(dayjs(), 'Asia/Jakarta').format('DD[.]MM[.]YYYY[.]hh[.]mm[.]ss');

export default defineConfig({
  plugins: [
    viteReact(),
    tailwindcss(),
    basicSsl({
      name: 'Local SSL',
      domains: ['*.dimasbaguspm.com'],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      injectRegister: 'script-defer',
      manifest: {
        name: 'Hub - @dimasbaguspm',
        short_name: 'Hub',
        theme_color: '#e07a5f',
        background_color: '#f4f1de',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'logo.svg',
            type: 'image/svg+xml',
            sizes: '48x48',
            purpose: 'any',
          },
          {
            src: 'logo.svg',
            type: 'image/svg+xml',
            sizes: '72x72',
            purpose: 'any',
          },
          {
            src: 'logo.svg',
            type: 'image/svg+xml',
            sizes: '96x96',
            purpose: 'any',
          },
          {
            src: 'logo.svg',
            type: 'image/svg+xml',
            sizes: '144x144',
            purpose: 'any',
          },
          {
            src: 'logo.svg',
            type: 'image/svg+xml',
            sizes: '192x192',
            purpose: 'any',
          },
          {
            src: 'logo.svg',
            type: 'image/svg+xml',
            sizes: '512x512',
            purpose: 'any',
          },
          {
            src: 'logo.svg',
            type: 'image/svg+xml',
            sizes: '192x192',
            purpose: 'maskable',
          },
          {
            src: 'logo.svg',
            type: 'image/svg+xml',
            sizes: '512x512',
            purpose: 'maskable',
          },
        ],
        protocol_handlers: [
          {
            protocol: 'web+hub',
            url: '/?handler=%s',
          },
        ],
        handle_links: 'preferred',
        launch_handler: {
          client_mode: 'focus-existing',
        },
      },
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(buildTime),
  },
  server: {
    host: 'local.dimasbaguspm.com',
    allowedHosts: ['.dimasbaguspm.com'],
    port: 8080,
    strictPort: true,
  },
});
