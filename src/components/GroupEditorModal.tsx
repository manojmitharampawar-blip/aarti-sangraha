'use client';

import React, { useState } from 'react';
import { X, ArrowUp, ArrowDown, Trash2, Plus, Check, Search } from 'lucide-react';
import { CustomGroup, AartiItem } from '@/types';
import { aartis } from '@/data/aartis';
import { useCustomGroups } from '@/hooks/useCustomGroups';

interface GroupEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  group?: CustomGroup | null; // If null, create mode
}

export function GroupEditorModal({ isOpen, onClose, group }: GroupEditorModalProps) {
  const { createGroup, updateGroup, deleteGroup } = useCustomGroups();

  const [name, setName] = useState(group?.name || '');
  const [description, setDescription] = useState(group?.description || '');
  const [selectedIds, setSelectedIds] = useState<string[]>(group?.aartiIds || []);
  const [showAartiPicker, setShowAartiPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

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
    if (group && confirm('हा ग्रुप नक्की हटवायचा आहे का? (Delete this group?)')) {
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

  const filteredPickerAartis = aartis.filter(
    a =>
      a.titleDevanagari.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      a.titleTransliteration.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl border p-5 shadow-2xl transition-all border-[var(--border-main)] bg-[var(--card-main)] my-8">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
          <h3 className="font-bold text-base text-[var(--text-primary)] font-devanagari">
            {group ? 'आरती ग्रुप संपादित करा' : 'नवीन आरती ग्रुप तयार करा'}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-4">
          {/* Group Name Input */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
              ग्रुपचे नाव (Group Name) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="उदा. माझी सकाळची पूजा, गुरुवार दत्त उपासना..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:outline-hidden focus:ring-2 focus:ring-saffron-500/50"
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
              placeholder="उदा. रोज सकाळच्या वेळेस म्हणायच्या आरत्या..."
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:outline-hidden focus:ring-2 focus:ring-saffron-500/50"
            />
          </div>

          {/* Sequence of Aartis in this Group */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                आरत्यांचा अनुक्रम (Chanting Sequence: {selectedIds.length})
              </label>
              <button
                type="button"
                onClick={() => setShowAartiPicker(!showAartiPicker)}
                className="text-xs font-bold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>आरती जोडा</span>
              </button>
            </div>

            {/* Aarti Picker Drawer */}
            {showAartiPicker && (
              <div className="p-3 mb-3 rounded-2xl border border-saffron-500/30 bg-saffron-500/5 space-y-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-saffron-600 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={pickerSearch}
                    onChange={e => setPickerSearch(e.target.value)}
                    placeholder="आरती शोधा..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)]"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto divide-y divide-[var(--border-main)] text-xs">
                  {filteredPickerAartis.map(item => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleAartiSelection(item.id)}
                        className="w-full flex items-center justify-between py-2 text-left hover:text-saffron-600"
                      >
                        <span className="font-devanagari font-semibold">{item.titleDevanagari}</span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-saffron-600 border-saffron-600 text-white' : 'border-stone-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Configured Sequence List */}
            {selectedIds.length > 0 ? (
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {selectedIds.map((id, index) => {
                  const item = aartis.find(a => a.id === id);
                  if (!item) return null;

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-xs"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-saffron-500/15 text-saffron-700 dark:text-saffron-300 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {index + 1}
                        </span>
                        <span className="font-bold truncate font-devanagari text-[var(--text-primary)]">
                          {item.titleDevanagari}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveItem(index, 'up')}
                          aria-label="Move up"
                          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-20 text-[var(--text-secondary)]"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === selectedIds.length - 1}
                          onClick={() => moveItem(index, 'down')}
                          aria-label="Move down"
                          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-20 text-[var(--text-secondary)]"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(id)}
                          aria-label="Remove from group"
                          className="p-1 rounded hover:bg-rose-500/10 text-rose-500 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-secondary)] italic p-3 text-center border border-dashed border-[var(--border-main)] rounded-xl">
                या ग्रुपमध्ये अद्याप आरत्या जोडलेल्या नाहीत. वरील &apos;आरती जोडा&apos; वर क्लिक करा.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2 border-t border-[var(--border-main)]">
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
                className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
