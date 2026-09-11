'use client';

import React, { useState, useEffect } from 'react';
import {
  Music,
  Volume2,
  VolumeX,
  Sliders,
  Play,
  Pause,
  Square,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  startDevotionalMusic,
  stopDevotionalMusic,
  isDevotionalMusicPlaying,
  setDevotionalMusicVolume,
  setDevotionalMusicTempo,
} from '@/lib/devotionalAudio';
import { useAartiSpeech } from '@/hooks/useAartiSpeech';
import { Stanza, ScriptType } from '@/types';

interface DevotionalAudioBarProps {
  stanzas?: Stanza[];
  script?: ScriptType;
  onSpeechComplete?: () => void;
  autoPlayMusic?: boolean;
}

export function DevotionalAudioBar({
  stanzas = [],
  script = 'devanagari',
  onSpeechComplete,
  autoPlayMusic = false,
}: DevotionalAudioBarProps) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [musicTempo, setMusicTempo] = useState(82);
  const [showSettings, setShowSettings] = useState(false);

  const {
    isSupported: speechSupported,
    isSpeaking,
    isPaused,
    rate: speechRate,
    setRate: setSpeechRate,
    speak,
    pause: pauseSpeech,
    resume: resumeSpeech,
    stop: stopSpeech,
  } = useAartiSpeech();

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopDevotionalMusic();
    };
  }, []);

  // Toggle Background Devotional Music
  const toggleMusic = () => {
    if (isMusicPlaying) {
      stopDevotionalMusic();
      setIsMusicPlaying(false);
    } else {
      startDevotionalMusic({ bpm: musicTempo, volume: musicVolume });
      setIsMusicPlaying(true);
    }
  };

  // Toggle Text-to-Speech Recitation
  const toggleSpeech = () => {
    if (isSpeaking) {
      if (isPaused) {
        resumeSpeech();
      } else {
        pauseSpeech();
      }
    } else {
      speak(stanzas, script, onSpeechComplete);
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

  return (
    <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] p-3 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Background Music Button */}
        <div className="flex items-center gap-2">
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
            <span>{isMusicPlaying ? 'वाद्य संगीत चालू' : 'वाद्य संगीत (मृदुंग/टाळ/सूर)'}</span>
          </button>

          {/* Settings Accordion Toggle */}
          <button
            onClick={() => setShowSettings(prev => !prev)}
            aria-label="Adjust audio settings"
            className="p-1.5 rounded-lg border border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text-to-Speech Recitation Button */}
        {speechSupported && (
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSpeech}
              aria-label="Toggle text to speech recitation"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSpeaking && !isPaused
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 animate-pulse'
                  : 'border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:border-emerald-500/50'
              }`}
            >
              {isSpeaking && !isPaused ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>{isSpeaking ? (isPaused ? 'वाचन सुरू ठेवा' : 'वाचन थांबवा') : 'ऑडिओ पठण (बोलून दाखवा)'}</span>
            </button>

            {isSpeaking && (
              <button
                onClick={stopSpeech}
                aria-label="Stop speech recitation"
                className="p-1.5 rounded-lg border border-rose-200 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
              >
                <Square className="w-3.5 h-3.5 fill-rose-600" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expanded Audio Settings */}
      {showSettings && (
        <div className="pt-2 border-t border-[var(--border-main)] space-y-3 text-xs">
          {/* Music Volume Slider */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[var(--text-secondary)] font-semibold flex items-center gap-1">
              <Volume2 className="w-3 h-3" />
              <span>वाद्य आवाज (Music Volume):</span>
            </span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="w-28 accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Music Tempo Buttons */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[var(--text-secondary)] font-semibold">
              लय (Rhythm Tempo):
            </span>
            <div className="flex gap-1">
              {[
                { label: 'मंद (72)', bpm: 72 },
                { label: 'मध्यम (82)', bpm: 82 },
                { label: 'जलद (96)', bpm: 96 },
              ].map(t => (
                <button
                  key={t.bpm}
                  onClick={() => handleTempoChange(t.bpm)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                    musicTempo === t.bpm
                      ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      : 'border-[var(--border-main)] text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speech Rate Control */}
          {speechSupported && (
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-dashed border-[var(--border-main)]">
              <span className="text-[var(--text-secondary)] font-semibold">
                वाचन गती (Speech Speed):
              </span>
              <div className="flex gap-1">
                {[
                  { label: '0.8x शांत', rate: 0.8 },
                  { label: '1.0x सामान्य', rate: 1.0 },
                  { label: '1.2x जलद', rate: 1.2 },
                ].map(r => (
                  <button
                    key={r.rate}
                    onClick={() => setSpeechRate(r.rate)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      speechRate === r.rate
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        : 'border-[var(--border-main)] text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
