import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Workspace packages - resolve to source for development
      "@powerletter/core": path.resolve(__dirname, "../../packages/core/src/index.ts"),
      "@powerletter/ui": path.resolve(__dirname, "../../packages/ui/src/index.ts"),
      "@powerletter/api-bindings": path.resolve(__dirname, "../../packages/api-bindings/src/index.ts"),
    },
  },
  server: {
    fs: {
      // Allow serving files from the monorepo packages
      allow: ['..', '../../packages'],
    },
    port: 5173,
    strictPort: false,
    host: host || false,
    hmr: host
      ? { protocol: 'ws', host, port: 5172 }
      : undefined,
  },
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  // base is '/' for desktop/mobile, GitHub Pages deploy handled separately
  base: '/',
  optimizeDeps: {
    // Exclude workspace packages - let Vite resolve them as source files
    exclude: ['@powerletter/core', '@powerletter/ui', '@powerletter/api-bindings'],
  },
})
