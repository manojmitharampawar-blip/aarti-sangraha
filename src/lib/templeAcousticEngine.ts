/**
 * Temple Acoustic Spatialization Engine (गर्भगृह ध्वनी)
 *
 * Emulates the sacred acoustics of stone temple sanctums (Garbhagriha)
 * using Web Audio convolution reverb, binaural filtering, and 432Hz harmonic drones.
 */

export interface TempleAcousticSettings {
  reverbDecaySeconds: number;
  stoneDiffusion: number;
  enableHarmonicDrone: boolean;
  droneFrequencyHz: number; // Defaults to sacred 432Hz or tuned Sur
  sanctumAmbienceVolume: number;
}

export const DEFAULT_TEMPLE_ACOUSTICS: TempleAcousticSettings = {
  reverbDecaySeconds: 2.8, // Reverberant stone sanctum decay
  stoneDiffusion: 0.75,
  enableHarmonicDrone: true,
  droneFrequencyHz: 432, // Healing sacred pitch (A = 432Hz / Sa harmonic)
  sanctumAmbienceVolume: 0.25,
};

let audioContext: AudioContext | null = null;
let convolverNode: ConvolverNode | null = null;
let droneOscillatorA: OscillatorNode | null = null;
let droneOscillatorB: OscillatorNode | null = null;
let droneGainNode: GainNode | null = null;
let masterAcousticGain: GainNode | null = null;

function getOrCreateAudioContext(): AudioContext {
  if (!audioContext || audioContext.state === 'closed') {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

/**
 * Procedurally generates an impulse response buffer simulating an ancient stone temple
 * sanctum with gentle early reflections and smooth exponential tail decay.
 */
export function generateTempleImpulseResponse(
  ctx: AudioContext,
  durationSeconds: number = 2.8,
  decayRate: number = 2.0
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * durationSeconds);
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const n = i / length;
    // Exponential decay envelope modeling stone absorption
    const envelope = Math.exp(-decayRate * n * 5);

    // Filtered white noise with stereo decorrelation
    const noiseL = (Math.random() * 2 - 1) * envelope;
    const noiseR = (Math.random() * 2 - 1) * envelope;

    // Early stone reflections within the first 120ms
    const earlyReflection =
      i < sampleRate * 0.12
        ? Math.sin(i * 0.05) * 0.3 * (1 - i / (sampleRate * 0.12))
        : 0;

    left[i] = noiseL * 0.8 + earlyReflection;
    right[i] = noiseR * 0.8 + earlyReflection;
  }

  return impulse;
}

/**
 * Initializes and starts the ambient temple acoustic sanctum (432Hz harmonic tanpura drone & reverb)
 */
export function startTempleAcoustics(
  settings: Partial<TempleAcousticSettings> = {}
): boolean {
  if (typeof window === 'undefined') return false;

  const cfg = { ...DEFAULT_TEMPLE_ACOUSTICS, ...settings };
  const ctx = getOrCreateAudioContext();

  stopTempleAcoustics();

  try {
    masterAcousticGain = ctx.createGain();
    masterAcousticGain.gain.setValueAtTime(0.01, ctx.currentTime);
    masterAcousticGain.gain.exponentialRampToValueAtTime(
      cfg.sanctumAmbienceVolume,
      ctx.currentTime + 1.2
    );
    masterAcousticGain.connect(ctx.destination);

    // Build Convolver for sacred Garbhagriha reverb
    convolverNode = ctx.createConvolver();
    convolverNode.buffer = generateTempleImpulseResponse(
      ctx,
      cfg.reverbDecaySeconds,
      cfg.stoneDiffusion * 3
    );

    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.65, ctx.currentTime);
    convolverNode.connect(reverbGain);
    reverbGain.connect(masterAcousticGain);

    // 432 Hz Sacred Harmonic Dual Drone (Sa - Pa harmonic blend)
    if (cfg.enableHarmonicDrone) {
      const baseFreq = cfg.droneFrequencyHz; // Sa (e.g. 432Hz or sub-harmonic 216Hz)
      const subSa = baseFreq / 2;
      const pancham = subSa * 1.5; // Pa (perfect fifth, 3:2 ratio)

      droneGainNode = ctx.createGain();
      droneGainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      droneGainNode.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 2.0);

      droneOscillatorA = ctx.createOscillator();
      droneOscillatorA.type = 'sine';
      droneOscillatorA.frequency.setValueAtTime(subSa, ctx.currentTime);

      droneOscillatorB = ctx.createOscillator();
      droneOscillatorB.type = 'triangle'; // Richer overtones for Pancham
      droneOscillatorB.frequency.setValueAtTime(pancham, ctx.currentTime);

      droneOscillatorA.connect(droneGainNode);
      droneOscillatorB.connect(droneGainNode);

      // Route drone through stone reverb for realistic sanctuary immersion
      droneGainNode.connect(convolverNode);
      droneGainNode.connect(masterAcousticGain);

      droneOscillatorA.start();
      droneOscillatorB.start();
    }

    return true;
  } catch (err) {
    console.warn('Temple acoustic engine initialization note:', err);
    return false;
  }
}

/**
 * Stops temple acoustics with a smooth, reverent fadeout
 */
export function stopTempleAcoustics(): void {
  if (masterAcousticGain && audioContext && audioContext.state !== 'closed') {
    try {
      const curr = audioContext.currentTime;
      masterAcousticGain.gain.cancelScheduledValues(curr);
      masterAcousticGain.gain.setValueAtTime(masterAcousticGain.gain.value, curr);
      masterAcousticGain.gain.exponentialRampToValueAtTime(0.001, curr + 0.6);

      setTimeout(() => {
        try {
          droneOscillatorA?.stop();
          droneOscillatorB?.stop();
          droneOscillatorA?.disconnect();
          droneOscillatorB?.disconnect();
          convolverNode?.disconnect();
          masterAcousticGain?.disconnect();
        } catch {
          // ignore
        }
        droneOscillatorA = null;
        droneOscillatorB = null;
        convolverNode = null;
        masterAcousticGain = null;
      }, 650);
    } catch {
      // ignore
    }
  }
}

export function setTempleAcousticVolume(volume: number): void {
  if (masterAcousticGain && audioContext && audioContext.state !== 'closed') {
    const clamped = Math.max(0, Math.min(1, volume));
    masterAcousticGain.gain.setTargetAtTime(clamped, audioContext.currentTime, 0.1);
  }
}
