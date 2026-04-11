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
    alias: [
      { find: "@powerletter/core", replacement: path.resolve(__dirname, "../../packages/core/src/index.ts") },
      { find: "@powerletter/ui", replacement: path.resolve(__dirname, "../../packages/ui/src/index.ts") },
      { find: "@powerletter/api-bindings", replacement: path.resolve(__dirname, "../../packages/api-bindings/src/index.ts") },
      
      // Resolve @/ within core package to core's src
      { find: "@/domain", replacement: path.resolve(__dirname, "../../packages/core/src/domain") },
      { find: "@/data", replacement: path.resolve(__dirname, "../../data") },
      { find: "@/features", replacement: path.resolve(__dirname, "../../packages/core/src/features") },
      { find: "@/games", replacement: path.resolve(__dirname, "../../packages/core/src/games") },
      { find: "@/lib", replacement: path.resolve(__dirname, "../../packages/core/src/lib") },
      { find: "@/hooks", replacement: path.resolve(__dirname, "../../packages/core/src/hooks") },
      { find: "@/types", replacement: path.resolve(__dirname, "../../packages/core/src/types") },
      { find: "@/i18n", replacement: path.resolve(__dirname, "../../packages/core/src/i18n") },
      { find: "@/wasm", replacement: path.resolve(__dirname, "../../packages/core/src/wasm") },
      { find: "@/atoms", replacement: path.resolve(__dirname, "../../packages/ui/src/atoms") },
      { find: "@/molecules", replacement: path.resolve(__dirname, "../../packages/ui/src/molecules") },
      { find: "@/organisms", replacement: path.resolve(__dirname, "../../packages/ui/src/organisms") },
      { find: "@/templates", replacement: path.resolve(__dirname, "../../packages/ui/src/templates") },
      { find: "@/screens", replacement: path.resolve(__dirname, "../../packages/ui/src/screens") },
      { find: "@/pages", replacement: path.resolve(__dirname, "../../packages/ui/src/pages") },
      // Must come last to prevent shadowing more specific aliases!
      { find: "@", replacement: path.resolve(__dirname, "./src") }
    ],
  },
  server: {
    fs: {
      // Allow serving files from the monorepo packages and data
      allow: ['..', '../../packages', '../../data'],
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
    // Include monorepo paths for proper alias resolution
    include: ['../../packages/core/src/**/*', '../../data/**/*'],
    esbuildOptions: {
      target: 'es2022',
    },
  },
})
