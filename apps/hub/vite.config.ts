import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    viteReact(),
    tailwindcss(),
    basicSsl({
      name: 'Local SSL',
      domains: ['*.dimasbaguspm.com'],
    }),
  ],
  server: {
    host: 'local.dimasbaguspm.com',
    allowedHosts: ['.dimasbaguspm.com'],
    port: 8080,
    strictPort: true,
  },
});
