'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    setIsSupported(typeof navigator !== 'undefined' && 'wakeLock' in navigator);
  }, []);

  const releaseLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await Promise.resolve(wakeLockRef.current.release());
      } catch (err) {
        console.warn('Wake Lock release failed:', err);
      }
      wakeLockRef.current = null;
    }
    setIsLocked(false);
  }, []);

  const requestLock = useCallback(async () => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return;
    }
    try {
      const sentinel = await (navigator as any).wakeLock.request('screen');
      wakeLockRef.current = sentinel;
      setIsLocked(true);

      sentinel.addEventListener?.('release', () => {
        setIsLocked(false);
        wakeLockRef.current = null;
      });
    } catch (err) {
      console.warn('Wake Lock request failed:', err);
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        try {
          const res = wakeLockRef.current.release();
          if (res && typeof res.catch === 'function') {
            res.catch(() => {});
          }
        } catch {
          // ignore cleanup error
        }
        wakeLockRef.current = null;
      }
    };
  }, []);

  return {
    isSupported,
    isLocked,
    requestLock,
    releaseLock,
  };
}
