'use client';

import React, { useState } from 'react';
import { FolderPlus, Check, X, Plus, Sparkles } from 'lucide-react';
import { useCustomGroups } from '@/hooks/useCustomGroups';
import { AartiItem } from '@/types';

interface AddToGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  aarti: AartiItem;
}

export function AddToGroupModal({ isOpen, onClose, aarti }: AddToGroupModalProps) {
  const { groups, addAartiToGroup, removeAartiFromGroup, createGroup, isAartiInGroup } = useCustomGroups();
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleToggleGroup = (groupId: string) => {
    if (isAartiInGroup(groupId, aarti.id)) {
      removeAartiFromGroup(groupId, aarti.id);
    } else {
      addAartiToGroup(groupId, aarti.id);
    }
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const created = createGroup(newGroupName.trim(), '', [aarti.id]);
    setNewGroupName('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl border p-5 shadow-2xl transition-all border-[var(--border-main)] bg-[var(--card-main)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-saffron-600" />
            <h3 className="font-bold text-base text-[var(--text-primary)]">
              आरती ग्रुपमध्ये जोडा
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <p className="text-xs text-[var(--text-secondary)] mt-2">
          <span className="font-bold text-[var(--text-primary)] font-devanagari">{aarti.titleDevanagari}</span> आपल्या पसंतीच्या ग्रुपमध्ये जोडा:
        </p>

        {/* Existing Groups List */}
        <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
          {groups.map(group => {
            const included = group.aartiIds.includes(aarti.id);
            return (
              <button
                key={group.id}
                onClick={() => handleToggleGroup(group.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                  included
                    ? 'border-saffron-600 bg-saffron-500/10 text-saffron-700 dark:text-saffron-300'
                    : 'border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] hover:border-saffron-500/40'
                }`}
              >
                <div className="flex-1 pr-2">
                  <h4 className="text-xs font-bold font-devanagari truncate">{group.name}</h4>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    {group.aartiIds.length} आरत्या जोडलेल्या
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                    included ? 'border-saffron-600 bg-saffron-600 text-white' : 'border-stone-400'
                  }`}
                >
                  {included && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Create New Group Inline */}
        <div className="mt-4 pt-3 border-t border-[var(--border-main)]">
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-saffron-500/50 text-saffron-600 hover:bg-saffron-500/5 text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>नवीन ग्रुप बनवा (Create New Group)</span>
            </button>
          ) : (
            <form onSubmit={handleCreateNew} className="space-y-2">
              <input
                type="text"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                placeholder="ग्रुपचे नाव (उदा. शनिवार हनुमान भजन)..."
                autoFocus
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] focus:outline-hidden focus:ring-1 focus:ring-saffron-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!newGroupName.trim()}
                  className="flex-1 py-2 bg-saffron-600 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                >
                  ग्रुप जतन करा (Save)
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-2 border border-[var(--border-main)] text-[var(--text-secondary)] text-xs rounded-xl"
                >
                  रद्द (Cancel)
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold transition-transform active:scale-98"
          >
            पूर्ण (Done)
          </button>
        </div>
      </div>
    </div>
  );
}
