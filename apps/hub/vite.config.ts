import { vitePWA } from '@dimasbaguspm/vite-plugin/pwa';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import viteReact from '@vitejs/plugin-react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { defineConfig } from 'vite';

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
    vitePWA({
      name: 'Hub - @dimasbaguspm',
      shortName: 'Hub',
      protocol_handlers: [
        {
          protocol: 'web+hub',
          url: '/?url=%s',
        },
      ],
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
