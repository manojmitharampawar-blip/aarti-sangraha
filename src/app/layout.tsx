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
  title: 'आरती संग्रह (Aarti Sangraha) — Nitya Pooja & Prayers',
  description: 'A serene, distraction-free, mobile-first Aarti Sangraha web app with auto-scroll, dual-script support, and offline capabilities.',
  keywords: ['aarti sangraha', 'ganesh aarti', 'marathi aarti', 'sukhkarta dukhharta', 'durga aarti', 'hanuman chalisa'],
  authors: [{ name: 'Aarti Sangraha Team' }],
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
  return (
    <html lang="mr" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="आरती संग्रह" />
        <meta name="application-name" content="आरती संग्रह" />
        <link rel="apple-touch-icon" href={`${basePath}/icon-192.png`} />
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
