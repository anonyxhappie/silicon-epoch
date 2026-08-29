/** @type {import('next').NextConfig} */
const repo = 'silicon-epoch';

const nextConfig = {
  output: 'export',
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three'],
  reactStrictMode: true,
};

export default nextConfig;
