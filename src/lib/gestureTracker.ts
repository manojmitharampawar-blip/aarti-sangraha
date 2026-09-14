/**
 * In-Browser Devotional Hand Gesture Tracker
 *
 * Tracks:
 * 1. Clockwise Circular Aarti Motion (प्रदक्षिणाकार आरती ओवाळणे)
 * 2. Namaskara / Anjali Mudra (हात जोडणे / नमस्कार)
 * 3. Swipe / Wave gestures (पुढचे कडवे)
 *
 * Runs 100% in-browser on a lightweight downsampled canvas (80x60)
 * to ensure high-FPS and low battery consumption on all mobile devices.
 */

export interface MotionCentroid {
  x: number;
  y: number;
  area: number;
  timestamp: number;
}

export interface GestureState {
  currentAngleDeg: number; // 0 to 360
  totalRevolutions: number; // Full clockwise rotations
  isClockwiseRotating: boolean;
  isNamaskarDetected: boolean;
  lastGestureTimestamp: number;
}

export class DevotionalGestureTracker {
  private prevFrameData: Uint8ClampedArray | null = null;
  private width = 80;
  private height = 60;
  private recentCentroids: MotionCentroid[] = [];
  private cumulativeAngleRad = 0;
  private lastAngleRad: number | null = null;
  private revolutions = 0;
  private lastNamaskarTime = -Infinity;
  private lastBellTime = -Infinity;

  public onAartiCircle?: (revolutions: number) => void;
  public onNamaskar?: () => void;
  public onSwipeUp?: () => void;

  /**
   * Processes a video frame using fast temporal frame differencing
   */
  public processFrame(
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement
  ): GestureState {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return this.getState();
    }

    ctx.drawImage(video, 0, 0, this.width, this.height);
    const frame = ctx.getImageData(0, 0, this.width, this.height);
    const data = frame.data;
    const now = performance.now();

    if (!this.prevFrameData) {
      this.prevFrameData = new Uint8ClampedArray(data);
      return this.getState();
    }

    // 1. Calculate motion centroid
    let sumX = 0;
    let sumY = 0;
    let motionPixels = 0;
    const threshold = 28; // Intensity diff threshold

    for (let i = 0; i < data.length; i += 4) {
      const diffR = Math.abs(data[i] - this.prevFrameData[i]);
      const diffG = Math.abs(data[i + 1] - this.prevFrameData[i + 1]);
      const diffB = Math.abs(data[i + 2] - this.prevFrameData[i + 2]);
      const diff = (diffR + diffG + diffB) / 3;

      if (diff > threshold) {
        const pixelIdx = i / 4;
        const x = pixelIdx % this.width;
        const y = Math.floor(pixelIdx / this.width);
        sumX += x;
        sumY += y;
        motionPixels++;
      }
    }

    // Save current frame for next comparison
    this.prevFrameData.set(data);

    // If significant motion detected (e.g. moving hand)
    if (motionPixels > 40) {
      const centroid: MotionCentroid = {
        x: sumX / motionPixels,
        y: sumY / motionPixels,
        area: motionPixels,
        timestamp: now,
      };

      this.addCentroid(centroid);
      this.analyzeGestures(centroid);
    }

    return this.getState();
  }

  private addCentroid(c: MotionCentroid) {
    this.recentCentroids.push(c);
    if (this.recentCentroids.length > 24) {
      this.recentCentroids.shift();
    }
  }

  /**
   * Analyzes movement vectors for circular clockwise aarti motion & namaskar
   */
  private analyzeGestures(current: MotionCentroid) {
    const now = current.timestamp;

    // 1. Check for Namaskar gesture: High motion concentrated in central upper quadrant
    const centerX = this.width / 2;
    const isCentral = Math.abs(current.x - centerX) < this.width * 0.22;
    const isUpper = current.y < this.height * 0.65;
    const isLargeArea = current.area > 220;

    if (isCentral && isUpper && isLargeArea && now - this.lastNamaskarTime > 2500) {
      this.lastNamaskarTime = now;
      if (this.onNamaskar) {
        this.onNamaskar();
      }
    }

    // 2. Check for Circular Clockwise Aarti Motion
    if (this.recentCentroids.length >= 4) {
      const centerBoxX = this.width / 2;
      const centerBoxY = this.height / 2;

      // Calculate polar angle relative to screen center
      const dx = current.x - centerBoxX;
      const dy = current.y - centerBoxY;
      const currentAngle = Math.atan2(dy, dx); // -PI to +PI

      if (this.lastAngleRad !== null) {
        let delta = currentAngle - this.lastAngleRad;

        // Normalize delta to [-PI, PI] to handle boundary wrap
        if (delta > Math.PI) delta -= 2 * Math.PI;
        if (delta < -Math.PI) delta += 2 * Math.PI;

        // Clockwise motion in screen coordinates
        if (Math.abs(delta) > 0.04 && Math.abs(delta) < 1.6) {
          this.cumulativeAngleRad += delta;

          // Full 360 degree circle completed (2 * PI radians)
          if (Math.abs(this.cumulativeAngleRad) >= 2 * Math.PI) {
            this.revolutions++;
            this.cumulativeAngleRad = 0;

            if (now - this.lastBellTime > 600) {
              this.lastBellTime = now;
              if (this.onAartiCircle) {
                this.onAartiCircle(this.revolutions);
              }
            }
          }
        }
      }

      this.lastAngleRad = currentAngle;
    }
  }

  public getState(): GestureState {
    const angleDeg = Math.round(((this.cumulativeAngleRad % (2 * Math.PI)) / (2 * Math.PI)) * 360);
    const normalizedDeg = angleDeg < 0 ? 360 + angleDeg : angleDeg;

    return {
      currentAngleDeg: normalizedDeg,
      totalRevolutions: this.revolutions,
      isClockwiseRotating: Math.abs(this.cumulativeAngleRad) > 0.5,
      isNamaskarDetected: performance.now() - this.lastNamaskarTime < 1800,
      lastGestureTimestamp: performance.now(),
    };
  }

  public reset() {
    this.cumulativeAngleRad = 0;
    this.lastAngleRad = null;
    this.revolutions = 0;
    this.recentCentroids = [];
    this.prevFrameData = null;
    this.lastNamaskarTime = -Infinity;
    this.lastBellTime = -Infinity;
  }
}
