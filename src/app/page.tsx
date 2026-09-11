'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ListMusic, Flame, Calendar, Search } from 'lucide-react';
import { deities } from '@/data/deities';
import { aartis } from '@/data/aartis';
import { playlists } from '@/data/playlists';
import { AartiCard } from '@/components/AartiCard';
import { useThemeContext } from '@/components/ThemeProvider';

export default function HomePage() {
  const { script, diyaGlow } = useThemeContext();

  // Determine current day of week and deity
  const todayInfo = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayIndex = new Date().getDay();
    const todayName = days[todayIndex];

    const dayMarathiNames: Record<string, string> = {
      Sunday: 'रविवार (Sunday)',
      Monday: 'सोमवार (Monday)',
      Tuesday: 'मंगळवार (Tuesday)',
      Wednesday: 'बुधवार (Wednesday)',
      Thursday: 'गुरुवार (Thursday)',
      Friday: 'शुक्रवार (Friday)',
      Saturday: 'शनिवार (Saturday)',
    };

    const matchedDeity = deities.find(d => d.primaryDay === todayName) || deities[0];
    const recommendedAartis = aartis.filter(a => a.deity === matchedDeity.id);

    return {
      dayName: dayMarathiNames[todayName],
      deity: matchedDeity,
      aartis: recommendedAartis.length > 0 ? recommendedAartis : aartis.slice(0, 3),
    };
  }, []);

  return (
    <div className={`space-y-6 transition-all ${diyaGlow ? 'diya-aura' : ''}`}>
      {/* Search Bar Quick Entry */}
      <Link
        href="/search"
        className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] shadow-sm hover:border-saffron-500/50 transition-all group"
      >
        <Search className="w-5 h-5 text-saffron-600 group-hover:scale-110 transition-transform" />
        <span className="text-sm">
          {script === 'devanagari' ? 'आरती, स्तोत्र किंवा देवता शोधा...' : 'Search Aarti, Stotra or Deity...'}
        </span>
      </Link>

      {/* Today's Auspicious Nitya Niyam Card */}
      <div className="relative overflow-hidden rounded-3xl p-5 border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-saffron-500/10 to-transparent shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-saffron-600 uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>आजचे नित्य नियम (Today&apos;s Ritual)</span>
          </div>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-saffron-500/15 text-saffron-700 dark:text-saffron-300">
            {todayInfo.dayName}
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] font-devanagari">
          {script === 'devanagari' ? todayInfo.deity.nameDevanagari : todayInfo.deity.nameTransliteration} उपासना
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
          {todayInfo.deity.description}
        </p>

        {todayInfo.aartis[0] && (
          <div className="mt-4">
            <Link
              href={`/aarti/${todayInfo.aartis[0].slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-md shadow-saffron-600/25 active:scale-95 transition-all"
            >
              <Flame className="w-4 h-4" />
              <span>
                {script === 'devanagari'
                  ? `${todayInfo.aartis[0].titleDevanagari} म्हणा`
                  : `Recite ${todayInfo.aartis[0].titleTransliteration}`}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Deities Quick Browser (Avatars Grid) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-saffron-600" />
            <span>{script === 'devanagari' ? 'देवता वर्ग' : 'Deities'}</span>
          </h2>
          <Link
            href="/deities"
            className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-0.5"
          >
            <span>{script === 'devanagari' ? 'सर्व पहा' : 'View all'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
          {deities.slice(0, 8).map(deity => (
            <Link
              key={deity.id}
              href={`/deities?id=${deity.id}`}
              className="flex flex-col items-center text-center p-2.5 rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/50 hover:shadow-sm transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-saffron-500/20 to-gold-500/30 flex items-center justify-center text-saffron-700 dark:text-saffron-300 font-bold group-hover:scale-105 transition-transform">
                <span className="text-sm font-devanagari">
                  {deity.nameDevanagari.split(' ')[1]?.[0] || deity.nameDevanagari[0]}
                </span>
              </div>
              <span className="text-[11px] font-bold mt-1.5 text-[var(--text-primary)] truncate max-w-full font-devanagari">
                {script === 'devanagari' ? deity.nameDevanagari.replace('श्री ', '') : deity.nameTransliteration.replace('Shri ', '')}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Sangraha Playlists */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-1.5">
            <ListMusic className="w-4 h-4 text-saffron-600" />
            <span>{script === 'devanagari' ? 'विशेष आरती संग्रह क्रम' : 'Aarti Sequences'}</span>
          </h2>
          <Link
            href="/playlists"
            className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-0.5"
          >
            <span>{script === 'devanagari' ? 'सर्व क्रम' : 'All playlists'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {playlists.slice(0, 2).map(playlist => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.slug}`}
              className="block p-4 rounded-2xl border border-[var(--border-main)] bg-gradient-to-r from-[var(--card-main)] to-amber-500/5 hover:border-saffron-500/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">
                    {playlist.occasion}
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-saffron-600 transition-colors mt-1 font-devanagari">
                    {script === 'devanagari' ? playlist.titleDevanagari : playlist.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {playlist.aartiIds.length} आरत्यांचा संपूर्ण क्रम (Sequential chanting)
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Aartis List */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            {script === 'devanagari' ? 'प्रमुख व लोकप्रिय आरत्या' : 'Popular Aartis'}
          </h2>
          <span className="text-xs text-[var(--text-secondary)]">
            {aartis.length} आरत्या उपलब्ध
          </span>
        </div>

        <div className="space-y-2.5">
          {aartis.map(aarti => (
            <AartiCard key={aarti.id} aarti={aarti} />
          ))}
        </div>
      </section>
    </div>
  );
}
