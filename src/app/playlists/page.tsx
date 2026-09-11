'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { playlists } from '@/data/playlists';
import { aartis } from '@/data/aartis';
import { useThemeContext } from '@/components/ThemeProvider';
import { ListMusic, ArrowRight, Sparkles, CheckCircle2, FolderPlus, Clock, Send } from 'lucide-react';
import { calculateChantingTimeMinutes } from '@/lib/categories';
import { ShareGroupModal } from '@/components/ShareGroupModal';

export default function PlaylistsPage() {
  const { script } = useThemeContext();
  const [sharingGroup, setSharingGroup] = useState<{
    name: string;
    description?: string;
    aartiIds: string[];
  } | null>(null);

  const isDevanagari = script === 'devanagari';

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari">
            {isDevanagari ? 'आरती संग्रह व उपासना क्रम' : 'Aarti Playlists & Sequences'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {isDevanagari
              ? 'सण, उत्सव व दैनंदिन पूजेसाठी सलग आरत्यांचे क्रमबद्ध संकलन'
              : 'Pre-ordered continuous recitation sequences for festivals and daily pooja'}
          </p>
        </div>

        <Link
          href="/groups"
          className="flex items-center gap-1 px-3 py-2 rounded-xl border border-saffron-500/30 bg-saffron-500/10 text-saffron-600 text-xs font-bold hover:bg-saffron-500/20 active:scale-95 transition-all shrink-0"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>{isDevanagari ? 'माझे ग्रुप' : 'My Groups'}</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl bg-black/5 dark:bg-white/5 text-xs font-bold">
        <div className="flex-1 py-2 text-center rounded-xl bg-[var(--card-main)] text-saffron-600 shadow-xs">
          {isDevanagari ? 'पारंपरिक क्रम (Built-in Sequences)' : 'Built-in Sequences'}
        </div>
        <Link
          href="/groups"
          className="flex-1 py-2 text-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {isDevanagari ? 'माझे वैयक्तिक ग्रुप (My Groups)' : 'My Custom Groups'}
        </Link>
      </div>

      <div className="space-y-3.5">
        {playlists.map(playlist => {
          // Calculate total estimated time
          const playlistHymns = playlist.aartiIds
            .map(id => aartis.find(a => a.id === id))
            .filter(Boolean);

          const totalMinutes = playlistHymns.reduce(
            (sum, h) => sum + (h ? calculateChantingTimeMinutes(h.stanzas) : 0),
            0
          );

          // Get preview of first 3 hymns
          const previewTitles = playlistHymns
            .slice(0, 3)
            .map(h => (isDevanagari ? h?.titleDevanagari : h?.titleTransliteration))
            .join(' ➔ ');

          return (
            <div
              key={playlist.id}
              className="p-5 rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/60 hover:shadow-lg hover:shadow-saffron-500/5 transition-all group relative"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-saffron-500/10 text-saffron-600">
                      <Sparkles className="w-3 h-3" />
                      <span>{playlist.occasion}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--text-secondary)]">
                      <Clock className="w-3 h-3 text-saffron-600" />
                      <span>~{totalMinutes} मिनिटे</span>
                    </span>
                  </div>

                  <Link href={`/playlist/${playlist.slug}`} className="block">
                    <h2 className="text-lg font-black text-[var(--text-primary)] group-hover:text-saffron-600 transition-colors font-devanagari">
                      {isDevanagari ? playlist.titleDevanagari : playlist.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {playlist.description}
                  </p>

                  {/* Flow preview */}
                  <p className="text-[11px] text-saffron-700/80 dark:text-saffron-300/80 font-medium truncate font-devanagari">
                    क्रम: {previewTitles} {playlist.aartiIds.length > 3 ? '...' : ''}
                  </p>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-saffron-700 dark:text-saffron-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-saffron-600" />
                      <span>{playlist.aartiIds.length} आरत्या सलग क्रमाने</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* WhatsApp share button */}
                      <button
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSharingGroup({
                            name: playlist.titleDevanagari,
                            description: playlist.description,
                            aartiIds: playlist.aartiIds,
                          });
                        }}
                        aria-label="Share sequence on WhatsApp"
                        title="व्हॉट्सॲपवर शेअर करा"
                        className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 active:scale-95 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/playlist/${playlist.slug}`}
                        className="w-8 h-8 rounded-full bg-saffron-500/10 group-hover:bg-saffron-600 group-hover:text-white text-saffron-600 flex items-center justify-center transition-all shrink-0"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sharingGroup && (
        <ShareGroupModal
          isOpen={!!sharingGroup}
          onClose={() => setSharingGroup(null)}
          group={sharingGroup}
        />
      )}
    </div>
  );
}
