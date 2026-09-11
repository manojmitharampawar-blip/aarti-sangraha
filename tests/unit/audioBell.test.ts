import { describe, it, expect, vi, beforeEach } from 'vitest';
import { playTempleBell } from '@/lib/audioBell';

describe('Web Audio Temple Bell Synthesizer', () => {
  let mockGainNode: any;
  let mockOscillatorNode: any;
  let mockAudioContext: any;

  beforeEach(() => {
    mockGainNode = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };

    mockOscillatorNode = {
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    mockAudioContext = {
      currentTime: 0,
      state: 'running',
      createGain: vi.fn(() => mockGainNode),
      createOscillator: vi.fn(() => mockOscillatorNode),
      destination: {},
      resume: vi.fn().mockResolvedValue(undefined),
    };

    (window as any).AudioContext = vi.fn(() => mockAudioContext);
  });

  it('synthesizes multi-harmonic brass bell sound without throwing', () => {
    expect(() => playTempleBell()).not.toThrow();
    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockAudioContext.createGain).toHaveBeenCalled();
    expect(mockOscillatorNode.start).toHaveBeenCalled();
  });

  it('triggers haptic feedback if navigator.vibrate is available', () => {
    const vibrateSpy = vi.spyOn(navigator, 'vibrate');
    playTempleBell({ enableHaptics: true });
    expect(vibrateSpy).toHaveBeenCalledWith(40);
  });
});
