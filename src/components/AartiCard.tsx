'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ChevronRight, Sparkles, FolderPlus, Clock } from 'lucide-react';
import { AartiItem, HymnType } from '@/types';
import { useThemeContext } from '@/components/ThemeProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { AddToGroupModal } from '@/components/AddToGroupModal';
import { deities } from '@/data/deities';
import { getHymnTypeBadge, calculateChantingTimeMinutes } from '@/lib/categories';

// Re-export for backward compatibility
export { getHymnTypeBadge };

interface AartiCardProps {
  aarti: AartiItem;
}

export function AartiCard({ aarti }: AartiCardProps) {
  const { script } = useThemeContext();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const favorited = isFavorite(aarti.id);

  const deityInfo = deities.find(d => d.id === aarti.deity);
  const isDevanagari = script === 'devanagari';
  const typeBadge = getHymnTypeBadge(aarti.type, isDevanagari);
  const estimatedMins = calculateChantingTimeMinutes(aarti.stanzas);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(aarti.id);
  };

  const handleGroupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsGroupModalOpen(true);
  };

  return (
    <>
      <Link
        href={`/aarti/${aarti.slug}`}
        className="group block p-4 sm:p-5 rounded-2xl border transition-all duration-200 border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/50 hover:shadow-md hover:shadow-saffron-500/5 active:scale-[0.99]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Deity Badge, Type Badge & Reading Time */}
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[var(--text-secondary)] border border-[var(--border-main)]">
                <Sparkles className="w-2.5 h-2.5 text-saffron-600" />
                <span>
                  {deityInfo ? (isDevanagari ? deityInfo.nameDevanagari : deityInfo.nameTransliteration) : aarti.deity}
                </span>
              </span>

              <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md ${typeBadge.className}`}>
                {typeBadge.label}
              </span>

              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--text-secondary)] ml-auto sm:ml-0">
                <Clock className="w-2.5 h-2.5 text-saffron-600/80" />
                <span>~{estimatedMins} मि.</span>
              </span>
            </div>

            {/* Title */}
            <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] group-hover:text-saffron-600 transition-colors truncate font-devanagari">
              {isDevanagari ? aarti.titleDevanagari : aarti.titleTransliteration}
            </h2>

            {/* First Line Preview */}
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] truncate mt-1 leading-relaxed">
              {isDevanagari ? aarti.firstLineDevanagari : aarti.firstLineTransliteration}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <button
              onClick={handleGroupClick}
              aria-label="Add to custom aarti group"
              title="ग्रुपमध्ये जोडा"
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--text-secondary)] hover:text-saffron-600"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
            <button
              onClick={handleHeartClick}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              title={favorited ? 'आवडत्यामधून काढा' : 'आवडत्यामध्ये जोडा'}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Heart
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  favorited ? 'fill-rose-500 text-rose-500' : 'text-[var(--text-secondary)]'
                }`}
              />
            </button>
            <div className="w-7 h-7 rounded-full bg-saffron-500/10 text-saffron-600 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-saffron-600 group-hover:text-white transition-all ml-1">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>

      {/* Add To Custom Group Modal */}
      <AddToGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        aarti={aarti}
      />
    </>
  );
}
