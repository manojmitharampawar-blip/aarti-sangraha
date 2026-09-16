'use client';

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sliders,
  Sparkles,
  Music,
  Mic,
  MicOff,
  ChevronDown,
  ChevronUp,
  Square,
  Gauge,
  User,
} from 'lucide-react';
import {
  startDevotionalMusic,
  stopDevotionalMusic,
  setDevotionalMusicVolume,
  setDevotionalMusicTempo,
} from '@/lib/devotionalAudio';
import { useAartiSpeech, LayaSpeed, VoiceGenderPreference } from '@/hooks/useAartiSpeech';
import { useAdaptiveSur } from '@/hooks/useAdaptiveSur';
import { useThemeContext } from '@/components/ThemeProvider';
import { Stanza, ScriptType } from '@/types';
import { INDIAN_SUR_REGISTRY, IndianSur } from '@/lib/pitchDetector';

// AI Vani Recitation enabled with rhythmic prosody and laya control
const SHOW_SPEECH_RECITATION = true;

interface DevotionalAudioBarProps {
  stanzas?: Stanza[];
  script?: ScriptType;
  onSpeechComplete?: () => void;
  onStanzaChange?: (index: number) => void;
  autoPlayMusic?: boolean;
  isAutoScrolling?: boolean;
  onToggleAutoScroll?: () => void;
  autoScrollSpeed?: number;
  onCycleScrollSpeed?: () => void;
  isVoiceFollowerActive?: boolean;
  isVoiceChanting?: boolean;
  onToggleVoiceFollower?: () => void;
}

export function DevotionalAudioBar({
  stanzas = [],
  script = 'devanagari',
  onSpeechComplete,
  onStanzaChange,
  autoPlayMusic = false,
  isAutoScrolling,
  onToggleAutoScroll,
  autoScrollSpeed: propAutoScrollSpeed,
  onCycleScrollSpeed,
  isVoiceFollowerActive = false,
  isVoiceChanting = false,
  onToggleVoiceFollower,
}: DevotionalAudioBarProps) {
  const { autoScrollSpeed: contextAutoScrollSpeed, cycleAutoScrollSpeed } = useThemeContext();
  const currentScrollSpeed = propAutoScrollSpeed ?? contextAutoScrollSpeed;

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [musicTempo, setMusicTempo] = useState(82);
  const [showSettings, setShowSettings] = useState(false);
  const [showAllSurs, setShowAllSurs] = useState(false);

  const {
    currentSur,
    setSur,
    isListening: isDetectingSur,
    detectedPitchHz,
    detectedSurInfo,
    statusMessage: surStatusMessage,
    startSurDetection,
    stopSurDetection,
  } = useAdaptiveSur();

  const {
    isSupported: speechSupported,
    isSpeaking,
    isPaused,
    rate: speechRate,
    setRate: setSpeechRate,
    laya,
    setLaya,
    genderPreference,
    setGenderPreference,
    speak,
    pause: pauseSpeech,
    resume: resumeSpeech,
    stop: stopSpeech,
  } = useAartiSpeech();

  // Clean up audio & mic on unmount
  useEffect(() => {
    return () => {
      stopDevotionalMusic();
      stopSurDetection();
    };
  }, [stopSurDetection]);

  // Toggle Background Devotional Music
  const toggleMusic = () => {
    if (isMusicPlaying) {
      stopDevotionalMusic();
      setIsMusicPlaying(false);
    } else {
      setIsMusicPlaying(true);
      try {
        startDevotionalMusic({ bpm: musicTempo, volume: musicVolume, sur: currentSur });
      } catch (err) {
        console.error('Failed to start devotional music:', err);
        setIsMusicPlaying(false);
      }
    }
  };

  // Toggle AI Vani Recitation with gentle accompanying drone
  const toggleSpeech = () => {
    if (isSpeaking) {
      if (isPaused) {
        resumeSpeech();
      } else {
        pauseSpeech();
      }
    } else {
      if (!isMusicPlaying) {
        try {
          // Accompany AI recitation with subtle devotional drone
          startDevotionalMusic({ bpm: musicTempo, volume: 0.3, sur: currentSur });
          setIsMusicPlaying(true);
        } catch {
          // ignore
        }
      }
      speak(stanzas, script, {
        onStanzaChange,
        onComplete: onSpeechComplete,
        laya,
        gender: genderPreference,
      });
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setMusicVolume(newVol);
    setDevotionalMusicVolume(newVol);
  };

  const handleTempoChange = (bpm: number) => {
    setMusicTempo(bpm);
    setDevotionalMusicTempo(bpm);
  };

  const handleSpeedCycle = () => {
    if (onCycleScrollSpeed) {
      onCycleScrollSpeed();
    } else {
      cycleAutoScrollSpeed();
    }
  };

  const cycleLaya = () => {
    const nextLaya: Record<LayaSpeed, LayaSpeed> = {
      vilambit: 'madhya',
      madhya: 'dhrut',
      dhrut: 'vilambit',
    };
    setLaya(nextLaya[laya]);
  };

  const handleSurSelect = (sur: IndianSur) => {
    setSur(sur);
  };

  const POPULAR_SURS = [
    INDIAN_SUR_REGISTRY[2], // पांढरी २ (D)
    INDIAN_SUR_REGISTRY[1], // काळी १ (C#)
    INDIAN_SUR_REGISTRY[8], // काळी ४ (G#)
    INDIAN_SUR_REGISTRY[10], // काळी ५ (A#)
  ];

  return (
    <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] p-3 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Background Music Button */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={toggleMusic}
            aria-label="Toggle devotional background music (Harmonium, Mridang, Taal)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isMusicPlaying
                ? 'bg-gradient-to-r from-amber-600 to-saffron-600 text-white shadow-sm shadow-amber-600/30'
                : 'border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:border-amber-500/50'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'animate-spin-slow text-yellow-200' : 'text-amber-600'}`} />
            <span>{isMusicPlaying ? 'वाद्य संगीत चालू' : 'वाद्य संगीत'}</span>
          </button>

          {/* Settings Accordion Toggle */}
          <button
            onClick={() => setShowSettings(prev => !prev)}
            aria-label="Adjust audio settings"
            title="ऑडिओ, सूर व ताल सेटिंग्स (AI)"
            className={`p-1.5 rounded-lg border transition-colors ${
              showSettings
                ? 'border-saffron-500 bg-saffron-500/10 text-saffron-600'
                : 'border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recitation, Voice Follower and Auto-Scroll Group */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Hands-Free Voice Chanting Follower Button */}
          {onToggleVoiceFollower && (
            <button
              onClick={onToggleVoiceFollower}
              aria-label="Toggle voice-activated hands-free auto-scroller"
              title={
                isVoiceFollowerActive
                  ? 'वाणी अनुसरक थांबवा'
                  : 'वाणी अनुसरक सुरू करा (AI गायन ऐकून आपोआप स्क्रोल)'
              }
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isVoiceFollowerActive
                  ? isVoiceChanting
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 animate-pulse'
                    : 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                  : 'border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:border-emerald-500/50'
              }`}
            >
              <Mic className={`w-3.5 h-3.5 ${isVoiceChanting ? 'animate-bounce text-yellow-200' : 'text-emerald-600'}`} />
              <span>
                {isVoiceFollowerActive
                  ? isVoiceChanting
                    ? 'गायन चालू'
                    : 'वाणी अनुसरक'
                  : 'वाणी स्क्रोल (AI)'}
              </span>
            </button>
          )}

          {/* AI Vani Recitation Button */}
          {SHOW_SPEECH_RECITATION && speechSupported && (
            <div className="flex items-center rounded-xl border border-[var(--border-main)] bg-[var(--bg-main)] overflow-hidden">
              <button
                onClick={toggleSpeech}
                aria-label="Toggle AI Vani Natural Recitation"
                title="AI वाणी पठण (नैसर्गिक स्वर, लय व आरोह-अवरोह)"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold transition-all ${
                  isSpeaking && !isPaused
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 animate-pulse'
                    : 'text-[var(--text-primary)] hover:text-emerald-600'
                }`}
              >
                {isSpeaking && !isPaused ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>
                  {isSpeaking
                    ? isPaused
                      ? 'पठण सुरू'
                      : 'पठण चालू'
                    : 'AI वाणी'}
                </span>
              </button>

              {/* Laya Preset Cycle */}
              <button
                onClick={cycleLaya}
                title={`लय: ${laya === 'vilambit' ? 'विलंबित (शांत)' : laya === 'dhrut' ? 'द्रुत (जलद)' : 'मध्यम (सामान्य)'}`}
                className="px-2 py-1.5 text-[10px] font-bold border-l border-[var(--border-main)] text-[var(--text-secondary)] hover:text-emerald-600 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {laya === 'vilambit' ? 'संथ' : laya === 'dhrut' ? 'द्रुत' : 'मध्य'}
              </button>

              {isSpeaking && (
                <button
                  onClick={stopSpeech}
                  aria-label="Stop speech recitation"
                  title="पठण पूर्ण बंद करा"
                  className="p-1.5 border-l border-[var(--border-main)] text-rose-600 hover:bg-rose-500/10"
                >
                  <Square className="w-3 h-3 fill-rose-600" />
                </button>
              )}
            </div>
          )}

          {/* Direct Auto-Scroll Button for Stotra & Aarti */}
          {onToggleAutoScroll && (
            <div className="flex items-center rounded-xl border border-[var(--border-main)] bg-[var(--bg-main)] overflow-hidden">
              <button
                onClick={onToggleAutoScroll}
                aria-label={isAutoScrolling ? "Stop auto-scroll" : "Start auto-scroll"}
                title={isAutoScrolling ? 'स्क्रोल थांबवा' : 'स्वयं-स्क्रोल सुरू करा'}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold transition-all ${
                  isAutoScrolling
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-[var(--text-primary)] hover:text-saffron-600'
                }`}
              >
                {isAutoScrolling ? (
                  <Pause className="w-3 h-3 fill-current" />
                ) : (
                  <Play className="w-3 h-3 fill-current" />
                )}
                <span>{isAutoScrolling ? 'स्क्रोल चालू' : 'स्वयं-स्क्रोल'}</span>
              </button>
              <button
                onClick={handleSpeedCycle}
                aria-label={`Scroll speed ${currentScrollSpeed}x. Click to change.`}
                title="स्क्रोल गती बदला"
                className="px-2 py-1.5 text-[10px] font-black border-l border-[var(--border-main)] text-[var(--text-secondary)] hover:text-saffron-600 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {currentScrollSpeed}x
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Audio & Harmonizer Settings */}
      {showSettings && (
        <div className="pt-2 border-t border-[var(--border-main)] space-y-3.5 text-xs">
          {/* AI Adaptive Sur (Harmonium Tuning) */}
          <div className="p-2.5 rounded-xl bg-saffron-500/5 dark:bg-saffron-950/20 border border-saffron-500/20 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold text-saffron-800 dark:text-saffron-300">
                <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
                <span>सूर व संवादिनी जुळवणी (Adaptive Sur):</span>
                <span className="text-[11px] font-extrabold text-saffron-700 dark:text-saffron-200 px-2 py-0.5 rounded-md bg-saffron-500/15">
                  {currentSur.nameMr}
                </span>
              </div>

              {/* Live Mic Pitch Detector Button */}
              <button
                onClick={isDetectingSur ? stopSurDetection : startSurDetection}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                  isDetectingSur
                    ? 'bg-rose-600 text-white animate-pulse shadow-xs'
                    : 'bg-saffron-600 text-white hover:bg-saffron-700 active:scale-95'
                }`}
              >
                {isDetectingSur ? (
                  <>
                    <MicOff className="w-3 h-3" />
                    <span>ऐकणे थांबवा</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3 h-3" />
                    <span>माझा सूर ओळखा (AI)</span>
                  </>
                )}
              </button>
            </div>

            {surStatusMessage && (
              <p className="text-[11px] text-amber-700 dark:text-amber-300 italic">
                {surStatusMessage}
              </p>
            )}

            {/* Quick Sur Selectors */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-[var(--text-secondary)] font-semibold">
                लोकप्रिय सूर:
              </span>
              {POPULAR_SURS.map(sur => (
                <button
                  key={sur.key}
                  onClick={() => handleSurSelect(sur)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                    currentSur.key === sur.key
                      ? 'bg-saffron-500 text-white shadow-xs'
                      : 'border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:border-saffron-500/50'
                  }`}
                >
                  {sur.nameMr}
                </button>
              ))}

              <button
                onClick={() => setShowAllSurs(prev => !prev)}
                className="text-[10px] text-saffron-600 dark:text-saffron-400 font-bold hover:underline ml-1"
              >
                {showAllSurs ? 'कमी दाखवा' : 'सर्व १२ सूर...'}
              </button>
            </div>

            {showAllSurs && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 pt-1.5 border-t border-saffron-500/20">
                {INDIAN_SUR_REGISTRY.map(sur => (
                  <button
                    key={sur.key}
                    onClick={() => handleSurSelect(sur)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all text-center ${
                      currentSur.key === sur.key
                        ? 'bg-saffron-500 text-white shadow-xs'
                        : 'border border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:border-saffron-500/50'
                    }`}
                  >
                    <div>{sur.nameMr}</div>
                    <div className="text-[9px] opacity-75">{sur.nameEn}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Vani Preferences */}
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-main)] flex-wrap">
            <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI वाणी स्वर प्रकार:</span>
            </div>
            <div className="flex items-center gap-1">
              {(['auto', 'female', 'male'] as VoiceGenderPreference[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGenderPreference(g)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                    genderPreference === g
                      ? 'bg-emerald-600 text-white'
                      : 'border border-[var(--border-main)] text-[var(--text-secondary)] hover:border-emerald-500/50'
                  }`}
                >
                  {g === 'auto' ? 'आपोआप' : g === 'female' ? 'महिला स्वर' : 'पुरुष स्वर'}
                </button>
              ))}
            </div>
          </div>

          {/* Tempo & Volume Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                <span>वाद्य आवाज (Volume)</span>
                <span>{Math.round(musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                aria-label="Background music volume"
                className="w-full accent-saffron-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                <span>आरती ताल गती (Laya Tempo)</span>
                <span>{musicTempo} BPM</span>
              </div>
              <input
                type="range"
                min="60"
                max="120"
                step="2"
                value={musicTempo}
                onChange={e => handleTempoChange(parseInt(e.target.value, 10))}
                aria-label="Devotional music tempo"
                className="w-full accent-saffron-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
