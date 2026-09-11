'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ChevronRight, Sparkles } from 'lucide-react';
import { AartiItem } from '@/types';
import { useThemeContext } from '@/components/ThemeProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { deities } from '@/data/deities';

interface AartiCardProps {
  aarti: AartiItem;
}

export function AartiCard({ aarti }: AartiCardProps) {
  const { script } = useThemeContext();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(aarti.id);

  const deityInfo = deities.find(d => d.id === aarti.deity);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(aarti.id);
  };

  return (
    <Link
      href={`/aarti/${aarti.slug}`}
      className="group block p-4 rounded-2xl border transition-all duration-200 border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/50 hover:shadow-md hover:shadow-saffron-500/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Deity Badge & Type */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-saffron-500/10 text-saffron-600">
              <Sparkles className="w-2.5 h-2.5" />
              {deityInfo ? (script === 'devanagari' ? deityInfo.nameDevanagari : deityInfo.nameTransliteration) : aarti.deity}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[var(--text-secondary)]">
              {aarti.type}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-saffron-600 transition-colors truncate font-devanagari">
            {script === 'devanagari' ? aarti.titleDevanagari : aarti.titleTransliteration}
          </h2>

          {/* First Line Preview */}
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] truncate mt-1">
            {script === 'devanagari' ? aarti.firstLineDevanagari : aarti.firstLineTransliteration}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0 pt-1">
          <button
            onClick={handleHeartClick}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-transform active:scale-125 ${
                favorited ? 'fill-rose-500 text-rose-500' : 'text-[var(--text-secondary)]'
              }`}
            />
          </button>
          <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
