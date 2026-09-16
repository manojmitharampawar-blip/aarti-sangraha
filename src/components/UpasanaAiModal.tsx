'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  X,
  Search,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  HelpCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Scroll,
} from 'lucide-react';
import { queryUpasanaGuidance, UpasanaGuidance } from '@/lib/upasanaAiEngine';
import { findScripturalCitations, ScripturalCitation } from '@/lib/scripturalKnowledgeBase';
import { aartis } from '@/data/aartis';

interface UpasanaAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

export function UpasanaAiModal({ isOpen, onClose, defaultTopic }: UpasanaAiModalProps) {
  const [queryInput, setQueryInput] = useState('');
  const [activeGuidance, setActiveGuidance] = useState<UpasanaGuidance>(() =>
    queryUpasanaGuidance(defaultTopic || 'आजची उपासना')
  );
  const [citations, setCitations] = useState<ScripturalCitation[]>(() =>
    findScripturalCitations(defaultTopic || 'आजची उपासना')
  );
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryInput.trim()) return;
    const result = queryUpasanaGuidance(queryInput);
    setActiveGuidance(result);
    setCitations(findScripturalCitations(queryInput));
  };

  const selectPreset = (presetQuestion: string) => {
    setQueryInput(presetQuestion);
    const result = queryUpasanaGuidance(presetQuestion);
    setActiveGuidance(result);
    setCitations(findScripturalCitations(presetQuestion));
  };

  // Voice In: Speech Recognition
  const toggleVoiceIn = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('तुमच्या ब्राउझरमध्ये व्हॉईस इनपुट उपलब्ध नाही.');
      return;
    }

    if (isVoiceListening) {
      setIsVoiceListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = 'mr-IN';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onresult = (evt: any) => {
        const transcript = evt.results[0][0].transcript;
        setQueryInput(transcript);
        const result = queryUpasanaGuidance(transcript);
        setActiveGuidance(result);
        setCitations(findScripturalCitations(transcript));
        setIsVoiceListening(false);
      };

      rec.onerror = () => setIsVoiceListening(false);
      rec.onend = () => setIsVoiceListening(false);

      setIsVoiceListening(true);
      rec.start();
    } catch {
      setIsVoiceListening(false);
    }
  };

  // Voice Out: Speech Synthesis Readout
  const toggleVoiceOut = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isVoiceSpeaking) {
      window.speechSynthesis.cancel();
      setIsVoiceSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${activeGuidance.questionDevanagari}। ${activeGuidance.answerDevanagari}`
    );
    utterance.lang = 'mr-IN';
    utterance.rate = 0.88; // Devotional calm pace

    utterance.onend = () => setIsVoiceSpeaking(false);
    utterance.onerror = () => setIsVoiceSpeaking(false);

    setIsVoiceSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const PRESET_TOPICS = [
    { label: 'आजची नित्य उपासना', query: 'आजची उपासना' },
    { label: 'सोमवार शिवपूजा', query: 'सोमवार शिव उपासना' },
    { label: 'मंगळवार गणेश-दुर्गा', query: 'मंगळवार गणेश उपासना' },
    { label: 'गुरुवार दत्त-स्वामी-साई', query: 'गुरुवार दत्त उपासना' },
    { label: 'शनिवार मारुती-शनिदेव', query: 'शनिवार मारुती उपासना' },
    { label: 'आरती ओवाळण्याचे शास्त्र', query: 'आरती कशी ओवाळावी नियम' },
    { label: 'संकष्टी चतुर्थी व्रत', query: 'संकष्टी चतुर्थी नियम' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upasana-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={() => {
        if (isVoiceSpeaking) window.speechSynthesis.cancel();
        onClose();
      }}
    >
      <div
        className="w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] p-5 shadow-2xl space-y-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-saffron-500 to-amber-500 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="upasana-modal-title" className="text-base font-bold text-[var(--text-primary)] font-devanagari">
                उपासना मित्र (Devotional AI Guide)
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                शास्त्रोक्त पूजा विधी, संत साहित्य व साधना मार्गदर्शन
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isVoiceSpeaking) window.speechSynthesis.cancel();
              onClose();
            }}
            aria-label="Close Upasana AI modal"
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Voice Input */}
        <form onSubmit={handleSearch} className="relative flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              placeholder="उदा. सोमवारची शिवपूजा, आरती कशी ओवाळावी, संकष्टी व्रत..."
              className="w-full pl-9 pr-12 py-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-main)] text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-hidden focus:border-saffron-500 font-devanagari"
            />
            <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-3" />

            {/* Mic Voice-In Button */}
            <button
              type="button"
              onClick={toggleVoiceIn}
              aria-label="Speak query"
              title="बोलून प्रश्न विचारा (व्हॉईस इनपुट)"
              className={`absolute right-2 top-2 p-1.5 rounded-lg transition-all ${
                isVoiceListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-[var(--text-secondary)] hover:text-saffron-600'
              }`}
            >
              {isVoiceListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            type="submit"
            className="px-3.5 py-2.5 rounded-xl bg-saffron-500 text-white text-xs font-bold hover:bg-saffron-600 active:scale-95 transition-all shrink-0"
          >
            विचारा
          </button>
        </form>

        {/* Preset Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {PRESET_TOPICS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => selectPreset(preset.query)}
              className="px-2.5 py-1 rounded-full border border-[var(--border-main)] bg-[var(--bg-main)] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-saffron-600 hover:border-saffron-500/50 shrink-0 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Guidance Display Card with Voice-Out Audio Readout */}
        <div className="p-4 rounded-2xl border border-saffron-500/30 bg-saffron-500/5 dark:bg-saffron-950/20 space-y-3 relative">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-saffron-600 shrink-0" />
              <h3 className="text-sm font-bold text-[var(--text-primary)] font-devanagari">
                {activeGuidance.questionDevanagari}
              </h3>
            </div>

            {/* Voice-Out Audio Answer Button */}
            <button
              onClick={toggleVoiceOut}
              aria-label="Listen to answer"
              title={isVoiceSpeaking ? 'ऑडिओ थांबवा' : 'मार्गदर्शन ऐका (AI वाणी)'}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                isVoiceSpeaking
                  ? 'bg-saffron-600 text-white animate-pulse'
                  : 'border border-saffron-500/40 text-saffron-800 dark:text-saffron-300 hover:bg-saffron-500/15'
              }`}
            >
              {isVoiceSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isVoiceSpeaking ? 'थांबवा' : 'ऐका'}</span>
            </button>
          </div>

          <p className="text-xs leading-relaxed text-[var(--text-primary)] font-devanagari">
            {activeGuidance.answerDevanagari}
          </p>

          <p className="text-[11px] leading-relaxed text-[var(--text-secondary)] italic border-t border-[var(--border-main)]/60 pt-2">
            {activeGuidance.answerEnglish}
          </p>
        </div>

        {/* Scriptural Grounding (संत साहित्य संदर्भ) */}
        {citations.length > 0 && (
          <div className="p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Scroll className="w-3.5 h-3.5" />
              <span>संत साहित्य संदर्भ (Scriptural Grounding):</span>
            </div>
            {citations.slice(0, 2).map((cit, cIdx) => (
              <div key={cIdx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] font-semibold">
                  <span className="text-amber-700 dark:text-amber-300">📖 {cit.sourceTextMr}</span>
                  <span>{cit.chapterOrOviMr}</span>
                </div>
                <p className="italic font-devanagari text-[var(--text-primary)] text-xs">
                  &ldquo;{cit.verseSnippetDevanagari}&rdquo;
                </p>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {cit.purportMr}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Ritual Tips */}
        {activeGuidance.ritualsTips.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>महत्त्वाचे पूजा संकेत व विधी</span>
            </h4>
            <div className="space-y-1.5">
              {activeGuidance.ritualsTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-main)] text-xs text-[var(--text-primary)] font-devanagari"
                >
                  <span className="text-saffron-600 font-bold shrink-0">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Hymns */}
        {activeGuidance.recommendedHymnSlugs.length > 0 && (
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-saffron-600" />
              <span>या उपासनेसाठी शिफारस केलेल्या आरत्या व स्तोत्रे</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeGuidance.recommendedHymnSlugs.map(slug => {
                const hymn = aartis.find(a => a.slug === slug);
                if (!hymn) return null;
                return (
                  <Link
                    key={slug}
                    href={`/aarti/${slug}`}
                    onClick={() => {
                      if (isVoiceSpeaking) window.speechSynthesis.cancel();
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/60 hover:bg-saffron-500/5 transition-all group"
                  >
                    <div className="truncate pr-2">
                      <p className="text-xs font-bold text-[var(--text-primary)] font-devanagari truncate group-hover:text-saffron-600 transition-colors">
                        {hymn.titleDevanagari}
                      </p>
                      <p className="text-[10px] text-[var(--text-secondary)] truncate">
                        {hymn.titleTransliteration}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-saffron-600 shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
