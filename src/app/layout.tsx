import type { Metadata, Viewport } from 'next';
import { Noto_Sans_Devanagari, Noto_Serif_Devanagari, Mukta } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { RitualBar } from '@/components/RitualBar';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

const notoSans = Noto_Sans_Devanagari({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['devanagari', 'latin'],
  display: 'swap',
  variable: '--font-noto-sans',
});

const notoSerif = Noto_Serif_Devanagari({
  weight: ['400', '600', '700'],
  subsets: ['devanagari', 'latin'],
  display: 'swap',
  variable: '--font-noto-serif',
});

const mukta = Mukta({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['devanagari', 'latin'],
  display: 'swap',
  variable: '--font-mukta',
});

// basePath is injected by next.config.mjs (empty for custom domain like vediconline.com)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH
  ? `/${process.env.NEXT_PUBLIC_BASE_PATH.replace(/^\/+|\/+$/g, '')}`
  : '';

export const metadata: Metadata = {
  metadataBase: new URL('https://vediconline.com'),
  title: {
    default: 'संपूर्ण आरती संग्रह मराठी | Vedic Online (Aarti Sangraha, Stotras & Panchang)',
    template: '%s | Vedic Online',
  },
  description:
    'सर्व देवी-देवतांच्या मराठी आरत्या, स्तोत्रे, मंत्र, दैनिक पंचांग व नित्य उपासना संग्रह. सूर-ताल ऑडिओ, व्हर्च्युअल आरती, AI वाणी स्क्रोल व इंग्रजी उच्चारणासह (Dual-script).',
  keywords: [
    'आरती संग्रह',
    'संपूर्ण आरती संग्रह',
    'मराठी आरत्या लिरिक्स',
    'marathi aarti lyrics',
    'vedic online',
    'गणपती आरती',
    'sukhkarta dukhharta lyrics',
    'durga aarti',
    'maruti stotra marathi',
    'hanuman chalisa marathi',
    'nitya upasana aarti',
    'daily panchang marathi',
    'aarti sangraha app',
  ],
  authors: [{ name: 'Vedic Online Team', url: 'https://vediconline.com' }],
  creator: 'Vedic Online',
  publisher: 'Vedic Online',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://vediconline.com/',
  },
  openGraph: {
    title: 'संपूर्ण आरती संग्रह मराठी | Vedic Online',
    description:
      'सर्व देवी-देवतांच्या मराठी आरत्या, स्तोत्रे, मंत्र व नित्य उपासना संग्रह. सूर-ताल ऑडिओ, व्हर्च्युअल आरती व AI स्क्रोलसह.',
    url: 'https://vediconline.com/',
    siteName: 'Vedic Online | आरती संग्रह',
    locale: 'mr_IN',
    alternateLocale: ['en_US', 'hi_IN'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'संपूर्ण आरती संग्रह मराठी | Vedic Online',
    description:
      'सर्व देवी-देवतांच्या मराठी आरत्या, स्तोत्रे, मंत्र व नित्य उपासना संग्रह.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: `${basePath}/manifest.json`,
  icons: {
    icon: `${basePath}/icon-192.png`,
    apple: `${basePath}/icon-192.png`,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'आरती संग्रह',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ea580c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global Structured Data for Google Sitelinks Search Box and Brand Authority
  const jsonLdWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vedic Online | आरती संग्रह',
    alternateName: ['Aarti Sangraha', 'Vedic Online', 'वैदिक ऑनलाइन', 'Aarti Sangrah'],
    url: 'https://vediconline.com/',
    inLanguage: 'mr-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://vediconline.com/search/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vedic Online',
    alternateName: 'वैदिक ऑनलाइन',
    url: 'https://vediconline.com/',
    logo: 'https://vediconline.com/icon-512.png',
  };

  return (
    <html lang="mr" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="आरती संग्रह" />
        <meta name="application-name" content="आरती संग्रह" />
        <link rel="apple-touch-icon" href={`${basePath}/icon-192.png`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body
        className={`${notoSans.variable} ${notoSerif.variable} ${mukta.variable} font-sans h-full bg-[var(--bg-main)] text-[var(--text-primary)] antialiased transition-colors duration-300`}
      >
        <ThemeProvider>
          <div className="min-h-full flex flex-col justify-between">
            <div>
              <Header />
              <RitualBar />
              <main className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6">{children}</main>
            </div>
            <BottomNav />
          </div>
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
