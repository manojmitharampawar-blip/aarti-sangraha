'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Type,
  Sun,
  Edit3,
  Send,
  Sparkles,
} from 'lucide-react';
import { AartiItem, CustomGroup } from '@/types';
import { aartis } from '@/data/aartis';
import { deities } from '@/data/deities';
import { useCustomGroups } from '@/hooks/useCustomGroups';
import { useThemeContext } from '@/components/ThemeProvider';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { AutoScrollPill } from '@/components/AutoScrollPill';
import { ReadingSettingsModal } from '@/components/ReadingSettingsModal';
import { GroupEditorModal } from '@/components/GroupEditorModal';
import { ShareGroupModal } from '@/components/ShareGroupModal';
import { NextAartiCountdown } from '@/components/NextAartiCountdown';
import { DevotionalAudioBar } from '@/components/DevotionalAudioBar';

function GroupPlayerContent() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get('id');
  const deityId = searchParams.get('deity');

  const { groups, isLoaded } = useCustomGroups();
  const {
    script,
    toggleScript,
    fontSize,
    fontFamily,
    lineSpacing,
    textAlign,
    spotlightMode,
    diyaGlow,
  } = useThemeContext();
  const { isLocked, isSupported: wakeLockSupported, requestLock, releaseLock } = useWakeLock();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeStanzaIndex, setActiveStanzaIndex] = useState(0);
  const [isReadingSettingsOpen, setIsReadingSettingsOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [pendingNextAarti, setPendingNextAarti] = useState<AartiItem | null>(null);
  const [isCompletedToast, setIsCompletedToast] = useState(false);

  // Deity-based virtual group vs Custom localStorage group
  const deityInfo = deityId ? deities.find(d => d.id === deityId) : null;
  const customGroup = groupId ? groups.find(g => g.id === groupId) : null;

  const groupTitle = deityInfo
    ? (script === 'devanagari' ? `${deityInfo.nameDevanagari} आरती संग्रह` : `${deityInfo.nameTransliteration} Aartis`)
    : (customGroup?.name || 'आरती संग्रह');

  // Map group's ordered aartiIds or filter by deity
  const orderedAartis: AartiItem[] = deityId
    ? aartis.filter(a => a.deity === deityId)
    : (customGroup?.aartiIds || [])
        .map(id => aartis.find(a => a.id === id))
        .filter((a): a is AartiItem => !!a);

  const currentAarti = orderedAartis[currentIndex] || orderedAartis[0];

  const fontClass =
    fontFamily === 'serif'
      ? 'font-grantha'
      : fontFamily === 'mukta'
      ? 'font-mukta'
      : 'font-devanagari';

  const lineHeightStyle =
    lineSpacing === 'compact' ? '1.85' : lineSpacing === 'relaxed' ? '2.6' : '2.2';

  const isDevanagari = script === 'devanagari';
  const isDual = script === 'dual';

  // Transition handler when user or timer confirms moving to next aarti
  const proceedToNext = useCallback(() => {
    setPendingNextAarti(null);
    setCurrentIndex(prev => prev + 1);
    setActiveStanzaIndex(0);
    window.scrollTo({ top: 0, behavior: 'instant' });
    resetEndTrigger();
  }, []);

  const cancelCountdown = useCallback(() => {
    setPendingNextAarti(null);
  }, []);

  // Callback when auto-scrolling reaches the bottom of the current aarti
  const handleReachEnd = useCallback(() => {
    if (currentIndex < orderedAartis.length - 1) {
      const nextHymn = orderedAartis[currentIndex + 1];
      setPendingNextAarti(nextHymn);
    } else {
      stopAutoScroll();
      setIsCompletedToast(true);
      setTimeout(() => setIsCompletedToast(false), 4000);
    }
  }, [currentIndex, orderedAartis]);

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

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setActiveStanzaIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNext = () => {
    if (currentIndex < orderedAartis.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setActiveStanzaIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCompletedToast(true);
      setTimeout(() => setIsCompletedToast(false), 4000);
    }
  };

  if (!isLoaded) {
    return (
      <div className="text-center py-12 text-sm text-[var(--text-secondary)]">
        लोड होत आहे...
      </div>
    );
  }

  if (orderedAartis.length === 0 || !currentAarti) {
    return (
      <div className="space-y-6 max-w-lg mx-auto text-center py-16 px-4">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          या ग्रुपमध्ये कोणत्याही आरत्या आढळल्या नाहीत.
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          कृपया ग्रुपमध्ये आरत्या जोडा किंवा क्रम संपादित करा.
        </p>
        <Link
          href="/groups"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 text-white font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ग्रुप यादीकडे परत जा</span>
        </Link>
      </div>
    );
  }

  const backLink = deityId ? `/deities?id=${deityId}` : '/groups';

  return (
    <div className={`space-y-6 max-w-lg mx-auto pb-24 transition-all ${diyaGlow ? 'diya-aura' : ''}`}>
      {/* Gentle Bottom Transition Countdown Banner */}
      {pendingNextAarti && (
        <NextAartiCountdown
          nextTitle={isDevanagari ? pendingNextAarti.titleDevanagari : pendingNextAarti.titleTransliteration}
          totalSeconds={12}
          onProceed={proceedToNext}
          onCancel={cancelCountdown}
        />
      )}

      {/* Completion Toast */}
      {isCompletedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span>पूजा संपन्न! संपूर्ण आरती संग्रह पूर्ण झाला. 🙏</span>
        </div>
      )}

      {/* Top App Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
        <Link
          href={backLink}
          aria-label="Back"
          className="p-2 -ml-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Step Counter Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 text-saffron-600 text-xs font-bold">
          <span>आरती {currentIndex + 1} / {orderedAartis.length}</span>
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

          {customGroup && (
            <button
              onClick={() => setIsShareModalOpen(true)}
              aria-label="Share group on WhatsApp"
              title="व्हॉट्सॲपवर शेअर करा"
              className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          )}

          {/* Edit Group Sequence (for custom groups) */}
          {customGroup && (
            <button
              onClick={() => setIsEditorOpen(true)}
              aria-label="Edit group sequence"
              title="Edit group sequence"
              className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)]"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={toggleScript}
            aria-label="Switch script"
            className="px-2.5 py-1.5 rounded-xl border text-xs font-bold border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] flex items-center gap-1"
          >
            {script === 'dual' ? (
              <>
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>दोन्ही</span>
              </>
            ) : isDevanagari ? (
              'मराठी'
            ) : (
              'ENG'
            )}
          </button>

          <button
            onClick={() => setIsReadingSettingsOpen(true)}
            aria-label="Adjust font size and reading theme"
            title="वाचन व अक्षर रचना (Aa)"
            className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)]"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Group Progress Bar */}
      <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-saffron-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / orderedAartis.length) * 100}%` }}
        />
      </div>

      {/* Aarti Title & Group Name */}
      <div className="text-center space-y-1 pt-1">
        <p className="text-xs font-semibold text-saffron-600 font-devanagari flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{groupTitle}</span>
        </p>
        <h1
          style={{ fontSize: `${Math.min(fontSize + 6, 34)}px` }}
          className={`font-black text-[var(--text-primary)] leading-snug ${fontClass}`}
        >
          {isDevanagari ? currentAarti.titleDevanagari : currentAarti.titleTransliteration}
        </h1>
        {currentAarti.author && (
          <p className="text-[11px] text-[var(--text-secondary)]">
            {currentAarti.author}
          </p>
        )}
      </div>

      {/* Devotional Audio & Speech Recitation Toolbar */}
      <DevotionalAudioBar
        stanzas={currentAarti.stanzas}
        script={script === 'dual' ? 'devanagari' : script}
        onSpeechComplete={handleReachEnd}
      />

      {/* Lyrics Canvas with Kindle Typography and Spotlight Focus */}
      <article
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeightStyle,
          textAlign: textAlign,
        }}
        className={`space-y-6 pt-2 ${fontClass}`}
      >
        {currentAarti.stanzas.map((stanza, sIdx) => {
          const isActive = activeStanzaIndex === sIdx;
          return (
            <div
              key={sIdx}
              onClick={() => setActiveStanzaIndex(sIdx)}
              className={`p-4 sm:p-5 rounded-3xl transition-all cursor-pointer ${
                stanza.isChorus
                  ? 'bg-amber-500/10 border-2 border-amber-500/30 font-bold'
                  : 'border border-[var(--border-main)] bg-[var(--card-main)]'
              } ${
                spotlightMode
                  ? isActive
                    ? 'stanza-spotlight-active'
                    : 'stanza-spotlight-dimmed'
                  : ''
              }`}
            >
              {stanza.sectionTitle && (
                <div className="text-xs font-extrabold uppercase tracking-wider text-saffron-700 dark:text-saffron-300 mb-2 py-0.5 px-3 rounded-full bg-saffron-500/15 inline-block">
                  {stanza.sectionTitle}
                </div>
              )}

              {isDual ? (
                stanza.devanagari.map((devLine, lIdx) => (
                  <div key={lIdx} className="space-y-0.5 my-1.5">
                    <p
                      className={`font-semibold tracking-wide ${
                        stanza.isChorus ? 'text-saffron-700 dark:text-saffron-300 font-bold' : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {devLine}
                    </p>
                    <p
                      style={{ fontSize: `${Math.max(13, fontSize - 6)}px` }}
                      className="text-[var(--text-secondary)] italic font-sans opacity-85"
                    >
                      {stanza.transliteration[lIdx] || ''}
                    </p>
                  </div>
                ))
              ) : isDevanagari ? (
                stanza.devanagari.map((line, lIdx) => (
                  <p
                    key={lIdx}
                    className={`font-semibold tracking-wide ${
                      stanza.isChorus ? 'text-saffron-700 dark:text-saffron-300 font-bold' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {line}
                  </p>
                ))
              ) : (
                stanza.transliteration.map((line, lIdx) => (
                  <p
                    key={lIdx}
                    className={`font-medium tracking-wide ${
                      stanza.isChorus ? 'text-saffron-700 dark:text-saffron-300 font-bold' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {line}
                  </p>
                ))
              )}
            </div>
          );
        })}
      </article>

      {/* Sequence Steppers */}
      <div className="flex items-center justify-between gap-3 pt-6 border-t border-[var(--border-main)]">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] font-bold text-xs text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-saffron-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>मागील (Prev)</span>
        </button>

        {currentIndex < orderedAartis.length - 1 ? (
          <button
            onClick={goToNext}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-md shadow-saffron-600/20 active:scale-98 transition-all"
          >
            <span>पुढील (Next)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md">
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

      <ReadingSettingsModal
        isOpen={isReadingSettingsOpen}
        onClose={() => setIsReadingSettingsOpen(false)}
      />

      {customGroup && (
        <ShareGroupModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          group={{
            name: customGroup.name,
            description: customGroup.description,
            aartiIds: customGroup.aartiIds,
          }}
        />
      )}

      {customGroup && (
        <GroupEditorModal
          key={customGroup.id}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          group={customGroup}
        />
      )}
    </div>
  );
}

export default function GroupPlayerPage() {
  return (
    <React.Suspense fallback={<div className="p-4 text-center text-xs">लोड होत आहे...</div>}>
      <GroupPlayerContent />
    </React.Suspense>
  );
}
