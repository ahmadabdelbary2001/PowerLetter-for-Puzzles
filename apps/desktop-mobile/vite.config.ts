import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

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
      // Package Aliases
      {
        find: "@core",
        replacement: path.resolve(__dirname, "../../packages/core/src"),
      },
      {
        find: "@ui",
        replacement: path.resolve(__dirname, "../../packages/ui/src"),
      },
      {
        find: "@powerletter/core",
        replacement: path.resolve(
          __dirname,
          "../../packages/core/src/index.ts"
        ),
      },
      {
        find: "@powerletter/ui",
        replacement: path.resolve(__dirname, "../../packages/ui/src/index.ts"),
      },
      {
        find: "@powerletter/api-bindings",
        replacement: path.resolve(
          __dirname,
          "../../packages/api-bindings/src/index.ts"
        ),
      },
      { find: "@data", replacement: path.resolve(__dirname, "../../data") },

      // Local App Alias
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  server: {
    fs: {
      // Allow serving files from the monorepo packages and data
      allow: ["..", "../../packages", "../../data"],
    },
    port: 5173,
    strictPort: false,
    host: host || false,
    hmr: host ? { protocol: "ws", host, port: 5172 } : undefined,
  },
  envPrefix: ["VITE_", "TAURI_ENV_*"],
  // base is '/' for desktop/mobile, GitHub Pages deploy handled separately
  base: "/",
  build: {
    // Silence non-blocking Rollup chunk-size warning for current bundle profile.
    chunkSizeWarningLimit: 800,
  },
  optimizeDeps: {
    // Exclude workspace packages - let Vite resolve them as source files
    exclude: [
      "@powerletter/core",
      "@powerletter/ui",
      "@powerletter/api-bindings",
    ],
    // Include monorepo paths for proper alias resolution
    include: ["../../packages/core/src/**/*", "../../data/**/*"],
    esbuildOptions: {
      target: "es2022",
    },
  },
});
