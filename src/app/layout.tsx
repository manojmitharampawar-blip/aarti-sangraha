import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { RitualBar } from '@/components/RitualBar';

export const metadata: Metadata = {
  title: 'आरती संग्रह (Aarti Sangraha) — Nitya Pooja & Prayers',
  description: 'A serene, distraction-free, mobile-first Aarti Sangraha web app with auto-scroll, dual-script support, and offline capabilities.',
  keywords: ['aarti sangraha', 'ganesh aarti', 'marathi aarti', 'sukhkarta dukhharta', 'durga aarti', 'hanuman chalisa'],
  authors: [{ name: 'Aarti Sangraha Team' }],
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
    <html lang="mr" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans transition-colors duration-300">
        <ThemeProvider>
          <div className="flex-1 flex flex-col max-w-xl mx-auto w-full min-h-screen relative shadow-2xl shadow-black/5 pb-24">
            <Header />
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
