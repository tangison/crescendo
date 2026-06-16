import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: output: "standalone" removed - Vercel handles Next.js natively
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000, // 1 year for product images
    remotePatterns: [],
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    // Tree-shake barrel imports - massive bundle reduction for icon libraries and framer-motion
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "class-variance-authority",
      "@radix-ui/react-slot",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-accordion",
      "@radix-ui/react-tabs",
      "@radix-ui/react-select",
    ],
  },
};

export default nextConfig;
