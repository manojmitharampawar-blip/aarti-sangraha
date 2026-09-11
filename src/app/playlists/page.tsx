'use client';

import React from 'react';
import Link from 'next/link';
import { playlists } from '@/data/playlists';
import { useThemeContext } from '@/components/ThemeProvider';
import { ListMusic, ArrowRight, Sparkles, CheckCircle2, FolderPlus } from 'lucide-react';

export default function PlaylistsPage() {
  const { script } = useThemeContext();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari">
            {script === 'devanagari' ? 'आरती संग्रह क्रम' : 'Aarti Playlists & Sequences'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {script === 'devanagari'
              ? 'सण, उत्सव व दैनंदिन पूजेसाठी सलग आरत्यांचे क्रमबद्ध संकलन'
              : 'Pre-ordered continuous recitation sequences for festivals and daily pooja'}
          </p>
        </div>

        <Link
          href="/groups"
          className="flex items-center gap-1 px-3 py-2 rounded-xl border border-saffron-500/30 bg-saffron-500/10 text-saffron-600 text-xs font-bold hover:bg-saffron-500/20 active:scale-95 transition-all shrink-0"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>माझे ग्रुप (My Groups)</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-bold">
        <div className="flex-1 py-2 text-center rounded-lg bg-[var(--card-main)] text-saffron-600 shadow-xs">
          पारंपरिक क्रम (Built-in Sequences)
        </div>
        <Link
          href="/groups"
          className="flex-1 py-2 text-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          माझे वैयक्तिक ग्रुप (My Groups)
        </Link>
      </div>

      <div className="space-y-3.5">
        {playlists.map(playlist => (
          <Link
            key={playlist.id}
            href={`/playlist/${playlist.slug}`}
            className="block p-5 rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/60 hover:shadow-lg hover:shadow-saffron-500/5 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 flex-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-saffron-500/10 text-saffron-600">
                  <Sparkles className="w-3 h-3" />
                  <span>{playlist.occasion}</span>
                </div>

                <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-saffron-600 transition-colors font-devanagari">
                  {script === 'devanagari' ? playlist.titleDevanagari : playlist.title}
                </h2>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {playlist.description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-saffron-700 dark:text-saffron-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-saffron-600" />
                  <span>{playlist.aartiIds.length} आरत्या सलग क्रमाने (Sequential sequence)</span>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full bg-saffron-500/10 group-hover:bg-saffron-600 group-hover:text-white text-saffron-600 flex items-center justify-center transition-all shrink-0 ml-3">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
