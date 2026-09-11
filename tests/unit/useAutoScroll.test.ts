import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAutoScroll } from '@/hooks/useAutoScroll';

describe('useAutoScroll Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.scrollBy = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes with scrolling paused', () => {
    const { result } = renderHook(() => useAutoScroll());
    expect(result.current.isScrolling).toBe(false);
    expect(result.current.speed).toBe(1);
  });

  it('toggles scrolling state on and off', () => {
    const { result } = renderHook(() => useAutoScroll());
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isScrolling).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isScrolling).toBe(false);
  });

  it('updates speed properly', () => {
    const { result } = renderHook(() => useAutoScroll());
    
    act(() => {
      result.current.setSpeed(1.5);
    });
    expect(result.current.speed).toBe(1.5);
  });

  it('scrolls window by step on interval when active', () => {
    const { result } = renderHook(() => useAutoScroll());
    
    act(() => {
      result.current.start();
    });
    expect(result.current.isScrolling).toBe(true);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(window.scrollBy).toHaveBeenCalled();
  });
});
