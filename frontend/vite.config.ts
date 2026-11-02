import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site under /<repo>/; the workflow sets VITE_BASE for it.
  base: process.env.VITE_BASE ?? '/',
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Same-origin in dev: /api/users -> http://localhost:3003/staff
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
