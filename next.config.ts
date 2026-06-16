import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: output: "standalone" removed — Vercel handles Next.js natively
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 31536000, // 1 year for product images
    remotePatterns: [],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
