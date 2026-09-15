import fs from 'fs';

/** @type {import('next').NextConfig} */
// Check if a custom domain is configured (via CNAME file or environment variable)
const hasCustomDomain =
  fs.existsSync('./public/CNAME') ||
  fs.existsSync('./CNAME') ||
  Boolean(process.env.CUSTOM_DOMAIN);

let repoName = '';
if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
  // If base_path from configure-pages or build env is set (e.g. "" for custom domain or "/repo" for github.io)
  repoName = process.env.NEXT_PUBLIC_BASE_PATH.replace(/^\/+|\/+$/g, '');
} else if (!hasCustomDomain && process.env.GITHUB_REPOSITORY) {
  repoName = process.env.GITHUB_REPOSITORY.split('/')[1] || '';
}

const basePath = repoName ? `/${repoName}` : '';

const nextConfig = {
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
