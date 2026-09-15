import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { aartis } from '@/data/aartis';
import { deities } from '@/data/deities';
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

export function generateMetadata({ params }: PageProps): Metadata {
  const aarti = aartis.find(a => a.slug === params.slug);
  if (!aarti) {
    return {
      title: 'आरती सापडली नाही',
    };
  }

  const deity = deities.find(d => d.id === aarti.deity);
  const deityName = deity ? deity.nameDevanagari : '';

  // Construct snippet from first 2 lines of first stanza
  const lyricsSnippet = aarti.stanzas[0]?.devanagari.slice(0, 2).join(' ') || '';
  const pageTitle = `${aarti.titleDevanagari} आरती लिरिक्स (${aarti.titleTransliteration})`;
  const pageDescription = `संपूर्ण ${aarti.titleDevanagari} (${aarti.titleTransliteration}) मराठी व इंग्रजी लिरिक्स. ${lyricsSnippet} — ऑडिओ, सूर-ताल वाद्य, आणि ऑटो-स्क्रोलसह वैदिक ऑनलाइनवर वाचा.`;
  const pageUrl = `https://vediconline.com/aarti/${aarti.slug}/`;

  const keywords = [
    aarti.titleDevanagari,
    `${aarti.titleDevanagari} आरती`,
    `${aarti.titleDevanagari} लिरिक्स`,
    `${aarti.titleDevanagari} lyrics in marathi`,
    aarti.titleTransliteration,
    `${aarti.titleTransliteration} aarti lyrics`,
    deityName ? `${deityName} आरती` : '',
    'आरती संग्रह',
    'संपूर्ण आरती संग्रह',
    'marathi aarti lyrics',
    'vedic online aarti',
    'nitya pooja aarti',
  ].filter(Boolean);

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${aarti.titleDevanagari} आरती लिरिक्स | Vedic Online`,
      description: pageDescription,
      url: pageUrl,
      siteName: 'Vedic Online | आरती संग्रह',
      locale: 'mr_IN',
      type: 'article',
      publishedTime: '2024-01-01T00:00:00.000Z',
      authors: [aarti.author || 'पारंपरिक'],
    },
    twitter: {
      card: 'summary',
      title: `${aarti.titleDevanagari} आरती लिरिक्स | Vedic Online`,
      description: pageDescription,
    },
  };
}

export default function AartiDetailPage({ params }: PageProps) {
  const currentIndex = aartis.findIndex(a => a.slug === params.slug);

  if (currentIndex === -1) {
    notFound();
  }

  const aarti = aartis[currentIndex];
  const nextAarti = aartis[(currentIndex + 1) % aartis.length];
  const deity = deities.find(d => d.id === aarti.deity);

  const fullLyricsText = aarti.stanzas
    .map(s => s.devanagari.join('\n'))
    .join('\n\n');

  // Schema.org Structured Data for Google Rich Snippets
  const jsonLdComposition = {
    '@context': 'https://schema.org',
    '@type': 'MusicComposition',
    name: aarti.titleDevanagari,
    alternateName: aarti.titleTransliteration,
    inLanguage: ['mr', 'en'],
    composer: aarti.author ? { '@type': 'Person', name: aarti.author } : undefined,
    lyrics: {
      '@type': 'CreativeWork',
      text: fullLyricsText,
      inLanguage: 'mr',
    },
    about: deity
      ? {
          '@type': 'Thing',
          name: deity.nameDevanagari,
          alternateName: deity.nameTransliteration,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Vedic Online',
      url: 'https://vediconline.com',
    },
    url: `https://vediconline.com/aarti/${aarti.slug}/`,
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
        name: 'देवतेनुसार आरत्या',
        item: 'https://vediconline.com/deities/',
      },
      ...(deity
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: deity.nameDevanagari,
              item: `https://vediconline.com/deities/?id=${deity.id}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: aarti.titleDevanagari,
              item: `https://vediconline.com/aarti/${aarti.slug}/`,
            },
          ]
        : [
            {
              '@type': 'ListItem',
              position: 3,
              name: aarti.titleDevanagari,
              item: `https://vediconline.com/aarti/${aarti.slug}/`,
            },
          ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdComposition) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <AartiReaderClient aarti={aarti} nextAarti={nextAarti} />
    </>
  );
}
