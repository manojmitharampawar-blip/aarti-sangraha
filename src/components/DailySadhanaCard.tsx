'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Music,
} from 'lucide-react';
import {
  getDevotionalRecommendation,
  getSadhanaStreak,
  recordSadhanaSession,
  DevotionalRecommendation,
  SadhanaStreak,
} from '@/lib/devotionalRecommender';
import { playTempleBell } from '@/lib/audioBell';

export function DailySadhanaCard() {
  const [recommendation, setRecommendation] = useState<DevotionalRecommendation | null>(null);
  const [streak, setStreak] = useState<SadhanaStreak>({
    currentStreak: 1,
    completedToday: false,
    totalSessions: 1,
  });
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const rec = getDevotionalRecommendation();
    setRecommendation(rec);
    setStreak(getSadhanaStreak());
  }, []);

  const handleCompleteSadhana = () => {
    const updated = recordSadhanaSession();
    setStreak(updated);
    setShowCelebration(true);
    playTempleBell({ enableHaptics: true });
    setTimeout(() => setShowCelebration(false), 2500);
  };

  if (!recommendation) return null;

  const { tithiInfo, muhurat, dayNameMr, specialBadge, headlineTitle, subTitle, recommendedHymns, suggestedPlaylist } =
    recommendation;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-saffron-500/5 to-amber-900/15 p-5 sm:p-6 shadow-md shadow-amber-500/5">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

      {/* Top Panchang & Muhurat Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <Calendar className="w-4 h-4" />
          </span>
          <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
            <span>{dayNameMr}</span>
            <span className="mx-1.5 opacity-40">•</span>
            <span className="text-saffron-600 dark:text-saffron-400">
              {tithiInfo.paksha} {tithiInfo.tithiNameMr}
            </span>
          </div>
        </div>

        {/* Sadhana Streak Pill */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-extrabold">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{streak.currentStreak} दिवस सलग उपासना</span>
        </div>
      </div>

      {/* Muhurat & Special Vrata Badge */}
      <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px]">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-[var(--border-main)] font-semibold text-[var(--text-secondary)]">
          <Clock className="w-3 h-3 text-saffron-600" />
          <span>{muhurat.nameMr}</span>
        </span>

        {specialBadge && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 to-rose-500/20 border border-amber-500/40 text-amber-900 dark:text-amber-100 font-bold shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{specialBadge}</span>
          </span>
        )}
      </div>

      {/* Main Devotional Headline */}
      <div className="mt-3 space-y-1">
        <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] font-devanagari tracking-tight">
          {headlineTitle}
        </h2>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-devanagari">
          {subTitle}
        </p>
      </div>

      {/* Quick Hymn Recommendations */}
      <div className="mt-4 pt-3 border-t border-dashed border-amber-500/20 space-y-2">
        <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          आजचे प्राधान्य पठण (Curated Hymns):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recommendedHymns.map(hymn => (
            <Link
              key={hymn.id}
              href={`/aarti/${hymn.slug}`}
              className="flex items-center justify-between p-2.5 rounded-xl border border-amber-500/20 bg-[var(--card-main)] hover:border-saffron-500/50 hover:shadow-xs transition-all text-xs group"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-amber-600 dark:text-amber-400">🪔</span>
                <span className="font-bold text-[var(--text-primary)] truncate font-devanagari">
                  {hymn.titleDevanagari}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-saffron-600 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Action Footers: Launch Playlist or Mark Sadhana Complete */}
      <div className="mt-4 pt-3 flex items-center justify-between gap-2 flex-wrap">
        {suggestedPlaylist && (
          <Link
            href={`/playlist/${suggestedPlaylist.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-saffron-600 text-white text-xs font-bold shadow-xs hover:bg-saffron-700 active:scale-95 transition-all"
          >
            <Music className="w-3.5 h-3.5" />
            <span>दैनिक उपासना सुरू करा</span>
          </Link>
        )}

        <button
          onClick={handleCompleteSadhana}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
            streak.completedToday
              ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
              : 'border-amber-500/40 bg-white/40 dark:bg-stone-900/40 text-amber-900 dark:text-amber-200 hover:bg-amber-500/20'
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${streak.completedToday ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span>{streak.completedToday ? 'आजची उपासना पूर्ण झाली ✓' : 'उपासना पूर्ण झाली म्हणून नोंदवा'}</span>
        </button>
      </div>

      {/* Celebration Toast */}
      {showCelebration && (
        <div className="absolute inset-x-4 top-4 p-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold text-center shadow-lg animate-fade-in flex items-center justify-center gap-1.5">
          <span>🌸</span>
          <span>धन्य! आजची नित्य उपासना पूर्ण झाली. संकल्प अखंड राहो!</span>
        </div>
      )}
    </div>
  );
}
