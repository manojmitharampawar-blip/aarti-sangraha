'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Type,
  Sun,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Share2,
  ChevronRight,
  FolderPlus,
  Bell,
  Play,
  Pause,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { AartiItem } from '@/types';
import { useThemeContext } from '@/components/ThemeProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { ReadingSettingsModal } from '@/components/ReadingSettingsModal';
import { AddToGroupModal } from '@/components/AddToGroupModal';
import { DevotionalAudioBar } from '@/components/DevotionalAudioBar';
import { NextAartiCountdown } from '@/components/NextAartiCountdown';
import { getHymnTypeBadge } from '@/components/AartiCard';
import { deities } from '@/data/deities';
import { playTempleBell } from '@/lib/audioBell';

interface AartiReaderClientProps {
  aarti: AartiItem;
  nextAarti?: AartiItem;
}

export function AartiReaderClient({ aarti, nextAarti }: AartiReaderClientProps) {
  const router = useRouter();
  const {
    script,
    toggleScript,
    fontSize,
    fontFamily,
    lineSpacing,
    textAlign,
    spotlightMode,
    zenMode,
    toggleZenMode,
    diyaGlow,
  } = useThemeContext();

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isLocked, isSupported: wakeLockSupported, requestLock, releaseLock } = useWakeLock();

  const [isReadingSettingsOpen, setIsReadingSettingsOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNextCountdown, setShowNextCountdown] = useState(false);
  const [activeStanzaIndex, setActiveStanzaIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bellRung, setBellRung] = useState(false);

  const favorited = isFavorite(aarti.id);
  const deityInfo = deities.find(d => d.id === aarti.deity);
  const isDevanagari = script === 'devanagari';
  const isDual = script === 'dual';
  const typeBadge = getHymnTypeBadge(aarti.type, isDevanagari);

  // Calculate estimated recitation time (~6-7 lines per minute)
  const totalLines = aarti.stanzas.reduce((sum, s) => sum + s.devanagari.length, 0);
  const estimatedMinutes = Math.max(1, Math.round(totalLines / 7));

  // Dynamic font family class
  const fontClass =
    fontFamily === 'serif'
      ? 'font-grantha'
      : fontFamily === 'mukta'
      ? 'font-mukta'
      : 'font-devanagari';

  // Dynamic line height
  const lineHeightStyle =
    lineSpacing === 'compact' ? '1.85' : lineSpacing === 'relaxed' ? '2.6' : '2.2';

  // Track scroll progress and auto-update active stanza
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((scrollY / docHeight) * 100)));
        setScrollProgress(progress);
      }

      // Detect active stanza via bounding box
      const stanzaElements = document.querySelectorAll<HTMLElement>('[data-stanza-index]');
      stanzaElements.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.25) {
          setActiveStanzaIndex(idx);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleReachEnd = useCallback(() => {
    if (nextAarti) {
      setShowNextCountdown(true);
    }
  }, [nextAarti]);

  const {
    isScrolling,
    speed,
    setSpeed,
    toggle: toggleAutoScroll,
  } = useAutoScroll(1, handleReachEnd);

  const proceedToNext = useCallback(() => {
    if (nextAarti) {
      setShowNextCountdown(false);
      router.push(`/aarti/${nextAarti.slug}`);
    }
  }, [nextAarti, router]);

  const cancelCountdown = useCallback(() => {
    setShowNextCountdown(false);
  }, []);

  // Auto request wakeLock on mount if supported
  useEffect(() => {
    if (wakeLockSupported) {
      requestLock();
    }
    return () => {
      releaseLock();
    };
  }, [wakeLockSupported, requestLock, releaseLock]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: aarti.titleDevanagari,
          text: `आरती व स्तोत्र संग्रह: ${aarti.titleDevanagari}\n${aarti.firstLineDevanagari}`,
          url: window.location.href,
        });
      } catch {
        // ignore share cancellation
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBellRing = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTempleBell({ enableHaptics: true, volume: 0.65 });
    setBellRung(true);
    setTimeout(() => setBellRung(false), 600);
  };

  return (
    <div className={`space-y-6 max-w-lg mx-auto pb-28 transition-all ${diyaGlow ? 'diya-aura' : ''}`}>
      {/* 1. Thin Kindle-Style Reading Progress Line (Pinned to Top) */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/5 dark:bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-saffron-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Gentle Next Aarti Countdown */}
      {showNextCountdown && nextAarti && (
        <NextAartiCountdown
          nextTitle={isDevanagari ? nextAarti.titleDevanagari : nextAarti.titleTransliteration}
          totalSeconds={12}
          onProceed={proceedToNext}
          onCancel={cancelCountdown}
        />
      )}

      {/* 2. Reader Top Action Bar (Auto-hides gracefully in Zen mode) */}
      {!zenMode && (
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)] animate-fade-in">
          <Link
            href="/"
            aria-label="Back to home"
            className="p-2 -ml-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5">
            {/* WakeLock Status Indicator */}
            {wakeLockSupported && (
              <button
                onClick={() => (isLocked ? releaseLock() : requestLock())}
                aria-label={`Screen wake lock is ${isLocked ? 'active' : 'inactive'}. Tap to toggle.`}
                title={isLocked ? 'स्क्रीन चालू आहे' : 'स्क्रीन चालू ठेवा'}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                  isLocked
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-600'
                    : 'border-[var(--border-main)] text-[var(--text-secondary)]'
                }`}
              >
                <Sun className={`w-4 h-4 ${isLocked ? 'animate-spin-slow text-amber-500' : ''}`} />
              </button>
            )}

            {/* Add to Group Button */}
            <button
              onClick={() => setIsGroupModalOpen(true)}
              aria-label="Add to custom group"
              title="ग्रुपमध्ये जोडा"
              className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] hover:border-saffron-500/50"
            >
              <FolderPlus className="w-4 h-4 text-saffron-600" />
            </button>

            {/* Script Switcher (Devanagari, Dual, English) */}
            <button
              onClick={toggleScript}
              aria-label="Switch script"
              title="लिपी बदला (मराठी / दोन्ही एकत्र / English)"
              className="px-2.5 py-1.5 rounded-xl border text-xs font-bold border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] flex items-center gap-1"
            >
              {script === 'dual' ? (
                <>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>दोन्ही</span>
                </>
              ) : script === 'devanagari' ? (
                'मराठी'
              ) : (
                'ENG'
              )}
            </button>

            {/* Reading & Typography Aa Button */}
            <button
              onClick={() => setIsReadingSettingsOpen(true)}
              aria-label="Adjust reading font and paper theme"
              title="वाचन व अक्षर रचना (Kindle Aa)"
              className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] hover:border-saffron-500/50"
            >
              <Type className="w-4 h-4 text-saffron-600" />
            </button>

            {/* Favorite Toggle */}
            <button
              onClick={() => toggleFavorite(aarti.id)}
              aria-label={favorited ? 'Remove favorite' : 'Add to favorite'}
              title={favorited ? 'आवडत्यामधून काढा' : 'आवडत्यामध्ये जोडा'}
              className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/50"
            >
              <Heart
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  favorited ? 'fill-rose-500 text-rose-500' : 'text-[var(--text-secondary)]'
                }`}
              />
            </button>

            {/* Zen Mode Button */}
            <button
              onClick={toggleZenMode}
              aria-label="Toggle Zen reading mode"
              title="वाचन ध्यान मोड (Distraction-free)"
              className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:border-saffron-500/50"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              aria-label="Share hymn"
              title="शेअर करा"
              className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:border-saffron-500/50"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* In Zen mode: Minimal floating exit button */}
      {zenMode && (
        <div className="fixed top-4 right-4 z-40 animate-fade-in">
          <button
            onClick={toggleZenMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-md shadow-lg"
            title="ध्यान मोडमधून बाहेर पडा"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>बाहेर पडा</span>
          </button>
        </div>
      )}

      {copied && (
        <div className="text-center text-xs font-semibold py-1.5 px-3 rounded-lg bg-emerald-500/10 text-emerald-600">
          लिंक कॉपी झाली (Link copied to clipboard)
        </div>
      )}

      {/* Aarti Header Title & Reading Time Estimate */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800/80 border border-[var(--border-main)]">
          <span className="text-[var(--text-primary)]">
            {deityInfo ? (isDevanagari ? deityInfo.nameDevanagari : deityInfo.nameTransliteration) : aarti.deity}
          </span>
          <span className="opacity-40">•</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${typeBadge.className}`}>
            {typeBadge.label}
          </span>
          <span className="opacity-40">•</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-secondary)] font-medium">
            <Clock className="w-3 h-3 text-saffron-600" />
            <span>~{estimatedMinutes} मिनिटे</span>
          </span>
        </div>

        <h1
          style={{ fontSize: `${Math.min(fontSize + 8, 36)}px` }}
          className={`font-black text-[var(--text-primary)] leading-snug tracking-tight px-2 ${fontClass}`}
        >
          {isDevanagari ? aarti.titleDevanagari : aarti.titleTransliteration}
        </h1>

        {aarti.author && (
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            रचनाकार: {aarti.author}
          </p>
        )}
      </div>

      {/* Devotional Audio & Speech Recitation Toolbar */}
      <DevotionalAudioBar
        stanzas={aarti.stanzas}
        script={script === 'dual' ? 'devanagari' : script}
      />

      {/* Aarti / Stotra Lyrics Canvas with Kindle-Grade Typography & Spotlight Focus */}
      <article
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeightStyle,
          textAlign: textAlign,
        }}
        className={`space-y-6 pt-2 ${fontClass}`}
      >
        {aarti.stanzas.map((stanza, sIdx) => {
          const isActive = activeStanzaIndex === sIdx;
          const isSpotlightApplied = spotlightMode;

          return (
            <div
              key={sIdx}
              data-stanza-index={sIdx}
              onClick={() => setActiveStanzaIndex(sIdx)}
              className={`p-4 sm:p-5 rounded-3xl transition-all cursor-pointer relative ${
                stanza.isChorus
                  ? 'bg-amber-500/10 border-2 border-amber-500/30'
                  : 'border border-[var(--border-main)] bg-[var(--card-main)]'
              } ${
                isSpotlightApplied
                  ? isActive
                    ? 'stanza-spotlight-active'
                    : 'stanza-spotlight-dimmed'
                  : ''
              }`}
            >
              {/* Section Header or Chorus Indicator */}
              <div className="flex items-center justify-between gap-2 mb-3">
                {stanza.sectionTitle ? (
                  <span className="text-xs font-extrabold uppercase tracking-wider text-saffron-700 dark:text-saffron-300 py-0.5 px-3 rounded-full bg-saffron-500/15 border border-saffron-500/25">
                    {stanza.sectionTitle}
                  </span>
                ) : stanza.isChorus ? (
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 py-0.5 px-2.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                    ॥ ध्रुवपद (Chorus) ॥
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-saffron-600/70">
                    ॥ चरण {sIdx + 1} ॥
                  </span>
                )}

                {isActive && spotlightMode && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-saffron-600 uppercase tracking-widest animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron-500" />
                    <span>चालू कडवे</span>
                  </span>
                )}
              </div>

              {/* Stanza Lines: Dual-Script Interlinear or Single Script */}
              <div className="space-y-2">
                {isDual ? (
                  /* Interlinear Mode: Devanagari line + phonetic English underneath */
                  stanza.devanagari.map((devLine, lIdx) => (
                    <div key={lIdx} className="space-y-0.5">
                      <p
                        className={`font-semibold tracking-wide ${
                          stanza.isChorus
                            ? 'text-saffron-700 dark:text-saffron-300 font-bold'
                            : 'text-[var(--text-primary)]'
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
                  /* Devanagari Only */
                  stanza.devanagari.map((line, lIdx) => (
                    <p
                      key={lIdx}
                      className={`font-semibold tracking-wide ${
                        stanza.isChorus
                          ? 'text-saffron-700 dark:text-saffron-300 font-bold'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {line}
                    </p>
                  ))
                ) : (
                  /* English Transliteration Only */
                  stanza.transliteration.map((line, lIdx) => (
                    <p
                      key={lIdx}
                      className={`font-medium tracking-wide ${
                        stanza.isChorus
                          ? 'text-saffron-700 dark:text-saffron-300 font-bold'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {line}
                    </p>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </article>

      {/* Meaning & Significance Accordion */}
      {aarti.meaningSummary && (
        <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] overflow-hidden">
          <button
            onClick={() => setShowMeaning(prev => !prev)}
            aria-expanded={showMeaning}
            className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-saffron-600" />
              <span>भावार्थ व महत्त्व (Meaning & Significance)</span>
            </div>
            {showMeaning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showMeaning && (
            <div className="p-4 pt-1 border-t border-[var(--border-main)] text-sm text-[var(--text-secondary)] leading-relaxed font-devanagari">
              {aarti.meaningSummary}
            </div>
          )}
        </div>
      )}

      {/* Next Recommended Hymn in Sequence */}
      {nextAarti && (
        <div className="pt-4">
          <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
            पुढील उपासना (Next Upasana)
          </p>
          <Link
            href={`/aarti/${nextAarti.slug}`}
            className="flex items-center justify-between p-4 rounded-2xl border border-saffron-500/30 bg-gradient-to-r from-saffron-500/10 to-amber-500/5 hover:border-saffron-500 group transition-all"
          >
            <div>
              <p className="text-xs text-saffron-600 font-semibold">पुढील उपासना क्रम</p>
              <h3 className="text-base font-bold text-[var(--text-primary)] font-devanagari">
                {isDevanagari ? nextAarti.titleDevanagari : nextAarti.titleTransliteration}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-saffron-600 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      )}

      {/* 3. Apple Books-Inspired Liquid Glass Floating Island HUD */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md">
        <div className="p-2 rounded-full border border-[var(--border-main)]/80 liquid-glass-island shadow-2xl flex items-center justify-between gap-2 px-3">
          {/* Stanza Counter Step */}
          <div className="flex items-center gap-1.5 pl-1 text-xs font-bold text-[var(--text-primary)]">
            <span className="text-saffron-600 font-devanagari">चरण</span>
            <span>{activeStanzaIndex + 1}/{aarti.stanzas.length}</span>
            <span className="text-[10px] text-[var(--text-secondary)] font-normal hidden sm:inline">
              ({scrollProgress}%)
            </span>
          </div>

          {/* Quick Temple Bell Chime */}
          <button
            onClick={handleBellRing}
            aria-label="Ring sacred temple bell"
            title="घंटा वाजवा"
            className={`p-2 rounded-full border border-amber-500/30 bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 active:scale-90 transition-all ${
              bellRung ? 'animate-bell-swing' : ''
            }`}
          >
            <Bell className="w-4 h-4 fill-current" />
          </button>

          {/* Auto-scroll Play / Pause Toggle */}
          <button
            onClick={toggleAutoScroll}
            aria-label={isScrolling ? 'Pause auto scroll' : 'Start auto scroll'}
            title={isScrolling ? 'स्क्रोल थांबवा' : 'ऑटो-स्क्रोल सुरू करा'}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              isScrolling
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'bg-saffron-600 text-white shadow-md shadow-saffron-600/30'
            }`}
          >
            {isScrolling ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>{speed}x</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>स्क्रोल</span>
              </>
            )}
          </button>

          {/* Reading Aa Settings Button */}
          <button
            onClick={() => setIsReadingSettingsOpen(true)}
            aria-label="Reading settings"
            title="वाचन रचना (Aa)"
            className="p-2 rounded-full border border-[var(--border-main)] hover:border-saffron-500 text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Zen Mode Button */}
          <button
            onClick={toggleZenMode}
            aria-label="Toggle Zen mode"
            title={zenMode ? 'सामान्य मोड' : 'ध्यान वाचन मोड'}
            className={`p-2 rounded-full border transition-colors ${
              zenMode
                ? 'border-saffron-500 bg-saffron-500/10 text-saffron-600'
                : 'border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {zenMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Reading & Typography Aa Settings Modal */}
      <ReadingSettingsModal
        isOpen={isReadingSettingsOpen}
        onClose={() => setIsReadingSettingsOpen(false)}
      />

      {/* Add To Custom Group Modal */}
      <AddToGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        aarti={aarti}
      />
    </div>
  );
}
