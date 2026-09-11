import React from 'react';
import { notFound } from 'next/navigation';
import { playlists } from '@/data/playlists';
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

export default function PlaylistDetailPage({ params }: PageProps) {
  const playlist = playlists.find(p => p.slug === params.slug);

  if (!playlist) {
    notFound();
  }

  return <PlaylistPlayerClient playlist={playlist} />;
}
