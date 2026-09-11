'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Type,
  Sun,
  Eye,
  ChevronDown,
  ChevronUp,
  Share2,
  ChevronRight,
  FolderPlus,
} from 'lucide-react';
import { AartiItem } from '@/types';
import { useThemeContext } from '@/components/ThemeProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { AutoScrollPill } from '@/components/AutoScrollPill';
import { FontSizeModal } from '@/components/FontSizeModal';
import { AddToGroupModal } from '@/components/AddToGroupModal';
import { DevotionalAudioBar } from '@/components/DevotionalAudioBar';
import { NextAartiCountdown } from '@/components/NextAartiCountdown';
import { getHymnTypeBadge } from '@/components/AartiCard';
import { deities } from '@/data/deities';

interface AartiReaderClientProps {
  aarti: AartiItem;
  nextAarti?: AartiItem;
}

export function AartiReaderClient({ aarti, nextAarti }: AartiReaderClientProps) {
  const router = useRouter();
  const { script, toggleScript, fontSize, diyaGlow } = useThemeContext();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isLocked, isSupported: wakeLockSupported, requestLock, releaseLock } = useWakeLock();

  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNextCountdown, setShowNextCountdown] = useState(false);

  const favorited = isFavorite(aarti.id);
  const deityInfo = deities.find(d => d.id === aarti.deity);
  const isDevanagari = script === 'devanagari';
  const typeBadge = getHymnTypeBadge(aarti.type, isDevanagari);

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

  return (
    <div className={`space-y-6 max-w-lg mx-auto pb-16 transition-all ${diyaGlow ? 'diya-aura' : ''}`}>
      {/* Gentle Next Aarti Countdown */}
      {
      showNextCountdown && nextAarti && (
        <NextAartiCountdown
          nextTitle={isDevanagari ? nextAarti.titleDevanagari : nextAarti.titleTransliteration}
          totalSeconds={12}
          onProceed={proceedToNext}
          onCancel={cancelCountdown}
        />
      )}

      {/* Reader Top Action Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
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
              title={isLocked ? 'Screen staying awake' : 'Tap to keep screen awake'}
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
            title="Add to group"
            className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] hover:border-saffron-500/50"
          >
            <FolderPlus className="w-4 h-4 text-saffron-600" />
          </button>

          {/* Script Switcher */}
          <button
            onClick={toggleScript}
            aria-label="Switch script"
            className="px-2.5 py-1.5 rounded-xl border text-xs font-bold border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)]"
          >
            {isDevanagari ? 'मराठी' : 'ENG'}
          </button>

          {/* Font Size Button */}
          <button
            onClick={() => setIsFontModalOpen(true)}
            aria-label="Adjust font size"
            className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-primary)] hover:border-saffron-500/50"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={() => toggleFavorite(aarti.id)}
            aria-label={favorited ? 'Remove favorite' : 'Add to favorite'}
            className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/50"
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                favorited ? 'fill-rose-500 text-rose-500' : 'text-[var(--text-secondary)]'
              }`}
            />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            aria-label="Share hymn"
            className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:border-saffron-500/50"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {copied && (
        <div className="text-center text-xs font-semibold py-1.5 px-3 rounded-lg bg-emerald-500/10 text-emerald-600">
          लिंक कॉपी झाली (Link copied to clipboard)
        </div>
      )}

      {/* Aarti Header Title */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 border border-[var(--border-main)]">
          <span className="text-[var(--text-primary)]">
            {deityInfo ? (isDevanagari ? deityInfo.nameDevanagari : deityInfo.nameTransliteration) : aarti.deity}
          </span>
          <span>•</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${typeBadge.className}`}>
            {typeBadge.label}
          </span>
        </div>

        <h1
          style={{ fontSize: `${Math.min(fontSize + 8, 34)}px` }}
          className="font-extrabold text-[var(--text-primary)] leading-snug tracking-tight font-devanagari px-2"
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
        script={script}
      />

      {/* Aarti / Stotra Lyrics Canvas */}
      <article
        style={{ fontSize: `${fontSize}px`, lineHeight: '1.9' }}
        className="space-y-6 pt-2 font-devanagari text-center"
      >
        {aarti.stanzas.map((stanza, sIdx) => {
          const lines = isDevanagari ? stanza.devanagari : stanza.transliteration;
          return (
            <div
              key={sIdx}
              className={`p-4 rounded-2xl transition-colors ${
                stanza.isChorus
                  ? 'bg-amber-500/5 border border-amber-500/20 font-bold'
                  : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
              }`}
            >
              {stanza.sectionTitle && (
                <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-saffron-700 dark:text-saffron-300 mb-3 py-1 px-3.5 rounded-full bg-saffron-500/10 inline-block border border-saffron-500/25">
                  {stanza.sectionTitle}
                </div>
              )}
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
            <div className="p-4 pt-1 border-t border-[var(--border-main)] text-sm text-[var(--text-secondary)] leading-relaxed">
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

      {/* Auto Scroll Floating Pill */}
      <AutoScrollPill
        isScrolling={isScrolling}
        speed={speed}
        onToggle={toggleAutoScroll}
        onSpeedChange={setSpeed}
      />

      {/* Font Size Modal */}
      <FontSizeModal isOpen={isFontModalOpen} onClose={() => setIsFontModalOpen(false)} />

      {/* Add To Group Modal */}
      <AddToGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        aarti={aarti}
      />
    </div>
  );
}
