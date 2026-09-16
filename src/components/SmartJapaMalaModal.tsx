'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Mic, MicOff, RefreshCw, Volume2, Award, CheckCircle } from 'lucide-react';
import { AcousticJapaTracker, JAPA_MALA_TARGETS, JapaTarget } from '@/lib/acousticJapaCounter';
import { playTempleBell } from '@/lib/audioBell';

interface SmartJapaMalaModalProps {
  isOpen: boolean;
  onClose: () => void;
  hymnTitle: string;
  defaultTarget?: JapaTarget;
}

export function SmartJapaMalaModal({
  isOpen,
  onClose,
  hymnTitle,
  defaultTarget = 11,
}: SmartJapaMalaModalProps) {
  const [target, setTarget] = useState<JapaTarget>(defaultTarget);
  const [currentCount, setCurrentCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const trackerRef = useRef<AcousticJapaTracker | null>(null);

  useEffect(() => {
    trackerRef.current = new AcousticJapaTracker(target, (count, completed) => {
      setCurrentCount(count);
      playTempleBell({ enableHaptics: true });
      if (completed) {
        setIsCompleted(true);
      }
    });

    return () => {
      trackerRef.current?.stopVoiceTracking();
    };
  }, [target]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!trackerRef.current) return;

    if (isListening) {
      trackerRef.current.stopVoiceTracking();
      setIsListening(false);
    } else {
      const started = trackerRef.current.startVoiceTracking([]);
      setIsListening(started);
    }
  };

  const handleManualIncrement = () => {
    if (!trackerRef.current) return;
    const completed = trackerRef.current.incrementManually();
    setCurrentCount(trackerRef.current.getCount());
    playTempleBell({ enableHaptics: true });
    if (completed) {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    trackerRef.current?.reset();
    setCurrentCount(0);
    setIsCompleted(false);
  };

  const progressPercent = Math.min(100, Math.round((currentCount / target) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="japa-mala-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] p-5 sm:p-6 shadow-2xl space-y-5 text-center relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
          <div className="flex items-center gap-2 text-left">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="japa-mala-modal-title" className="text-base font-bold text-[var(--text-primary)] font-devanagari">
                स्मार्ट जप व आवर्तन गणक
              </h2>
              <p className="text-xs text-[var(--text-secondary)] truncate max-w-[210px]">
                {hymnTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Japa Mala modal"
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Selector */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            संकल्प आवर्तने:
          </span>
          {JAPA_MALA_TARGETS.map(t => (
            <button
              key={t}
              onClick={() => {
                setTarget(t);
                trackerRef.current?.setTarget(t);
                if (currentCount >= t) {
                  setIsCompleted(true);
                } else {
                  setIsCompleted(false);
                }
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                target === t
                  ? 'bg-saffron-500 text-white shadow-xs'
                  : 'border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:border-saffron-500/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Circular Bead Counter Display */}
        <div className="relative py-2 flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 rounded-full border-8 border-amber-500/20 flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/5 to-saffron-500/10 shadow-inner">
            <span className="text-4xl font-black text-[var(--text-primary)] font-devanagari">
              {currentCount}
            </span>
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-1">
              / {target} आवर्तने
            </span>

            {/* Simulated Rudraksha Bead Indicator */}
            <div
              className="absolute top-1 w-4 h-4 rounded-full bg-amber-600 ring-4 ring-amber-300 shadow-md transition-all duration-300"
              style={{
                transform: `rotate(${Math.min(360, (currentCount / target) * 360)}deg) translate(0, -84px)`,
              }}
            />
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mt-4 h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-saffron-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Completion Toast */}
        {isCompleted && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
            <Award className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>संकल्प संपन्न! {target} आवर्तने पूर्ण झाली. ईश्वराची कृपा राहो!</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {/* Hands-Free Voice Tracking Button */}
          <button
            onClick={toggleListening}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                : 'border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:border-saffron-500/50'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-saffron-600" />}
            <span>{isListening ? 'आवाज ऐकणे थांबवा' : 'स्पर्शविरहित आवाज गणक (AI)'}</span>
          </button>

          {/* Manual Tap Increment */}
          <button
            onClick={handleManualIncrement}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-500 text-white text-xs font-bold shadow-xs hover:from-saffron-600 hover:to-amber-600 active:scale-95 transition-all"
          >
            +१ जप मोजा
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            aria-label="Reset japa counter"
            title="पुन्हा शून्य करा"
            className="p-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-[var(--text-secondary)] italic">
          टीप: स्पर्शविरहित मोड चालू केल्यास प्रत्येक पठणानंतर आपोआप १ जप मोजला जातो.
        </p>
      </div>
    </div>
  );
}
