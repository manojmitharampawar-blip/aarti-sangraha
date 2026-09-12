// Procedural Web Audio Synthesizer for Devotional Temple Music:
// 1. Harmonium (सुर/संवादिनी) - Warm phase-detuned oscillators with acoustic bellows LFO
// 2. Mridang / Pakhawaj (मृदुंग) - Dual-tone punchy bass & crisp resonant slaps audible on mobile speakers
// 3. Taal / Manjira (झांज / टाळ) - Metallic brass chime with rhythmic traditional theka

import { getSharedAudioContext } from '@/lib/audioContext';

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let masterGain: GainNode | null = null;
let harmoniumNodes: { oscs: (OscillatorNode | GainNode)[]; gain: GainNode } | null = null;
let scheduleIntervalId: ReturnType<typeof setInterval> | null = null;
let currentBpm = 82; // Traditional moderate devotional tempo
let nextBeatTime = 0;
let currentBeat = 0;

function getAudioContext(): AudioContext | null {
  audioCtx = getSharedAudioContext();
  return audioCtx;
}

// 1. HARMONIUM DRONE (Sa-Pa chord drone with acoustic bellows LFO)
// Tuned for high acoustic clarity on phone speakers and rich warmth on headphones
function startHarmoniumDrone(ctx: AudioContext, parentGain: GainNode) {
  const droneGain = ctx.createGain();
  droneGain.gain.setValueAtTime(0.28, ctx.currentTime);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1100, ctx.currentTime);
  filter.Q.setValueAtTime(1.5, ctx.currentTime);

  // Sa-Pa Frequencies: D3 (146.8Hz), A3 (220Hz), D4 (293.66Hz), F#4 (369.99Hz)
  const baseFreqs = [
    { freq: 146.83, type: 'sawtooth' as OscillatorType, vol: 0.22 },
    { freq: 147.2, type: 'sawtooth' as OscillatorType, vol: 0.18 },
    { freq: 220.0, type: 'sawtooth' as OscillatorType, vol: 0.25 },
    { freq: 220.4, type: 'triangle' as OscillatorType, vol: 0.20 },
    { freq: 293.66, type: 'triangle' as OscillatorType, vol: 0.30 },
  ];

  const oscs: (OscillatorNode | GainNode)[] = [];

  baseFreqs.forEach(({ freq, type, vol }) => {
    try {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      oscGain.gain.setValueAtTime(vol, ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      oscs.push(osc, oscGain);
    } catch {
      // ignore
    }
  });

  // Bellows pumping LFO (gentle devotional breathing variation every ~2.8 seconds)
  try {
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.36, ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.06, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(droneGain.gain);
    lfo.start();
    oscs.push(lfo, lfoGain);
  } catch {
    // ignore
  }

  filter.connect(droneGain);
  droneGain.connect(parentGain);

  return { oscs, gain: droneGain };
}

// 2. MRIDANG SOUNDS (Acoustically shaped for phone speakers & deep bass)
function playMridangBass(ctx: AudioContext, time: number, parentGain: GainNode) {
  try {
    const safeTime = Math.max(time, ctx.currentTime + 0.005);

    // Fundamental drop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, safeTime);
    osc.frequency.exponentialRampToValueAtTime(75, safeTime + 0.18);

    gain.gain.setValueAtTime(0.65, safeTime);
    gain.gain.exponentialRampToValueAtTime(0.001, safeTime + 0.26);

    // Mid harmonic punch (allows mobile phone speakers to hear the bass attack)
    const midOsc = ctx.createOscillator();
    const midGain = ctx.createGain();
    midOsc.type = 'triangle';
    midOsc.frequency.setValueAtTime(320, safeTime);
    midOsc.frequency.exponentialRampToValueAtTime(150, safeTime + 0.12);

    midGain.gain.setValueAtTime(0.35, safeTime);
    midGain.gain.exponentialRampToValueAtTime(0.001, safeTime + 0.16);

    osc.connect(gain);
    midOsc.connect(midGain);
    gain.connect(parentGain);
    midGain.connect(parentGain);

    osc.start(safeTime);
    midOsc.start(safeTime);
    osc.stop(safeTime + 0.28);
    midOsc.stop(safeTime + 0.20);

    setTimeout(() => {
      try {
        gain.disconnect();
        midGain.disconnect();
      } catch {
        // ignore
      }
    }, 350);
  } catch {
    // ignore
  }
}

function playMridangSlap(ctx: AudioContext, time: number, parentGain: GainNode) {
  try {
    const safeTime = Math.max(time, ctx.currentTime + 0.005);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, safeTime);
    osc.frequency.exponentialRampToValueAtTime(220, safeTime + 0.09);

    gain.gain.setValueAtTime(0.55, safeTime);
    gain.gain.exponentialRampToValueAtTime(0.001, safeTime + 0.14);

    osc.connect(gain);
    gain.connect(parentGain);

    osc.start(safeTime);
    osc.stop(safeTime + 0.15);

    setTimeout(() => {
      try {
        gain.disconnect();
      } catch {
        // ignore
      }
    }, 250);
  } catch {
    // ignore
  }
}

// 3. TAAL / MANJIRA BRASS CHIME
function playTaalManjira(ctx: AudioContext, time: number, parentGain: GainNode) {
  try {
    const safeTime = Math.max(time, ctx.currentTime + 0.005);
    const freqs = [2600, 3650, 5200];
    const manjiraGain = ctx.createGain();

    manjiraGain.gain.setValueAtTime(0.35, safeTime);
    manjiraGain.gain.exponentialRampToValueAtTime(0.001, safeTime + 0.32);

    freqs.forEach(f => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, safeTime);
      osc.connect(manjiraGain);
      osc.start(safeTime);
      osc.stop(safeTime + 0.34);
    });

    manjiraGain.connect(parentGain);

    setTimeout(() => {
      try {
        manjiraGain.disconnect();
      } catch {
        // ignore
      }
    }, 450);
  } catch {
    // ignore
  }
}

// RHYTHM SCHEDULER: Traditional 4/4 Devotional Aarti Theka
// Beat 0: Dha (Bass + Slap) + Taal (झांज)
// Beat 1: Ghe (Bass)
// Beat 2: Na (Slap) + Taal
// Beat 3: Ti (Gentle Slap)
function scheduleBeats() {
  if (!audioCtx || !isPlaying || !masterGain) return;

  const secondsPerBeat = 60.0 / currentBpm;
  const scheduleAheadTime = 0.25; // 250ms lookahead

  // If clock drifted behind (tab in background or device throttled), resync cleanly
  if (nextBeatTime < audioCtx.currentTime) {
    nextBeatTime = audioCtx.currentTime + 0.02;
  }

  while (nextBeatTime < audioCtx.currentTime + scheduleAheadTime) {
    switch (currentBeat % 4) {
      case 0: // Strong beat
        playMridangBass(audioCtx, nextBeatTime, masterGain);
        playMridangSlap(audioCtx, nextBeatTime, masterGain);
        playTaalManjira(audioCtx, nextBeatTime, masterGain);
        break;
      case 1:
        playMridangBass(audioCtx, nextBeatTime, masterGain);
        break;
      case 2:
        playMridangSlap(audioCtx, nextBeatTime, masterGain);
        playTaalManjira(audioCtx, nextBeatTime, masterGain);
        break;
      case 3:
        playMridangSlap(audioCtx, nextBeatTime, masterGain);
        break;
    }

    nextBeatTime += secondsPerBeat;
    currentBeat++;
  }
}

export interface DevotionalMusicOptions {
  bpm?: number;
  volume?: number;
}

export function startDevotionalMusic(options?: DevotionalMusicOptions) {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Crucial for iOS Safari & Android: trigger resume inside the click gesture synchronously
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  if (isPlaying) {
    stopDevotionalMusic();
  }

  currentBpm = options?.bpm || 82;
  const initialVolume = options?.volume !== undefined ? options.volume : 0.7;

  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(initialVolume, ctx.currentTime);
  masterGain.connect(ctx.destination);

  // Start Harmonium Drone
  harmoniumNodes = startHarmoniumDrone(ctx, masterGain);

  isPlaying = true;
  nextBeatTime = ctx.currentTime + 0.03;
  currentBeat = 0;

  // Run scheduler loop every 40ms
  scheduleIntervalId = setInterval(scheduleBeats, 40);
}

export function stopDevotionalMusic() {
  isPlaying = false;

  if (scheduleIntervalId) {
    clearInterval(scheduleIntervalId);
    scheduleIntervalId = null;
  }

  if (harmoniumNodes) {
    harmoniumNodes.oscs.forEach(node => {
      try {
        if ('stop' in node) {
          node.stop();
        }
        node.disconnect();
      } catch {
        // ignore
      }
    });
    harmoniumNodes = null;
  }

  if (masterGain) {
    try {
      masterGain.disconnect();
    } catch {
      // ignore
    }
    masterGain = null;
  }
}

export function isDevotionalMusicPlaying(): boolean {
  return isPlaying;
}

export function setDevotionalMusicVolume(volume: number) {
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), audioCtx.currentTime, 0.05);
    } catch {
      // ignore
    }
  }
}

export function setDevotionalMusicTempo(bpm: number) {
  currentBpm = Math.max(50, Math.min(130, bpm));
}
