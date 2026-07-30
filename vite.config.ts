import { resolve } from 'node:path';

import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    lightningcss: {
      errorRecovery: true,
    },
  },
  build: {
    manifest: true,
    outDir: resolve(import.meta.dirname, 'dist/main/public'),
    emptyOutDir: true,
    rolldownOptions: {
      input: resolve(import.meta.dirname, 'src/main/assets/js/index.ts'),
    },
  },
});
