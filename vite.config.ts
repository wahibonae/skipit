import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import { execFileSync } from 'child_process';
import manifest from './manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Build the injected script from modules before main build
    {
      name: 'build-injected-script',
      buildStart() {
        console.log('Building netflix-injected.js from modules...');
        execFileSync('node', ['src/content/injected/build.js'], { stdio: 'inherit' });
      },
    },
    react(),
    crx({ manifest: manifest as any }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html',
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
