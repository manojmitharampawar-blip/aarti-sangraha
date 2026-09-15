import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { playlists } from '@/data/playlists';
import { aartis } from '@/data/aartis';
import { PlaylistPlayerClient } from './PlaylistPlayerClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return playlists.map(p => ({
    slug: p.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const playlist = playlists.find(p => p.slug === params.slug);
  if (!playlist) {
    return {
      title: 'संग्रह सापडला नाही',
    };
  }

  const playlistHymns = playlist.aartiIds
    .map(id => aartis.find(a => a.id === id))
    .filter(Boolean);

  const hymnTitles = playlistHymns
    .map(h => h?.titleDevanagari)
    .filter(Boolean)
    .join(', ');

  const pageTitle = `${playlist.titleDevanagari} (${playlist.occasion}) सलग पठण संग्रह`;
  const pageDescription = `${playlist.titleDevanagari} — ${playlist.description}. समाविष्ट आरत्या व स्तोत्रे: ${hymnTitles}. अखंड ऑडिओ, सूर व ऑटो-स्क्रोलसह दैनिक पूजा क्रम.`;
  const pageUrl = `https://vediconline.com/playlist/${playlist.slug}/`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      playlist.titleDevanagari,
      playlist.title,
      `${playlist.titleDevanagari} पठण`,
      playlist.occasion,
      'आरती संग्रह',
      'नित्य पूजा संग्रह',
      'vedic online playlist',
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${pageTitle} | Vedic Online`,
      description: pageDescription,
      url: pageUrl,
      siteName: 'Vedic Online | आरती संग्रह',
      locale: 'mr_IN',
      type: 'article',
      images: [
        {
          url: 'https://vediconline.com/og-image.jpg',
          secureUrl: 'https://vediconline.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${playlist.titleDevanagari} - वैदिक ऑनलाईन`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pageTitle} | Vedic Online`,
      description: pageDescription,
      images: ['https://vediconline.com/og-image.jpg'],
    },
  };
}

export default function PlaylistDetailPage({ params }: PageProps) {
  const playlist = playlists.find(p => p.slug === params.slug);

  if (!playlist) {
    notFound();
  }

  const playlistHymns = playlist.aartiIds
    .map(id => aartis.find(a => a.id === id))
    .filter(Boolean);

  const jsonLdItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: playlist.titleDevanagari,
    description: playlist.description,
    numberOfItems: playlistHymns.length,
    itemListElement: playlistHymns.map((hymn, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: hymn?.titleDevanagari,
      url: `https://vediconline.com/aarti/${hymn?.slug}/`,
    })),
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'मुख्यपृष्ठ',
        item: 'https://vediconline.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'नित्य उपासना व संग्रह',
        item: 'https://vediconline.com/playlists/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: playlist.titleDevanagari,
        item: `https://vediconline.com/playlist/${playlist.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <PlaylistPlayerClient playlist={playlist} />
    </>
  );
}
