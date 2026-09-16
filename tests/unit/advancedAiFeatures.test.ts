import { describe, it, expect, vi } from 'vitest';
import {
  DEFAULT_TEMPLE_ACOUSTICS,
  generateTempleImpulseResponse,
} from '@/lib/templeAcousticEngine';
import {
  AcousticJapaTracker,
  JAPA_MALA_TARGETS,
} from '@/lib/acousticJapaCounter';
import {
  SCRIPTURAL_CITATIONS_REGISTRY,
  findScripturalCitations,
} from '@/lib/scripturalKnowledgeBase';

describe('Advanced AI & UX Elevation Suite', () => {
  describe('Temple Acoustic Spatialization (गर्भगृह ध्वनी)', () => {
    it('provides authentic acoustic parameters for stone sanctums', () => {
      expect(DEFAULT_TEMPLE_ACOUSTICS.reverbDecaySeconds).toBe(2.8);
      expect(DEFAULT_TEMPLE_ACOUSTICS.droneFrequencyHz).toBe(432);
      expect(DEFAULT_TEMPLE_ACOUSTICS.enableHarmonicDrone).toBe(true);
    });

    it('procedurally generates stereo impulse response buffers with stone decay', () => {
      const mockAudioContext = {
        sampleRate: 44100,
        createBuffer: (channels: number, length: number, sampleRate: number) => ({
          numberOfChannels: channels,
          length,
          sampleRate,
          getChannelData: (ch: number) => new Float32Array(length),
        }),
      } as unknown as AudioContext;

      const buffer = generateTempleImpulseResponse(mockAudioContext, 1.0, 2.0);
      expect(buffer.numberOfChannels).toBe(2);
      expect(buffer.length).toBe(44100);
    });
  });

  describe('Smart Hands-Free Japa Mala (स्मार्ट जप व पाठ गणक)', () => {
    it('supports traditional Mala count presets (11, 21, 54, 108)', () => {
      expect(JAPA_MALA_TARGETS).toContain(11);
      expect(JAPA_MALA_TARGETS).toContain(21);
      expect(JAPA_MALA_TARGETS).toContain(54);
      expect(JAPA_MALA_TARGETS).toContain(108);
    });

    it('tracks repetition counts and signals completion when target is reached', () => {
      let latestCount = 0;
      let isDone = false;

      const tracker = new AcousticJapaTracker(3, (count, completed) => {
        latestCount = count;
        isDone = completed;
      });

      expect(tracker.getCount()).toBe(0);

      // Increment 1
      tracker.incrementManually();
      expect(tracker.getCount()).toBe(1);
      expect(isDone).toBe(false);

      // Increment 2
      // Fast forward timestamp check by mocking Date.now or calling after delay
      vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 1000);
      tracker.incrementManually();
      expect(tracker.getCount()).toBe(2);
      expect(isDone).toBe(false);

      // Increment 3 (Target reached)
      vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 2000);
      const completed = tracker.incrementManually();
      expect(tracker.getCount()).toBe(3);
      expect(completed).toBe(true);
      expect(isDone).toBe(true);

      // Reset
      tracker.reset();
      expect(tracker.getCount()).toBe(0);

      vi.restoreAllMocks();
    });
  });

  describe('Scriptural RAG Knowledge Base (संत साहित्य ज्ञानपीठ)', () => {
    it('contains comprehensive citations from revered saints and shastras', () => {
      expect(SCRIPTURAL_CITATIONS_REGISTRY.length).toBeGreaterThanOrEqual(5);

      const sources = SCRIPTURAL_CITATIONS_REGISTRY.map(c => c.sourceTextMr);
      expect(sources.some(s => s.includes('दासबोध'))).toBe(true);
      expect(sources.some(s => s.includes('ज्ञानेश्वरी'))).toBe(true);
      expect(sources.some(s => s.includes('तुकाराम गाथा'))).toBe(true);
      expect(sources.some(s => s.includes('गुरुचरित्र'))).toBe(true);
    });

    it('matches user queries to authentic scriptural passages', () => {
      const dasbodhMatches = findScripturalCitations('आरती व सगुण भक्तीचा महिमा');
      expect(dasbodhMatches.length).toBeGreaterThan(0);
      expect(dasbodhMatches[0].sourceTextMr).toContain('दासबोध');

      const dnyaneshwariMatches = findScripturalCitations('ज्ञानेश्वरी नामसंकीर्तन');
      expect(dnyaneshwariMatches.some(m => m.sourceTextMr.includes('ज्ञानेश्वरी'))).toBe(true);

      const guruMatches = findScripturalCitations('श्री स्वामी समर्थ व दत्त महाराज');
      expect(guruMatches.some(m => m.sourceTextMr.includes('गुरुचरित्र'))).toBe(true);
    });
  });
});
