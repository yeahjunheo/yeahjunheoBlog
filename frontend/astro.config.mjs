// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    port: 4321,
    host: true
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          // Suppress known @astrojs/node 10 warnings (upstream issues)
          if (warning.message?.includes('experimentalDisableStreaming')) return;
          if (warning.message?.includes('externalized for browser compatibility')) return;
          defaultHandler(warning);
        }
      }
    }
  }
});
