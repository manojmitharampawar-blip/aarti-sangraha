'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Calendar,
  Search,
  BookOpen,
  Music,
  Clock,
  Layers,
  Shield,
  Sun,
  Moon,
  Sunset,
  Sunrise,
} from 'lucide-react';
import { deities } from '@/data/deities';
import { aartis } from '@/data/aartis';
import { playlists } from '@/data/playlists';
import { AartiCard } from '@/components/AartiCard';
import { DailySadhanaCard } from '@/components/DailySadhanaCard';
import { useThemeContext } from '@/components/ThemeProvider';
import {
  CATEGORY_REGISTRY,
  filterHymnsByCategory,
  getCategoryCounts,
} from '@/lib/categories';

export default function HomePage() {
  const { script, diyaGlow } = useThemeContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDeityFilter, setSelectedDeityFilter] = useState<string | 'all'>('all');

  const isDevanagari = script === 'devanagari';

  // Determine current day of week, time of day greeting, and auspicious deity
  const timeContext = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();

    let greetingDevanagari = '॥ शुभ प्रभात ॥';
    let greetingEnglish = 'Good Morning';
    let greetingSubDev = 'प्रभात समय • काकड आरती व स्तोत्र पठण';
    let greetingSubEng = 'Morning Worship & Prayers';
    let IconComponent = Sunrise;

    if (hour >= 12 && hour < 17) {
      greetingDevanagari = '॥ शुभ मध्यान्ह ॥';
      greetingEnglish = 'Good Afternoon';
      greetingSubDev = 'मध्यान्ह पूजा • मंगल स्तोत्र व नामस्मरण';
      greetingSubEng = 'Midday Prayers & Chanting';
      IconComponent = Sun;
    } else if (hour >= 17 && hour < 21) {
      greetingDevanagari = '॥ शुभ संधिकाल ॥';
      greetingEnglish = 'Good Evening';
      greetingSubDev = 'संध्याकाळची वेळ • दीप प्रज्वलन व सांज आरती';
      greetingSubEng = 'Evening Aarti & Diya Lighting';
      IconComponent = Sunset;
    } else if (hour >= 21 || hour < 4) {
      greetingDevanagari = '॥ शुभ शयन ॥';
      greetingEnglish = 'Peaceful Night';
      greetingSubDev = 'शयन समय • शांत ध्यान व शेज आरती';
      greetingSubEng = 'Night Devotion & Peaceful Sleep';
      IconComponent = Moon;
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayIndex = now.getDay();
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
    const recommendedHymns = aartis.filter(a => a.deity === matchedDeity.id);

    return {
      greetingDev: greetingDevanagari,
      greetingEng: greetingEnglish,
      greetingSubDev,
      greetingSubEng,
      GreetingIcon: IconComponent,
      dayName: dayMarathiNames[todayName],
      deity: matchedDeity,
      hymns: recommendedHymns.length > 0 ? recommendedHymns : aartis.slice(0, 3),
    };
  }, []);

  // Filter hymns based on both category pill and selected deity filter
  const filteredHymns = useMemo(() => {
    let result = aartis;
    if (selectedDeityFilter !== 'all') {
      result = result.filter(a => a.deity === selectedDeityFilter);
    }
    return filterHymnsByCategory(result, selectedCategory);
  }, [selectedCategory, selectedDeityFilter]);

  // Dynamic counts for each category
  const categoryCounts = useMemo(() => {
    const baseHymns = selectedDeityFilter === 'all'
      ? aartis
      : aartis.filter(a => a.deity === selectedDeityFilter);
    return getCategoryCounts(baseHymns);
  }, [selectedDeityFilter]);

  // Deity avatar items with hymn count
  const deityAvatarItems = useMemo(() => {
    return deities.slice(0, 10).map(deity => {
      const count = aartis.filter(a => a.deity === deity.id).length;
      return { deity, count };
    });
  }, []);

  return (
    <div className={`space-y-6 transition-all ${diyaGlow ? 'diya-aura' : ''}`}>\n      {/* 1. Time-Aware Devotional Greeting Banner */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-saffron-500/20 to-amber-500/30 border border-saffron-500/30 flex items-center justify-center text-saffron-600 shadow-xs">
            <timeContext.GreetingIcon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] font-devanagari leading-tight">
              {isDevanagari ? timeContext.greetingDev : timeContext.greetingEng}
            </h2>
            <p className="text-[11px] text-[var(--text-secondary)] font-medium">
              {isDevanagari ? timeContext.greetingSubDev : timeContext.greetingSubEng}
            </p>
          </div>
        </div>

        {/* Auspicious Day Badge */}
        <div className="text-right hidden sm:block">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 border border-saffron-500/20">
            <Calendar className="w-3 h-3 text-saffron-600" />
            <span>{timeContext.dayName}</span>
          </span>
        </div>
      </div>

      {/* 2. Modern Quick Search Entry */}
      <Link
        href="/search"
        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] shadow-sm hover:border-saffron-500/50 transition-all group"
      >
        <Search className="w-5 h-5 text-saffron-600 group-hover:scale-110 transition-transform" />
        <span className="text-xs sm:text-sm font-medium">
          {isDevanagari
            ? 'आरती, स्तोत्र, चालीसा किंवा देवता शोधा...'
            : 'Search Aarti, Stotra, Chalisa or Deity...'}
        </span>
      </Link>

      {/* Phase 5: Daily Sadhana, Hindu Panchang & Muhurat Recommendation */}
      <DailySadhanaCard />

      {/* 3. Deity Story Avatar Carousel (आराध्य देवता दर्शन) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider font-devanagari">
            {isDevanagari ? 'आराध्य देवता दर्शन' : 'Worshipped Deities'}
          </span>
          <Link
            href="/deities"
            className="text-[11px] font-bold text-saffron-600 hover:text-saffron-700 flex items-center gap-0.5"
          >
            <span>{isDevanagari ? 'सर्व देवता (All)' : 'View All'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pt-1">
          {/* "All" Deity Reset Pill */}
          <button
            onClick={() => setSelectedDeityFilter('all')}
            className={`flex flex-col items-center gap-1.5 shrink-0 transition-all active:scale-95 ${
              selectedDeityFilter === 'all' ? 'scale-105' : 'opacity-80 hover:opacity-100'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                selectedDeityFilter === 'all'
                  ? 'border-saffron-500 bg-saffron-600 text-white shadow-md shadow-saffron-600/30'
                  : 'border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)]'
              }`}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-[var(--text-primary)] font-devanagari">
              {isDevanagari ? 'सर्व देवता' : 'All'}
            </span>
          </button>

          {/* Deity Avatars */}
          {deityAvatarItems.map(({ deity, count }) => {
            const isSelected = selectedDeityFilter === deity.id;
            return (
              <button
                key={deity.id}
                onClick={() => setSelectedDeityFilter(isSelected ? 'all' : deity.id)}
                className={`flex flex-col items-center gap-1.5 shrink-0 transition-all active:scale-95 ${
                  isSelected ? 'scale-105' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all relative ${
                    isSelected
                      ? 'border-saffron-500 ring-2 ring-saffron-500/40 bg-gradient-to-tr from-saffron-500 to-amber-500 text-white shadow-md'
                      : 'border-amber-500/30 bg-gradient-to-tr from-saffron-500/10 to-amber-500/10 text-saffron-700 dark:text-saffron-300 hover:border-saffron-500/50'
                  }`}
                >
                  <span className="font-devanagari">
                    {deity.nameDevanagari.split(' ')[1]?.[0] || deity.nameDevanagari[0]}
                  </span>
                  <span className="absolute -bottom-1 -right-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-saffron-600 text-white shadow-xs">
                    {count}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[var(--text-primary)] truncate max-w-[70px] text-center font-devanagari">
                  {isDevanagari
                    ? deity.nameDevanagari.replace('श्री ', '').replace('भगवान ', '')
                    : deity.nameTransliteration.replace('Shri ', '').replace('Bhagwan ', '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Auspicious Nitya Niyam Hero Card */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-saffron-500/10 to-transparent shadow-lg shadow-amber-500/5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-saffron-600 uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>आजचे नित्य नियम (Today&apos;s Consecrated Ritual)</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-saffron-500/15 text-saffron-700 dark:text-saffron-300 border border-saffron-500/25">
            {timeContext.dayName}
          </span>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-devanagari">
            {isDevanagari ? timeContext.deity.nameDevanagari : timeContext.deity.nameTransliteration} विशेष उपासना
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed font-devanagari">
            {timeContext.deity.description}
          </p>
        </div>

        {timeContext.hymns[0] && (
          <div className="pt-2 flex flex-wrap gap-2.5">
            <Link
              href={`/aarti/${timeContext.hymns[0].slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-md shadow-saffron-600/25 active:scale-95 transition-all"
            >
              <Flame className="w-4 h-4 text-amber-200" />
              <span>
                {isDevanagari
                  ? `${timeContext.hymns[0].titleDevanagari} म्हणा`
                  : `Recite ${timeContext.hymns[0].titleTransliteration}`}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={`/deities?id=${timeContext.deity.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] hover:border-saffron-500/50 text-xs font-bold transition-all"
            >
              <span>{isDevanagari ? 'सर्व स्तोत्र व आरत्या' : 'All Hymns'}</span>
              <ArrowRight className="w-3 h-3 text-saffron-600" />
            </Link>
          </div>
        )}
      </div>

      {/* 5. Dynamic Segmented Category Filter Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider font-devanagari">
            {isDevanagari ? 'प्रकारानुसार वर्गवारी (Categories)' : 'Browse by Category'}
          </span>
          {selectedDeityFilter !== 'all' && (
            <button
              onClick={() => setSelectedDeityFilter('all')}
              className="text-[11px] font-bold text-saffron-600 hover:underline"
            >
              फिल्टर काढा (Clear)
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_REGISTRY.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                  isSelected
                    ? 'bg-saffron-600 text-white shadow-md shadow-saffron-600/25 ring-2 ring-saffron-500/30'
                    : 'border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-saffron-500/40'
                }`}
              >
                <span>{isDevanagari ? cat.labelDevanagari : cat.labelEnglish}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-black/5 dark:bg-white/10 text-[var(--text-secondary)]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Filtered Hymns List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-[var(--text-primary)] font-devanagari">
            {isDevanagari
              ? `${filteredHymns.length} उपासना रचना उपलब्ध`
              : `${filteredHymns.length} Hymns Available`}
          </h3>
          <span className="text-[11px] text-[var(--text-secondary)]">
            एकूण {aartis.length} आरत्या व स्तोत्रे
          </span>
        </div>

        {filteredHymns.length > 0 ? (
          <div className="space-y-3">
            {filteredHymns.map(aarti => (
              <AartiCard key={aarti.id} aarti={aarti} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl border border-dashed border-[var(--border-main)] p-6 space-y-2">
            <p className="text-sm font-bold text-[var(--text-primary)]">
              निवडलेल्या प्रकारामध्ये कोणतीही रचना उपलब्ध नाही.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDeityFilter('all');
              }}
              className="text-xs font-bold text-saffron-600 hover:underline"
            >
              सर्व रचना पहा (Reset Filters)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
