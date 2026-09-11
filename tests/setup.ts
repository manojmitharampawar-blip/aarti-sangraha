import '@testing-library/jest-dom';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock navigator.vibrate
if (typeof navigator !== 'undefined') {
  Object.defineProperty(navigator, 'vibrate', {
    writable: true,
    value: () => true,
  });
}

// Mock localStorage for test environment
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
};

Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: createLocalStorageMock(),
});

// Mock Web Audio API (AudioContext)
if (typeof window !== 'undefined') {
  class AudioNodeMock {
    connect() {}
    disconnect() {}
  }

  class GainNodeMock extends AudioNodeMock {
    gain = {
      value: 1,
      setValueAtTime: () => {},
      exponentialRampToValueAtTime: () => {},
      setTargetAtTime: () => {},
    };
  }

  class OscillatorNodeMock extends AudioNodeMock {
    type = 'sine';
    frequency = {
      setValueAtTime: () => {},
      exponentialRampToValueAtTime: () => {},
    };
    start() {}
    stop() {}
  }

  class BiquadFilterNodeMock extends AudioNodeMock {
    type = 'lowpass';
    frequency = { setValueAtTime: () => {} };
    Q = { setValueAtTime: () => {} };
  }

  class AudioContextMock {
    currentTime = 0;
    state = 'running';
    destination = new AudioNodeMock();
    createGain() {
      return new GainNodeMock();
    }
    createOscillator() {
      return new OscillatorNodeMock();
    }
    createBiquadFilter() {
      return new BiquadFilterNodeMock();
    }
    resume() {
      return Promise.resolve();
    }
    close() {
      return Promise.resolve();
    }
  }

  (window as any).AudioContext = AudioContextMock;
  (window as any).webkitAudioContext = AudioContextMock;
}

// Mock SpeechSynthesis for Web Speech API
if (typeof window !== 'undefined') {
  const speechSynthesisMock = {
    speaking: false,
    paused: false,
    pending: false,
    onvoiceschanged: null,
    speak: (utterance: any) => {
      if (utterance.onstart) utterance.onstart();
      setTimeout(() => {
        if (utterance.onend) utterance.onend();
      }, 50);
    },
    cancel: () => {},
    pause: () => {},
    resume: () => {},
    getVoices: () => [
      { lang: 'mr-IN', name: 'Marathi India', default: true },
      { lang: 'hi-IN', name: 'Hindi India', default: false },
      { lang: 'en-IN', name: 'English India', default: false },
    ],
  };

  Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    value: speechSynthesisMock,
  });

  (window as any).SpeechSynthesisUtterance = class {
    text: string;
    lang: string = 'mr-IN';
    rate: number = 1;
    pitch: number = 1;
    volume: number = 1;
    onstart: (() => void) | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(text?: string) {
      this.text = text || '';
    }
  };
}
