import { describe, it, expect } from 'vitest';
import { DevotionalVoiceActivityDetector } from '@/lib/voiceActivityDetector';
import { alignChantedTextToStanzas, normalizeDevotionalText } from '@/lib/chantingAligner';
import { Stanza } from '@/types';

describe('Phase 4: Hands-free Chanting Follower & Devotional VAD', () => {
  it('normalizes Devanagari text correctly by stripping punctuation and extra spaces', () => {
    const raw = 'सुखकर्ता दुखहर्ता, वार्ता विघ्नाची! ॥१॥';
    const norm = normalizeDevotionalText(raw);
    expect(norm).toBe('सुखकर्ता दुखहर्ता वार्ता विघ्नाची १');
  });

  it('accurately aligns spoken chant phrases to the correct stanza', () => {
    const mockStanzas: Stanza[] = [
      {
        stanzaNumber: 1,
        devanagari: ['सुखकर्ता दुखहर्ता वार्ता विघ्नाची', 'नुरवी पुरवी प्रेम कृपा जयाची'],
        transliteration: ['sukhkarta dukhharta varta vighnachi'],
      },
      {
        stanzaNumber: 2,
        devanagari: ['रत्नखचित फरा तुज गौरीकुमरा', 'चंदनाची उटी कुंकुमकेशरा'],
        transliteration: ['ratnakhachit phara tuja gaurikumara'],
      },
      {
        stanzaNumber: 3,
        devanagari: ['लंबोदर पीतांबर फणिवरबंधना', 'सरळ सोंड वक्रतुंड त्रिनयना'],
        transliteration: ['lambodara pitambara phanivarabandhana'],
      },
    ];

    // Spoken line from Stanza 1
    const match1 = alignChantedTextToStanzas('सुखकर्ता दुःखहर्ता', mockStanzas);
    expect(match1).not.toBeNull();
    expect(match1?.matchedStanzaIndex).toBe(0);

    // Spoken line from Stanza 2
    const match2 = alignChantedTextToStanzas('चंदनाची उटी कुंकुमकेशरा', mockStanzas);
    expect(match2).not.toBeNull();
    expect(match2?.matchedStanzaIndex).toBe(1);

    // Spoken line from Stanza 3
    const match3 = alignChantedTextToStanzas('लंबोदर पीतांबर', mockStanzas);
    expect(match3).not.toBeNull();
    expect(match3?.matchedStanzaIndex).toBe(2);

    // Irrelevant phrase
    const matchNone = alignChantedTextToStanzas('काहीतरी भलतेच वाक्य', mockStanzas);
    expect(matchNone).toBeNull();
  });

  it('detects silence and vocal chanting in audio buffers', () => {
    const vad = new DevotionalVoiceActivityDetector();

    // 1. Silent buffer
    const silentBuffer = new Float32Array(1024); // all 0s
    const metricsSilent = vad.processAudioBuffer(silentBuffer);
    expect(metricsSilent.isChanting).toBe(false);
    expect(metricsSilent.energyRms).toBe(0);

    // 2. Chanting vocal wave (synthetic 220Hz sine with amplitude 0.25)
    const vocalBuffer = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      vocalBuffer[i] = 0.25 * Math.sin((2 * Math.PI * 220 * i) / 44100);
    }

    // Process a couple frames to pass the activation threshold
    vad.processAudioBuffer(vocalBuffer);
    const metricsVocal = vad.processAudioBuffer(vocalBuffer);
    expect(metricsVocal.isChanting).toBe(true);
    expect(metricsVocal.energyRms).toBeGreaterThan(0.05);

    // 3. Reset
    vad.reset();
    expect(vad.processAudioBuffer(silentBuffer).isChanting).toBe(false);
  });
});
