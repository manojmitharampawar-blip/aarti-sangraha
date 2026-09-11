'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Play, Sparkles, ArrowRight } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { aartis } from '@/data/aartis';
import { AartiCard } from '@/components/AartiCard';
import { useThemeContext } from '@/components/ThemeProvider';

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();
  const { script } = useThemeContext();

  const favoriteAartis = aartis.filter(a => favorites.includes(a.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari">
          {script === 'devanagari' ? 'माझ्या आवडत्या आरत्या' : 'My Saved Aartis'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          {script === 'devanagari'
            ? 'आपण जतन केलेल्या आरत्यांचे वैयक्तिक संकलन'
            : 'Your personalized collection of bookmarked hymns'}
        </p>
      </div>

      {!isLoaded ? (
        <div className="text-center py-10 text-xs text-[var(--text-secondary)]">
          लोड होत आहे...
        </div>
      ) : favoriteAartis.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-semibold">{favoriteAartis.length} आरत्या जतन केलेल्या</span>
          </div>

          <div className="space-y-2.5">
            {favoriteAartis.map(aarti => (
              <AartiCard key={aarti.id} aarti={aarti} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[var(--border-main)] space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {script === 'devanagari'
                ? 'अद्याप कोणतीही आरती जोडलेली नाही'
                : 'No favorite aartis saved yet'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
              {script === 'devanagari'
                ? 'कोणत्याही आरतीवर मनाचे चिन्ह (❤️) दाबून ती येथे जतन करा'
                : 'Tap the heart icon on any aarti to save it here for quick daily access'}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 text-white font-bold text-xs shadow-md shadow-saffron-600/20 active:scale-95 transition-all"
          >
            <span>आरती संग्रह पहा (Browse Aartis)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
