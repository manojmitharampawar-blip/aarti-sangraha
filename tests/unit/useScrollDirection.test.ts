import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrollDirection } from '@/hooks/useScrollDirection';

describe('useScrollDirection Hook', () => {
  let scrollYGetter: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    scrollYGetter = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with isVisible true by default', () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current).toBe(true);
  });

  it('hides navigation when scrolling downward beyond threshold', () => {
    const { result } = renderHook(() => useScrollDirection(10));

    act(() => {
      scrollYGetter.mockReturnValue(80);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(false);
  });

  it('shows navigation when scrolling upward', () => {
    const { result } = renderHook(() => useScrollDirection(10));

    // First scroll down
    act(() => {
      scrollYGetter.mockReturnValue(150);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe(false);

    // Then scroll up
    act(() => {
      scrollYGetter.mockReturnValue(100);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe(true);
  });

  it('always shows navigation when near the top of the page', () => {
    const { result } = renderHook(() => useScrollDirection(10));

    // Scroll down
    act(() => {
      scrollYGetter.mockReturnValue(200);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe(false);

    // Scroll back to top
    act(() => {
      scrollYGetter.mockReturnValue(5);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe(true);
  });
});
