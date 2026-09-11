'use client';

import React, { useState } from 'react';
import { Bell, Flame, Wind } from 'lucide-react';
import { playTempleBell, playShankh } from '@/lib/audioBell';
import { useThemeContext } from '@/components/ThemeProvider';

export function RitualBar() {
  const [bellRinging, setBellRinging] = useState(false);
  const [shankhBlowing, setShankhBlowing] = useState(false);
  const { diyaGlow, toggleDiyaGlow } = useThemeContext();

  const handleRingBell = () => {
    setBellRinging(true);
    playTempleBell({ enableHaptics: true });
    setTimeout(() => setBellRinging(false), 600);
  };

  const handleBlowShankh = () => {
    setShankhBlowing(true);
    playShankh({ enableHaptics: true });
    setTimeout(() => setShankhBlowing(false), 1500);
  };

  return (
    <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-2.5 items-end">
      {/* Temple Bell */}
      <button
        onClick={handleRingBell}
        aria-label="Ring Temple Bell (घंटी)"
        className={`w-12 h-12 rounded-full border border-amber-300/40 bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-900 flex items-center justify-center shadow-lg shadow-amber-600/30 transition-transform active:scale-90 ${
          bellRinging ? 'animate-bell-swing' : 'hover:scale-105'
        }`}
        title="घंटी वाजवा (Ring Bell)"
      >
        <Bell className="w-6 h-6 fill-stone-900" />
      </button>

      {/* Conch / Shankh */}
      <button
        onClick={handleBlowShankh}
        aria-label="Blow Shankh (शंख)"
        className={`w-11 h-11 rounded-full border border-amber-200/40 bg-[var(--card-main)] text-amber-600 flex items-center justify-center shadow-md shadow-stone-900/10 transition-transform active:scale-90 ${
          shankhBlowing ? 'scale-110 ring-4 ring-amber-400/40' : 'hover:scale-105'
        }`}
        title="शंखनाद (Conch Tone)"
      >
        <Wind className="w-5 h-5" />
      </button>

      {/* Diya Light Toggle */}
      <button
        onClick={toggleDiyaGlow}
        aria-label="Toggle Diya Aura (दीप प्रज्वलन)"
        className={`w-11 h-11 rounded-full border border-amber-200/40 bg-[var(--card-main)] flex items-center justify-center shadow-md transition-transform active:scale-90 ${
          diyaGlow
            ? 'text-amber-500 ring-2 ring-amber-500/50 bg-amber-500/10'
            : 'text-[var(--text-secondary)] hover:scale-105'
        }`}
        title="दीप ज्योत (Diya Glow)"
      >
        <Flame className={`w-5 h-5 ${diyaGlow ? 'fill-amber-500 animate-pulse' : ''}`} />
      </button>
    </div>
  );
}
