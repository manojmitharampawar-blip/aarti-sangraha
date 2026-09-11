import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  startDevotionalMusic,
  stopDevotionalMusic,
  isDevotionalMusicPlaying,
  setDevotionalMusicVolume,
  setDevotionalMusicTempo,
} from '@/lib/devotionalAudio';

describe('Devotional Audio Synthesizer (Harmonium, Mridang, Taal)', () => {
  beforeEach(() => {
    stopDevotionalMusic();
  });

  afterEach(() => {
    stopDevotionalMusic();
  });

  it('starts and stops procedural devotional music', () => {
    expect(isDevotionalMusicPlaying()).toBe(false);
    startDevotionalMusic({ bpm: 85, volume: 0.5 });
    expect(isDevotionalMusicPlaying()).toBe(true);

    stopDevotionalMusic();
    expect(isDevotionalMusicPlaying()).toBe(false);
  });

  it('adjusts volume and tempo safely', () => {
    startDevotionalMusic();
    expect(() => setDevotionalMusicVolume(0.8)).not.toThrow();
    expect(() => setDevotionalMusicTempo(95)).not.toThrow();
    stopDevotionalMusic();
  });
});
