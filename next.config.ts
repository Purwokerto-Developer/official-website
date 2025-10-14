import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [new URL('https://lh3.googleusercontent.com/**')],
  },
  transpilePackages: ['three'],
};

export default nextConfig;
