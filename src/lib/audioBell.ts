'use client';

interface BellOptions {
  enableHaptics?: boolean;
  volume?: number;
}

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Procedural Temple Bell synthesizer using multi-harmonic additive synthesis.
 * Emulates the brass resonance and decay of a traditional temple ghanti.
 */
export function playTempleBell(options: BellOptions = {}) {
  const { enableHaptics = true, volume = 0.6 } = options;

  if (enableHaptics && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(40);
    } catch {
      // ignore
    }
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const fundamental = 659.25; // E5

  // Harmonics with amplitude weights for rich temple bell metal sound
  const harmonics = [
    { freq: fundamental * 1, gain: 0.6, decay: 2.2 },
    { freq: fundamental * 1.51, gain: 0.4, decay: 1.8 },
    { freq: fundamental * 2.02, gain: 0.35, decay: 1.5 },
    { freq: fundamental * 2.75, gain: 0.2, decay: 1.2 },
    { freq: fundamental * 4.15, gain: 0.15, decay: 0.8 },
  ];

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume, now);
  masterGain.connect(ctx.destination);

  harmonics.forEach(({ freq, gain, decay }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gainNode.gain.setValueAtTime(gain, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + decay);
  });
}

/**
 * Procedural Conch (Shankh) tone synthesizer.
 */
export function playShankh(options: BellOptions = {}) {
  const { enableHaptics = true, volume = 0.7 } = options;

  if (enableHaptics && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([80, 40, 100]);
    } catch {
      // ignore
    }
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'sawtooth';
  // Shankh starting lower and swelling up
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.linearRampToValueAtTime(330, now + 0.5);
  osc.frequency.linearRampToValueAtTime(320, now + 2.0);

  gainNode.gain.setValueAtTime(0.01, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.4);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 2.5);
}
