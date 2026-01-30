import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import { execFileSync } from 'child_process';
import manifest from './manifest.json';

const DEV_ONLY_HOST_PERMISSIONS = ['http://localhost:3000/*'];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  const buildManifest = isProduction
    ? {
        ...manifest,
        host_permissions: manifest.host_permissions.filter(
          (p) => !DEV_ONLY_HOST_PERMISSIONS.includes(p)
        ),
      }
    : manifest;

  return {
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
      crx({ manifest: buildManifest as any }),
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
  };
});
