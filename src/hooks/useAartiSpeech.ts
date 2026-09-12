'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Stanza, ScriptType } from '@/types';

/**
 * Sanitizes devotional text so that speech synthesis does not speak punctuation
 * symbols like "danda", "vertical bar", "khadi pai", or verse numbers.
 * Converts line endings to natural prosodic pauses (comma/period).
 */
export function sanitizeChantingText(rawText: string): string {
  if (!rawText) return '';

  return rawText
    // Remove verse numbering like ॥ १ ॥, || 1 ||, (१), (1), [1], etc.
    .replace(/[॥|।]\s*[\d०-९]+\s*[॥|।]/g, '')
    .replace(/\(\s*[\d०-९]+\s*\)/g, '')
    .replace(/\[\s*[\d०-९]+\s*\]/g, '')
    // Remove standalone dandas and vertical bars
    .replace(/[॥।|]+/g, '')
    // Remove decorative symbols
    .replace(/[*~_#^<>="'+]+/g, '')
    // Remove stray brackets and dashes
    .replace(/[()[\]{}]/g, '')
    .replace(/\s*-\s*/g, ' ')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Intelligent voice selection prioritizing natural human voices for Indian devotional chanting
 */
export function selectBestChantingVoice(
  voices: SpeechSynthesisVoice[],
  script: ScriptType
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  if (script === 'devanagari') {
    // 1. Marathi Voices (e.g. Google मराठी, mr-IN)
    const mrVoice = voices.find(
      v =>
        (v.lang.toLowerCase().includes('mr') || v.name.toLowerCase().includes('marathi')) &&
        !v.name.toLowerCase().includes('english')
    );
    if (mrVoice) return mrVoice;

    // 2. High-quality Hindi / Sanskrit voices (e.g. Google हिन्दी, Swara, Madhur, Lekha, hi-IN)
    // These neural voices pronounce Devanagari prayers & Sanskrit stotras with remarkable fidelity
    const hiNatural = voices.find(
      v =>
        (v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi')) &&
        (v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('google') ||
          v.name.toLowerCase().includes('lekha') ||
          v.name.toLowerCase().includes('swara') ||
          v.name.toLowerCase().includes('madhur'))
    );
    if (hiNatural) return hiNatural;

    const hiVoice = voices.find(
      v =>
        (v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi')) &&
        !v.name.toLowerCase().includes('english')
    );
    if (hiVoice) return hiVoice;

    // 3. Indian English as fallback
    const inVoice = voices.find(v => v.lang.toLowerCase().includes('in'));
    if (inVoice) return inVoice;
  } else {
    // Transliteration (Phonetic English): Indian English accent sounds best for mantras
    const enInVoice = voices.find(
      v =>
        v.lang.toLowerCase().includes('en-in') ||
        v.lang.toLowerCase().includes('en_in') ||
        v.name.toLowerCase().includes('india')
    );
    if (enInVoice) return enInVoice;

    // Fallback to Hindi or general English
    const hiVoice = voices.find(v => v.lang.toLowerCase().includes('hi'));
    if (hiVoice) return hiVoice;

    const enVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
    if (enVoice) return enVoice;
  }

  return voices[0] || null;
}

export interface UseAartiSpeechOptions {
  onStanzaChange?: (index: number) => void;
  onComplete?: () => void;
}

export function useAartiSpeech() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(0.88); // Unhurried, meditative tempo for human-like devotional chanting
  const [currentStanzaIndex, setCurrentStanzaIndex] = useState(-1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const stanzasRef = useRef<Stanza[]>([]);
  const scriptRef = useRef<ScriptType>('devanagari');
  const onStanzaChangeRef = useRef<((idx: number) => void) | undefined>();
  const onCompleteRef = useRef<(() => void) | undefined>();
  const isCanceledRef = useRef(false);

  // Initialize Speech Synthesis & Load Voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          setVoices(available);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  const stop = useCallback(() => {
    isCanceledRef.current = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentStanzaIndex(-1);
  }, []);

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  /**
   * Internal sequential stanza chanter.
   * Chanting stanza-by-stanza:
   * 1. Prevents Chrome 15-second TTS timeout on long stotras
   * 2. Allows natural 400ms pause between verses
   * 3. Syncs active stanza highlighting and auto-scrolls along with chanting
   */
  const speakStanzaAt = useCallback(
    (index: number) => {
      if (isCanceledRef.current) return;
      if (index >= stanzasRef.current.length) {
        // Recitation completed
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentStanzaIndex(-1);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
        return;
      }

      setCurrentStanzaIndex(index);
      if (onStanzaChangeRef.current) {
        onStanzaChangeRef.current(index);
      }

      const stanza = stanzasRef.current[index];
      const rawLines =
        scriptRef.current === 'devanagari' ? stanza.devanagari : stanza.transliteration;

      // Clean lines: strip dandas, numbers, and format with commas for natural breathing pauses
      const cleanedLines = rawLines
        .map(sanitizeChantingText)
        .filter(l => l.length > 0);

      if (cleanedLines.length === 0) {
        // Skip empty stanza
        speakStanzaAt(index + 1);
        return;
      }

      // Joining with comma creates a natural 250ms prosodic breath pause; period at end creates restful cadence
      const phraseText = cleanedLines.join(', ') + '.';
      const utterance = new SpeechSynthesisUtterance(phraseText);

      // Select natural voice
      const bestVoice = selectBestChantingVoice(
        voices.length > 0 ? voices : window.speechSynthesis.getVoices(),
        scriptRef.current
      );

      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else if (scriptRef.current === 'devanagari') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }

      utterance.rate = rate;
      utterance.pitch = 0.98; // Warm, natural human pitch

      utterance.onend = () => {
        if (isCanceledRef.current) return;
        // Natural 350ms devotional pause before the next stanza
        setTimeout(() => {
          if (!isCanceledRef.current) {
            speakStanzaAt(index + 1);
          }
        }, 350);
      };

      utterance.onerror = () => {
        if (!isCanceledRef.current) {
          speakStanzaAt(index + 1);
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [voices, rate]
  );

  const speak = useCallback(
    (
      stanzas: Stanza[],
      script: ScriptType,
      options?: UseAartiSpeechOptions | (() => void)
    ) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (!stanzas || stanzas.length === 0) return;

      stop();
      isCanceledRef.current = false;

      stanzasRef.current = stanzas;
      scriptRef.current = script;

      if (typeof options === 'function') {
        onCompleteRef.current = options;
        onStanzaChangeRef.current = undefined;
      } else {
        onCompleteRef.current = options?.onComplete;
        onStanzaChangeRef.current = options?.onStanzaChange;
      }

      setIsSpeaking(true);
      setIsPaused(false);

      speakStanzaAt(0);
    },
    [stop, speakStanzaAt]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    rate,
    setRate,
    currentStanzaIndex,
    speak,
    pause,
    resume,
    stop,
  };
}
