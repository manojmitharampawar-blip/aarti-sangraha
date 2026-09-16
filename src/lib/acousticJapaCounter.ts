/**
 * Acoustic Japa & Avartan Counter (स्मार्ट जप व पाठ गणक)
 *
 * Hands-free counter for sacred mantra repetitions (11, 21, 54, 108 malas).
 * Detects completed verse recitations via speech recognition or rhythmic acoustic pauses
 * without requiring the devotee to touch their phone during active puja.
 */

export interface JapaSessionState {
  currentCount: number;
  targetCount: number;
  mantraOrStotraTitle: string;
  isCompleted: boolean;
  startTime: number;
  elapsedSeconds: number;
}

export const JAPA_MALA_TARGETS = [11, 21, 54, 108] as const;
export type JapaTarget = (typeof JAPA_MALA_TARGETS)[number];

export class AcousticJapaTracker {
  private count = 0;
  private target = 11;
  private isListening = false;
  private recognition: any = null;
  private onCountChangeCallback?: (count: number, completed: boolean) => void;
  private lastIncrementTimestamp = 0;
  private minimumCooldownMs = 2500; // Prevents double counting rapid utterances

  constructor(target: number = 11, onCountChange?: (count: number, completed: boolean) => void) {
    this.target = target;
    this.onCountChangeCallback = onCountChange;
  }

  public setTarget(target: number) {
    this.target = target;
  }

  public getCount(): number {
    return this.count;
  }

  public incrementManually(): boolean {
    const now = Date.now();
    if (now - this.lastIncrementTimestamp < 300) return false;
    this.lastIncrementTimestamp = now;

    this.count += 1;
    const isCompleted = this.count >= this.target;

    if (this.onCountChangeCallback) {
      this.onCountChangeCallback(this.count, isCompleted);
    }
    return isCompleted;
  }

  public reset() {
    this.count = 0;
    if (this.onCountChangeCallback) {
      this.onCountChangeCallback(0, false);
    }
  }

  /**
   * Starts hands-free acoustic voice tracking
   */
  public startVoiceTracking(keyPhrases: string[] = []): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return false;

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'mr-IN';

      this.recognition.onresult = (event: any) => {
        const results = event.results;
        if (!results || results.length === 0) return;

        const latest = results[results.length - 1];
        if (latest && latest[0]) {
          const transcript = latest[0].transcript.trim().toLowerCase();
          const now = Date.now();

          // Increment if cooldown elapsed and transcript contains mantra or end markers
          if (now - this.lastIncrementTimestamp >= this.minimumCooldownMs) {
            let matched = keyPhrases.length === 0;
            if (!matched) {
              matched = keyPhrases.some(p => transcript.includes(p.toLowerCase()));
            }

            if (matched) {
              this.lastIncrementTimestamp = now;
              this.count += 1;
              const isCompleted = this.count >= this.target;

              if (this.onCountChangeCallback) {
                this.onCountChangeCallback(this.count, isCompleted);
              }
            }
          }
        }
      };

      this.recognition.onerror = () => {
        // restart silently if still listening
        if (this.isListening) {
          try {
            this.recognition?.start();
          } catch {
            // ignore
          }
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try {
            this.recognition?.start();
          } catch {
            // ignore
          }
        }
      };

      this.isListening = true;
      this.recognition.start();
      return true;
    } catch {
      return false;
    }
  }

  public stopVoiceTracking() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
  }
}
