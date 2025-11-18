import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  plugins: [
    tailwindcss(),
    react(),
    tanstackRouter({}),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@loar/abis/addresses": path.resolve(__dirname, "../../packages/abis/src/addresses.ts"),
      "@loar/abis/generated": path.resolve(__dirname, "../../packages/abis/src/generated.ts"),
    },
  },
  build: {
    rollupOptions: {
      external: ['wagmi/codegen'],
      output: {
        globals: {
          'wagmi/codegen': 'wagmi'
        }
      }
    }
  },
  server: {
    port: 3001,
    hmr: {
      port: 3001,
    },
  },
});

