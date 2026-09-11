'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, X, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';
import { aartis } from '@/data/aartis';
import { deities } from '@/data/deities';
import { searchHymns } from '@/lib/search';
import { AartiCard } from '@/components/AartiCard';
import { DeityId, HymnType } from '@/types';
import { useThemeContext } from '@/components/ThemeProvider';
import { CATEGORY_REGISTRY, filterHymnsByCategory } from '@/lib/categories';

const POPULAR_SEARCH_CHIPS = [
  'सुखकर्ता दुखहर्ता',
  'गणपती अथर्वशीर्ष',
  'रामरक्षा स्तोत्र',
  'हनुमान चालीसा',
  'कालभैरवाष्टक',
  'दत्त बावनी',
  'शिव तांडव',
  'महालक्ष्मी अष्टक',
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialDeity = (searchParams.get('deity') as DeityId) || 'all';

  const { script } = useThemeContext();
  const isDevanagari = script === 'devanagari';
  const [query, setQuery] = useState('');
  const [selectedDeity, setSelectedDeity] = useState<DeityId | 'all'>(initialDeity);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredResults = useMemo(() => {
    let list = searchHymns(aartis, query);
    if (selectedDeity !== 'all') {
      list = list.filter(a => a.deity === selectedDeity);
    }
    return filterHymnsByCategory(list, selectedCategory);
  }, [query, selectedDeity, selectedCategory]);

  const clearQuery = () => setQuery('');

  return (
    <div className="space-y-5">
      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-saffron-600">
          <SearchIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={
            isDevanagari
              ? 'आरती, स्तोत्र, मंत्र किंवा देवता शोधा (उदा. अथर्वशीर्ष, रामरक्षा)...'
              : 'Search Aarti, Stotra or Mantra (e.g. Atharvashirsha, Ramraksha)...'
          }
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-hidden focus:ring-2 focus:ring-saffron-500/50 shadow-sm text-sm"
        />
        {query && (
          <button
            onClick={clearQuery}
            aria-label="Clear search query"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Popular Search Suggestions (shown when no query) */}
      {!query && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] uppercase">
            <TrendingUp className="w-3.5 h-3.5 text-saffron-600" />
            <span>{isDevanagari ? 'लोकप्रिय शोध (Popular Prayers)' : 'Popular Prayers'}</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {POPULAR_SEARCH_CHIPS.map(chip => (
              <button
                key={chip}
                onClick={() => setQuery(chip)}
                className="px-3 py-1.5 rounded-full border border-saffron-500/30 bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 font-bold whitespace-nowrap hover:bg-saffron-500/20 active:scale-95 transition-all font-devanagari"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Deity Filter Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
          <span>{isDevanagari ? 'देवता निवडा (Deity)' : 'Filter by Deity'}</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedDeity('all')}
            className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
              selectedDeity === 'all'
                ? 'bg-saffron-600 text-white shadow-xs'
                : 'border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)]'
            }`}
          >
            {isDevanagari ? 'सर्व (All)' : 'All'}
          </button>
          {deities.map(deity => (
            <button
              key={deity.id}
              onClick={() => setSelectedDeity(deity.id)}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all font-devanagari ${
                selectedDeity === deity.id
                  ? 'bg-saffron-600 text-white shadow-xs'
                  : 'border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)]'
              }`}
            >
              {isDevanagari
                ? deity.nameDevanagari.replace('श्री ', '').replace('भगवान ', '')
                : deity.nameTransliteration.replace('Shri ', '').replace('Bhagwan ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Hymn Category Filter Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] uppercase">
          <SlidersHorizontal className="w-3.5 h-3.5 text-saffron-600" />
          <span>{isDevanagari ? 'प्रकार (Category)' : 'Filter by Category'}</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORY_REGISTRY.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-saffron-600 text-white shadow-xs'
                  : 'border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)]'
              }`}
            >
              {isDevanagari ? cat.labelDevanagari : cat.labelEnglish}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Count */}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pt-1">
        <span>{isDevanagari ? 'शोध निकाल (Results)' : 'Search Results'}</span>
        <span className="font-semibold text-saffron-600">
          {filteredResults.length} {isDevanagari ? 'स्तोत्र व आरत्या मिळाल्या' : 'hymns found'}
        </span>
      </div>

      {/* Results List */}
      <div className="space-y-2.5">
        {filteredResults.length > 0 ? (
          filteredResults.map(aarti => (
            <AartiCard key={aarti.id} aarti={aarti} />
          ))
        ) : (
          <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-[var(--border-main)] space-y-2">
            <p className="text-base font-bold text-[var(--text-primary)]">
              {isDevanagari ? 'काहीही सापडले नाही (No hymns found)' : 'No hymns found'}
            </p>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
              {isDevanagari
                ? 'कृपया वेगळा शब्द किंवा स्पेलिंग वापरून पहा. (उदा. अथर्वशीर्ष, रामरक्षा, सुखकर्ता)'
                : 'Try phonetic English or Marathi keywords, e.g. "atharvashirsha", "ramraksha", "sukhkarta"'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-xs">शोध लोड होत आहे...</div>}>
      <SearchContent />
    </Suspense>
  );
}
