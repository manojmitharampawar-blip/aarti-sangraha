'use client';

import React from 'react';
import { Play, Pause, FastForward } from 'lucide-react';
import { useThemeContext } from '@/components/ThemeProvider';
import { useScrollDirection } from '@/hooks/useScrollDirection';

interface AutoScrollPillProps {
  isScrolling: boolean;
  speed?: number;
  onToggle: () => void;
  onSpeedChange?: (speed: number) => void;
}

export function AutoScrollPill({
  isScrolling,
  speed: propSpeed,
  onToggle,
  onSpeedChange,
}: AutoScrollPillProps) {
  const { autoScrollSpeed, cycleAutoScrollSpeed } = useThemeContext();
  const isNavVisible = useScrollDirection(8);

  const currentSpeed = propSpeed ?? autoScrollSpeed;

  const handleNextSpeed = () => {
    const nextSpeed = cycleAutoScrollSpeed();
    if (onSpeedChange) {
      onSpeedChange(nextSpeed);
    }
  };

  return (
    <div
      className={`fixed left-4 z-30 flex items-center bg-[var(--card-main)] border border-[var(--border-main)] rounded-full shadow-lg shadow-black/10 px-3 py-1.5 gap-2 animate-fade-in transition-all duration-300 ease-in-out ${
        isNavVisible ? 'bottom-20' : 'bottom-4'
      }`}
    >
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

      {/* Speed Selector (Uniform: 0.5x, 1x, 1.5x, 2x) */}
      <button
        onClick={handleNextSpeed}
        aria-label={`Current scroll speed ${currentSpeed}x. Click to change speed.`}
        title="स्क्रोल गती बदला"
        className="flex items-center gap-1 text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <FastForward className="w-3 h-3" />
        <span>{currentSpeed}x</span>
      </button>
    </div>
  );
}
