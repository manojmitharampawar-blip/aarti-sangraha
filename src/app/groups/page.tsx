'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Play,
  Edit3,
  Trash2,
  Plus,
  ListMusic,
  Share2,
  CheckCircle,
  Send,
} from 'lucide-react';
import { useCustomGroups } from '@/hooks/useCustomGroups';
import { useThemeContext } from '@/components/ThemeProvider';
import { GroupEditorModal } from '@/components/GroupEditorModal';
import { ShareGroupModal } from '@/components/ShareGroupModal';
import { ImportGroupModal } from '@/components/ImportGroupModal';
import { CustomGroup } from '@/types';
import { aartis } from '@/data/aartis';
import { parseGroupShareParams, ShareableGroup } from '@/lib/groupSharing';

function GroupsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { groups, isLoaded, deleteGroup, createGroup } = useCustomGroups();
  const { script } = useThemeContext();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<CustomGroup | null>(null);

  // Sharing state
  const [sharingGroup, setSharingGroup] = useState<ShareableGroup | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Receiving/Importing state
  const [importingGroup, setImportingGroup] = useState<ShareableGroup | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detect shared group from query params
  useEffect(() => {
    const shared = parseGroupShareParams(searchParams);
    if (shared) {
      setImportingGroup(shared);
    }
  }, [searchParams]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

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
    if (confirm('हा ग्रुप नक्की हटवायचा आहे का? (Delete this group?)')) {
      deleteGroup(groupId);
      showToast('ग्रुप हटवला गेला.');
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
    showToast(`'${newGroup.name}' ग्रुप यशस्वीरित्या सेव्ह झाला!`);
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
            {script === 'devanagari' ? 'माझे आरती व स्तोत्र ग्रुप' : 'My Hymn Groups'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {script === 'devanagari'
              ? 'आपल्या पसंतीनुसार स्तोत्रे व आरत्यांचा क्रम तयार करा, सलग म्हणा व WhatsApp वर शेअर करा'
              : 'Create custom sequences, chant sequentially, and share with family on WhatsApp'}
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

                  {/* Action Buttons: WhatsApp Share, Edit, and Delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={e => handleOpenShare(group, e)}
                      aria-label="Share group on WhatsApp"
                      title="व्हॉट्सॲपवर शेअर करा"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 text-xs font-bold transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
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
                    या ग्रुपमध्ये अजून आरत्या किंवा स्तोत्रे जोडलेली नाहीत.
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
              अद्याप कोणताही आरती ग्रुप तयार केलेला नाही
            </h2>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              आपल्या नित्य पूजेसाठी किंवा सणांसाठी आवडत्या आरत्या व स्तोत्रांचा स्वतःचा ग्रुप बनवा आणि नातेवाईकांना शेअर करा.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 text-white font-bold text-xs shadow-md shadow-saffron-600/20 hover:bg-saffron-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>पहिला ग्रुप तयार करा (Create Group)</span>
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

      {/* Incoming Import Modal */}
      <ImportGroupModal
        isOpen={!!importingGroup}
        group={importingGroup}
        onSave={handleSaveImportedGroup}
        onPlayDirectly={handlePlayImportedGroup}
        onClose={handleCloseImport}
      />
    </div>
  );
}

export default function GroupsPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-[var(--text-secondary)]">लोड होत आहे...</div>}>
      <GroupsContent />
    </Suspense>
  );
}
