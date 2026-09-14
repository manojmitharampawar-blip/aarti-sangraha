'use client';

import { useState, useRef, useCallback } from 'react';
import {
  IndianSur,
  INDIAN_SUR_REGISTRY,
  matchFrequencyToSur,
  detectPitchAutocorrelation,
} from '@/lib/pitchDetector';
import {
  getCurrentDevotionalSur,
  setDevotionalMusicSur,
} from '@/lib/devotionalAudio';

export interface UseAdaptiveSurResult {
  currentSur: IndianSur;
  setSur: (sur: IndianSur) => void;
  isListening: boolean;
  detectedPitchHz: number | null;
  detectedSurInfo: { sur: IndianSur; centsDiff: number } | null;
  statusMessage: string | null;
  startSurDetection: () => Promise<void>;
  stopSurDetection: () => void;
}

export function useAdaptiveSur(): UseAdaptiveSurResult {
  const [currentSur, setCurrentSurState] = useState<IndianSur>(() => getCurrentDevotionalSur());
  const [isListening, setIsListening] = useState(false);
  const [detectedPitchHz, setDetectedPitchHz] = useState<number | null>(null);
  const [detectedSurInfo, setDetectedSurInfo] = useState<{ sur: IndianSur; centsDiff: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const consecutiveMatchCountRef = useRef(0);
  const lastCandidateSurKeyRef = useRef<string | null>(null);

  const setSur = useCallback((sur: IndianSur) => {
    setCurrentSurState(sur);
    setDevotionalMusicSur(sur);
    setStatusMessage(`सूर निवडला: ${sur.nameMr}`);
  }, []);

  const stopSurDetection = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }

    setIsListening(false);
  }, []);

  const startSurDetection = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setStatusMessage('तुमच्या ब्राउझरमध्ये मायक्रोफोन उपलब्ध नाही.');
      return;
    }

    try {
      stopSurDetection();
      setIsListening(true);
      setStatusMessage('आवाज ऐकत आहे... कृपया एक स्वर म्हणा (उदा. "सा-अ-अ")');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // keep singing harmonics intact
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;

      source.connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);
      consecutiveMatchCountRef.current = 0;
      lastCandidateSurKeyRef.current = null;

      const processAudio = () => {
        if (!analyser || ctx.state === 'closed') return;

        analyser.getFloatTimeDomainData(buffer);
        const result = detectPitchAutocorrelation(buffer, ctx.sampleRate, 0.83);

        if (result && result.freq >= 85 && result.freq <= 500) {
          const matched = matchFrequencyToSur(result.freq);
          setDetectedPitchHz(Math.round(result.freq));
          setDetectedSurInfo(matched);

          if (matched.sur.key === lastCandidateSurKeyRef.current) {
            consecutiveMatchCountRef.current += 1;
          } else {
            lastCandidateSurKeyRef.current = matched.sur.key;
            consecutiveMatchCountRef.current = 1;
          }

          // When the pitch is held consistently for ~6-8 animation frames (~100-140ms)
          if (consecutiveMatchCountRef.current >= 7) {
            setSur(matched.sur);
            setStatusMessage(`सूर ओळखला: ${matched.sur.nameMr} (${Math.round(result.freq)} Hz)`);
            stopSurDetection();
            return;
          }
        }

        animFrameIdRef.current = requestAnimationFrame(processAudio);
      };

      animFrameIdRef.current = requestAnimationFrame(processAudio);

      // Timeout safety: stop after 12 seconds if no steady pitch detected
      setTimeout(() => {
        if (isListening) {
          stopSurDetection();
          setStatusMessage('सूर शोधण्याची वेळ संपली. कृपया पुन्हा प्रयत्न करा किंवा खालील यादीतून निवडा.');
        }
      }, 12000);
    } catch (err) {
      console.error('Microphone error:', err);
      setIsListening(false);
      setStatusMessage('मायक्रोफोन परवानगी नाकारली गेली आहे.');
    }
  }, [isListening, setSur, stopSurDetection]);

  return {
    currentSur,
    setSur,
    isListening,
    detectedPitchHz,
    detectedSurInfo,
    statusMessage,
    startSurDetection,
    stopSurDetection,
  };
}
