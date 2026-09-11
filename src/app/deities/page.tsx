'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { deities } from '@/data/deities';
import { aartis } from '@/data/aartis';
import { useThemeContext } from '@/components/ThemeProvider';
import { AartiCard } from '@/components/AartiCard';
import {
  Sparkles,
  Calendar,
  ChevronRight,
  Play,
  ArrowLeft,
  X,
  Flame,
} from 'lucide-react';

function DeitiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialDeityId = searchParams.get('id');

  const { script } = useThemeContext();
  const [selectedDeityId, setSelectedDeityId] = useState<string | null>(initialDeityId);

  useEffect(() => {
    if (initialDeityId) {
      setSelectedDeityId(initialDeityId);
    }
  }, [initialDeityId]);

  const activeDeity = deities.find(d => d.id === selectedDeityId);
  const activeAartis = selectedDeityId
    ? aartis.filter(a => a.deity === selectedDeityId)
    : [];

  const handleSelectDeity = (id: string) => {
    setSelectedDeityId(id);
    // Smooth scroll to top of details
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
            <span>सर्व देवता (All Deities)</span>
          </button>

          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            {activeAartis.length} आरत्या
          </span>
        </div>
      ) : (
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari">
            {script === 'devanagari' ? 'देवता संग्रह' : 'Deities & Devotions'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {script === 'devanagari'
              ? 'आपल्या आराध्य देवतेची निवड करा व समर्पित आरत्यांचे सलग पठण करा'
              : 'Select your worshipped deity to chant all dedicated hymns in sequence'}
          </p>
        </div>
      )}

      {/* ACTIVE SELECTED DEITY SHOWCASE VIEW */}
      {activeDeity ? (
        <div className="space-y-5 animate-fade-in">
          {/* Consecrated Deity Banner */}
          <div className="p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-saffron-500/10 to-transparent space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-saffron-600 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>उपासना वार: {activeDeity.primaryDay}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari">
                  {script === 'devanagari' ? activeDeity.nameDevanagari : activeDeity.nameTransliteration}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 font-devanagari">
                  {activeDeity.description}
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-saffron-500/30 to-amber-400/40 flex items-center justify-center font-bold text-saffron-700 dark:text-saffron-300 shrink-0 text-base font-devanagari">
                {activeDeity.nameDevanagari.split(' ')[1]?.[0] || activeDeity.nameDevanagari[0]}
              </div>
            </div>

            {/* Launch Sequential Recitation Button */}
            {activeAartis.length > 0 && (
              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={`/group?deity=${activeDeity.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-md shadow-saffron-600/25 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>
                    {script === 'devanagari'
                      ? `सर्व ${activeAartis.length} आरत्या सलग म्हणा (Chant All in Sequence)`
                      : `Chant All ${activeAartis.length} Aartis in Sequence`}
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Deity's Aarti Cards List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
                <span>उपलब्ध आरत्या व स्तोत्रे</span>
              </h3>
            </div>

            <div className="space-y-3">
              {activeAartis.map(aarti => (
                <AartiCard key={aarti.id} aarti={aarti} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* DEITIES GRID LIST */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {deities.map(deity => {
            const deityAartis = aartis.filter(a => a.deity === deity.id);
            const count = deityAartis.length;

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
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-saffron-500/20 to-amber-500/20 flex items-center justify-center font-bold text-saffron-700 dark:text-saffron-300 shrink-0 text-sm font-devanagari group-hover:scale-105 transition-transform">
                        {deity.nameDevanagari.split(' ')[1]?.[0] || deity.nameDevanagari[0]}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-[var(--text-primary)] font-devanagari group-hover:text-saffron-600 transition-colors">
                          {script === 'devanagari' ? deity.nameDevanagari : deity.nameTransliteration}
                        </h2>
                        <div className="flex items-center gap-1 text-[11px] text-saffron-600 font-semibold">
                          <Calendar className="w-3 h-3" />
                          <span>{deity.primaryDay}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-saffron-500/15 text-saffron-700 dark:text-saffron-300 shrink-0">
                      {count} {count === 1 ? 'आरती' : 'आरत्या'}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2 font-devanagari leading-relaxed">
                    {deity.description}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="pt-2 border-t border-[var(--border-main)] flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-saffron-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>आरत्या पहा (View Aartis)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>

                  {count > 0 && (
                    <Link
                      href={`/group?deity=${deity.id}`}
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-saffron-500/10 hover:bg-saffron-600 hover:text-white text-saffron-700 dark:text-saffron-300 text-[11px] font-bold transition-all"
                      title="या देवतेच्या सर्व आरत्या सलग म्हणा"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>सलग पठण</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DeitiesPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-[var(--text-secondary)]">लोड होत आहे...</div>}>
      <DeitiesContent />
    </Suspense>
  );
}
