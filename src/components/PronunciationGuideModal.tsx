'use client';

import React, { useState } from 'react';
import { Volume2, X, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import {
  syllabifyDevanagari,
  getLineSyllables,
  VEDIC_PRONUNCIATION_RULES,
  SyllableToken,
} from '@/lib/phoneticPreprocessor';
import { Stanza } from '@/types';

interface PronunciationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  stanzas: Stanza[];
  activeStanzaIndex?: number;
  hymnTitle: string;
}

export function PronunciationGuideModal({
  isOpen,
  onClose,
  stanzas,
  activeStanzaIndex = 0,
  hymnTitle,
}: PronunciationGuideModalProps) {
  const [selectedStanzaIdx, setSelectedStanzaIdx] = useState(activeStanzaIndex);
  const [activeTab, setActiveTab] = useState<'syllables' | 'rules'>('syllables');
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStanza = stanzas[selectedStanzaIdx] || stanzas[0];
  const lines = currentStanza?.devanagari || [];

  const playSyllableAudio = (text: string, rate: number = 0.65) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    setSpeakingText(text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'mr-IN';
    utterance.rate = rate; // Slow, didactic laya
    utterance.pitch = 1.02;

    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pronunciation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] p-5 shadow-2xl space-y-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="pronunciation-modal-title" className="text-base font-bold text-[var(--text-primary)] font-devanagari">
                शुद्ध उच्चार व पदच्छेद मार्गदर्शक
              </h2>
              <p className="text-xs text-[var(--text-secondary)] truncate max-w-[240px]">
                {hymnTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close pronunciation modal"
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--bg-main)] border border-[var(--border-main)]">
          <button
            onClick={() => setActiveTab('syllables')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'syllables'
                ? 'bg-[var(--card-main)] text-saffron-600 shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            कडवे व पदच्छेद (Syllables)
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'rules'
                ? 'bg-[var(--card-main)] text-saffron-600 shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            वैदिक उच्चार नियम (Rules)
          </button>
        </div>

        {/* Tab 1: Syllables Breakdown */}
        {activeTab === 'syllables' && (
          <div className="space-y-4">
            {/* Stanza Selector */}
            {stanzas.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-xs text-[var(--text-secondary)] font-semibold shrink-0">
                  कडवे निवडा:
                </span>
                {stanzas.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedStanzaIdx(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      selectedStanzaIdx === idx
                        ? 'bg-saffron-500 text-white'
                        : 'border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:border-saffron-500/50'
                    }`}
                  >
                    {idx === 0 ? 'ध्रुवपद' : `${idx}`}
                  </button>
                ))}
              </div>
            )}

            {/* Lines and Syllables */}
            <div className="space-y-3">
              {lines.map((line, lIdx) => {
                const syllables = getLineSyllables(line);
                return (
                  <div
                    key={lIdx}
                    className="p-3 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-main)] space-y-2"
                  >
                    {/* Full Line with Audio Button */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[var(--text-primary)] font-devanagari">
                        {line}
                      </p>
                      <button
                        onClick={() => playSyllableAudio(line, 0.75)}
                        aria-label="Listen slow pronunciation of full line"
                        title="हळू आवाजात पूर्ण ओळ ऐका"
                        className={`p-1.5 rounded-lg border transition-all ${
                          speakingText === line
                            ? 'bg-saffron-500 text-white border-saffron-600'
                            : 'border-[var(--border-main)] bg-[var(--card-main)] text-saffron-600 hover:bg-saffron-500/10'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Syllable Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {syllables.map((s, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => playSyllableAudio(s.syllable, 0.6)}
                          title={`${s.syllable} (${s.transliteration}) - Click to hear`}
                          className={`flex flex-col items-center px-2 py-1 rounded-lg text-xs border transition-transform active:scale-95 ${
                            speakingText === s.syllable
                              ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400/50'
                              : s.isHeavy
                              ? 'border-amber-500/40 bg-amber-500/5 text-amber-900 dark:text-amber-200 hover:border-amber-500'
                              : 'border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] hover:border-saffron-500/50'
                          }`}
                        >
                          <span className="font-bold font-devanagari">{s.syllable}</span>
                          <span className="text-[9px] text-[var(--text-secondary)] opacity-80">
                            {s.transliteration}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-[var(--text-secondary)] italic text-center">
              टीप: अक्षरावर टॅप करून त्याचा शुद्ध, संथ उच्चार ऐका. पिवळ्या रंगातील अक्षरे दीर्घ (गुरु) आहेत.
            </p>
          </div>
        )}

        {/* Tab 2: Vedic Pronunciation Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-3">
            {VEDIC_PRONUNCIATION_RULES.map((rule, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-main)] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-saffron-500/15 text-saffron-700 dark:text-saffron-300 font-bold text-xs font-devanagari">
                    {rule.character} ({rule.devanagariExample})
                  </span>
                  <button
                    onClick={() => playSyllableAudio(rule.devanagariExample, 0.65)}
                    aria-label={`Listen pronunciation example for ${rule.character}`}
                    className="p-1 rounded-md text-saffron-600 hover:bg-saffron-500/10"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  {rule.authenticGuidance}
                </p>
                <p className="text-[11px] text-rose-600 dark:text-rose-400">
                  ⚠️ चूक टाळा: {rule.commonMistake}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
