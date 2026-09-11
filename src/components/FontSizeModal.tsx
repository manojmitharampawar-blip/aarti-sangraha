'use client';

import React from 'react';
import { Type, X } from 'lucide-react';
import { useThemeContext } from '@/components/ThemeProvider';

interface FontSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fontSizes = [
  { label: 'लहान (Small)', size: 16 },
  { label: 'मध्यम (Medium)', size: 19 },
  { label: 'मोठे (Large)', size: 23 },
  { label: 'खूप मोठे (Extra Large)', size: 28 },
];

export function FontSizeModal({ isOpen, onClose }: FontSizeModalProps) {
  const { fontSize, setFontSize } = useThemeContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl border p-5 shadow-2xl transition-all border-[var(--border-main)] bg-[var(--card-main)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-saffron-600" />
            <h3 className="font-bold text-base text-[var(--text-primary)]">
              अक्षर आकार (Font Size)
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close font size modal"
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {fontSizes.map(item => (
            <button
              key={item.size}
              onClick={() => {
                setFontSize(item.size);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                fontSize === item.size
                  ? 'border-saffron-600 bg-saffron-500/10 text-saffron-600 font-bold shadow-xs'
                  : 'border-[var(--border-main)] text-[var(--text-primary)] hover:border-saffron-500/40'
              }`}
            >
              <span>{item.label}</span>
              <span style={{ fontSize: `${item.size}px` }} className="font-devanagari">
                अ
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-saffron-600 text-white font-semibold shadow-md shadow-saffron-600/20 active:scale-98 transition-transform"
          >
            पूर्ण (Done)
          </button>
        </div>
      </div>
    </div>
  );
}
