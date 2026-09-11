'use client';

import React, { useState } from 'react';
import { X, Check, Copy, Share2, Send } from 'lucide-react';
import {
  ShareableGroup,
  generateGroupShareUrl,
  generateWhatsAppShareMessage,
  shareToWhatsApp,
} from '@/lib/groupSharing';
import { aartis } from '@/data/aartis';

interface ShareGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: ShareableGroup | null;
}

export function ShareGroupModal({ isOpen, onClose, group }: ShareGroupModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !group) return null;

  const shareUrl = typeof window !== 'undefined' ? generateGroupShareUrl(group) : '';
  const message = generateWhatsAppShareMessage(group, shareUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsApp = () => {
    shareToWhatsApp(group);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: group.name,
          text: message,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleWhatsApp();
    }
  };

  const hymnItems = group.aartiIds
    .map(id => aartis.find(a => a.id === id))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] p-5 sm:p-6 shadow-2xl space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--text-primary)] font-devanagari">
                ग्रुप शेअर करा (Share Group)
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                व्हॉट्सॲपवर पाठवा; मित्र व कुटुंब थेट इंपोर्ट करू शकतील
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Group Summary Preview */}
        <div className="p-3 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-main)] space-y-2">
          <div>
            <h4 className="font-black text-sm text-[var(--text-primary)] font-devanagari">
              {group.name}
            </h4>
            {group.description && (
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {group.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-saffron-600 font-bold">
            <span>{hymnItems.length} स्तोत्रे व आरत्या समाविष्ट</span>
          </div>

          <div className="max-h-24 overflow-y-auto divide-y divide-[var(--border-main)] pt-1 text-xs">
            {hymnItems.map((h, i) => (
              <div key={h?.id || i} className="py-1 flex items-center justify-between text-[11px]">
                <span className="truncate text-[var(--text-primary)] font-devanagari">
                  {i + 1}. {h?.titleDevanagari}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* WhatsApp Primary Action Button */}
          <button
            onClick={handleWhatsApp}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-98 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>WhatsApp वर शेअर करा (Share to WhatsApp)</span>
          </button>

          {/* Copy Share Link */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 px-3 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500 text-[var(--text-primary)] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">लिंक कॉपी झाली!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>लिंक कॉपी करा (Copy Link)</span>
                </>
              )}
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-xl border border-[var(--border-main)] hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                title="इतर ॲप्सवर शेअर करा"
              >
                <Share2 className="w-4 h-4" />
                <span>अधिक पर्याय</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
