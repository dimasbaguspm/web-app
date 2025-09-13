import { VitePWA } from 'vite-plugin-pwa';

interface VitePWAOptions {
  name: string;
  shortName: string;
  protocol_handlers: { protocol: string; url: string }[];
}

export const vitePWA = (options: VitePWAOptions) => {
  const { name, shortName, protocol_handlers } = options ?? {};

  return VitePWA({
    registerType: 'autoUpdate',
    strategies: 'generateSW',
    injectRegister: 'script-defer',
    manifest: {
      name,
      short_name: shortName,
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
      protocol_handlers,
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
  });
};
