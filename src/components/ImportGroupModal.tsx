'use client';

import React from 'react';
import { X, Check, Play, Sparkles, BookOpen } from 'lucide-react';
import { ShareableGroup } from '@/lib/groupSharing';
import { aartis } from '@/data/aartis';
import { getHymnTypeBadge } from '@/components/AartiCard';

interface ImportGroupModalProps {
  isOpen: boolean;
  group: ShareableGroup | null;
  onSave: (group: ShareableGroup) => void;
  onPlayDirectly: (group: ShareableGroup) => void;
  onClose: () => void;
}

export function ImportGroupModal({
  isOpen,
  group,
  onSave,
  onPlayDirectly,
  onClose,
}: ImportGroupModalProps) {
  if (!isOpen || !group) return null;

  const validHymns = group.aartiIds
    .map(id => aartis.find(a => a.id === id))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl border border-saffron-500/40 bg-[var(--card-main)] p-5 sm:p-6 shadow-2xl space-y-4 animate-fade-in my-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--border-main)]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-saffron-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-saffron-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-600">
                नवीन शेअर केलेला ग्रुप (Shared Group Received)
              </span>
              <h3 className="text-lg font-black text-[var(--text-primary)] font-devanagari">
                {group.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Group Description */}
        {group.description && (
          <p className="text-xs text-[var(--text-secondary)] font-devanagari leading-relaxed">
            {group.description}
          </p>
        )}

        {/* Hymns List Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
            <span>समाविष्ट रचना ({validHymns.length})</span>
            <span>सलग पठण क्रम</span>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-[var(--border-main)] rounded-2xl border border-[var(--border-main)] bg-[var(--bg-main)] p-2">
            {validHymns.map((h, index) => {
              if (!h) return null;
              const badge = getHymnTypeBadge(h.type, true);

              return (
                <div key={h.id} className="py-2 px-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 text-center text-xs font-bold text-saffron-600 shrink-0">
                      {index + 1}.
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate font-devanagari">
                        {h.titleDevanagari}
                      </p>
                      <p className="text-[10px] text-[var(--text-secondary)] truncate">
                        {h.firstLineDevanagari}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-[var(--border-main)] space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onSave(group)}
              className="flex-1 py-3 px-4 rounded-2xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-saffron-600/20 active:scale-98 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>माझ्या ॲपमध्ये जोडा (Save to My Groups)</span>
            </button>

            <button
              onClick={() => onPlayDirectly(group)}
              className="py-3 px-4 rounded-2xl border border-saffron-500/30 bg-saffron-500/10 hover:bg-saffron-500/20 text-saffron-700 dark:text-saffron-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>थेट सलग म्हणा (Chant Directly)</span>
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold py-1"
            >
              रद्द करा (Dismiss)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
