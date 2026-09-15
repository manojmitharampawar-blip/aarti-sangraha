'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Flame, Music, ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react';
import { useThemeContext } from '@/components/ThemeProvider';
import { openAppGuide } from '@/components/AppIntroductionModal';

export function DevotionalHeroBanner() {
  const { script } = useThemeContext();
  const isDevanagari = script === 'devanagari';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-saffron-500/10 to-amber-900/10 p-5 sm:p-6 shadow-md shadow-amber-500/5">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-400/20 via-saffron-500/15 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-saffron-600/10 to-transparent rounded-full blur-2xl pointer-events-none -ml-12 -mb-12" />

      {/* Decorative Sacred Shloka Tagline */}
      <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap mb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-extrabold text-amber-900 dark:text-amber-200 tracking-wide">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{isDevanagari ? '॥ ॐ श्री गणेशाय नमः ॥' : 'Om Shri Ganeshaya Namaha'}</span>
        </span>

        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isDevanagari ? '१००% मोफत व जाहिरातमुक्त' : '100% Free & Ad-Free'}</span>
        </span>
      </div>

      {/* Hero Headline & Subtitle */}
      <div className="relative z-10 space-y-1.5 sm:space-y-2">
        <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari tracking-tight leading-tight">
          {isDevanagari ? (
            <>
              संपूर्ण मराठी{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-600 to-amber-600">
                आरती संग्रह
              </span>{' '}
              व नित्य उपासना
            </>
          ) : (
            <>
              Complete Marathi{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-600 to-amber-600">
                Aarti Sangraha
              </span>{' '}
              & Daily Upasana
            </>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed font-devanagari">
          {isDevanagari
            ? '७५+ पारंपरिक आरत्या, स्तोत्रे व पंचांग — सूर-ताल ऑडिओ, AI वाणी स्क्रोल व स्पर्शविरहित व्हर्च्युअल आरतीसह.'
            : '75+ traditional Aartis, Stotras, and Panchang — with Sur-Taal audio, AI voice scroll, and touchless virtual aarti.'}
        </p>
      </div>

      {/* Feature Micro-Badges */}
      <div className="relative z-10 flex items-center gap-2 flex-wrap pt-3 text-[11px]">
        <span className="px-2.5 py-1 rounded-xl bg-[var(--card-main)] border border-[var(--border-main)] font-semibold text-[var(--text-secondary)] shadow-2xs">
          🪔 ७५+ आरत्या व स्तोत्रे
        </span>
        <span className="px-2.5 py-1 rounded-xl bg-[var(--card-main)] border border-[var(--border-main)] font-semibold text-[var(--text-secondary)] shadow-2xs">
          🎙️ AI वाणी स्क्रोल
        </span>
        <span className="px-2.5 py-1 rounded-xl bg-[var(--card-main)] border border-[var(--border-main)] font-semibold text-[var(--text-secondary)] shadow-2xs">
          📹 स्पर्शविरहित आरती
        </span>
        <span className="px-2.5 py-1 rounded-xl bg-[var(--card-main)] border border-[var(--border-main)] font-semibold text-[var(--text-secondary)] shadow-2xs">
          📶 १००% ऑफलाइन
        </span>
      </div>

      {/* Quick Action CTAs */}
      <div className="relative z-10 mt-4 pt-3 border-t border-amber-500/20 flex items-center gap-3 flex-wrap">
        <Link
          href="/playlists"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-saffron-600/20 active:scale-95 transition-all"
        >
          <Music className="w-3.5 h-3.5" />
          <span>{isDevanagari ? 'नित्य संग्रह सुरू करा' : 'Explore Collections'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={openAppGuide}
          className="px-3.5 py-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/40 text-[var(--text-primary)] font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>{isDevanagari ? 'ॲप मार्गदर्शक (Guide)' : 'App Guide'}</span>
        </button>
      </div>
    </div>
  );
}
