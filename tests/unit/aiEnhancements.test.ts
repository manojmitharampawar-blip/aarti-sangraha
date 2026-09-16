import { describe, it, expect } from 'vitest';
import {
  syllabifyDevanagari,
  getLineSyllables,
  preprocessDevotionalPronunciation,
  VEDIC_PRONUNCIATION_RULES,
} from '@/lib/phoneticPreprocessor';
import { getStanzaBhavarth } from '@/lib/bhavarthEngine';
import { BHAVARTH_REGISTRY } from '@/data/bhavarthData';
import { queryUpasanaGuidance, UPASANA_KNOWLEDGE_BASE } from '@/lib/upasanaAiEngine';
import {
  sanitizeChantingText,
  selectBestChantingVoice,
  LAYA_RATES,
} from '@/hooks/useAartiSpeech';
import { aartis } from '@/data/aartis';

describe('AI Enhancements Suite', () => {
  describe('Vedic Phonetic Preprocessor (शुद्ध उच्चार)', () => {
    it('accurately syllabifies Devanagari lines into aksharas', () => {
      const syllables = syllabifyDevanagari('सुखकर्ता दुःखहर्ता');
      expect(syllables.length).toBeGreaterThanOrEqual(4);
      expect(syllables).toContain('सु');
      expect(syllables).toContain('ख');
    });

    it('generates line syllables with light/heavy metrical classification', () => {
      const lineTokens = getLineSyllables('जय देव जय देव');
      expect(lineTokens.length).toBeGreaterThan(0);
      expect(lineTokens[0].syllable).toBe('ज');
      expect(lineTokens[0].isHeavy).toBe(false);
      // 'दे' has 'े' matra so it should be heavy (guru)
      const deToken = lineTokens.find(t => t.syllable === 'दे');
      expect(deToken).toBeDefined();
      expect(deToken?.isHeavy).toBe(true);
    });

    it('preprocesses devotional pronunciation smoothing punctuation and conjuncts', () => {
      const smoothed = preprocessDevotionalPronunciation('सुखकर्ता दुःखहर्ता । वार्ता विघ्नाची ॥ १ ॥');
      expect(smoothed).not.toContain('॥');
      expect(smoothed).not.toContain('१');
      expect(smoothed).toContain('दुखहर्ता');
    });

    it('contains comprehensive Vedic and Marathi pronunciation rules', () => {
      expect(VEDIC_PRONUNCIATION_RULES.length).toBeGreaterThanOrEqual(5);
      const chars = VEDIC_PRONUNCIATION_RULES.map(r => r.character);
      expect(chars).toContain('ज्ञ');
      expect(chars).toContain('ऋ');
      expect(chars).toContain('ं (अनुस्वार)');
    });
  });

  describe('Bhavarth & Meaning Engine (भावार्थ व संदर्भा)', () => {
    it('retrieves curated stanza-level Bhavarth for Sukhkarta Dukhharta', () => {
      const sukhkarta = aartis.find(a => a.slug === 'sukhkarta-dukhharta');
      expect(sukhkarta).toBeDefined();

      const bhavarth = getStanzaBhavarth('sukhkarta-dukhharta', 0, sukhkarta?.stanzas[0], sukhkarta);
      expect(bhavarth.isCurated).toBe(true);
      expect(bhavarth.marathiMeaning).toContain('सुख देणारा');
      expect(bhavarth.englishMeaning).toContain('Lord Ganesha');
      expect(bhavarth.keywords).toContain('आनंददाता');
    });

    it('retrieves curated Bhavarth for Yuge Atthavis and Lavthavti Vikrala', () => {
      const vitthal = BHAVARTH_REGISTRY['yuge-atthavis'];
      expect(vitthal).toBeDefined();
      expect(vitthal.stanzas[0].marathi).toContain('अठ्ठावीस युगे');

      const shiva = BHAVARTH_REGISTRY['lavthavti-vikrala'];
      expect(shiva).toBeDefined();
      expect(shiva.stanzas[0].marathi).toContain('त्रिनेत्र');
    });

    it('dynamically derives meaningful devotional context for any arbitrary stanza', () => {
      const mockStanza = {
        stanzaNumber: 1,
        devanagari: ['सद्गुरु कृपा देई आम्हा दर्शन'],
        transliteration: ['Sadguru kripa deyi aamha darshana'],
      };

      const result = getStanzaBhavarth('custom-hymn', 0, mockStanza);
      expect(result.marathiMeaning).toBeTruthy();
      expect(result.englishMeaning).toBeTruthy();
      expect(result.keywords.length).toBeGreaterThan(0);
    });
  });

  describe('Upasana AI Engine (उपासना मित्र)', () => {
    it('contains comprehensive spiritual guidance modules', () => {
      expect(UPASANA_KNOWLEDGE_BASE.length).toBeGreaterThanOrEqual(5);
    });

    it('resolves deity queries based on day of week and intent', () => {
      const shivaQuery = queryUpasanaGuidance('सोमवारची शिवपूजा विधी');
      expect(shivaQuery.topic).toBe('daily-somwar');
      expect(shivaQuery.recommendedDeityId).toBe('shiva');
      expect(shivaQuery.ritualsTips.length).toBeGreaterThan(0);

      const ganeshQuery = queryUpasanaGuidance('मंगळवार गणपती उपासना');
      expect(ganeshQuery.topic).toBe('daily-mangalwar');
      expect(ganeshQuery.recommendedDeityId).toBe('ganesha');

      const guruQuery = queryUpasanaGuidance('गुरुवार दत्त व स्वामी उपासना');
      expect(guruQuery.topic).toBe('daily-guruwar');
      expect(guruQuery.recommendedDeityId).toBe('dattatreya');
    });

    it('provides clear guidelines for Aarti waving rules and Sankashti fasting', () => {
      const aartiRule = queryUpasanaGuidance('आरती कशी ओवाळावी शास्त्र काय आहे?');
      expect(aartiRule.topic).toBe('ritual-aarti-rules');
      expect(aartiRule.answerDevanagari).toContain('घड्याळाच्या काट्याच्या दिशेने');

      const sankashti = queryUpasanaGuidance('संकष्टी चतुर्थीचे व्रत नियम');
      expect(sankashti.topic).toBe('sankashti-chaturthi');
      expect(sankashti.recommendedHymnSlugs).toContain('sankata-nashana-ganesh-stotra');
    });
  });

  describe('AI Vani Prosodic Recitation (स्वर-लय व नैसर्गिक पठण)', () => {
    it('provides well-defined devotional Laya speed rates', () => {
      expect(LAYA_RATES.vilambit).toBe(0.74);
      expect(LAYA_RATES.madhya).toBe(0.86);
      expect(LAYA_RATES.dhrut).toBe(1.02);
    });

    it('sanitizes chanting text without dropping sacred syllables', () => {
      const sanitized = sanitizeChantingText('जय देव जय देव (ध्रु.) ॥ १ ॥');
      expect(sanitized).toBe('जय देव जय देव');
    });

    it('intelligently selects best Indian voice given mock speech voices', () => {
      const mockVoices = [
        { name: 'Alex', lang: 'en-US' },
        { name: 'Google मराठी', lang: 'mr-IN' },
        { name: 'Google हिन्दी', lang: 'hi-IN' },
      ] as SpeechSynthesisVoice[];

      const mrChoice = selectBestChantingVoice(mockVoices, 'devanagari');
      expect(mrChoice?.lang).toBe('mr-IN');

      const enChoice = selectBestChantingVoice(mockVoices, 'transliteration');
      expect(enChoice).toBeDefined();
    });

    it('supports voice gender preference filtering', () => {
      const mockVoices = [
        { name: 'Google Swara (Natural)', lang: 'hi-IN' },
        { name: 'Google Madhur', lang: 'hi-IN' },
      ] as SpeechSynthesisVoice[];

      const femaleChoice = selectBestChantingVoice(mockVoices, 'devanagari', 'female');
      expect(femaleChoice?.name).toContain('Swara');

      const maleChoice = selectBestChantingVoice(mockVoices, 'devanagari', 'male');
      expect(maleChoice?.name).toContain('Madhur');
    });
  });
});
