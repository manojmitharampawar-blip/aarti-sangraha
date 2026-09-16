'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, X, Sparkles, BookOpen, CheckCircle2, Mic, MicOff, Award } from 'lucide-react';
import {
  syllabifyDevanagari,
  getLineSyllables,
  VEDIC_PRONUNCIATION_RULES,
  SyllableToken,
} from '@/lib/phoneticPreprocessor';
import { Stanza } from '@/types';
import { playTempleBell } from '@/lib/audioBell';

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
  const [activeTab, setActiveTab] = useState<'syllables' | 'rules' | 'practice'>('syllables');
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Live Practice States
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceLineIdx, setPracticeLineIdx] = useState(0);
  const [userTranscript, setUserTranscript] = useState('');
  const [practiceScore, setPracticeScore] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const currentStanza = stanzas[selectedStanzaIdx] || stanzas[0];
  const lines = currentStanza?.devanagari || [];
  const targetLine = lines[practiceLineIdx] || lines[0] || '';

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

  const toggleLivePractice = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('तुमच्या ब्राउझरमध्ये व्हॉईस इनपुट उपलब्ध नाही.');
      return;
    }

    if (isPracticing) {
      setIsPracticing(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = 'mr-IN';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onresult = (evt: any) => {
        const transcript = evt.results[0][0].transcript.trim();
        setUserTranscript(transcript);

        // Simple phonetic similarity score calculation
        const targetClean = targetLine.replace(/[॥।|.,\s]+/g, '');
        const userClean = transcript.replace(/[॥।|.,\s]+/g, '');

        let matchCount = 0;
        for (const char of userClean) {
          if (targetClean.includes(char)) matchCount++;
        }
        const score = Math.min(100, Math.round((matchCount / Math.max(1, targetClean.length)) * 100));
        setPracticeScore(score);

        if (score >= 65) {
          playTempleBell({ enableHaptics: true });
        }
        setIsPracticing(false);
      };

      rec.onerror = () => setIsPracticing(false);
      rec.onend = () => setIsPracticing(false);

      setUserTranscript('');
      setPracticeScore(null);
      setIsPracticing(true);
      rec.start();
    } catch {
      setIsPracticing(false);
    }
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
        className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] p-5 shadow-2xl space-y-4"
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
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-main)] border border-[var(--border-main)]">
          <button
            onClick={() => setActiveTab('syllables')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'syllables'
                ? 'bg-[var(--card-main)] text-saffron-600 shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            पदच्छेद (Syllables)
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'practice'
                ? 'bg-[var(--card-main)] text-saffron-600 shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            🎙️ उच्चार सराव (Practice)
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'rules'
                ? 'bg-[var(--card-main)] text-saffron-600 shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            नियम (Rules)
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
                    onClick={() => {
                      setSelectedStanzaIdx(idx);
                      setPracticeLineIdx(0);
                      setPracticeScore(null);
                    }}
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

        {/* Tab 2: Live Practice Mode */}
        {activeTab === 'practice' && (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2 text-left">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                लक्ष्य ओळ (Target Line):
              </span>
              <p className="text-sm font-bold text-[var(--text-primary)] font-devanagari">
                {targetLine}
              </p>
            </div>

            {/* Mic Practice Trigger */}
            <div className="py-2">
              <button
                onClick={toggleLivePractice}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all inline-flex items-center gap-2 ${
                  isPracticing
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                    : 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white shadow-md hover:from-saffron-600 hover:to-amber-600 active:scale-95'
                }`}
              >
                {isPracticing ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isPracticing ? 'आवाज ऐकत आहे... (Chant now)' : 'माईकमध्ये उच्चार करून पहा'}</span>
              </button>
            </div>

            {/* Spoken Feedback */}
            {userTranscript && (
              <div className="p-3.5 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-main)] space-y-2 text-left animate-fade-in">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                  तुम्ही उच्चारलेले शब्द:
                </span>
                <p className="text-xs font-semibold text-[var(--text-primary)] font-devanagari">
                  &ldquo;{userTranscript}&rdquo;
                </p>

                {practiceScore !== null && (
                  <div className="flex items-center justify-between pt-1 border-t border-[var(--border-main)]/50 text-xs font-bold">
                    <span className="text-amber-700 dark:text-amber-300">
                      उच्चार अचूकता: {practiceScore}%
                    </span>
                    {practiceScore >= 70 ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        उत्कृष्ट शुद्ध उच्चार!
                      </span>
                    ) : (
                      <span className="text-amber-600">पुन्हा प्रयत्न करा</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Vedic Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-3">
            {VEDIC_PRONUNCIATION_RULES.map((rule, rIdx) => (
              <div
                key={rIdx}
                className="p-3.5 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-main)] space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-200 font-black text-xs font-devanagari">
                    {rule.character}
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)] font-semibold">
                    उदा. {rule.devanagariExample}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-primary)] font-medium">
                  {rule.phoneticDescription}
                </p>
                <div className="text-[11px] text-rose-600 dark:text-rose-400">
                  <span className="font-bold">चूक: </span>
                  {rule.commonMistake}
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                  <span className="font-bold">शास्त्रशुद्ध पद्धत: </span>
                  {rule.authenticGuidance}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
