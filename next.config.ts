import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local network host for dev HMR when accessing via LAN IP
  // Include both host and scheme variants to satisfy Turbopack checks
  allowedDevOrigins: ['http://192.168.1.21', '192.168.1.21'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'dummy-placeholder-project.supabase.co',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
