/** @type {import('next').NextConfig} */
const repoName = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: repoName ? `/${repoName}` : '',
  assetPrefix: repoName ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
