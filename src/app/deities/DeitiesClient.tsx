'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { deities } from '@/data/deities';
import { aartis } from '@/data/aartis';
import { useThemeContext } from '@/components/ThemeProvider';
import { AartiCard } from '@/components/AartiCard';
import {
  Calendar,
  ChevronRight,
  Play,
  ArrowLeft,
  Search,
  Clock,
} from 'lucide-react';
import {
  CATEGORY_REGISTRY,
  filterHymnsByCategory,
  getCategoryCounts,
  calculateChantingTimeMinutes,
} from '@/lib/categories';

function DeitiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialDeityId = searchParams.get('id');

  const { script } = useThemeContext();
  const isDevanagari = script === 'devanagari';
  const [selectedDeityId, setSelectedDeityId] = useState<string | null>(initialDeityId);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (initialDeityId) {
      setSelectedDeityId(initialDeityId);
    }
  }, [initialDeityId]);

  const activeDeity = deities.find(d => d.id === selectedDeityId);

  // All hymns dedicated to selected deity
  const allDeityHymns = useMemo(() => {
    return selectedDeityId ? aartis.filter(a => a.deity === selectedDeityId) : [];
  }, [selectedDeityId]);

  // Filtered by category
  const filteredDeityHymns = useMemo(() => {
    return filterHymnsByCategory(allDeityHymns, selectedCategory);
  }, [allDeityHymns, selectedCategory]);

  // Dynamic category counts for this deity
  const deityCategoryCounts = useMemo(() => {
    return getCategoryCounts(allDeityHymns);
  }, [allDeityHymns]);

  // Total estimated chanting time for all deity hymns in flow
  const totalDeityTimeMinutes = useMemo(() => {
    return allDeityHymns.reduce(
      (sum, h) => sum + calculateChantingTimeMinutes(h.stanzas),
      0
    );
  }, [allDeityHymns]);

  // Filtered deities list for top search
  const filteredDeitiesList = useMemo(() => {
    if (!searchFilter.trim()) return deities;
    const q = searchFilter.toLowerCase();
    return deities.filter(
      d =>
        d.nameDevanagari.toLowerCase().includes(q) ||
        d.nameTransliteration.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        (d.primaryDay && d.primaryDay.toLowerCase().includes(q))
    );
  }, [searchFilter]);

  const handleSelectDeity = (id: string) => {
    setSelectedDeityId(id);
    setSelectedCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSelection = () => {
    setSelectedDeityId(null);
    router.push('/deities');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      {activeDeity ? (
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
          <button
            onClick={handleClearSelection}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-600 hover:text-saffron-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isDevanagari ? 'सर्व देवता (All Deities)' : 'All Deities'}</span>
          </button>

          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            {allDeityHymns.length} {isDevanagari ? 'स्तोत्र व आरत्या' : 'Hymns'}
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari">
              {isDevanagari ? 'देवता दालन व उपासना' : 'Deities & Sanctuaries'}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              {isDevanagari
                ? 'आपल्या आराध्य देवतेची निवड करा व समर्पित आरत्या व स्तोत्रांचे सलग पठण करा'
                : 'Select your worshipped deity to chant all dedicated hymns and stotras in sequence'}
            </p>
          </div>

          {/* Instant Deity Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-saffron-600">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder={isDevanagari ? 'देवतेचे नाव शोधा (उदा. गणेश, शिव, दत्त)...' : 'Filter deity...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-hidden focus:ring-2 focus:ring-saffron-500/40"
            />
          </div>
        </div>
      )}

      {/* ACTIVE SELECTED DEITY SHOWCASE VIEW */}
      {activeDeity ? (
        <div className="space-y-5 animate-fade-in">
          {/* Consecrated Deity Banner */}
          <div className="p-5 sm:p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-saffron-500/10 to-transparent space-y-3.5 shadow-lg shadow-amber-500/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-saffron-600 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {isDevanagari
                      ? `उपासना वार: ${activeDeity.primaryDay}`
                      : `Primary Day: ${activeDeity.primaryDay}`}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari">
                  {isDevanagari ? activeDeity.nameDevanagari : activeDeity.nameTransliteration}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 font-devanagari leading-relaxed">
                  {activeDeity.description}
                </p>
              </div>

              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-saffron-500/30 to-amber-400/40 border border-saffron-500/40 flex items-center justify-center font-bold text-saffron-700 dark:text-saffron-300 shrink-0 text-lg font-devanagari shadow-xs">
                {activeDeity.nameDevanagari.split(' ')[1]?.[0] || activeDeity.nameDevanagari[0]}
              </div>
            </div>

            {/* Launch Sequential Recitation Button */}
            {allDeityHymns.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/group?deity=${activeDeity.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-md shadow-saffron-600/25 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>
                    {isDevanagari
                      ? `सर्व ${allDeityHymns.length} आरत्या सलग म्हणा (Chant All)`
                      : `Chant All ${allDeityHymns.length} in Sequence`}
                  </span>
                </Link>

                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]">
                  <Clock className="w-3.5 h-3.5 text-saffron-600" />
                  <span>~{totalDeityTimeMinutes} मिनिटे संपूर्ण उपासना</span>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Category Filter for this deity */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_REGISTRY.map(cat => {
              const count = deityCategoryCounts[cat.id] ?? 0;
              if (cat.id !== 'all' && count === 0) return null;

              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? 'bg-saffron-600 text-white shadow-xs'
                      : 'border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{isDevanagari ? cat.labelDevanagari : cat.labelEnglish}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Deity's Aarti Cards List */}
          <div className="space-y-3">
            {filteredDeityHymns.map(aarti => (
              <AartiCard key={aarti.id} aarti={aarti} />
            ))}
          </div>
        </div>
      ) : (
        /* DEITIES GRID LIST */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredDeitiesList.map(deity => {
            const deityHymns = aartis.filter(a => a.deity === deity.id);
            const count = deityHymns.length;
            const approxMinutes = deityHymns.reduce(
              (sum, h) => sum + calculateChantingTimeMinutes(h.stanzas),
              0
            );

            return (
              <div
                key={deity.id}
                onClick={() => handleSelectDeity(deity.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleSelectDeity(deity.id)}
                className="text-left p-4 sm:p-5 rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/60 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-saffron-500/20 to-amber-500/30 border border-saffron-500/30 flex items-center justify-center font-bold text-saffron-700 dark:text-saffron-300 shrink-0 text-sm font-devanagari group-hover:scale-105 transition-transform shadow-xs">
                        {deity.nameDevanagari.split(' ')[1]?.[0] || deity.nameDevanagari[0]}
                      </div>
                      <div>
                        <h2 className="text-base font-black text-[var(--text-primary)] font-devanagari group-hover:text-saffron-600 transition-colors leading-tight">
                          {isDevanagari ? deity.nameDevanagari : deity.nameTransliteration}
                        </h2>
                        <div className="flex items-center gap-1 text-[11px] text-saffron-600 font-semibold mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{deity.primaryDay}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-saffron-500/15 text-saffron-700 dark:text-saffron-300 shrink-0">
                      {count} {isDevanagari ? 'रचना' : 'hymns'}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] mt-2.5 line-clamp-2 leading-relaxed">
                    {deity.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border-main)] flex items-center justify-between text-xs text-saffron-600 font-bold">
                  <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                    ~{approxMinutes} मिनिटे पाठ
                  </span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{isDevanagari ? 'उपासना पहा' : 'View Sanctuaries'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DeitiesClient() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-xs">लोड होत आहे...</div>}>
      <DeitiesContent />
    </Suspense>
  );
}
