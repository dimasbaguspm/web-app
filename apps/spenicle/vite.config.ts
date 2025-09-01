import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import viteReact from '@vitejs/plugin-react';
import dayjs from 'dayjs';
import { defineConfig } from 'vite';

const buildTime = dayjs().format('DD[.]MM[.]YYYY[.]hh[.]mm[.]ss');

export default defineConfig({
  plugins: [
    viteReact(),
    tailwindcss(),
    basicSsl({
      name: 'Local SSL',
      domains: ['*.dimasbaguspm.com'],
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
