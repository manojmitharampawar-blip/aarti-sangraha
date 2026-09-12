'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Wind, ChevronLeft, ChevronRight } from 'lucide-react';
import { playTempleBell, playShankh } from '@/lib/audioBell';
import { useThemeContext } from '@/components/ThemeProvider';
import { useScrollDirection } from '@/hooks/useScrollDirection';

export function RitualBar() {
  const pathname = usePathname();
  const [bellRinging, setBellRinging] = useState(false);
  const [shankhBlowing, setShankhBlowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { diyaGlow, toggleDiyaGlow, zenMode } = useThemeContext();
  const isNavVisible = useScrollDirection(8);

  if (zenMode) return null;

  const handleRingBell = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBellRinging(true);
    playTempleBell({ enableHaptics: true, volume: 0.65 });
    setTimeout(() => setBellRinging(false), 600);
  };

  const handleBlowShankh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShankhBlowing(true);
    playShankh({ enableHaptics: true, volume: 0.7 });
    setTimeout(() => setShankhBlowing(false), 1500);
  };

  const handleToggleDiya = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleDiyaGlow();
  };

  return (
    <div
      className={`fixed z-30 transition-all duration-300 ease-in-out right-3 ${
        isNavVisible ? 'bottom-20' : 'bottom-4'
      }`}
    >
      <div className="flex items-center gap-1.5 p-1 rounded-full border border-amber-500/30 bg-[var(--card-main)] shadow-xl shadow-black/10">
        {/* Toggle Expand / Collapse Arrow */}
        <button
          onClick={() => setIsExpanded(prev => !prev)}
          aria-label={isExpanded ? 'Collapse pooja tray' : 'Expand pooja tray'}
          title={isExpanded ? 'पूजा थाळी बंद करा' : 'पूजा थाळी उघडा (Bell, Shankh, Diya)'}
          className="p-1.5 rounded-full text-saffron-600 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          {isExpanded ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-1 px-1">
              <span className="text-xs font-black text-saffron-600 font-devanagari">ॐ</span>
              <ChevronLeft className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            </div>
          )}
        </button>

        {/* Expandable Ritual Tray Instruments */}
        {isExpanded && (
          <div className="flex items-center gap-1.5 pr-1 animate-fade-in">
            {/* 1. Temple Bell (घंटी) */}
            <button
              onClick={handleRingBell}
              aria-label="Ring Temple Bell (घंटी)"
              title="घंटी वाजवा (Temple Bell)"
              className={`w-9 h-9 rounded-full border border-amber-400/50 bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-900 flex items-center justify-center shadow-md active:scale-90 transition-transform ${
                bellRinging ? 'animate-bell-swing' : 'hover:scale-105'
              }`}
            >
              <Bell className="w-4 h-4 fill-stone-900" />
            </button>

            {/* 2. Conch / Shankh (शंखनाद) */}
            <button
              onClick={handleBlowShankh}
              aria-label="Blow Shankh (शंख)"
              title="शंखनाद (Sacred Conch)"
              className={`w-9 h-9 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs active:scale-90 transition-transform ${
                shankhBlowing ? 'scale-110 ring-2 ring-blue-400' : 'hover:scale-105'
              }`}
            >
              <Wind className="w-4 h-4" />
            </button>

            {/* 3. Diya Aura (दीप प्रज्वलन) */}
            <button
              onClick={handleToggleDiya}
              aria-label="Toggle Diya Aura (दीप प्रज्वलन)"
              title={diyaGlow ? 'दीप शांत करा' : 'दीप प्रज्वलित करा'}
              className={`w-9 h-9 rounded-full border transition-all active:scale-90 ${
                diyaGlow
                  ? 'border-amber-500 bg-amber-500 text-stone-900 shadow-md shadow-amber-500/30'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-600 hover:scale-105'
              }`}
            >
              <span className="text-sm">🪔</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
