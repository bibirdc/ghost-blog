import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/blog',
  assetPrefix: '/blog',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
