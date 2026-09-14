'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Stanza } from '@/types';
import { DevotionalVoiceActivityDetector } from '@/lib/voiceActivityDetector';
import { alignChantedTextToStanzas } from '@/lib/chantingAligner';

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

export interface UseVoiceChantingFollowerOptions {
  stanzas: Stanza[];
  onVoiceActivityChange?: (isChanting: boolean) => void;
  onStanzaMatch?: (stanzaIndex: number, phrase: string) => void;
}

export function useVoiceChantingFollower({
  stanzas,
  onVoiceActivityChange,
  onStanzaMatch,
}: UseVoiceChantingFollowerOptions) {
  const [isActive, setIsActive] = useState(false);
  const [isChanting, setIsChanting] = useState(false);
  const [lastRecognizedPhrase, setLastRecognizedPhrase] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const vadRef = useRef<DevotionalVoiceActivityDetector>(new DevotionalVoiceActivityDetector());
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const stanzasRef = useRef(stanzas);
  stanzasRef.current = stanzas;

  const onVoiceActivityChangeRef = useRef(onVoiceActivityChange);
  onVoiceActivityChangeRef.current = onVoiceActivityChange;

  const onStanzaMatchRef = useRef(onStanzaMatch);
  onStanzaMatchRef.current = onStanzaMatch;

  const stopFollower = useCallback(() => {
    setIsActive(false);
    setIsChanting(false);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (onVoiceActivityChangeRef.current) {
      onVoiceActivityChangeRef.current(false);
    }
  }, []);

  const startFollower = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      stopFollower();
      setStatusMessage('मायक्रोफोन जोडत आहे...');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // Keep chanting harmonics
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);
      vadRef.current.reset();

      let lastChantingState = false;

      const processVAD = () => {
        if (!analyser || ctx.state === 'closed') return;

        analyser.getFloatTimeDomainData(buffer);
        const metrics = vadRef.current.processAudioBuffer(buffer);

        if (metrics.isChanting !== lastChantingState) {
          lastChantingState = metrics.isChanting;
          setIsChanting(metrics.isChanting);
          if (onVoiceActivityChangeRef.current) {
            onVoiceActivityChangeRef.current(metrics.isChanting);
          }
        }

        animFrameRef.current = requestAnimationFrame(processVAD);
      };

      animFrameRef.current = requestAnimationFrame(processVAD);
      setIsActive(true);
      setStatusMessage('वाणी अनुसरक चालू: गाणे सुरू करा');

      // Initialize Speech Recognition for Marathi if supported
      const win = window as unknown as {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      };
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        try {
          const rec = new SpeechRecognitionClass();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'mr-IN';

          rec.onresult = (event: SpeechRecognitionEvent) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              currentTranscript += event.results[i][0].transcript + ' ';
            }

            const trimmed = currentTranscript.trim();
            if (trimmed) {
              setLastRecognizedPhrase(trimmed);
              const alignment = alignChantedTextToStanzas(trimmed, stanzasRef.current);
              if (alignment && onStanzaMatchRef.current) {
                onStanzaMatchRef.current(alignment.matchedStanzaIndex, trimmed);
              }
            }
          };

          rec.onerror = () => {
            // SpeechRecognition error gracefully handled via VAD acoustic fallback
          };

          rec.onend = () => {
            // Auto-restart if still active
            if (streamRef.current && isActive) {
              try {
                rec.start();
              } catch {
                // ignore
              }
            }
          };

          rec.start();
          recognitionRef.current = rec;
        } catch {
          // SpeechRecognition not allowed; VAD will handle scrolling purely acoustically
        }
      }
    } catch (err) {
      console.error('Failed to start voice follower:', err);
      setStatusMessage('मायक्रोफोन परवानगी नाकारली.');
      stopFollower();
    }
  }, [isActive, stopFollower]);

  const toggleFollower = useCallback(() => {
    if (isActive) {
      stopFollower();
    } else {
      startFollower();
    }
  }, [isActive, startFollower, stopFollower]);

  useEffect(() => {
    return () => {
      stopFollower();
    };
  }, [stopFollower]);

  return {
    isActive,
    isChanting,
    lastRecognizedPhrase,
    statusMessage,
    toggleFollower,
    startFollower,
    stopFollower,
  };
}
