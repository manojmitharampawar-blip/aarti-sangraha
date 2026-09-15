'use client';

import React from 'react';
import Link from 'next/link';
import { Moon, Sun, Flame, Sliders, HelpCircle } from 'lucide-react';
import { useThemeContext } from '@/components/ThemeProvider';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { openAppGuide } from '@/components/AppIntroductionModal';

export function Header() {
  const { theme, setTheme, script, toggleScript } = useThemeContext();
  const isVisible = useScrollDirection(8);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('pooja');
    else if (theme === 'pooja') setTheme('dark');
    else setTheme('light');
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-[var(--border-main)] bg-[var(--bg-main)] shadow-xs transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-saffron-600 to-gold-500 flex items-center justify-center text-white shadow-md shadow-saffron-600/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-amber-100 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-[var(--text-primary)]">
              आरती संग्रह
            </h1>
            <p className="text-[11px] font-medium tracking-wide text-[var(--text-secondary)]">
              Aarti Sangraha
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Script Switcher */}
          <button
            onClick={toggleScript}
            aria-label={`Switch to ${script === 'devanagari' ? 'English' : 'Devanagari'} script`}
            className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] hover:border-saffron-500/50 transition-colors shadow-sm"
          >
            {script === 'devanagari' ? 'मराठी / ENG' : 'ENG / मराठी'}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={cycleTheme}
            aria-label="Toggle theme: Light, Pooja Amber, Dark"
            className="p-2 rounded-lg border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] hover:border-saffron-500/50 transition-colors shadow-sm"
            title={`Current: ${theme}`}
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-600" />}
            {theme === 'pooja' && <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-diya-glow" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* App Guide / Introduction Walkthrough */}
          <button
            onClick={openAppGuide}
            aria-label="ॲप मार्गदर्शक व माहिती (App Guide)"
            title="ॲप मार्गदर्शक (App Guide)"
            className="p-2 rounded-lg border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] hover:border-saffron-500/50 transition-colors shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </button>

          <Link
            href="/settings"
            aria-label="Settings"
            className="p-2 rounded-lg border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] hover:border-saffron-500/50 transition-colors shadow-sm"
          >
            <Sliders className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
