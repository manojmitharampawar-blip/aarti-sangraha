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
import { useVoiceChantingFollower } from '@/hooks/useVoiceChantingFollower';
import { AutoScrollPill } from '@/components/AutoScrollPill';
import { ReadingSettingsModal } from '@/components/ReadingSettingsModal';
import { VirtualAartiModal } from '@/components/VirtualAartiModal';
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
    autoScrollSpeed,
    cycleAutoScrollSpeed,
  } = useThemeContext();
  const { isLocked, isSupported: wakeLockSupported, requestLock, releaseLock } = useWakeLock();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeStanzaIndex, setActiveStanzaIndex] = useState(0);
  const [isReadingSettingsOpen, setIsReadingSettingsOpen] = useState(false);
  const [isVirtualAartiOpen, setIsVirtualAartiOpen] = useState(false);
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
  const orderedAartis: AartiItem[] = deityInfo
    ? aartis.filter(a => a.deity === deityInfo.id)
    : (customGroup?.aartiIds
        ?.map(id => aartis.find(a => a.id === id))
        ?.filter((a): a is AartiItem => !!a) || []);

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

  const handleReachEnd = useCallback(() => {
    if (currentIndex < orderedAartis.length - 1) {
      setPendingNextAarti(orderedAartis[currentIndex + 1]);
    } else {
      setIsCompletedToast(true);
      setTimeout(() => setIsCompletedToast(false), 4000);
    }
  }, [currentIndex, orderedAartis]);

  const {
    isScrolling,
    speed,
    setSpeed,
    start: startAutoScroll,
    stop: stopAutoScroll,
    toggle: toggleAutoScroll,
    resetEndTrigger,
  } = useAutoScroll(autoScrollSpeed, handleReachEnd);

  // Phase 4: Hands-free Voice-Activated Chanting Follower (AI)
  const {
    isActive: isVoiceFollowerActive,
    isChanting,
    lastRecognizedPhrase,
    errorMessage: voiceFollowerError,
    clearErrorMessage: clearVoiceFollowerError,
    toggleFollower: toggleVoiceFollowerRaw,
  } = useVoiceChantingFollower({
    stanzas: currentAarti?.stanzas || [],
    onVoiceActivityChange: isChantingNow => {
      if (isChantingNow) {
        startAutoScroll();
      }
    },
    onStanzaMatch: matchedIndex => {
      setActiveStanzaIndex(matchedIndex);
      const el = document.getElementById(`group-stanza-${matchedIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
  });

  const toggleVoiceFollower = useCallback(() => {
    if (isVoiceFollowerActive) {
      toggleVoiceFollowerRaw();
      stopAutoScroll();
    } else {
      toggleVoiceFollowerRaw();
      startAutoScroll();
    }
  }, [isVoiceFollowerActive, toggleVoiceFollowerRaw, startAutoScroll, stopAutoScroll]);

  const proceedToNext = useCallback(() => {
    stopAutoScroll();
    setPendingNextAarti(null);
    setCurrentIndex(prev => prev + 1);
    setActiveStanzaIndex(0);
    resetEndTrigger();
  }, [stopAutoScroll, resetEndTrigger]);

  const cancelCountdown = useCallback(() => {
    setPendingNextAarti(null);
  }, []);

  // Keep autoScroll speed synced with ThemeContext
  useEffect(() => {
    setSpeed(autoScrollSpeed);
  }, [autoScrollSpeed, setSpeed]);

  useEffect(() => {
    requestLock();
    return () => {
      releaseLock();
    };
  }, [requestLock, releaseLock]);

  // When auto navigation or voice follower is active, keep screen display awake
  useEffect(() => {
    if (isScrolling || isVoiceFollowerActive) {
      requestLock();
    }
  }, [isScrolling, isVoiceFollowerActive, requestLock]);

  const goToPrev = () => {
    if (currentIndex > 0) {
      stopAutoScroll();
      setCurrentIndex(prev => prev - 1);
      setActiveStanzaIndex(0);
    }
  };

  const goToNext = () => {
    if (currentIndex < orderedAartis.length - 1) {
      stopAutoScroll();
      setCurrentIndex(prev => prev + 1);
      setActiveStanzaIndex(0);
    }
  };

  // Dedicated cross-platform scroll to top on aarti switch (iOS Safari, Android Chrome & Edge)
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    scrollToTop();
    const frameId = requestAnimationFrame(scrollToTop);
    const timerId = setTimeout(scrollToTop, 60);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
    };
  }, [currentIndex]);

  if (!isLoaded && groupId) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-[var(--text-secondary)] text-sm">संग्रह लोड होत आहे...</p>
      </div>
    );
  }

  if (orderedAartis.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-[var(--text-secondary)]">
          {customGroup
            ? 'या संग्रहात अद्याप कोणत्याही आरत्या जोडलेल्या नाहीत.'
            : 'या देवतेसाठी आरत्या सापडल्या नाहीत.'}
        </p>
        <Link href="/groups" className="text-saffron-600 font-bold underline">
          माझे वैयक्तिक संग्रह यादीकडे परत जा
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-32">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <Link
          href="/groups"
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 -ml-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>संग्रह (Collections)</span>
        </Link>

        <div className="flex items-center gap-1.5">
          {/* Quick Script Toggle Button */}
          <button
            onClick={toggleScript}
            aria-label="Toggle script view"
            title="मराठी / Dual / English लिपी बदला"
            className="px-2.5 py-1.5 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-xs font-bold text-[var(--text-primary)] hover:border-saffron-500/50"
          >
            {script === 'devanagari' ? (
              'मराठी'
            ) : script === 'dual' ? (
              <span className="flex items-center gap-1 text-saffron-600">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Dual
              </span>
            ) : (
              'ENG'
            )}
          </button>

          {/* Touchless Virtual Aarti Camera Trigger (AI) */}
          <button
            onClick={() => setIsVirtualAartiOpen(true)}
            aria-label="Open touchless virtual aarti"
            title="स्पर्शविरहित व्हर्च्युअल आरती (AI कॅमेरा हस्तमुद्रा)"
            className="p-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          </button>

          {/* Reading Aa Button */}
          <button
            onClick={() => setIsReadingSettingsOpen(true)}
            aria-label="Adjust reading font and paper theme"
            title="वाचन व अक्षर रचना (Aa)"
            className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] hover:border-saffron-500/50"
          >
            <Type className="w-4 h-4 text-saffron-600" />
          </button>

          {/* Edit Group Button (Only for custom groups) */}
          {customGroup && (
            <>
              <button
                onClick={() => setIsEditorOpen(true)}
                aria-label="Edit custom group"
                title="संग्रह संपादन करा"
                className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:text-saffron-600 hover:border-saffron-500/50"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                aria-label="Share group on WhatsApp"
                title="व्हॉट्सअ‍ॅपवर संग्रह शेअर करा"
                className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:text-emerald-600 hover:border-emerald-500/50"
              >
                <Send className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Group Progress Indicator */}
      <div className="p-4 rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">
              {groupTitle}
            </span>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-saffron-500/10 text-saffron-700 dark:text-saffron-300">
            {currentIndex + 1} / {orderedAartis.length}
          </span>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-saffron-600 transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / orderedAartis.length) * 100}%` }}
          />
        </div>

        {/* Carousel / Quick Track Dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {orderedAartis.map((aarti, idx) => (
            <button
              key={aarti.id}
              onClick={() => {
                setCurrentIndex(idx);
                setActiveStanzaIndex(0);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                currentIndex === idx
                  ? 'bg-saffron-600 text-white shadow-xs'
                  : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {idx + 1}. {isDevanagari ? aarti.titleDevanagari : aarti.titleTransliteration}
            </button>
          ))}
        </div>
      </div>

      {/* Completion Toast Notification */}
      {isCompletedToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>अभिनंदन! या संग्रहातील सर्व आरत्या व स्तोत्रे संपन्न झाली आहेत.</span>
          </div>
          <button
            onClick={() => setIsCompletedToast(false)}
            className="text-[10px] underline ml-2 shrink-0"
          >
            बंद करा
          </button>
        </div>
      )}

      {/* Countdown to Next Hymn Overlay Modal */}
      {pendingNextAarti && (
        <NextAartiCountdown
          nextTitle={isDevanagari ? pendingNextAarti.titleDevanagari : pendingNextAarti.titleTransliteration}
          onProceed={proceedToNext}
          onCancel={cancelCountdown}
        />
      )}

      {/* Current Aarti Title */}
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

      {/* Devotional Audio, AI Voice Follower & Speech Recitation Toolbar */}
      <DevotionalAudioBar
        stanzas={currentAarti.stanzas}
        script={script === 'dual' ? 'devanagari' : script}
        isAutoScrolling={isScrolling}
        onToggleAutoScroll={toggleAutoScroll}
        autoScrollSpeed={speed}
        onCycleScrollSpeed={() => {
          const nextSpd = cycleAutoScrollSpeed();
          setSpeed(nextSpd);
        }}
        isVoiceFollowerActive={isVoiceFollowerActive}
        isVoiceChanting={isChanting}
        onToggleVoiceFollower={toggleVoiceFollower}
        onStanzaChange={stanzaIndex => {
          setActiveStanzaIndex(stanzaIndex);
          const el = document.getElementById(`group-stanza-${stanzaIndex}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
        onSpeechComplete={handleReachEnd}
      />

      {/* Live Voice Follower Chanting Feedback Banner */}
      {isVoiceFollowerActive && (
        <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-800 dark:text-emerald-200 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isChanting ? 'bg-emerald-500 animate-ping' : 'bg-emerald-400'}`} />
            <span className="font-semibold">
              {isChanting ? '🎙️ गायन सुरू • वाणी स्क्रोल चालू (AI)' : '🎙️ आवाज ऐकत आहे... (गायन सुरू करा)'}
            </span>
          </div>
          {lastRecognizedPhrase && (
            <span className="text-[11px] font-medium opacity-85 truncate max-w-[160px] sm:max-w-xs font-devanagari">
              &quot;{lastRecognizedPhrase}&quot;
            </span>
          )}
        </div>
      )}

      {/* Voice Follower Error / Permission Banner */}
      {voiceFollowerError && (
        <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-800 dark:text-rose-200 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <span className="font-medium">{voiceFollowerError}</span>
          </div>
          <button
            onClick={clearVoiceFollowerError}
            aria-label="Dismiss error"
            className="p-1 rounded-lg hover:bg-rose-500/20 transition-colors shrink-0 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

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
              id={`group-stanza-${sIdx}`}
              onClick={() => setActiveStanzaIndex(sIdx)}
              className={`p-4 sm:p-5 rounded-3xl transition-all cursor-pointer ${
                stanza.isChorus
                  ? 'bg-amber-500/10 border-2 border-amber-500/30 font-bold'
                  : isActive ? 'border-2 border-saffron-500/80 bg-[var(--card-main)] shadow-sm' : 'border border-[var(--border-main)] bg-[var(--card-main)]'
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
                    {stanza.transliteration[lIdx] && (
                      <p className="text-xs sm:text-sm font-sans text-[var(--text-secondary)] italic opacity-90">
                        {stanza.transliteration[lIdx]}
                      </p>
                    )}
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

      {/* Consecutive Flow Steppers */}
      <div className="flex items-center justify-between gap-3 pt-6 border-t border-[var(--border-main)]">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:border-saffron-500 transition-colors"
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

      {/* Auto Scroll & AI Controls Floating Pill */}
      <AutoScrollPill
        isScrolling={isScrolling}
        speed={speed}
        onToggle={toggleAutoScroll}
        onSpeedChange={setSpeed}
        isVoiceFollowerActive={isVoiceFollowerActive}
        isVoiceChanting={isChanting}
        onToggleVoiceFollower={toggleVoiceFollower}
        onOpenVirtualAarti={() => setIsVirtualAartiOpen(true)}
      />

      <ReadingSettingsModal
        isOpen={isReadingSettingsOpen}
        onClose={() => setIsReadingSettingsOpen(false)}
      />

      {/* Touchless Virtual Aarti Camera Modal (AI) */}
      <VirtualAartiModal
        isOpen={isVirtualAartiOpen}
        onClose={() => setIsVirtualAartiOpen(false)}
        aarti={currentAarti}
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
