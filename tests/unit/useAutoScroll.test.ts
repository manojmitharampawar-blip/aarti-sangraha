import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAutoScroll } from '@/hooks/useAutoScroll';

describe('useAutoScroll Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.scrollBy = vi.fn();
    window.scrollTo = vi.fn();
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
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

  it('triggers onReachEnd callback when reaching the bottom of the page', () => {
    const onReachEnd = vi.fn();
    const { result } = renderHook(() => useAutoScroll(1, { onReachEnd, threshold: 20 }));

    act(() => {
      result.current.start();
    });

    // Simulate scroll reaching bottom: innerHeight (800) + scrollY (1190) >= scrollHeight (2000) - threshold (20)
    window.scrollY = 1190;

    act(() => {
      vi.advanceTimersByTime(60);
    });

    expect(onReachEnd).toHaveBeenCalledTimes(1);

    // Verify it doesn't fire repeatedly in a tight loop on subsequent ticks
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(onReachEnd).toHaveBeenCalledTimes(1);
  });
});
