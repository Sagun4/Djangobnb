import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "167.172.91.46",
        port: "1337",
        pathname: "/media/**",
      },
    ],
  },
  async rewrites() {
    const backendHost = process.env.NEXT_PUBLIC_API_HOST || 'http://167.172.91.46:1337';
    return [
      {
        source: '/api/:path*/',
        destination: `${backendHost}/api/:path*/`,
      },
      {
        source: '/api/:path*',
        destination: `${backendHost}/api/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${backendHost}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
