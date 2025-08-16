import tailwindcssPlugin from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tanstackRouter({}),
  ],
  css: {
    postcss: {
      plugins: [tailwindcssPlugin, autoprefixer],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});