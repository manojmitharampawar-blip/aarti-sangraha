'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, X, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';
import { aartis } from '@/data/aartis';
import { deities } from '@/data/deities';
import { AartiCard } from '@/components/AartiCard';
import { DeityId } from '@/types';
import { useThemeContext } from '@/components/ThemeProvider';
import { CATEGORY_REGISTRY } from '@/lib/categories';
import { DEVOTIONAL_INTENT_CATEGORIES } from '@/lib/semanticIndex';
import { performIntelligentSearch } from '@/lib/neuralSearchClient';

const POPULAR_SEARCH_CHIPS = [
  'सुखकर्ता दुखहर्ता',
  'गणपती अथर्वशीर्ष',
  'रामरक्षा स्तोत्र',
  'हनुमान चालीसा',
  'कालभैरवाष्टक',
  'दत्त बावनि',
  'शिव तांडव',
  'महालक्ष्मी अष्टक',
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialDeity = (searchParams.get('deity') as DeityId) || 'all';

  const { script } = useThemeContext();
  const isDevanagari = script === 'devanagari';
  const [query, setQuery] = useState('');
  const [isAiMode, setIsAiMode] = useState(true);
  const [selectedIntent, setSelectedIntent] = useState<string>('all');
  const [selectedDeity, setSelectedDeity] = useState<DeityId | 'all'>(initialDeity);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredResults = useMemo(() => {
    return performIntelligentSearch(aartis, query, {
      isAiMode,
      selectedIntent,
      selectedDeity,
      selectedCategory,
    });
  }, [query, isAiMode, selectedIntent, selectedDeity, selectedCategory]);

  const clearQuery = () => {
    setQuery('');
    setSelectedIntent('all');
  };

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
          onChange={e => {
            setQuery(e.target.value);
            if (selectedIntent !== 'all') setSelectedIntent('all');
          }}
          placeholder={
            isAiMode
              ? isDevanagari
                ? 'उदा. संकट निवारण, आरोग्य लाभ, परीक्षेसाठी बुद्धी, किंवा भीतीमुक्ती...'
                : 'e.g. Overcoming crisis, health healing, exam wisdom, peace...'
              : isDevanagari
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

      {/* AI Semantic Mode Control */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setIsAiMode(!isAiMode)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            isAiMode
              ? 'bg-gradient-to-r from-saffron-600 to-amber-600 text-white shadow-md shadow-saffron-500/20 active:scale-95'
              : 'border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAiMode ? 'animate-pulse text-amber-200' : 'text-saffron-600'}`} />
          <span>{isDevanagari ? 'AI सिमेंटिक शोध' : 'AI Intent Search'}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              isAiMode ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            {isAiMode ? (isDevanagari ? 'सुरू' : 'ON') : (isDevanagari ? 'बंद' : 'OFF')}
          </span>
        </button>

        <span className="text-[11px] text-[var(--text-secondary)]">
          {isAiMode
            ? isDevanagari
              ? 'स्थानिक ऑन-डिव्हाइस AI'
              : 'On-device AI'
            : isDevanagari
              ? 'शब्दशः शोध'
              : 'Exact search'}
        </span>
      </div>

      {/* AI Spiritual Intent Chips (Active when AI Mode is ON) */}
      {isAiMode && (
        <div className="space-y-2 p-3 rounded-2xl bg-saffron-500/5 dark:bg-saffron-950/20 border border-saffron-500/20">
          <div className="flex items-center justify-between text-xs font-bold text-saffron-800 dark:text-saffron-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
              {isDevanagari ? 'संकल्प व आध्यात्मिक हेतू (Spiritual Goals)' : 'Spiritual Needs & Goals'}
            </span>
            {selectedIntent !== 'all' && (
              <button
                onClick={() => setSelectedIntent('all')}
                className="text-[11px] text-saffron-600 hover:underline"
              >
                {isDevanagari ? 'सर्व दाखवा' : 'Show all'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedIntent('all')}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                selectedIntent === 'all'
                  ? 'bg-saffron-600 text-white shadow-xs'
                  : 'border border-saffron-500/30 bg-[var(--card-main)] text-[var(--text-secondary)]'
              }`}
            >
              {isDevanagari ? 'सर्व (All)' : 'All'}
            </button>
            {DEVOTIONAL_INTENT_CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedIntent(cat.key);
                  if (query) setQuery('');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all font-devanagari ${
                  selectedIntent === cat.key
                    ? 'bg-saffron-600 text-white shadow-xs'
                    : 'border border-saffron-500/20 bg-[var(--card-main)] text-[var(--text-secondary)] hover:border-saffron-500/40'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{isDevanagari ? cat.labelMr.split(' व ')[0] : cat.labelEn.split(' & ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Search Suggestions (shown when no query and no intent selected) */}
      {!query && selectedIntent === 'all' && (
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
      <div className="space-y-3">
        {filteredResults.length > 0 ? (
          filteredResults.map(item => (
            <div key={item.hymn.id} className="space-y-1.5">
              <AartiCard aarti={item.hymn} />
              {isAiMode && item.reasonMr && (
                <div className="mx-1 px-3 py-1.5 rounded-xl bg-saffron-500/10 dark:bg-saffron-950/40 border border-saffron-500/20 text-xs flex items-center justify-between text-saffron-800 dark:text-saffron-200">
                  <div className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
                    <span className="font-medium truncate">
                      {isDevanagari ? item.reasonMr : item.reasonEn}
                    </span>
                  </div>
                  <span className="font-bold text-[10px] bg-saffron-600 text-white px-2 py-0.5 rounded-full shrink-0 ml-2">
                    {item.score}% {isDevanagari ? 'जुळणी' : 'match'}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-[var(--border-main)] space-y-2">
            <p className="text-base font-bold text-[var(--text-primary)]">
              {isDevanagari ? 'काहीही सापडले नाही (No hymns found)' : 'No hymns found'}
            </p>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
              {isDevanagari
                ? 'कृपया वेगळा शब्द, हेतू किंवा स्पेलिंग वापरून पहा. (उदा. संकट निवारण, आरोग्य, अथर्वशीर्ष, रामरक्षा)'
                : 'Try natural intent words like "crisis", "health", "exam wisdom" or prayer names.'}
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
