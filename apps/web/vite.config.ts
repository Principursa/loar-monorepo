import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    tanstackRouter({}),
  ],
  build: {
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/starknetkit')) return 'starknetkit';
          // no local src/core chunks
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['@dynamic-labs/sdk-react-core'],
  },
  ssr: {
    noExternal: ['@dynamic-labs/sdk-react-core'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

