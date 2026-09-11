'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { deities } from '@/data/deities';
import { aartis } from '@/data/aartis';
import { useThemeContext } from '@/components/ThemeProvider';
import { Sparkles, Calendar, ChevronRight } from 'lucide-react';

export default function DeitiesPage() {
  const { script } = useThemeContext();
  const [selectedDeity, setSelectedDeity] = useState<string | null>(null);

  const activeAartis = selectedDeity
    ? aartis.filter(a => a.deity === selectedDeity)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari">
          {script === 'devanagari' ? 'देवता संग्रह' : 'Deities & Devotions'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          {script === 'devanagari'
            ? 'आपल्या आराध्य देवतेच्या आरत्या व स्तोत्रे निवडा'
            : 'Select your worshipped deity to recite dedicated hymns'}
        </p>
      </div>

      {/* Deities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {deities.map(deity => {
          const count = aartis.filter(a => a.deity === deity.id).length;
          const isSelected = selectedDeity === deity.id;

          return (
            <button
              key={deity.id}
              onClick={() => setSelectedDeity(isSelected ? null : deity.id)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                isSelected
                  ? 'border-saffron-600 bg-saffron-500/10 shadow-md ring-1 ring-saffron-500/40'
                  : 'border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-saffron-600 font-semibold mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{deity.primaryDay}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-devanagari">
                    {script === 'devanagari' ? deity.nameDevanagari : deity.nameTransliteration}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                    {deity.description}
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-saffron-500/15 text-saffron-700 dark:text-saffron-300 ml-2">
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Deity Aarti List Drawer/Section */}
      {selectedDeity && (
        <section className="p-4 rounded-2xl border border-saffron-500/30 bg-[var(--card-main)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-saffron-600 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>उपलब्ध आरत्या (Available Hymns)</span>
            </h3>
            <span className="text-xs text-[var(--text-secondary)]">
              {activeAartis.length} रचना
            </span>
          </div>

          <div className="divide-y divide-[var(--border-main)]">
            {activeAartis.map(aarti => (
              <Link
                key={aarti.id}
                href={`/aarti/${aarti.slug}`}
                className="flex items-center justify-between py-3 group hover:text-saffron-600"
              >
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-saffron-600 font-devanagari">
                    {script === 'devanagari' ? aarti.titleDevanagari : aarti.titleTransliteration}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                    {script === 'devanagari' ? aarti.firstLineDevanagari : aarti.firstLineTransliteration}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
