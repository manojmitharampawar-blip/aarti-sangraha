import { describe, it, expect } from 'vitest';
import {
  INDIAN_SUR_REGISTRY,
  matchFrequencyToSur,
  detectPitchAutocorrelation,
} from '@/lib/pitchDetector';
import {
  getCurrentDevotionalSur,
  setDevotionalMusicSur,
} from '@/lib/devotionalAudio';

describe('Adaptive Sur (Pitch) & Devotional Acoustic Harmonizer', () => {
  it('contains all 12 traditional Indian scales (Sur) in registry', () => {
    expect(INDIAN_SUR_REGISTRY.length).toBe(12);
    const keys = INDIAN_SUR_REGISTRY.map(s => s.key);
    expect(keys).toContain('C3');
    expect(keys).toContain('C#3');
    expect(keys).toContain('D3');
    expect(keys).toContain('G#3');
    expect(keys).toContain('A#3');
  });

  it('accurately maps fundamental frequencies to the correct Indian Sur', () => {
    // 138.6 Hz -> Kali 1 (C#3)
    const kali1 = matchFrequencyToSur(138.6);
    expect(kali1.sur.key).toBe('C#3');
    expect(kali1.sur.nameMr).toContain('काळी १');

    // 147.0 Hz -> Safed 2 (D3)
    const safed2 = matchFrequencyToSur(147.0);
    expect(safed2.sur.key).toBe('D3');
    expect(safed2.sur.nameMr).toContain('पांढरी २');

    // 207.65 Hz -> Kali 4 (G#3)
    const kali4 = matchFrequencyToSur(207.65);
    expect(kali4.sur.key).toBe('G#3');
    expect(kali4.sur.nameMr).toContain('काळी ४');

    // 233.1 Hz -> Kali 5 (A#3)
    const kali5 = matchFrequencyToSur(233.1);
    expect(kali5.sur.key).toBe('A#3');
    expect(kali5.sur.nameMr).toContain('काळी ५');
  });

  it('correctly maps higher octave pitches to the base Sur', () => {
    // D4 = 293.66 Hz should map to D3 (पांढरी २)
    const octaveMatch = matchFrequencyToSur(293.66);
    expect(octaveMatch.sur.key).toBe('D3');
    expect(Math.abs(octaveMatch.centsDiff)).toBeLessThan(5);

    // C#4 = 277.18 Hz should map to C#3 (काळी १)
    const kali1Octave = matchFrequencyToSur(277.18);
    expect(kali1Octave.sur.key).toBe('C#3');
    expect(Math.abs(kali1Octave.centsDiff)).toBeLessThan(5);
  });

  it('detects pitch accurately from synthetic audio buffers using autocorrelation', () => {
    const sampleRate = 44100;
    const targetFreq = 220; // A3
    const bufferSize = 2048;
    const buffer = new Float32Array(bufferSize);

    // Generate pure 220Hz sine wave
    for (let i = 0; i < bufferSize; i++) {
      buffer[i] = 0.5 * Math.sin((2 * Math.PI * targetFreq * i) / sampleRate);
    }

    const result = detectPitchAutocorrelation(buffer, sampleRate, 0.8);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.freq).toBeCloseTo(220, 0);
      expect(result.clarity).toBeGreaterThan(0.85);
    }
  });

  it('returns null safely for quiet silence or background noise', () => {
    const sampleRate = 44100;
    const silentBuffer = new Float32Array(2048); // all zeros
    const result = detectPitchAutocorrelation(silentBuffer, sampleRate);
    expect(result).toBeNull();
  });

  it('updates procedural harmonium sur via setDevotionalMusicSur', () => {
    const targetSur = INDIAN_SUR_REGISTRY[1]; // C#3
    setDevotionalMusicSur(targetSur);
    expect(getCurrentDevotionalSur().key).toBe('C#3');

    // Restore to D3 default
    setDevotionalMusicSur(INDIAN_SUR_REGISTRY[2]);
    expect(getCurrentDevotionalSur().key).toBe('D3');
  });
});
