import React from 'react';
import { notFound } from 'next/navigation';
import { aartis } from '@/data/aartis';
import { AartiReaderClient } from './AartiReaderClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return aartis.map(aarti => ({
    slug: aarti.slug,
  }));
}

export default function AartiDetailPage({ params }: PageProps) {
  const currentIndex = aartis.findIndex(a => a.slug === params.slug);

  if (currentIndex === -1) {
    notFound();
  }

  const aarti = aartis[currentIndex];
  const nextAarti = aartis[(currentIndex + 1) % aartis.length];

  return <AartiReaderClient aarti={aarti} nextAarti={nextAarti} />;
}
