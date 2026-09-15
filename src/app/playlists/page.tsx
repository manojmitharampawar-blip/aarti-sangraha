import React from 'react';
import { Metadata } from 'next';
import { PlaylistsClient } from './PlaylistsClient';

export const metadata: Metadata = {
  title: 'नित्य उपासना व सलग आरती संग्रह क्रम',
  description:
    'सण, उत्सव व दैनंदिन पूजेसाठी सलग आरत्यांचे क्रमबद्ध संकलन. मंगळवार गणेश उपासना, गुरुवार दत्त उपासना, प्रभात स्तोत्रे, नवरात्र आरत्या व अखंड ऑडिओ वादन.',
  keywords: [
    'आरती संग्रह क्रम',
    'नित्य उपासना संग्रह',
    'गणेश उपासना क्रम',
    'दत्त उपासना क्रम',
    'प्रभात स्तोत्रे',
    'नवरात्र आरती संग्रह',
    'मराठी आरती संग्रह',
    'vedic online playlists',
  ],
  alternates: {
    canonical: 'https://vediconline.com/playlists/',
  },
  openGraph: {
    title: 'नित्य उपासना व सलग आरती संग्रह क्रम | Vedic Online',
    description:
      'सण, उत्सव व दैनंदिन पूजेसाठी सलग आरत्यांचे क्रमबद्ध संकलन. अखंड ऑडिओ, सूर व ऑटो-स्क्रोलसह.',
    url: 'https://vediconline.com/playlists/',
    siteName: 'Vedic Online | आरती संग्रह',
    locale: 'mr_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'नित्य उपासना व सलग आरती संग्रह क्रम | Vedic Online',
    description: 'सण, उत्सव व दैनंदिन पूजेसाठी सलग आरत्यांचे क्रमबद्ध संकलन.',
  },
};

export default function PlaylistsPage() {
  return <PlaylistsClient />;
}
