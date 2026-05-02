import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['logging-middleware'],
  experimental: {
    externalDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://20.207.122.201/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
