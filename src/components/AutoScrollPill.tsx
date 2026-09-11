'use client';

import React from 'react';
import { Play, Pause, FastForward } from 'lucide-react';

interface AutoScrollPillProps {
  isScrolling: boolean;
  speed: number;
  onToggle: () => void;
  onSpeedChange: (speed: number) => void;
}

const speeds = [0.5, 1, 1.5, 2];

export function AutoScrollPill({
  isScrolling,
  speed,
  onToggle,
  onSpeedChange,
}: AutoScrollPillProps) {
  const nextSpeed = () => {
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    onSpeedChange(speeds[nextIndex]);
  };

  return (
    <div className="fixed bottom-20 left-4 z-30 flex items-center bg-[var(--card-main)]/95 backdrop-blur-md border border-[var(--border-main)] rounded-full shadow-lg shadow-black/10 px-3 py-1.5 gap-2">
      {/* Play/Pause Button */}
      <button
        onClick={onToggle}
        aria-label={isScrolling ? 'Pause auto scroll' : 'Start auto scroll'}
        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
          isScrolling
            ? 'bg-saffron-600 text-white shadow-sm shadow-saffron-600/30'
            : 'bg-saffron-500/10 text-saffron-600 hover:bg-saffron-500/20'
        }`}
      >
        {isScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        <span>{isScrolling ? 'थांबवा' : 'स्वयं-स्क्रोल'}</span>
      </button>

      {/* Speed Selector */}
      <button
        onClick={nextSpeed}
        aria-label={`Current speed ${speed}x. Click to change speed.`}
        className="flex items-center gap-1 text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <FastForward className="w-3 h-3" />
        <span>{speed}x</span>
      </button>
    </div>
  );
}
