'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowUp, ArrowDown, Trash2, Plus, Check, Search, GripVertical } from 'lucide-react';
import { aartis } from '@/data/aartis';
import { deities } from '@/data/deities';
import { CustomGroup } from '@/types';
import { useCustomGroups } from '@/hooks/useCustomGroups';
import { getHymnTypeBadge } from '@/components/AartiCard';

interface GroupEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  group?: CustomGroup | null;
}

export function GroupEditorModal({ isOpen, onClose, group }: GroupEditorModalProps) {
  const { createGroup, updateGroup, deleteGroup } = useCustomGroups();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pickerSearch, setPickerSearch] = useState('');

  // Sync state whenever modal opens or group prop changes
  useEffect(() => {
    if (isOpen) {
      if (group) {
        setName(group.name);
        setDescription(group.description || '');
        setSelectedIds([...group.aartiIds]);
      } else {
        setName('');
        setDescription('');
        setSelectedIds([]);
      }
      setPickerSearch('');
    }
  }, [isOpen, group]);

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

  // Filter hymns for search & add
  const searchLower = pickerSearch.trim().toLowerCase();
  const filteredPickerAartis = pickerSearch.trim()
    ? aartis.filter(
        a =>
          a.titleDevanagari.toLowerCase().includes(searchLower) ||
          a.titleTransliteration.toLowerCase().includes(searchLower) ||
          a.firstLineDevanagari.toLowerCase().includes(searchLower) ||
          a.firstLineTransliteration.toLowerCase().includes(searchLower) ||
          a.deity.toLowerCase().includes(searchLower) ||
          a.tags.some(t => t.toLowerCase().includes(searchLower))
      )
    : aartis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl border p-5 sm:p-6 shadow-2xl transition-all border-[var(--border-main)] bg-[var(--card-main)] my-6 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)] shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-saffron-600">
              {group ? 'ग्रुप संपादन (Edit Group)' : 'नवीन उपासना संग्रह'}
            </span>
            <h3 className="font-black text-lg text-[var(--text-primary)] font-devanagari">
              {group ? group.name : 'नवीन आरती व स्तोत्र ग्रुप तयार करा'}
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
              placeholder="उदा. माझी सकाळची पूजा, शनिवार मारुती भजन..."
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
              placeholder="उदा. दैनंदिन सकाळ-संध्याकाळ पूजेसाठी सलग स्तोत्र व आरत्यांचा क्रम..."
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:outline-hidden focus:ring-2 focus:ring-saffron-500/50"
            />
          </div>

          {/* SEARCH & ADD AARTIS / STOTRAS SECTION */}
          <div className="p-3.5 rounded-2xl border border-saffron-500/30 bg-saffron-500/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-saffron-700 dark:text-saffron-300 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-saffron-600" />
                <span>स्तोत्र व आरती शोधा आणि जोडा (Search & Add)</span>
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
                placeholder="आरतीचे नाव, देवता किंवा शब्द शोधा (उदा. गणपती, सुखकर्ता, रामरक्षा)..."
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
            <div className="max-h-48 overflow-y-auto divide-y divide-[var(--border-main)] rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] px-2">
              {filteredPickerAartis.length > 0 ? (
                filteredPickerAartis.map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  const deity = deities.find(d => d.id === item.deity);
                  const typeBadge = getHymnTypeBadge(item.type, true);

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
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${typeBadge.className}`}>
                            {typeBadge.label}
                          </span>
                          {deity && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-[var(--text-secondary)] font-devanagari">
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
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                            : 'bg-saffron-600 text-white hover:bg-saffron-700'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-[10px]">जोडली</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span className="text-[10px]">जोडा</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="py-4 text-center text-xs text-[var(--text-secondary)]">
                  कोणतीही रचना सापडली नाही (No matching hymns)
                </div>
              )}
            </div>
          </div>

          {/* CHOSEN SEQUENCE ORDER */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1">
                <GripVertical className="w-3.5 h-3.5 text-saffron-600" />
                <span>पठणाचा सलग क्रम (Sequential Order - {selectedIds.length})</span>
              </label>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-[10px] text-rose-500 hover:underline font-semibold"
                >
                  सर्व काढा (Clear all)
                </button>
              )}
            </div>

            {selectedIds.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-[var(--border-main)] text-center text-xs text-[var(--text-secondary)]">
                वरील शोधपेटीतून स्तोत्रे व आरत्या निवडा आणि क्रम तयार करा.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {selectedIds.map((id, index) => {
                  const item = aartis.find(a => a.id === id);
                  if (!item) return null;

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-xs gap-2 group"
                    >
                      <span className="w-5 text-center font-bold text-saffron-600 shrink-0">
                        {index + 1}.
                      </span>
                      <span className="flex-1 font-bold text-[var(--text-primary)] truncate font-devanagari">
                        {item.titleDevanagari}
                      </span>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveItem(index, 'up')}
                          aria-label="Move Up"
                          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === selectedIds.length - 1}
                          onClick={() => moveItem(index, 'down')}
                          aria-label="Move Down"
                          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(id)}
                          aria-label="Remove Item"
                          className="p-1 rounded text-rose-500 hover:bg-rose-500/10 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[var(--border-main)] flex items-center justify-between gap-3">
            {group ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>ग्रुप हटवा</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-[var(--border-main)] text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                disabled={!name.trim() || selectedIds.length === 0}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-saffron-600 text-white hover:bg-saffron-700 shadow-md shadow-saffron-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {group ? 'बदल जतन करा (Save Changes)' : 'ग्रुप तयार करा (Create Group)'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
