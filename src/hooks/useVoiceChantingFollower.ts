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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isActiveRef = useRef(false);
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
    isActiveRef.current = false;
    setIsActive(false);
    setIsChanting(false);
    setStatusMessage(null);

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

    setErrorMessage(null);

    // 1. Check for insecure HTTP on custom domain and attempt instant upgrade
    if (
      window.location.protocol === 'http:' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      const secureUrl =
        'https://' +
        window.location.host +
        window.location.pathname +
        window.location.search +
        window.location.hash;
      window.location.replace(secureUrl);
      setErrorMessage('मायक्रोफोनसाठी सुरक्षित HTTPS आवश्यक आहे. सुरक्षित लिंकवर पुनर्निर्देशित करत आहे...');
      return;
    }

    // 2. Check for mediaDevices availability in browser
    if (!navigator?.mediaDevices?.getUserMedia) {
      setErrorMessage(
        'आपल्या ब्राऊझरमध्ये मायक्रोफोन सपोर्ट उपलब्ध नाही किंवा सुरक्षित (HTTPS) कनेक्शन आवश्यक आहे.'
      );
      return;
    }

    try {
      stopFollower();
      setStatusMessage('मायक्रोफोन जोडत आहे...');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // Maintain chanting harmonics & resonant swaras
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) {
        setErrorMessage('ब्राऊझरमध्ये वेब ऑडिओ सपोर्ट उपलब्ध नाही.');
        return;
      }

      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        await ctx.resume().catch(() => {});
      }
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
      isActiveRef.current = true;
      setIsActive(true);
      setStatusMessage('वाणी अनुसरक चालू: पठण सुरू करा');

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
            // Handled gracefully via acoustic VAD
          };

          rec.onend = () => {
            // Auto-restart if user still has follower active
            if (streamRef.current && isActiveRef.current) {
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
          // SpeechRecognition not allowed; VAD handles scrolling acoustically
        }
      }
    } catch (err: unknown) {
      console.error('Failed to start voice follower:', err);
      const errStr = String(err);
      if (
        errStr.includes('NotAllowedError') ||
        errStr.includes('PermissionDeniedError') ||
        errStr.includes('denied')
      ) {
        setErrorMessage(
          'मायक्रोफोन परवानगी नाकारली आहे. कृपया ब्राऊझरच्या ॲड्रेस बारमधील कुलूप (Lock) आयकॉनवर क्लिक करून मायक्रोफोन परवानगी (Allow) द्या.'
        );
      } else if (errStr.includes('NotFoundError') || errStr.includes('DevicesNotFoundError')) {
        setErrorMessage('मायक्रोफोन डिव्हाइस सापडले नाही.');
      } else {
        setErrorMessage('मायक्रोफोन सुरू करता आला नाही. कृपया पेज रीफ्रेश करा किंवा HTTPS लिंक तपासा.');
      }
      stopFollower();
    }
  }, [stopFollower]);

  const toggleFollower = useCallback(() => {
    if (isActiveRef.current) {
      stopFollower();
    } else {
      startFollower();
    }
  }, [startFollower, stopFollower]);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(null);
  }, []);

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
    errorMessage,
    clearErrorMessage,
    toggleFollower,
    startFollower,
    stopFollower,
  };
}
