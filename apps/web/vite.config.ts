import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import fs from "fs";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    tanstackRouter({}),
  ],
  server: {
    port: 3001,
    host: true,
    // Using HTTP for now - Porto will show a warning but still work
    hmr: {
      port: 3001,
    },
  },
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

