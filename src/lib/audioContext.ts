// Shared AudioContext Singleton for Mobile & Desktop Web Audio
// Ensures iOS Safari & Android Chrome audio hardware unlock without hitting AudioContext instance limits

let sharedContext: AudioContext | null = null;

export function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!sharedContext || sharedContext.state === 'closed') {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      sharedContext = new AudioCtx();
    }
  }

  if (sharedContext) {
    if (sharedContext.state === 'suspended') {
      sharedContext.resume().catch(() => {});
    }

    // iOS WebKit silent buffer unlock: unlocks audio hardware synchronously within user gesture
    try {
      const buffer = sharedContext.createBuffer(1, 1, 22050);
      const source = sharedContext.createBufferSource();
      source.buffer = buffer;
      source.connect(sharedContext.destination);
      source.start(0);
    } catch {
      // ignore
    }
  }

  return sharedContext;
}
