import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAartiSpeech } from '@/hooks/useAartiSpeech';
import { Stanza } from '@/types';

const mockStanzas: Stanza[] = [
  {
    stanzaNumber: 1,
    isChorus: true,
    devanagari: ['सुखकर्ता दुःखहर्ता वार्ता विघ्नाची', 'नुरवी पुरवी प्रेम कृपा जयाची'],
    transliteration: ['Sukhkarta dukhharta varta vighnachi', 'Nuravi puravi prema krupa jayachi'],
  },
];

describe('useAartiSpeech Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('detects speech synthesis support and initializes stopped', () => {
    const { result } = renderHook(() => useAartiSpeech());
    expect(result.current.isSupported).toBe(true);
    expect(result.current.isSpeaking).toBe(false);
  });

  it('starts speaking stanzas and stops on cancel', () => {
    const { result } = renderHook(() => useAartiSpeech());

    act(() => {
      result.current.speak(mockStanzas, 'devanagari');
    });

    expect(result.current.isSpeaking).toBe(true);

    act(() => {
      result.current.stop();
    });

    expect(result.current.isSpeaking).toBe(false);
  });
});
