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

const githubRepo = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ? `/${process.env.NEXT_PUBLIC_BASE_PATH}` : githubRepo ? `/${githubRepo}` : '';

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
    <html lang="mr" suppressHydrationWarning className={`${notoSans.variable} ${notoSerif.variable} ${mukta.variable}`}>
      <head>
        <link rel="manifest" href="./manifest.json" />
        <link rel="apple-touch-icon" href="./icon-192.png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans transition-colors duration-300">
        <ThemeProvider>
          <div className="flex-1 flex flex-col max-w-xl mx-auto w-full min-h-screen relative shadow-2xl shadow-black/5 pb-24">
            <Header />
            <PWAInstallPrompt />
            <main className="flex-1 px-4 py-5 w-full">
              {children}
            </main>
            <RitualBar />
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
