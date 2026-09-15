import React from 'react';
import { Metadata } from 'next';
import { DeitiesClient } from './DeitiesClient';

export const metadata: Metadata = {
  title: 'देवता दालन व संपूर्ण उपासना आरत्या (Deities & Sanctuaries)',
  description:
    'गणेश, शिव, देवी दुर्गा, विठ्ठल, मारुती, दत्त, महालक्ष्मी व सर्व देवतांच्या आरत्या, स्तोत्रे व मंत्र. आपल्या आराध्य देवतेची उपासना, वार व सलग पठण क्रम.',
  keywords: [
    'गणपती आरत्या',
    'शंकर आरती',
    'दुर्गा देवी आरती',
    'दत्त आरती',
    'मारुती स्तोत्र',
    'महालक्ष्मी आरती',
    'विठ्ठल आरती',
    'देवता आरत्या मराठी',
    'deity aartis marathi',
    'vedic online deities',
  ],
  alternates: {
    canonical: 'https://vediconline.com/deities/',
  },
  openGraph: {
    title: 'देवता दालन व संपूर्ण उपासना आरत्या | Vedic Online',
    description:
      'गणेश, शिव, दुर्गा, दत्त, विठ्ठल, मारुती व सर्व देवतांच्या आरत्या व स्तोत्रे. उपासना वार व ऑडिओ-स्क्रोलसह.',
    url: 'https://vediconline.com/deities/',
    siteName: 'Vedic Online | आरती संग्रह',
    locale: 'mr_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'देवता दालन व संपूर्ण उपासना आरत्या | Vedic Online',
    description: 'सर्व हिंदू देवी-देवतांच्या मराठी आरत्या, स्तोत्रे व मंत्र.',
  },
};

export default function DeitiesPage() {
  return <DeitiesClient />;
}
