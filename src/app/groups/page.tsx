'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderPlus,
  Play,
  Edit3,
  Trash2,
  Sparkles,
  Plus,
  ListMusic,
} from 'lucide-react';
import { useCustomGroups } from '@/hooks/useCustomGroups';
import { useThemeContext } from '@/components/ThemeProvider';
import { GroupEditorModal } from '@/components/GroupEditorModal';
import { CustomGroup } from '@/types';
import { aartis } from '@/data/aartis';

export default function GroupsPage() {
  const { groups, isLoaded, deleteGroup } = useCustomGroups();
  const { script } = useThemeContext();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<CustomGroup | null>(null);

  const handleOpenCreate = () => {
    setSelectedGroup(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (group: CustomGroup, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedGroup(group);
    setIsEditorOpen(true);
  };

  const handleDelete = (groupId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('हा ग्रुप नक्की हटवायचा आहे का? (Delete this group?)')) {
      deleteGroup(groupId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Create Button */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari">
            {script === 'devanagari' ? 'माझे आरती ग्रुप' : 'My Aarti Groups'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {script === 'devanagari'
              ? 'आपल्या पसंतीनुसार आरत्यांचा क्रम ठरवा व सलग पठण करा'
              : 'Create custom sequences of aartis for your daily rituals'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-md shadow-saffron-600/20 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>नवीन ग्रुप (New)</span>
        </button>
      </div>

      {/* Tabs linking Built-in Sequences and Custom Groups */}
      <div className="flex gap-2 p-1 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-bold">
        <Link
          href="/playlists"
          className="flex-1 py-2 text-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          पारंपरिक क्रम (Built-in Sequences)
        </Link>
        <div className="flex-1 py-2 text-center rounded-lg bg-[var(--card-main)] text-saffron-600 shadow-xs">
          माझे वैयक्तिक ग्रुप (My Groups)
        </div>
      </div>

      {/* Groups List */}
      {!isLoaded ? (
        <div className="text-center py-10 text-xs text-[var(--text-secondary)]">
          लोड होत आहे...
        </div>
      ) : groups.length > 0 ? (
        <div className="space-y-3.5">
          {groups.map(group => {
            const previewAartis = group.aartiIds
              .map(id => aartis.find(a => a.id === id))
              .filter(Boolean);

            return (
              <div
                key={group.id}
                className="p-5 rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/50 shadow-xs transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-devanagari">
                      {group.name}
                    </h2>
                    {group.description && (
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {group.description}
                      </p>
                    )}
                  </div>

                  {/* Edit and Delete Icon buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={e => handleOpenEdit(group, e)}
                      aria-label="Edit group sequence"
                      className="p-2 rounded-xl border border-[var(--border-main)] hover:border-saffron-500 text-[var(--text-secondary)] hover:text-saffron-600"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => handleDelete(group.id, e)}
                      aria-label="Delete group"
                      className="p-2 rounded-xl border border-[var(--border-main)] hover:border-rose-500 text-[var(--text-secondary)] hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sequence Preview Badges */}
                {previewAartis.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      आरती क्रम ({group.aartiIds.length} आरत्या):
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {previewAartis.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 font-devanagari font-medium"
                        >
                          <span className="font-bold opacity-60 text-[9px]">{idx + 1}.</span>
                          <span>{item?.titleDevanagari}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-secondary)] italic">
                    या ग्रुपमध्ये अजून आरत्या जोडलेल्या नाहीत.
                  </p>
                )}

                {/* Start Recitation CTA */}
                <div className="pt-2 flex items-center justify-between border-t border-[var(--border-main)]">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {group.aartiIds.length} आरत्या सलग क्रमाने
                  </span>

                  <Link
                    href={`/group?id=${group.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-md shadow-saffron-600/20 active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>पठण सुरू करा (Chant Sequence)</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[var(--border-main)] space-y-4">
          <div className="w-14 h-14 rounded-full bg-saffron-500/10 text-saffron-600 flex items-center justify-center mx-auto">
            <ListMusic className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              अद्याप कोणताही ग्रुप तयार केलेला नाही
            </h2>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
              आपल्या सोयीनुसार आरत्यांचा वैयक्तिक संच तयार करा व सलग एका पाठोपाठ एक म्हणा.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 text-white font-bold text-xs shadow-md shadow-saffron-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>पहिला ग्रुप तयार करा (Create Group)</span>
          </button>
        </div>
      )}

      {/* Group Editor Modal */}
      <GroupEditorModal
        key={selectedGroup ? selectedGroup.id : 'new-group'}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedGroup(null);
        }}
        group={selectedGroup}
      />
    </div>
  );
}
