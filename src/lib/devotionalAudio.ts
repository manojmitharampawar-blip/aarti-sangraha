// Procedural Web Audio Synthesizer for Devotional Temple Music:
// 1. Harmonium (सुर/संवादिनी) - Warm phase-detuned sawtooth oscillators with bellows LFO
// 2. Mridang / Pakhawaj (मृदुंग) - Deep bass frequency drops & crisp slaps
// 3. Taal / Manjira (झांज / टाळ) - Inharmonic metallic brass ring

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let masterGain: GainNode | null = null;
let harmoniumNodes: { oscs: OscillatorNode[]; gain: GainNode } | null = null;
let scheduleIntervalId: NodeJS.Timeout | null = null;
let currentBpm = 82; // Traditional moderate devotional tempo
let nextBeatTime = 0;
let currentBeat = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// 1. HARMONIUM DRONE (Sa-Pa C3/G3 or D3/A3 chord drone with acoustic bellows)
function startHarmoniumDrone(ctx: AudioContext, parentGain: GainNode) {
  const droneGain = ctx.createGain();
  droneGain.gain.setValueAtTime(0.12, ctx.currentTime);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, ctx.currentTime);
  filter.Q.setValueAtTime(2, ctx.currentTime);

  // Frequencies: Root D3 (146.83Hz), Fifth A3 (220Hz), Octave D4 (293.66Hz)
  const baseFreqs = [146.83, 147.2, 220.0, 220.5, 293.66];
  const oscs: OscillatorNode[] = [];

  baseFreqs.forEach(freq => {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.connect(filter);
    osc.start();
    oscs.push(osc);
  });

  // Gentle bellows pumping LFO (air flow variation every ~3 seconds)
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(0.35, ctx.currentTime);
  lfoGain.gain.setValueAtTime(0.04, ctx.currentTime);
  lfo.connect(droneGain.gain);
  lfo.start();
  oscs.push(lfo);

  filter.connect(droneGain);
  droneGain.connect(parentGain);

  return { oscs, gain: droneGain };
}

// 2. MRIDANG SOUNDS
function playMridangBass(ctx: AudioContext, time: number, parentGain: GainNode) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Pitch envelope drop: 120Hz -> 58Hz
  osc.frequency.setValueAtTime(120, time);
  osc.frequency.exponentialRampToValueAtTime(58, time + 0.16);

  gain.gain.setValueAtTime(0.45, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

  osc.connect(gain);
  gain.connect(parentGain);

  osc.start(time);
  osc.stop(time + 0.3);
}

function playMridangSlap(ctx: AudioContext, time: number, parentGain: GainNode) {
  // Crisp resonant slap tone
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(340, time);
  osc.frequency.exponentialRampToValueAtTime(180, time + 0.08);

  gain.gain.setValueAtTime(0.35, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

  osc.connect(gain);
  gain.connect(parentGain);

  osc.start(time);
  osc.stop(time + 0.11);
}

// 3. TAAL / MANJIRA BRASS CHIME
function playTaalManjira(ctx: AudioContext, time: number, parentGain: GainNode) {
  const freqs = [3150, 3850, 5200];
  const manjiraGain = ctx.createGain();
  manjiraGain.gain.setValueAtTime(0.22, time);
  manjiraGain.gain.exponentialRampToValueAtTime(0.001, time + 0.38);

  freqs.forEach(f => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, time);
    osc.connect(manjiraGain);
    osc.start(time);
    osc.stop(time + 0.4);
  });

  manjiraGain.connect(parentGain);
}

// RHYTHM SCHEDULER: Traditional 4/4 Devotional Aarti Theka
// Beat 0: Dha (Bass + Slap) + Taal
// Beat 1: Ghe (Bass)
// Beat 2: Na (Slap) + Taal
// Beat 3: Ti (Gentle Slap)
function scheduleBeats() {
  if (!audioCtx || !isPlaying || !masterGain) return;

  const secondsPerBeat = 60.0 / currentBpm;
  const scheduleAheadTime = 0.2; // 200ms lookahead

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

  if (isPlaying) {
    stopDevotionalMusic();
  }

  currentBpm = options?.bpm || 82;
  const initialVolume = options?.volume !== undefined ? options.volume : 0.6;

  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(initialVolume, ctx.currentTime);
  masterGain.connect(ctx.destination);

  // Start Harmonium Drone
  harmoniumNodes = startHarmoniumDrone(ctx, masterGain);

  isPlaying = true;
  nextBeatTime = ctx.currentTime + 0.05;
  currentBeat = 0;

  // Run scheduler loop every 50ms
  scheduleIntervalId = setInterval(scheduleBeats, 50);
}

export function stopDevotionalMusic() {
  isPlaying = false;

  if (scheduleIntervalId) {
    clearInterval(scheduleIntervalId);
    scheduleIntervalId = null;
  }

  if (harmoniumNodes) {
    harmoniumNodes.oscs.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
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
    masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), audioCtx.currentTime, 0.05);
  }
}

export function setDevotionalMusicTempo(bpm: number) {
  currentBpm = Math.max(50, Math.min(130, bpm));
}
