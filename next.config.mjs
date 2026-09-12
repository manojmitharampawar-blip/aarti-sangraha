/** @type {import('next').NextConfig} */
const githubRepo = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';
const repoName = process.env.NEXT_PUBLIC_BASE_PATH || githubRepo || '';

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
