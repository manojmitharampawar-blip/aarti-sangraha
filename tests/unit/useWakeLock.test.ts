import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWakeLock } from '@/hooks/useWakeLock';

describe('useWakeLock Hook', () => {
  let mockRelease: ReturnType<typeof vi.fn>;
  let mockRequest: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockRelease = vi.fn().mockResolvedValue(undefined);
    mockRequest = vi.fn().mockResolvedValue({
      release: mockRelease,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    Object.defineProperty(navigator, 'wakeLock', {
      writable: true,
      configurable: true,
      value: {
        request: mockRequest,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reports isSupported as true when navigator.wakeLock is present', () => {
    const { result } = renderHook(() => useWakeLock());
    expect(result.current.isSupported).toBe(true);
  });

  it('requests wakeLock when requestLock() is called', async () => {
    const { result } = renderHook(() => useWakeLock());
    
    await act(async () => {
      await result.current.requestLock();
    });

    expect(mockRequest).toHaveBeenCalledWith('screen');
    expect(result.current.isLocked).toBe(true);
  });

  it('releases wakeLock when releaseLock() is called', async () => {
    const { result } = renderHook(() => useWakeLock());
    
    await act(async () => {
      await result.current.requestLock();
    });
    expect(result.current.isLocked).toBe(true);

    await act(async () => {
      await result.current.releaseLock();
    });
    expect(mockRelease).toHaveBeenCalled();
    expect(result.current.isLocked).toBe(false);
  });

  it('releases wakeLock cleanly upon unmount', async () => {
    const { result, unmount } = renderHook(() => useWakeLock());
    
    await act(async () => {
      await result.current.requestLock();
    });
    
    unmount();
    expect(mockRelease).toHaveBeenCalled();
  });
});
