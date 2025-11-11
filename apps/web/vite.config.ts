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
      "@ethersproject/wordlists": path.resolve(__dirname, "../../node_modules/.bun/@ethersproject+wordlists@5.8.0/node_modules/@ethersproject/wordlists/lib.esm/index.js"),
    },
  },
  optimizeDeps: {
    include: [
      'bn.js',
      'js-sha3',
      'ethers',
      '@uniswap/universal-router-sdk',
      '@uniswap/v4-sdk',
      '@ethersproject/wordlists',
      '@ethersproject/abi',
      '@ethersproject/abstract-provider',
      '@ethersproject/abstract-signer',
      '@ethersproject/address',
      '@ethersproject/base64',
      '@ethersproject/basex',
      '@ethersproject/bignumber',
      '@ethersproject/bytes',
      '@ethersproject/constants',
      '@ethersproject/contracts',
      '@ethersproject/hash',
      '@ethersproject/hdnode',
      '@ethersproject/json-wallets',
      '@ethersproject/keccak256',
      '@ethersproject/logger',
      '@ethersproject/networks',
      '@ethersproject/pbkdf2',
      '@ethersproject/properties',
      '@ethersproject/providers',
      '@ethersproject/random',
      '@ethersproject/rlp',
      '@ethersproject/sha2',
      '@ethersproject/signing-key',
      '@ethersproject/solidity',
      '@ethersproject/strings',
      '@ethersproject/transactions',
      '@ethersproject/units',
      '@ethersproject/wallet',
      '@ethersproject/web',
      '@ethersproject/bech32',
    ],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 3001,
    hmr: {
      port: 3001,
    },
  },
});

