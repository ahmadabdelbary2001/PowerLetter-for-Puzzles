import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Support Arabic/English with proper RTL
  i18n: undefined, // We use i18next client-side for flexibility
  // Allow importing from monorepo packages
  transpilePackages: ["@powerletter/ui", "@powerletter/core"],
};

export default nextConfig;
