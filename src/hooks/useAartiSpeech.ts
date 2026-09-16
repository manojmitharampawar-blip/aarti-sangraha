'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Stanza, ScriptType } from '@/types';
import { preprocessDevotionalPronunciation } from '@/lib/phoneticPreprocessor';

export type LayaSpeed = 'vilambit' | 'madhya' | 'dhrut';
export type VoiceGenderPreference = 'auto' | 'female' | 'male';

export const LAYA_RATES: Record<LayaSpeed, number> = {
  vilambit: 0.74, // शांत, ध्यानस्थ, संथ गती
  madhya: 0.86,   // मध्यम, पारंपारिक नित्य लय
  dhrut: 1.02,    // द्रुत, सामूहिक आरती गती
};

/**
 * Sanitizes devotional text so that speech synthesis does not speak punctuation
 * symbols like "danda", "vertical bar", "khadi pai", or verse numbers.
 * Converts line endings to natural prosodic pauses.
 */
export function sanitizeChantingText(rawText: string): string {
  if (!rawText) return '';

  let text = preprocessDevotionalPronunciation(rawText);

  return text
    // Remove refrain indicators like धृ. or ध्रु. or Dhru. (with optional parens)
    .replace(/[\(（]?\s*(?:धृ|ध्रु|ध्र|Dhru)\.?\s*[\)）]?/gi, '')
    // Remove verse numbering like ॥ १ ॥, || 1 ||, (१), (1), [1], etc.
    .replace(/[॥।]\s*[\d०-९]+\s*[॥।]/g, '')
    .replace(/\(\s*[\d०-९]+\s*\)/g, '')
    .replace(/\[\s*[\d०-९]+\s*\]/g, '')
    // Remove standalone dandas, dots, and vertical bars
    .replace(/[॥।|.,]+/g, ' ')
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
  script: ScriptType,
  genderPreference: VoiceGenderPreference = 'auto'
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const isFemaleName = (name: string) =>
    /swara|lekha|kalpana|priya|aditi|female|woman|girl/i.test(name);
  const isMaleName = (name: string) =>
    /madhur|ravi|neel|hemant|male|man|boy/i.test(name);

  const filterByGender = (list: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] => {
    if (genderPreference === 'female') {
      const females = list.filter(v => isFemaleName(v.name));
      if (females.length > 0) return females;
    } else if (genderPreference === 'male') {
      const males = list.filter(v => isMaleName(v.name));
      if (males.length > 0) return males;
    }
    return list;
  };

  if (script === 'devanagari') {
    // 1. Marathi Voices (e.g. Google मराठी, mr-IN)
    const mrVoices = voices.filter(
      v =>
        (v.lang.toLowerCase().includes('mr') || v.name.toLowerCase().includes('marathi')) &&
        !v.name.toLowerCase().includes('english')
    );
    const mrFiltered = filterByGender(mrVoices);
    if (mrFiltered.length > 0) return mrFiltered[0];

    // 2. High-quality Hindi / Sanskrit voices (e.g. Google हिन्दी, Swara, Madhur, Lekha, hi-IN)
    const hiNatural = voices.filter(
      v =>
        (v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi')) &&
        (v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('google') ||
          v.name.toLowerCase().includes('lekha') ||
          v.name.toLowerCase().includes('swara') ||
          v.name.toLowerCase().includes('madhur'))
    );
    const hiNatFiltered = filterByGender(hiNatural);
    if (hiNatFiltered.length > 0) return hiNatFiltered[0];

    const hiVoice = voices.filter(
      v =>
        (v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi')) &&
        !v.name.toLowerCase().includes('english')
    );
    const hiFiltered = filterByGender(hiVoice);
    if (hiFiltered.length > 0) return hiFiltered[0];

    // 3. Indian English as fallback
    const inVoice = voices.filter(v => v.lang.toLowerCase().includes('in'));
    if (inVoice.length > 0) return inVoice[0];
  } else {
    // Transliteration (Phonetic English): Indian English accent sounds best for mantras
    const enInVoice = voices.filter(
      v =>
        v.lang.toLowerCase().includes('en-in') ||
        v.lang.toLowerCase().includes('en_in') ||
        v.name.toLowerCase().includes('india')
    );
    const enInFiltered = filterByGender(enInVoice);
    if (enInFiltered.length > 0) return enInFiltered[0];

    // Fallback to Hindi or general English
    const hiVoice = voices.filter(v => v.lang.toLowerCase().includes('hi'));
    if (hiVoice.length > 0) return hiVoice[0];

    const enVoice = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
    if (enVoice.length > 0) return enVoice[0];
  }

  return voices[0] || null;
}

export interface UseAartiSpeechOptions {
  onStanzaChange?: (index: number) => void;
  onComplete?: () => void;
  laya?: LayaSpeed;
  gender?: VoiceGenderPreference;
}

export function useAartiSpeech() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [laya, setLaya] = useState<LayaSpeed>('madhya');
  const [rate, setRate] = useState(LAYA_RATES['madhya']);
  const [genderPreference, setGenderPreference] = useState<VoiceGenderPreference>('auto');
  const [currentStanzaIndex, setCurrentStanzaIndex] = useState(-1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const stanzasRef = useRef<Stanza[]>([]);
  const scriptRef = useRef<ScriptType>('devanagari');
  const onStanzaChangeRef = useRef<((idx: number) => void) | undefined>();
  const onCompleteRef = useRef<(() => void) | undefined>();
  const isCanceledRef = useRef(false);

  // Synchronize rate with selected laya
  const handleSetLaya = useCallback((newLaya: LayaSpeed) => {
    setLaya(newLaya);
    setRate(LAYA_RATES[newLaya]);
  }, []);

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
   * Line-by-line melodic chanter with traditional Laya & Swara:
   * - Aroha (आरोह - elevation): Odd lines sung with elevated pitch (1.06)
   * - Avaroha (अवरोह - resolution): Even lines sung with resolving pitch (0.93)
   * - Chorus / Dhruvapada (ध्रुवपद): Resonant elevated joy (1.11)
   * - 240ms micro-pause at metrical caesura (यती), 500ms breath between stanzas
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

      // Clean lines: strip dandas, numbering, and format
      const cleanedLines = rawLines
        .map(sanitizeChantingText)
        .filter(l => l.length > 0);

      if (cleanedLines.length === 0) {
        // Skip empty stanza
        speakStanzaAt(index + 1);
        return;
      }

      const bestVoice = selectBestChantingVoice(
        voices.length > 0 ? voices : window.speechSynthesis.getVoices(),
        scriptRef.current,
        genderPreference
      );

      const speakLineAt = (lineIdx: number) => {
        if (isCanceledRef.current) return;
        if (lineIdx >= cleanedLines.length) {
          // Stanza finished -> 500ms meditative pause before next stanza
          setTimeout(() => {
            if (!isCanceledRef.current) {
              speakStanzaAt(index + 1);
            }
          }, 500);
          return;
        }

        const lineText = cleanedLines[lineIdx];
        const isChorusLine = stanza.isChorus || /जय\s*देव|धृ|dhru|jai\s*dev/i.test(lineText);

        // Devotional Swara and Laya modulation:
        let linePitch = 0.98;
        let lineRate = rate;

        if (isChorusLine) {
          linePitch = 1.11; // Joyous bhakti chorus lift
          lineRate = Math.min(1.0, rate * 1.02);
        } else if (lineIdx % 2 === 0) {
          linePitch = 1.05; // Aroha (melodic rise in the opening half-verse)
          lineRate = rate;
        } else {
          linePitch = 0.94; // Avaroha (peaceful resolution to tonic Sa)
          lineRate = Math.max(0.72, rate * 0.95);
        }

        const utterance = new SpeechSynthesisUtterance(lineText);

        if (bestVoice) {
          utterance.voice = bestVoice;
          utterance.lang = bestVoice.lang;
        } else if (scriptRef.current === 'devanagari') {
          utterance.lang = 'mr-IN';
        } else {
          utterance.lang = 'en-IN';
        }

        utterance.pitch = linePitch;
        utterance.rate = lineRate;

        utterance.onend = () => {
          if (isCanceledRef.current) return;
          // Natural 240ms breath pause between poetic lines
          setTimeout(() => {
            if (!isCanceledRef.current) {
              speakLineAt(lineIdx + 1);
            }
          }, 240);
        };

        utterance.onerror = (e) => {
          // If canceled intentionally, ignore error
          if (isCanceledRef.current || e.error === 'canceled') return;
          console.warn('AI Vani recitation note:', e.error);
          // Advance to next line
          setTimeout(() => {
            if (!isCanceledRef.current) {
              speakLineAt(lineIdx + 1);
            }
          }, 240);
        };

        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.speak(utterance);
        }
      };

      speakLineAt(0);
    },
    [voices, rate, genderPreference]
  );

  const speak = useCallback(
    (
      stanzas: Stanza[],
      script: ScriptType = 'devanagari',
      options?: UseAartiSpeechOptions | (() => void)
    ) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      isCanceledRef.current = false;

      stanzasRef.current = stanzas;
      scriptRef.current = script;

      if (typeof options === 'function') {
        onCompleteRef.current = options;
      } else if (options) {
        onStanzaChangeRef.current = options.onStanzaChange;
        onCompleteRef.current = options.onComplete;
        if (options.laya) {
          handleSetLaya(options.laya);
        }
        if (options.gender) {
          setGenderPreference(options.gender);
        }
      }

      setIsSpeaking(true);
      setIsPaused(false);
      speakStanzaAt(0);
    },
    [speakStanzaAt, handleSetLaya]
  );

  return {
    isSupported,
    isSpeaking,
    isPaused,
    rate,
    setRate,
    laya,
    setLaya: handleSetLaya,
    genderPreference,
    setGenderPreference,
    currentStanzaIndex,
    voices,
    speak,
    pause,
    resume,
    stop,
  };
}
