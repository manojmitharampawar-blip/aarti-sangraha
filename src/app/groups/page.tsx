'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCustomGroups } from '@/hooks/useCustomGroups';
import { CustomGroup } from '@/types';
import { aartis } from '@/data/aartis';
import { useThemeContext } from '@/components/ThemeProvider';
import {
  Plus,
  Play,
  Share2,
  Trash2,
  Edit3,
  ListMusic,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  FolderHeart,
} from 'lucide-react';
import { GroupEditorModal } from '@/components/GroupEditorModal';
import { ShareGroupModal } from '@/components/ShareGroupModal';
import { parseGroupShareParams, ShareableGroup } from '@/lib/groupSharing';

function GroupsContent() {
  const { groups, isLoaded, deleteGroup, createGroup } = useCustomGroups();
  const { script } = useThemeContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<CustomGroup | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingGroup, setSharingGroup] = useState<{
    name: string;
    description?: string;
    aartiIds: string[];
  } | null>(null);

  // Incoming Shared Group Import Prompt State
  const [importingGroup, setImportingGroup] = useState<ShareableGroup | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check URL query parameters for WhatsApp import payload
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parsed = parseGroupShareParams(new URLSearchParams(window.location.search));
      if (parsed) {
        setImportingGroup(parsed);
      }
    }
  }, [searchParams]);

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

  const handleOpenShare = (group: CustomGroup, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSharingGroup({
      name: group.name,
      description: group.description,
      aartiIds: group.aartiIds,
    });
    setIsShareModalOpen(true);
  };

  const handleDelete = (groupId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('हा संग्रह नक्की हटवायचा आहे का? (Delete this collection?)')) {
      deleteGroup(groupId);
      showToast('संग्रह हटवला गेला.');
    }
  };

  const handleSaveImportedGroup = (groupToImport: ShareableGroup) => {
    const newGroup = createGroup(
      groupToImport.name,
      groupToImport.description || '',
      groupToImport.aartiIds
    );
    setImportingGroup(null);
    router.replace('/groups');
    showToast(`'${newGroup.name}' संग्रह यशस्वीरीत्या सेव्ह झाला!`);
  };

  const handlePlayImportedGroup = (groupToImport: ShareableGroup) => {
    const newGroup = createGroup(
      groupToImport.name,
      groupToImport.description || '',
      groupToImport.aartiIds
    );
    setImportingGroup(null);
    router.push(`/group?id=${newGroup.id}`);
  };

  const handleCloseImport = () => {
    setImportingGroup(null);
    router.replace('/groups');
  };

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Create Button */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari">
            {script === 'devanagari' ? 'माझे वैयक्तिक संग्रह' : 'My Custom Collections'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {script === 'devanagari'
              ? 'आपल्या पसंतीनुसार स्तोत्रे व आरत्यांचा संग्रह तयार करा, सलग म्हणा व WhatsApp वर शेअर करा'
              : 'Create custom sequences, chant sequentially, and share with family on WhatsApp'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-md shadow-saffron-600/20 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>नवीन संग्रह (New)</span>
        </button>
      </div>

      {/* Tabs linking Built-in Collections and Custom Collections */}
      <div className="flex gap-2 p-1 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-bold">
        <Link
          href="/playlists"
          className="flex-1 py-2 text-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          पारंपरिक संग्रह
        </Link>
        <div className="flex-1 py-2 text-center rounded-lg bg-[var(--card-main)] text-saffron-600 shadow-xs">
          माझे वैयक्तिक संग्रह
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

                  {/* Action buttons: Edit, Share, Delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={e => handleOpenShare(group, e)}
                      aria-label="Share group sequence"
                      title="WhatsApp वर शेअर करा"
                      className="p-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={e => handleOpenEdit(group, e)}
                      aria-label="Edit group sequence"
                      title="संपादन करा"
                      className="p-1.5 rounded-xl border border-[var(--border-main)] hover:border-saffron-500 text-[var(--text-secondary)] hover:text-saffron-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={e => handleDelete(group.id, e)}
                      aria-label="Delete group"
                      title="हटवा"
                      className="p-1.5 rounded-xl border border-[var(--border-main)] hover:border-rose-500 text-[var(--text-secondary)] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sequence Preview Badges */}
                {previewAartis.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      पठणाचा क्रम ({group.aartiIds.length} रचना):
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
                    या संग्रहामध्ये अजून आरत्या किंवा स्तोत्रे जोडलेली नाहीत.
                  </p>
                )}

                {/* Start Recitation CTA and Share Link */}
                <div className="pt-2 flex items-center justify-between border-t border-[var(--border-main)]">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {group.aartiIds.length} रचना सलग क्रमाने
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => handleOpenShare(group, e)}
                      className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--border-main)] text-[var(--text-secondary)] text-xs font-bold"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>शेअर</span>
                    </button>

                    <Link
                      href={`/group?id=${group.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-md shadow-saffron-600/20 active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>पठण सुरू करा (Chant Sequence)</span>
                    </Link>
                  </div>
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
              अद्याप कोणताही संग्रह तयार केलेला नाही
            </h2>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              आपल्या नित्य पूजेसाठी किंवा सणांसाठी आवडत्या आरत्या व स्तोत्रांचा स्वतःचा संग्रह बनवा आणि नातेवाईकांना शेअर करा.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 text-white font-bold text-xs shadow-md shadow-saffron-600/20 hover:bg-saffron-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>पहिला संग्रह तयार करा (Create Collection)</span>
          </button>
        </div>
      )}

      {/* Editor Modal */}
      <GroupEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        group={selectedGroup}
      />

      {/* WhatsApp Share Modal */}
      <ShareGroupModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        group={sharingGroup}
      />

      {/* Incoming Shared Group Import Confirmation Dialog */}
      {importingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-saffron-600 font-bold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>नवीन आरती संग्रह प्राप्त झाला! (Shared Collection)</span>
            </div>

            <div>
              <h3 className="text-lg font-black text-[var(--text-primary)] font-devanagari">
                {importingGroup.name}
              </h3>
              {importingGroup.description && (
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {importingGroup.description}
                </p>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 space-y-2">
              <span className="text-xs font-bold text-[var(--text-secondary)]">
                या संग्रहातील आरत्या ({importingGroup.aartiIds.length}):
              </span>
              <ul className="text-xs space-y-1 text-[var(--text-primary)] font-devanagari max-h-36 overflow-y-auto">
                {importingGroup.aartiIds.map((id, index) => {
                  const item = aartis.find(a => a.id === id);
                  return (
                    <li key={id} className="flex items-center gap-2">
                      <span className="w-4 text-[var(--text-secondary)] font-sans">{index + 1}.</span>
                      <span>{item ? item.titleDevanagari : id}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => handleSaveImportedGroup(importingGroup)}
                className="w-full py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                माझ्या संग्रहामध्ये सेव्ह करा (Save to My Sangrah)
              </button>

              <button
                onClick={() => handlePlayImportedGroup(importingGroup)}
                className="w-full py-2.5 rounded-xl border border-saffron-500/30 text-saffron-600 hover:bg-saffron-500/10 font-bold text-xs transition-all"
              >
                आत्ताच सलग म्हणा (Chant Now)
              </button>

              <button
                onClick={handleCloseImport}
                className="w-full py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                रद्द करा (Dismiss)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GroupsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-xs">लोड होत आहे...</div>}>
      <GroupsContent />
    </Suspense>
  );
}
