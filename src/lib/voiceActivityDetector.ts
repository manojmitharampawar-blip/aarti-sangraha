/**
 * In-Browser Voice Activity Detector (VAD) for Devotional Chanting
 *
 * Distinguishes voiced singing/recitation from ambient background noise
 * using short-time energy (RMS) and zero-crossing rate (ZCR).
 * Runs 100% in-browser via Web Audio AnalyserNode.
 */

export interface VADMetrics {
  isChanting: boolean;
  energyRms: number;
  zeroCrossingRate: number;
  confidence: number;
}

export class DevotionalVoiceActivityDetector {
  private energyThreshold = 0.015; // Minimum RMS energy for vocal chant
  private zcrMin = 0.003; // Allows low-pitch devotional swaras (down to 80Hz)
  private zcrMax = 0.45; // Vocal singing boundary (avoids high-frequency hiss/fans)
  private consecutiveActiveFrames = 0;
  private consecutiveSilenceFrames = 0;
  private isCurrentlyActive = false;

  /**
   * Evaluates a float time-domain buffer of audio samples (typically 1024 or 2048)
   */
  public processAudioBuffer(buffer: Float32Array): VADMetrics {
    const size = buffer.length;
    if (size === 0) {
      return { isChanting: false, energyRms: 0, zeroCrossingRate: 0, confidence: 0 };
    }

    // 1. Calculate RMS energy
    let sumSq = 0;
    let zeroCrossings = 0;

    for (let i = 0; i < size; i++) {
      const val = buffer[i];
      sumSq += val * val;

      if (i > 0 && ((buffer[i] >= 0 && buffer[i - 1] < 0) || (buffer[i] < 0 && buffer[i - 1] >= 0))) {
        zeroCrossings++;
      }
    }

    const rms = Math.sqrt(sumSq / size);
    const zcr = zeroCrossings / size;

    // 2. Chanting detection logic
    const isEnergyHigh = rms >= this.energyThreshold;
    const isZcrVocal = zcr >= this.zcrMin && zcr <= this.zcrMax;
    const isFrameVoiced = isEnergyHigh && isZcrVocal;

    if (isFrameVoiced) {
      this.consecutiveActiveFrames++;
      this.consecutiveSilenceFrames = 0;

      // Quick activation (after ~2 frames / ~40-60ms)
      if (this.consecutiveActiveFrames >= 2) {
        this.isCurrentlyActive = true;
      }
    } else {
      this.consecutiveSilenceFrames++;
      this.consecutiveActiveFrames = 0;

      // Gentle pause hangover (~18-24 frames / ~400-500ms) to prevent jitter during breath pauses
      if (this.consecutiveSilenceFrames >= 18) {
        this.isCurrentlyActive = false;
      }
    }

    const confidence = Math.min(1.0, rms / (this.energyThreshold * 3));

    return {
      isChanting: this.isCurrentlyActive,
      energyRms: rms,
      zeroCrossingRate: zcr,
      confidence,
    };
  }

  public reset() {
    this.consecutiveActiveFrames = 0;
    this.consecutiveSilenceFrames = 0;
    this.isCurrentlyActive = false;
  }
}
