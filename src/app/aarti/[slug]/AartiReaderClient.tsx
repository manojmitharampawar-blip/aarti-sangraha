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
    autoScrollSpeed,
    cycleAutoScrollSpeed,
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
  } = useAutoScroll(autoScrollSpeed, handleReachEnd);

  // Keep auto-scroll speed synchronized with ThemeContext
  useEffect(() => {
    setSpeed(autoScrollSpeed);
  }, [autoScrollSpeed, setSpeed]);

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

  // On mobile & desktop scroll, track the visible stanza in reading viewport
  useEffect(() => {
    if (!spotlightMode || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-stanza-index"));
            if (!isNaN(idx)) {
              setActiveStanzaIndex(idx);
            }
          }
        });
      },
      { rootMargin: "-15% 0px -40% 0px", threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-stanza-index]");
    elements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [spotlightMode, aarti.id]);

  const handleBellRing = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTempleBell({ enableHaptics: true });
    setBellRung(true);
    setTimeout(() => setBellRung(false), 800);
  };

  return (
    <div className={`space-y-5 max-w-xl mx-auto pb-32 transition-all relative ${zenMode ? 'pt-4' : ''}`}>
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-amber-400 to-saffron-600 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Top Navigation & Toolbar (Hidden in Zen Mode for distraction-free chanting) */}
      {!zenMode && (
        <div className="flex items-center justify-between gap-2 pt-2 animate-fade-in">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 -ml-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>मागे (Home)</span>
          </Link>

          <div className="flex items-center gap-1.5">
            {/* Add to Custom Group */}
            <button
              onClick={() => setIsGroupModalOpen(true)}
              aria-label="Add to custom hymn group"
              title="माझ्या संग्रहात जोडा"
              className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:text-saffron-600 hover:border-saffron-500/50"
            >
              <FolderPlus className="w-4 h-4" />
            </button>

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

      {/* Devotional Audio, Natural Speech Recitation & Quick Auto-Scroll Toolbar */}
      <DevotionalAudioBar
        stanzas={aarti.stanzas}
        script={script === 'dual' ? 'devanagari' : script}
        isAutoScrolling={isScrolling}
        onToggleAutoScroll={toggleAutoScroll}
        autoScrollSpeed={speed}
        onCycleScrollSpeed={() => {
          const nextSpd = cycleAutoScrollSpeed();
          setSpeed(nextSpd);
        }}
        onStanzaChange={stanzaIndex => {
          setActiveStanzaIndex(stanzaIndex);
          const el = document.getElementById(`stanza-${stanzaIndex}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
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
              id={`stanza-${sIdx}`}
              data-stanza-index={sIdx}
              onClick={() => setActiveStanzaIndex(sIdx)}
              className={`p-4 sm:p-5 rounded-3xl transition-all cursor-pointer relative ${
                stanza.isChorus
                  ? 'bg-amber-500/10 border-2 border-amber-500/30'
                  : isActive
                  ? 'border-2 border-saffron-500/80 bg-[var(--card-main)] shadow-sm'
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
                            ? 'text-amber-950 dark:text-amber-100 font-bold'
                            : 'text-[var(--text-primary)]'
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
                ) : (
                  /* Single Script Mode */
                  (isDevanagari ? stanza.devanagari : stanza.transliteration).map(
                    (line, lIdx) => (
                      <p
                        key={lIdx}
                        className={`font-semibold tracking-wide ${
                          stanza.isChorus
                            ? 'text-amber-950 dark:text-amber-100 font-bold'
                            : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {line}
                      </p>
                    )
                  )
                )}
              </div>
            </div>
          );
        })}
      </article>

      {/* Meaning Accordion (Expandable) */}
      {aarti.meaningSummary && (
        <div className="rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] overflow-hidden transition-all shadow-xs">
          <button
            onClick={() => setShowMeaning(prev => !prev)}
            aria-expanded={showMeaning}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-devanagari">
                {isDevanagari ? 'भावार्थ व महत्त्व (Devotional Essence)' : 'Spiritual Meaning & Context'}
              </span>
            </div>
            {showMeaning ? (
              <ChevronUp className="w-4 h-4 text-[var(--text-secondary)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
            )}
          </button>

          {showMeaning && (
            <div className="p-4 pt-1 border-t border-[var(--border-main)] text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-2 animate-fade-in font-devanagari">
              <p>{aarti.meaningSummary}</p>
            </div>
          )}
        </div>
      )}

      {/* Next Up in Sequence Countdown Alert */}
      {showNextCountdown && nextAarti && (
        <NextAartiCountdown
          nextTitle={isDevanagari ? nextAarti.titleDevanagari : nextAarti.titleTransliteration}
          onProceed={proceedToNext}
          onCancel={cancelCountdown}
        />
      )}

      {/* Modern Kindle/Apple Books Floating Liquid Glass Island HUD */}
      <div className="fixed bottom-20 left-4 right-4 z-40 max-w-sm mx-auto animate-fade-in pointer-events-auto">
        <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-full bg-[var(--card-main)]/90 backdrop-blur-xl border border-[var(--border-main)] shadow-2xl shadow-black/20 text-xs">
          {/* Active Stanza Pill */}
          <div className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-[var(--text-primary)]">
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

          {/* Auto-scroll Play / Pause Toggle & Speed Pill */}
          <div className="flex items-center rounded-full bg-saffron-600 text-white shadow-md shadow-saffron-600/30 overflow-hidden">
            <button
              onClick={toggleAutoScroll}
              aria-label={isScrolling ? 'Pause auto scroll' : 'Start auto scroll'}
              title={isScrolling ? 'स्क्रोल थांबवा' : 'स्वयं-स्क्रोल सुरू करा'}
              className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all ${
                isScrolling ? 'bg-amber-500 hover:bg-amber-600' : 'hover:bg-saffron-700'
              }`}
            >
              {isScrolling ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{isScrolling ? 'थांबवा' : 'स्क्रोल'}</span>
            </button>
            <button
              onClick={() => {
                const nextSpd = cycleAutoScrollSpeed();
                setSpeed(nextSpd);
              }}
              aria-label={`Scroll speed ${speed}x. Click to change.`}
              title="स्क्रोल गती बदला"
              className="px-2 py-1.5 text-[11px] font-black border-l border-white/25 hover:bg-black/10 transition-colors"
            >
              {speed}x
            </button>
          </div>

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
