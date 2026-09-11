'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Type, Sun, Sparkles } from 'lucide-react';
import { Playlist, AartiItem } from '@/types';
import { aartis } from '@/data/aartis';
import { useThemeContext } from '@/components/ThemeProvider';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { AutoScrollPill } from '@/components/AutoScrollPill';
import { FontSizeModal } from '@/components/FontSizeModal';

interface PlaylistPlayerClientProps {
  playlist: Playlist;
}

export function PlaylistPlayerClient({ playlist }: PlaylistPlayerClientProps) {
  const { script, toggleScript, fontSize, diyaGlow } = useThemeContext();
  const { isLocked, isSupported: wakeLockSupported, requestLock, releaseLock } = useWakeLock();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState<string | null>(null);

  // Map playlist IDs to AartiItem objects
  const playlistAartis: AartiItem[] = playlist.aartiIds
    .map(id => aartis.find(a => a.id === id))
    .filter((a): a is AartiItem => !!a);

  const currentAarti = playlistAartis[currentIndex] || playlistAartis[0];

  const handleReachEnd = useCallback(() => {
    if (currentIndex < playlistAartis.length - 1) {
      const nextHymn = playlistAartis[currentIndex + 1];
      const nextTitle =
        script === 'devanagari' ? nextHymn.titleDevanagari : nextHymn.titleTransliteration;

      setTransitionMessage(`पुढील आरती: ${nextTitle} सुरू होत आहे...`);

      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'instant' });
        resetEndTrigger();
        setTransitionMessage(null);
      }, 1200);
    } else {
      stopAutoScroll();
      setTransitionMessage('पूजा संपन्न! (Pooja Completed) 🙏');
      setTimeout(() => setTransitionMessage(null), 3000);
    }
  }, [currentIndex, playlistAartis, script]);

  const {
    isScrolling,
    speed,
    setSpeed,
    toggle: toggleAutoScroll,
    stop: stopAutoScroll,
    resetEndTrigger,
  } = useAutoScroll(1, handleReachEnd);

  useEffect(() => {
    if (wakeLockSupported) {
      requestLock();
    }
    return () => {
      releaseLock();
    };
  }, [wakeLockSupported, requestLock, releaseLock]);

  // Scroll to top when switching step
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex]);

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetEndTrigger();
    }
  };

  const goToNext = () => {
    if (currentIndex < playlistAartis.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetEndTrigger();
    }
  };

  return (
    <div className={`space-y-6 max-w-lg mx-auto pb-16 transition-all ${diyaGlow ? 'diya-aura' : ''}`}>
      {/* Floating Transition Alert */}
      {transitionMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-amber-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-amber-400">
          <Sparkles className="w-4 h-4 text-yellow-200" />
          <span>{transitionMessage}</span>
        </div>
      )}

      {/* Header & Playlist Stepper Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
        <Link
          href="/playlists"
          aria-label="Back to playlists"
          className="p-2 -ml-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Step Progress Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 text-saffron-600 text-xs font-bold">
          <span>आरती {currentIndex + 1} / {playlistAartis.length}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {wakeLockSupported && (
            <button
              onClick={() => (isLocked ? releaseLock() : requestLock())}
              aria-label="Toggle wake lock"
              title="Keep screen awake"
              className={`p-2 rounded-xl border text-xs font-semibold ${
                isLocked
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-600'
                  : 'border-[var(--border-main)] text-[var(--text-secondary)]'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={toggleScript}
            aria-label="Switch script"
            className="px-2.5 py-1.5 rounded-xl border text-xs font-bold border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)]"
          >
            {script === 'devanagari' ? 'मराठी' : 'ENG'}
          </button>

          <button
            onClick={() => setIsFontModalOpen(true)}
            aria-label="Adjust font size"
            className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)]"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-saffron-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / playlistAartis.length) * 100}%` }}
        />
      </div>

      {/* Aarti Title */}
      <div className="text-center space-y-1 pt-1">
        <p className="text-xs font-semibold text-saffron-600">
          {script === 'devanagari' ? playlist.titleDevanagari : playlist.title}
        </p>
        <h1
          style={{ fontSize: `${Math.min(fontSize + 6, 32)}px` }}
          className="font-extrabold text-[var(--text-primary)] font-devanagari leading-snug"
        >
          {script === 'devanagari' ? currentAarti.titleDevanagari : currentAarti.titleTransliteration}
        </h1>
      </div>

      {/* Aarti Lyrics Canvas */}
      <article
        style={{ fontSize: `${fontSize}px`, lineHeight: '1.9' }}
        className="space-y-6 pt-2 font-devanagari text-center"
      >
        {currentAarti.stanzas.map((stanza, sIdx) => {
          const lines = script === 'devanagari' ? stanza.devanagari : stanza.transliteration;
          return (
            <div
              key={sIdx}
              className={`p-4 rounded-2xl ${
                stanza.isChorus
                  ? 'bg-amber-500/5 border border-amber-500/20 font-bold'
                  : ''
              }`}
            >
              {lines.map((line, lIdx) => (
                <p
                  key={lIdx}
                  className={`${
                    stanza.isChorus ? 'text-saffron-700 dark:text-saffron-300 font-bold' : 'text-[var(--text-primary)]'
                  } tracking-wide`}
                >
                  {line}
                </p>
              ))}
            </div>
          );
        })}
      </article>

      {/* Consecutive Flow Steppers */}
      <div className="flex items-center justify-between gap-3 pt-6 border-t border-[var(--border-main)]">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] font-bold text-sm text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-saffron-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>मागील (Previous)</span>
        </button>

        {currentIndex < playlistAartis.length - 1 ? (
          <button
            onClick={goToNext}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-sm shadow-md shadow-saffron-600/20 active:scale-98 transition-transform"
          >
            <span>पुढील (Next)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md">
            <CheckCircle className="w-4 h-4" />
            <span>पूजा संपन्न (Complete)</span>
          </div>
        )}
      </div>

      {/* Auto Scroll Floating Pill */}
      <AutoScrollPill
        isScrolling={isScrolling}
        speed={speed}
        onToggle={toggleAutoScroll}
        onSpeedChange={setSpeed}
      />

      <FontSizeModal isOpen={isFontModalOpen} onClose={() => setIsFontModalOpen(false)} />
    </div>
  );
}
