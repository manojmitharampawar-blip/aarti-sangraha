import { MetadataRoute } from 'next';
import { aartis } from '@/data/aartis';
import { playlists } from '@/data/playlists';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vediconline.com';
  const currentDate = new Date().toISOString();

  // 1. Core High-Priority Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deities/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/playlists/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. Individual Aarti and Stotra Content Pages (High SEO Value)
  const aartiRoutes: MetadataRoute.Sitemap = aartis.map(aarti => ({
    url: `${baseUrl}/aarti/${aarti.slug}/`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 3. Curated Playlists & Chanting Sequences
  const playlistRoutes: MetadataRoute.Sitemap = playlists.map(playlist => ({
    url: `${baseUrl}/playlist/${playlist.slug}/`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...aartiRoutes, ...playlistRoutes];
}
