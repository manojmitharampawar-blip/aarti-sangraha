/**
 * Vedic & Devotional Phonetic Preprocessor
 *
 * Deconstructs Devanagari script into metrical syllables (अक्षर / पदच्छेद)
 * and provides pronunciation guidance for Sanskrit stotras & Marathi aartis.
 */

export interface SyllableToken {
  syllable: string;
  transliteration: string;
  isHeavy: boolean; // Guru (दीर्घ/गुरु) vs Laghu (ह्रस्व/लघु)
}

export interface PronunciationRule {
  character: string;
  devanagariExample: string;
  phoneticDescription: string;
  commonMistake: string;
  authenticGuidance: string;
}

/**
 * Standard Vedic and Marathi Pronunciation Guidelines
 */
export const VEDIC_PRONUNCIATION_RULES: PronunciationRule[] = [
  {
    character: 'ज्ञ',
    devanagariExample: 'ज्ञान, यज्ञ',
    phoneticDescription: 'Marathi: "dnya" (द्+ञ), Sanskrit: "jña" (ज्+ञ)',
    commonMistake: 'Pronouncing as Hindi "gya"',
    authenticGuidance: 'In Maharashtra tradition, pronounce with soft nasal dental "Dnya" (ज्ञान = Dnyān).',
  },
  {
    character: 'ऋ',
    devanagariExample: 'ऋषि, कृपा',
    phoneticDescription: 'Sanskrit/Marathi vocalic "ru / ri"',
    commonMistake: 'Skipping vocalic roll or stretching to long "ree"',
    authenticGuidance: 'Pronounce as short, crisp "Ru" in Marathi (कृपा = Krupā) and subtle "Ri" in classical Vedic.',
  },
  {
    character: 'ः (विसर्ग)',
    devanagariExample: 'नमः, दुःख',
    phoneticDescription: 'Unvoiced glottal aspiration echoing preceding vowel',
    commonMistake: 'Pronouncing as harsh "ha" or omitting completely',
    authenticGuidance: 'Gently release breath echoing the previous vowel: "नमः" sounds like "Namaha", "शांतिः" sounds like "Shantihi".',
  },
  {
    character: 'ं (अनुस्वार)',
    devanagariExample: 'मंगल, शांत',
    phoneticDescription: 'Nasal consonant adapting to following varga (kavarga, chavarga, etc.)',
    commonMistake: 'Flat "n" or "m" everywhere',
    authenticGuidance: 'Before क/ख/ग it becomes "ङ" (Ang), before त/थ/द it becomes "न", before प/फ/ब it becomes "म".',
  },
  {
    character: 'ळ',
    devanagariExample: 'मंगळ, काळ',
    phoneticDescription: 'Retroflex lateral flap (वैदिक ळ / Lha)',
    commonMistake: 'Replacing with plain dental "ल" (L)',
    authenticGuidance: 'Curl the tip of the tongue up against the hard palate for authentic Marathi timbre.',
  },
  {
    character: 'श vs ष',
    devanagariExample: 'शिव (श), पुरुष (ष)',
    phoneticDescription: 'Palatal "Sha" (श) vs Retroflex "Sha" (ष)',
    commonMistake: 'Treating both as identical soft "sh"',
    authenticGuidance: 'For "श", blade of tongue touches palatal roof. For "ष", tongue curls back retroflexly.',
  },
];

/**
 * Splits Devanagari text into syllables (Aksharas) preserving viramas, matras, and conjuncts.
 */
export function syllabifyDevanagari(text: string): string[] {
  if (!text) return [];

  const cleaned = text.trim();

  // Regex matching Devanagari consonant cluster + optional vowel signs + anusvara/visarga
  // or standalone independent vowel + modifiers
  const devanagariSyllableRegex =
    /(?:(?:[\u0915-\u0939]\u094D)*[\u0915-\u0939][\u093E-\u094C\u0962\u0963]?|[\u0904-\u0914\u0960\u0961])[\u0901-\u0903]?/g;

  const matches = cleaned.match(devanagariSyllableRegex);
  if (!matches) {
    return cleaned.split(/\s+/);
  }

  return matches;
}

/**
 * Generates an interactive syllable-by-syllable breakdown of a prayer line
 */
export function getLineSyllables(line: string): SyllableToken[] {
  const aksharas = syllabifyDevanagari(line);

  return aksharas.map(ak => {
    // Check if syllable contains long vowels (आ, ई, ऊ, ए, ऐ, ओ, औ, or matras)
    const isHeavy = /[\u093E\u0940\u0942\u0947\u0948\u094B\u094C\u0906\u0908\u090A\u090F\u0910\u0913\u0914\u0902\u0903]/.test(
      ak
    );

    return {
      syllable: ak,
      transliteration: approximateTransliteration(ak),
      isHeavy,
    };
  });
}

/**
 * Fast approximate transliteration of a single Devanagari syllable
 */
function approximateTransliteration(syllable: string): string {
  const charMap: Record<string, string> = {
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
    'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
    'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
    'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
    'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha',
    'ष': 'sha', 'स': 'sa', 'ह': 'ha', 'ळ': 'la', 'क्ष': 'ksha',
    'ज्ञ': 'dnya',
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'm', 'ः': 'h',
    '्': '',
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ऋ': 'ru', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  };

  let res = '';
  for (const char of syllable) {
    if (charMap[char] !== undefined) {
      res += charMap[char];
    } else {
      res += char;
    }
  }
  return res || syllable;
}

/**
 * Phonetic preprocessor for natural AI speech synthesis
 * Converts complex Vedic spellings to optimal pronunciation strings for TTS voices.
 */
export function preprocessDevotionalPronunciation(text: string): string {
  if (!text) return '';

  return text
    // Replace duplicate visarga or irregular signs
    .replace(/ःः+/g, 'ः')
    // Smooth pronunciation of 'दुःख' to natural 'दुख'
    .replace(/दुःख/g, 'दुख')
    // Remove refrains and numbers FIRST while dandas are intact
    .replace(/[॥।]\s*[\d०-९]+\s*[॥।]/g, '')
    .replace(/\(\s*[\d०-९]+\s*\)/g, '')
    .replace(/\[\s*[\d०-९]+\s*\]/g, '')
    // Ensure respectful full pronunciation of remaining danda stops
    .replace(/।/g, ' , ')
    .replace(/॥/g, ' . ')
    .replace(/\s+/g, ' ')
    .trim();
}
