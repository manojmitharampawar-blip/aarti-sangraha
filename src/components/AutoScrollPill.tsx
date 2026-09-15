'use client';

import React from 'react';
import { Play, Pause, FastForward, Sun, Mic } from 'lucide-react';
import { useThemeContext } from '@/components/ThemeProvider';
import { useScrollDirection } from '@/hooks/useScrollDirection';

interface AutoScrollPillProps {
  isScrolling: boolean;
  speed?: number;
  onToggle: () => void;
  onSpeedChange?: (speed: number) => void;
  isVoiceFollowerActive?: boolean;
  isVoiceChanting?: boolean;
  onToggleVoiceFollower?: () => void;
  onOpenVirtualAarti?: () => void;
}

export function AutoScrollPill({
  isScrolling,
  speed: propSpeed,
  onToggle,
  onSpeedChange,
  isVoiceFollowerActive,
  isVoiceChanting,
  onToggleVoiceFollower,
  onOpenVirtualAarti,
}: AutoScrollPillProps) {
  const { autoScrollSpeed, cycleAutoScrollSpeed, script } = useThemeContext();
  const isNavVisible = useScrollDirection(8);
  const isDevanagari = script === 'devanagari';

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
      {/* Touchless Virtual Aarti Trigger (AI) */}
      {onOpenVirtualAarti && (
        <button
          onClick={onOpenVirtualAarti}
          aria-label="Start touchless virtual aarti"
          title="स्पर्शविरहित व्हर्च्युअल आरती (AI)"
          className="p-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 active:scale-90 transition-all flex items-center justify-center text-xs"
        >
          <span>🪔</span>
        </button>
      )}

      {/* Voice Chanting Follower Button (AI) */}
      {onToggleVoiceFollower && (
        <button
          onClick={onToggleVoiceFollower}
          aria-label="Toggle voice chanting follower"
          title={
            isVoiceFollowerActive
              ? 'वाणी अनुसरक थांबवा'
              : 'वाणी अनुसरक (AI गायन ऐकून आपोआप स्क्रोल)'
          }
          className={`p-1.5 rounded-full border transition-all active:scale-90 flex items-center justify-center ${
            isVoiceFollowerActive
              ? isVoiceChanting
                ? 'border-emerald-500 bg-emerald-600 text-white animate-pulse shadow-md shadow-emerald-500/30'
                : 'border-emerald-500/50 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              : 'border-[var(--border-main)] text-[var(--text-secondary)] hover:text-emerald-600'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
        </button>
      )}

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

      {/* Speed Selector (Uniform: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x) */}
      <button
        onClick={handleNextSpeed}
        aria-label={`Current scroll speed ${currentSpeed}x. Click to change speed.`}
        title="स्क्रोल गती बदला"
        className="flex items-center gap-1 text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <FastForward className="w-3 h-3" />
        <span>{currentSpeed}x</span>
      </button>

      {/* Screen Stay Awake Indicator during auto navigation */}
      {isScrolling && (
        <span
          title={isDevanagari ? 'स्क्रीन चालू राहील (Display will stay on)' : 'Screen will not lock'}
          aria-label="Screen stay-awake active"
          className="flex items-center gap-1 text-[10px] font-semibold text-amber-500 pl-0.5 border-l border-[var(--border-main)]"
        >
          <Sun className="w-3.5 h-3.5 animate-pulse" />
        </span>
      )}
    </div>
  );
}
