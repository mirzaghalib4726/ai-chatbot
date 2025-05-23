import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false, // Disable source maps in production
  images: {
    domains: ['lh3.googleusercontent.com'], // Allow Google user profile images
  },
  // Disable telemetry
  telemetry: {
    disabled: true,
  },
};

export default nextConfig;
