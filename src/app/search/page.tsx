'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { aartis } from '@/data/aartis';
import { deities } from '@/data/deities';
import { searchHymns, filterHymns } from '@/lib/search';
import { AartiCard } from '@/components/AartiCard';
import { DeityId, HymnType } from '@/types';
import { useThemeContext } from '@/components/ThemeProvider';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialDeity = (searchParams.get('deity') as DeityId) || 'all';

  const { script } = useThemeContext();
  const [query, setQuery] = useState('');
  const [selectedDeity, setSelectedDeity] = useState<DeityId | 'all'>(initialDeity);
  const [selectedType, setSelectedType] = useState<HymnType | 'all'>('all');

  const filteredResults = useMemo(() => {
    const searched = searchHymns(aartis, query);
    return filterHymns(searched, {
      deity: selectedDeity,
      type: selectedType,
    });
  }, [query, selectedDeity, selectedType]);

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
            script === 'devanagari'
              ? 'आरती, स्तोत्र किंवा देवता शोधा (उदा. सुखकर्ता, गणपती)...'
              : 'Search Aarti, Stotra (e.g. Sukhkarta, Ganpati)...'
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

      {/* Deity Filter Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
          <span>देवता निवडा (Deity)</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedDeity('all')}
            className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
              selectedDeity === 'all'
                ? 'bg-saffron-600 text-white shadow-xs'
                : 'border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)]'
            }`}
          >
            सर्व (All)
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
              {script === 'devanagari' ? deity.nameDevanagari.replace('श्री ', '') : deity.nameTransliteration.replace('Shri ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Hymn Type Filter Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] uppercase">
          <SlidersHorizontal className="w-3.5 h-3.5 text-saffron-600" />
          <span>प्रकार (Type)</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'सर्व प्रकार (All)' },
            { id: 'aarti', label: 'आरती (Aarti)' },
            { id: 'chalisa', label: 'चालीसा (Chalisa)' },
            { id: 'stotra', label: 'स्तोत्र (Stotra)' },
            { id: 'mantra', label: 'प्रार्थना व मंत्र (Mantra)' },
          ].map(typeItem => (
            <button
              key={typeItem.id}
              onClick={() => setSelectedType(typeItem.id as HymnType | 'all')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                selectedType === typeItem.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)]'
              }`}
            >
              {typeItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Count */}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pt-1">
        <span>शोध निकाल (Results)</span>
        <span className="font-semibold text-saffron-600">
          {filteredResults.length} आरत्या मिळाल्या
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
              काहीही सापडले नाही (No hymns found)
            </p>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
              कृपया वेगळा शब्द किंवा स्पेलिंग वापरून पहा. (Try phonetic English, e.g. &apos;sukhkarta&apos;)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-sm text-[var(--text-secondary)]">लोड होत आहे...</div>}>
      <SearchContent />
    </Suspense>
  );
}
