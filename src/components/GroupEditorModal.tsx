'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Check,
  Search,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CustomGroup, AartiItem } from '@/types';
import { aartis } from '@/data/aartis';
import { deities } from '@/data/deities';
import { useCustomGroups } from '@/hooks/useCustomGroups';

interface GroupEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  group?: CustomGroup | null; // If null, create mode
}

export function GroupEditorModal({ isOpen, onClose, group }: GroupEditorModalProps) {
  const { createGroup, updateGroup, deleteGroup } = useCustomGroups();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pickerSearch, setPickerSearch] = useState('');

  // Re-synchronize state whenever group prop or isOpen changes
  useEffect(() => {
    if (group) {
      setName(group.name || '');
      setDescription(group.description || '');
      setSelectedIds(group.aartiIds ? [...group.aartiIds] : []);
    } else {
      setName('');
      setDescription('');
      setSelectedIds([]);
    }
    setPickerSearch('');
  }, [group, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (group) {
      updateGroup(group.id, {
        name: name.trim(),
        description: description.trim(),
        aartiIds: selectedIds,
      });
    } else {
      createGroup(name.trim(), description.trim(), selectedIds);
    }
    onClose();
  };

  const handleDelete = () => {
    if (group && confirm(`'${group.name}' हा ग्रुप नक्की हटवायचा आहे का? (Delete this group?)`)) {
      deleteGroup(group.id);
      onClose();
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= selectedIds.length) return;
    const copy = [...selectedIds];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    setSelectedIds(copy);
  };

  const removeItem = (id: string) => {
    setSelectedIds(prev => prev.filter(item => item !== id));
  };

  const toggleAartiSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter aartis for search & add
  const searchLower = pickerSearch.trim().toLowerCase();
  const filteredPickerAartis = pickerSearch.trim()
    ? aartis.filter(
        a =>
          a.titleDevanagari.toLowerCase().includes(searchLower) ||
          a.titleTransliteration.toLowerCase().includes(searchLower) ||
          a.firstLineDevanagari.toLowerCase().includes(searchLower) ||
          a.deity.toLowerCase().includes(searchLower)
      )
    : aartis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl border p-5 sm:p-6 shadow-2xl transition-all border-[var(--border-main)] bg-[var(--card-main)] my-6 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)] shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-saffron-600">
              {group ? 'ग्रुप संपादन' : 'नवीन संग्रह'}
            </span>
            <h3 className="font-black text-lg text-[var(--text-primary)] font-devanagari">
              {group ? group.name : 'नवीन आरती ग्रुप तयार करा'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="space-y-4 pt-3 overflow-y-auto flex-1 pr-1">
          {/* Group Name */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
              ग्रुपचे नाव (Group Name) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="उदा. माझी सकाळची पूजा, शनिवार हनुमान भजन..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--text-primary)] text-sm font-devanagari font-bold focus:outline-hidden focus:ring-2 focus:ring-saffron-500/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
              वर्णन (Description - Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="उदा. दैनंदिन सकाळ-संध्याकाळ पूजेसाठी सलग आरत्यांचा क्रम..."
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:outline-hidden focus:ring-2 focus:ring-saffron-500/50"
            />
          </div>

          {/* SEARCH & ADD AARTIS SECTION */}
          <div className="p-3.5 rounded-2xl border border-saffron-500/30 bg-saffron-500/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-saffron-700 dark:text-saffron-300 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-saffron-600" />
                <span>आरती शोधा आणि ग्रुपमध्ये जोडा (Search & Add)</span>
              </label>
              <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                {selectedIds.length} जोडलेल्या
              </span>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-2.5" />
              <input
                type="text"
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                placeholder="आरतीचे नाव, देवता किंवा शब्द शोधा (उदा. गणपती, सुखकर्ता)..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-hidden focus:ring-2 focus:ring-saffron-500"
              />
              {pickerSearch && (
                <button
                  type="button"
                  onClick={() => setPickerSearch('')}
                  className="absolute right-2.5 top-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Matching Results List */}
            <div className="max-h-44 overflow-y-auto divide-y divide-[var(--border-main)] rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] px-2">
              {filteredPickerAartis.length > 0 ? (
                filteredPickerAartis.map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  const deity = deities.find(d => d.id === item.deity);

                  return (
                    <div
                      key={item.id}
                      className="py-2 px-1 flex items-center justify-between gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-devanagari font-bold text-xs text-[var(--text-primary)]">
                            {item.titleDevanagari}
                          </span>
                          {deity && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-saffron-500/10 text-saffron-600 font-devanagari">
                              {deity.nameDevanagari}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[var(--text-secondary)] truncate">
                          {item.firstLineDevanagari}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleAartiSelection(item.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shrink-0 ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-saffron-600 text-white hover:bg-saffron-700'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>जोडली</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>जोडा</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="py-3 text-center text-xs text-[var(--text-secondary)]">
                  कोणतीही आरती सापडली नाही.
                </p>
              )}
            </div>
          </div>

          {/* CONFIGURED SEQUENCE LIST (WITH UP / DOWN / REMOVE) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                आरत्यांचा अनुक्रम (Chanting Sequence: {selectedIds.length} आरत्या)
              </label>
              <span className="text-[10px] text-[var(--text-secondary)]">
                वर-खाली करण्यासाठी ▲ ▼ वापरा
              </span>
            </div>

            {selectedIds.length > 0 ? (
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {selectedIds.map((id, index) => {
                  const item = aartis.find(a => a.id === id);
                  if (!item) return null;

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-main)] text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold truncate font-devanagari text-[var(--text-primary)]">
                            {item.titleDevanagari}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveItem(index, 'up')}
                          aria-label="Move up"
                          title="Move up"
                          className="p-1 rounded-lg border border-[var(--border-main)] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-20 text-[var(--text-secondary)]"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === selectedIds.length - 1}
                          onClick={() => moveItem(index, 'down')}
                          aria-label="Move down"
                          title="Move down"
                          className="p-1 rounded-lg border border-[var(--border-main)] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-20 text-[var(--text-secondary)]"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(id)}
                          aria-label="Remove from group"
                          title="Remove"
                          className="p-1 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 px-3 border border-dashed border-[var(--border-main)] rounded-xl text-xs text-[var(--text-secondary)]">
                या ग्रुपमध्ये अद्याप आरत्या जोडलेल्या नाहीत. वरील शोधातून आरत्या जोडा.
              </div>
            )}
          </div>

          {/* Modal Action Buttons */}
          <div className="flex gap-2.5 pt-3 border-t border-[var(--border-main)] shrink-0">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-md shadow-saffron-600/20 active:scale-98 transition-all disabled:opacity-50"
            >
              {group ? 'बदल जतन करा (Save Changes)' : 'ग्रुप तयार करा (Create Group)'}
            </button>

            {group && (
              <button
                type="button"
                onClick={handleDelete}
                aria-label="Delete group"
                title="हा ग्रुप हटवा"
                className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[var(--border-main)] text-[var(--text-secondary)] text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              रद्द
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
