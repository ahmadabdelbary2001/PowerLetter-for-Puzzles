import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Support Arabic/English with proper RTL
  i18n: undefined, // We use i18next client-side for flexibility
  // Allow importing from monorepo packages
  transpilePackages: ["@powerletter/ui", "@powerletter/core"],
  // Resolve path aliases for monorepo packages
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Resolve @/ within core package to core's src
      "@/domain": path.resolve(__dirname, "../../packages/core/src/domain"),
      "@/data": path.resolve(__dirname, "../../data"),
      "@/features": path.resolve(__dirname, "../../packages/core/src/features"),
      "@/games": path.resolve(__dirname, "../../packages/core/src/games"),
      "@/lib": path.resolve(__dirname, "../../packages/core/src/lib"),
      "@/hooks": path.resolve(__dirname, "../../packages/core/src/hooks"),
      "@/types": path.resolve(__dirname, "../../packages/core/src/types"),
      "@/i18n": path.resolve(__dirname, "../../packages/core/src/i18n"),
      "@/wasm": path.resolve(__dirname, "../../packages/core/src/wasm"),
      // Alias for packages folder (CSS and assets)
      "@packages": path.resolve(__dirname, "../../packages"),
    };
    return config;
  },
};

export default nextConfig;
