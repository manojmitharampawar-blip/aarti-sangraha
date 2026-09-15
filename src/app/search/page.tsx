import React from 'react';
import { Metadata } from 'next';
import { SearchClient } from './SearchClient';

export const metadata: Metadata = {
  title: 'आरती व स्तोत्र AI स्मार्ट शोध (Devotional Search)',
  description:
    'सर्व मराठी आरत्या, स्तोत्रे, मंत्र, श्लोक व चालिसा त्वरित शोधा. उच्चार, नाव, देवता किंवा आपल्या आध्यात्मिक गरजेनुसार (संकट निवारण, शांती, आरोग्य) ऑन-डिव्हाइस AI शोध.',
  keywords: [
    'आरती शोध',
    'स्तोत्र शोध',
    'मराठी आरती सर्च',
    'गणपती आरती शोध',
    'रामरक्षा स्तोत्र',
    'हनुमान चालिसा',
    'vedic online search',
    'marathi devotional search',
  ],
  alternates: {
    canonical: 'https://vediconline.com/search/',
  },
  openGraph: {
    title: 'आरती व स्तोत्र AI स्मार्ट शोध | Vedic Online',
    description:
      'सर्व मराठी आरत्या, स्तोत्रे, मंत्र व चालिसा त्वरित शोधा. उच्चार किंवा आध्यात्मिक गरजेनुसार AI शोध.',
    url: 'https://vediconline.com/search/',
    siteName: 'Vedic Online | आरती संग्रह',
    locale: 'mr_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'आरती व स्तोत्र AI स्मार्ट शोध | Vedic Online',
    description: 'सर्व मराठी आरत्या, स्तोत्रे, मंत्र व चालिसा त्वरित शोधा.',
  },
};

export default function SearchPage() {
  return <SearchClient />;
}
