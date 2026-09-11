'use client';

import React, { useState, useEffect } from 'react';
import { FastForward, Pause, Sparkles } from 'lucide-react';

interface NextAartiCountdownProps {
  nextTitle: string;
  totalSeconds?: number;
  onProceed: () => void;
  onCancel: () => void;
}

export function NextAartiCountdown({
  nextTitle,
  totalSeconds = 10,
  onProceed,
  onCancel,
}: NextAartiCountdownProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onProceed();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSeconds, onProceed]);

  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <aside
      aria-label="पुढील आरती संक्रमण"
      className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-50 p-4 rounded-3xl border border-amber-500/50 bg-stone-950/95 text-white shadow-2xl backdrop-blur-md transition-all animate-slide-up"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>आरतीचा शेवटचा भाग गाण्यासाठी वेळ</span>
          </div>
          <p className="text-sm font-extrabold font-devanagari text-white leading-tight">
            पुढील आरती: <span className="text-amber-300">{nextTitle}</span> ({secondsLeft} सेकंदात)
          </p>
        </div>

        {/* Seconds Counter Circle */}
        <div className="relative w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center font-mono font-bold text-xs text-amber-300 shrink-0">
          {secondsLeft}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden my-3">
        <div
          className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-1000"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onProceed}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-md transition-transform active:scale-98"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>आत्ताच पुढे जा (Next Now)</span>
        </button>

        <button
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-300 font-semibold text-xs transition-colors"
        >
          <Pause className="w-3.5 h-3.5" />
          <span>इथेच थांबा (Wait Here)</span>
        </button>
      </div>
    </aside>
  );
}
