/**
 * Devotional Chanting Aligner
 *
 * Matches spoken Devanagari / Marathi syllables and phrases
 * against an Aarti or Stotra's stanza lines to locate the devotee's position.
 */

import { Stanza } from '@/types';

export interface AlignmentResult {
  matchedStanzaIndex: number;
  confidence: number;
  matchedPhrase: string;
}

/**
 * Normalizes text for robust Devanagari matching (removes punctuation, virama variants)
 */
export function normalizeDevotionalText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[।॥,.!?;:()'"\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes word-overlap similarity score between recognized phrase and a stanza
 */
export function alignChantedTextToStanzas(
  spokenText: string,
  stanzas: Stanza[]
): AlignmentResult | null {
  const normSpoken = normalizeDevotionalText(spokenText);
  if (!normSpoken || stanzas.length === 0) return null;

  const spokenWords = normSpoken.split(' ').filter(w => w.length >= 2);
  if (spokenWords.length === 0) return null;

  let bestIndex = -1;
  let bestScore = 0;
  let bestPhrase = '';

  stanzas.forEach((stanza, idx) => {
    const fullStanzaText = normalizeDevotionalText(stanza.devanagari.join(' '));
    const stanzaWords = new Set(fullStanzaText.split(' '));

    // Count matched words
    let matchedWordCount = 0;
    for (const word of spokenWords) {
      if (stanzaWords.has(word) || fullStanzaText.includes(word)) {
        matchedWordCount++;
      }
    }

    const score = matchedWordCount / spokenWords.length;

    if (score > bestScore && score >= 0.3) {
      bestScore = score;
      bestIndex = idx;
      bestPhrase = spokenText;
    }
  });

  if (bestIndex !== -1) {
    return {
      matchedStanzaIndex: bestIndex,
      confidence: bestScore,
      matchedPhrase: bestPhrase,
    };
  }

  return null;
}
