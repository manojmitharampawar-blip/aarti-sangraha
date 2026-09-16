'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, X, Sunrise, Sunset, BookOpen, Volume2, ArrowRight } from 'lucide-react';
import { aartis } from '@/data/aartis';

interface ElderBhaktiModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ElderBhaktiModeModal({ isOpen, onClose }: ElderBhaktiModeModalProps) {
  if (!isOpen) return null;

  const MORNING_HYMNS = [
    { slug: 'ganesha-kakad-aarti', title: 'गणेश काकड आरती' },
    { slug: 'ram-raksha-stotra', title: 'श्री रामरक्षा स्तोत्र' },
    { slug: 'ganapati-atharvashirsha', title: 'श्री गणपती अथर्वशीर्ष' },
  ];

  const EVENING_HYMNS = [
    { slug: 'sukhkarta-dukhharta', title: 'सुखकर्ता दुःखहर्ता (आरती)' },
    { slug: 'durge-durgat-bhari', title: 'दुर्गे दुर्घट भारी (देवी आरती)' },
    { slug: 'ghalin-lotangan', title: 'घालीन लोटांगण' },
    { slug: 'mantra-pushpanjali', title: 'मंत्रपुष्पांजली' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="elder-mode-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-amber-500 bg-amber-50 dark:bg-stone-950 p-6 shadow-2xl space-y-6 text-[var(--text-primary)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-500/30 pb-4">
          <div className="space-y-1">
            <h2 id="elder-mode-modal-title" className="text-2xl font-black text-amber-950 dark:text-amber-100 font-devanagari">
              ज्येष्ठ भक्त सुलभ मोड
            </h2>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
              मोठे स्पष्ट अक्षर, सोपे वाचन व १-टॅप पूजा
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Elder Bhakti Mode"
            className="p-2 rounded-full border-2 border-amber-600 bg-amber-500/10 text-amber-900 dark:text-amber-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Big Card 1: Morning Pooja */}
        <div className="p-5 rounded-3xl border-2 border-amber-500/50 bg-white/80 dark:bg-stone-900/80 space-y-3 shadow-md">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-amber-500 text-white font-black text-xl">
              🌅
            </span>
            <div>
              <h3 className="text-xl font-black text-amber-950 dark:text-amber-100 font-devanagari">
                सकाळची नित्य पूजा
              </h3>
              <p className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                काकड आरती व प्रभात स्तोत्रे
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {MORNING_HYMNS.map(h => (
              <Link
                key={h.slug}
                href={`/aarti/${h.slug}`}
                onClick={onClose}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 font-bold text-lg font-devanagari transition-colors group"
              >
                <span>🪔 {h.title}</span>
                <ArrowRight className="w-5 h-5 text-amber-700 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

        {/* Big Card 2: Evening Aarti */}
        <div className="p-5 rounded-3xl border-2 border-orange-500/50 bg-white/80 dark:bg-stone-900/80 space-y-3 shadow-md">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-orange-500 text-white font-black text-xl">
              🪔
            </span>
            <div>
              <h3 className="text-xl font-black text-amber-950 dark:text-amber-100 font-devanagari">
                संध्याकाळची आरती
              </h3>
              <p className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                दीप प्रज्वलन व संपूर्ण आरती
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {EVENING_HYMNS.map(h => (
              <Link
                key={h.slug}
                href={`/aarti/${h.slug}`}
                onClick={onClose}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 font-bold text-lg font-devanagari transition-colors group"
              >
                <span>🌸 {h.title}</span>
                <ArrowRight className="w-5 h-5 text-orange-700 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
