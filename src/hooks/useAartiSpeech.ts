'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Stanza, ScriptType } from '@/types';

export function useAartiSpeech() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(0.95); // Slightly slower for serene chanting
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);

  const onCompleteRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentLineIndex(-1);
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

  const speak = useCallback(
    (stanzas: Stanza[], script: ScriptType, onComplete?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      stop();
      onCompleteRef.current = onComplete || null;

      // Extract text lines
      const allLines = stanzas.flatMap(s =>
        script === 'devanagari' ? s.devanagari : s.transliteration
      );

      if (allLines.length === 0) return;

      const fullText = allLines.join(' । \n');
      const utterance = new SpeechSynthesisUtterance(fullText);

      // Select voice: Prefer Marathi (mr-IN) or Hindi (hi-IN) for devanagari
      const voices = window.speechSynthesis.getVoices();
      if (script === 'devanagari') {
        const mrVoice = voices.find(v => v.lang.includes('mr') || v.lang.includes('MR'));
        const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
        if (mrVoice) {
          utterance.voice = mrVoice;
          utterance.lang = 'mr-IN';
        } else if (hiVoice) {
          utterance.voice = hiVoice;
          utterance.lang = 'hi-IN';
        }
      } else {
        const enVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en'));
        if (enVoice) {
          utterance.voice = enVoice;
          utterance.lang = 'en-IN';
        }
      }

      utterance.rate = rate;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [rate, stop]
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
    speak,
    pause,
    resume,
    stop,
    currentLineIndex,
  };
}
