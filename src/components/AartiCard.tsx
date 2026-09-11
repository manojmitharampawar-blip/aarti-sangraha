'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ChevronRight, Sparkles, FolderPlus } from 'lucide-react';
import { AartiItem, HymnType } from '@/types';
import { useThemeContext } from '@/components/ThemeProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { AddToGroupModal } from '@/components/AddToGroupModal';
import { deities } from '@/data/deities';

interface AartiCardProps {
  aarti: AartiItem;
}

export function getHymnTypeBadge(type: HymnType, isDevanagari: boolean) {
  switch (type) {
    case 'stotra':
      return {
        label: isDevanagari ? 'स्तोत्र' : 'Stotra',
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
      };
    case 'ashtak':
      return {
        label: isDevanagari ? 'अष्टक' : 'Ashtak',
        className: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20',
      };
    case 'mantra':
      return {
        label: isDevanagari ? 'मंत्र / सूक्त' : 'Mantra',
        className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
      };
    case 'chalisa':
      return {
        label: isDevanagari ? 'चालीसा' : 'Chalisa',
        className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
      };
    case 'aarti':
    default:
      return {
        label: isDevanagari ? 'आरती' : 'Aarti',
        className: 'bg-saffron-500/10 text-saffron-700 dark:text-saffron-400 border border-saffron-500/20',
      };
  }
}

export function AartiCard({ aarti }: AartiCardProps) {
  const { script } = useThemeContext();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const favorited = isFavorite(aarti.id);

  const deityInfo = deities.find(d => d.id === aarti.deity);
  const isDevanagari = script === 'devanagari';
  const typeBadge = getHymnTypeBadge(aarti.type, isDevanagari);

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
        className="group block p-4 rounded-2xl border transition-all duration-200 border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/50 hover:shadow-md hover:shadow-saffron-500/5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Deity Badge & Type */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[var(--text-secondary)]">
                <Sparkles className="w-2.5 h-2.5 text-saffron-600" />
                {deityInfo ? (isDevanagari ? deityInfo.nameDevanagari : deityInfo.nameTransliteration) : aarti.deity}
              </span>
              <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md ${typeBadge.className}`}>
                {typeBadge.label}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-saffron-600 transition-colors truncate font-devanagari">
              {isDevanagari ? aarti.titleDevanagari : aarti.titleTransliteration}
            </h2>

            {/* First Line Preview */}
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] truncate mt-1">
              {isDevanagari ? aarti.firstLineDevanagari : aarti.firstLineTransliteration}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0 pt-1">
            <button
              onClick={handleGroupClick}
              aria-label="Add to custom aarti group"
              title="Add to group"
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--text-secondary)] hover:text-saffron-600"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
            <button
              onClick={handleHeartClick}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Heart
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  favorited ? 'fill-rose-500 text-rose-500' : 'text-[var(--text-secondary)]'
                }`}
              />
            </button>
            <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>

      <AddToGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        aarti={aarti}
      />
    </>
  );
}
