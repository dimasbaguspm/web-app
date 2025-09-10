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
        name: 'Spenicle - @dimasbaguspm',
        short_name: 'Spenicle',
        theme_color: '#e07a5f',
        background_color: '#f4f1de',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'logo.svg',
            type: 'image/svg+xml',
            sizes: '32x32',
            purpose: 'any maskable',
          },
        ],
        protocol_handlers: [
          {
            protocol: 'web+spenicle',
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
