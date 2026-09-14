/**
 * In-Browser Devotional Pitch & Sur Detector
 *
 * Implements real-time vocal pitch estimation (F0) using normalized
 * autocorrelation with first-peak detection and Indian Classical scale (Sur) mapping.
 * Runs 100% in-browser via Web Audio AnalyserNode without server latency.
 */

export interface IndianSur {
  key: string; // e.g. 'C#3'
  nameMr: string; // e.g. 'काळी १ (C#)'
  nameEn: string; // e.g. 'Kali 1 (C#)'
  freq: number; // fundamental Hz
  voiceType: 'male' | 'female' | 'universal';
}

export const INDIAN_SUR_REGISTRY: IndianSur[] = [
  { key: 'C3', nameMr: 'पांढरी १ (C)', nameEn: 'Safed 1 (C)', freq: 130.81, voiceType: 'male' },
  { key: 'C#3', nameMr: 'काळी १ (C#)', nameEn: 'Kali 1 (C#)', freq: 138.59, voiceType: 'male' },
  { key: 'D3', nameMr: 'पांढरी २ (D)', nameEn: 'Safed 2 (D)', freq: 146.83, voiceType: 'male' },
  { key: 'D#3', nameMr: 'काळी २ (D#)', nameEn: 'Kali 2 (D#)', freq: 155.56, voiceType: 'male' },
  { key: 'E3', nameMr: 'पांढरी ३ (E)', nameEn: 'Safed 3 (E)', freq: 164.81, voiceType: 'male' },
  { key: 'F3', nameMr: 'पांढरी ४ (F)', nameEn: 'Safed 4 (F)', freq: 174.61, voiceType: 'universal' },
  { key: 'F#3', nameMr: 'काळी ३ (F#)', nameEn: 'Kali 3 (F#)', freq: 185.0, voiceType: 'universal' },
  { key: 'G3', nameMr: 'पांढरी ५ (G)', nameEn: 'Safed 5 (G)', freq: 196.0, voiceType: 'female' },
  { key: 'G#3', nameMr: 'काळी ४ (G#)', nameEn: 'Kali 4 (G#)', freq: 207.65, voiceType: 'female' },
  { key: 'A3', nameMr: 'पांढरी ६ (A)', nameEn: 'Safed 6 (A)', freq: 220.0, voiceType: 'female' },
  { key: 'A#3', nameMr: 'काळी ५ (A#)', nameEn: 'Kali 5 (A#)', freq: 233.08, voiceType: 'female' },
  { key: 'B3', nameMr: 'पांढरी ७ (B)', nameEn: 'Safed 7 (B)', freq: 246.94, voiceType: 'female' },
];

/**
 * Finds the nearest traditional Indian Sur for a given pitch in Hertz
 */
export function matchFrequencyToSur(freqHz: number): { sur: IndianSur; centsDiff: number } {
  // Normalize frequency to the octave range 125Hz - 255Hz
  let normalizedFreq = freqHz;
  while (normalizedFreq < 125) normalizedFreq *= 2;
  while (normalizedFreq > 255) normalizedFreq /= 2;

  let bestSur = INDIAN_SUR_REGISTRY[2]; // Default D3
  let minDiff = Infinity;
  let bestCents = 0;

  for (const sur of INDIAN_SUR_REGISTRY) {
    // Difference in cents: 1200 * log2(f / f_sur)
    const cents = 1200 * Math.log2(normalizedFreq / sur.freq);
    const absDiff = Math.abs(cents);
    if (absDiff < minDiff) {
      minDiff = absDiff;
      bestSur = sur;
      bestCents = Math.round(cents);
    }
  }

  return { sur: bestSur, centsDiff: bestCents };
}

/**
 * Normalized Autocorrelation Pitch Detector (Time-Domain)
 * Uses first significant candidate peak detection to prevent octave halving.
 */
export function detectPitchAutocorrelation(
  buffer: Float32Array,
  sampleRate: number,
  clarityThreshold = 0.82
): { freq: number; clarity: number } | null {
  const SIZE = buffer.length;

  // 1. Calculate Root Mean Square (RMS) energy to discard silence
  let sumSq = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    sumSq += val * val;
  }
  const rms = Math.sqrt(sumSq / SIZE);
  if (rms < 0.012) {
    return null; // Too quiet
  }

  // 2. Autocorrelation over the human singing range (75 Hz to 650 Hz)
  const minPeriod = Math.floor(sampleRate / 650);
  const maxPeriod = Math.floor(sampleRate / 75);

  const correlations = new Float32Array(maxPeriod + 1);
  let globalMax = -1;

  for (let period = minPeriod; period <= maxPeriod; period++) {
    let corr = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < SIZE - period; i++) {
      const a = buffer[i];
      const b = buffer[i + period];
      corr += a * b;
      norm1 += a * a;
      norm2 += b * b;
    }

    const norm = Math.sqrt(norm1 * norm2);
    const normalizedCorr = norm > 0 ? corr / norm : 0;
    correlations[period] = normalizedCorr;

    if (normalizedCorr > globalMax) {
      globalMax = normalizedCorr;
    }
  }

  if (globalMax < clarityThreshold) {
    return null;
  }

  // 3. Find the FIRST prominent peak that reaches at least 88% of globalMax (avoids octave halving / subharmonics)
  let bestPeriod = -1;
  const peakCutoff = globalMax * 0.88;

  for (let period = minPeriod + 1; period < maxPeriod; period++) {
    const prev = correlations[period - 1];
    const curr = correlations[period];
    const next = correlations[period + 1];

    if (curr > prev && curr >= next && curr >= peakCutoff) {
      bestPeriod = period;
      break;
    }
  }

  if (bestPeriod === -1) {
    // Fallback to highest peak if no local maxima found
    for (let period = minPeriod; period <= maxPeriod; period++) {
      if (correlations[period] === globalMax) {
        bestPeriod = period;
        break;
      }
    }
  }

  if (bestPeriod > 0) {
    // Parabolic interpolation for sub-sample accuracy
    const y1 = correlations[bestPeriod - 1] || correlations[bestPeriod];
    const y2 = correlations[bestPeriod];
    const y3 = correlations[bestPeriod + 1] || correlations[bestPeriod];
    const delta = (y3 - y1) / (2 * (2 * y2 - y1 - y3) || 1);
    const refinedPeriod = bestPeriod + (Math.abs(delta) < 1 ? delta : 0);

    const freq = sampleRate / refinedPeriod;
    return { freq, clarity: globalMax };
  }

  return null;
}
