'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Tiny 1-frame silent base64 MP4 video fallback for older mobile devices / iOS Safari without WakeLock API
const SILENT_VIDEO_URI =
  'data:video/mp4;base64,AAAAHGZ0eXBpc29tAAAAAG1wNDEAAAAIbW9vdgAAAGxtdmhkAAAAANQk857UJPOfAAAA+gAAAAAAAEGAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAMdHJhazAAAAAkdGtoZAAAAADUJPOf1CTzngAAAAEAAAAAAAAAQYAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAABFtZGlhAAAAIA==';

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const wakeLockRef = useRef<any>(null);
  const shouldBeLockedRef = useRef(false);
  const fallbackVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setIsSupported(
      typeof navigator !== 'undefined' &&
        ('wakeLock' in navigator || (typeof document !== 'undefined' && 'createElement' in document))
    );
  }, []);

  const startFallback = useCallback(() => {
    if (typeof document === 'undefined') return;
    try {
      if (!fallbackVideoRef.current) {
        const video = document.createElement('video');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('muted', '');
        video.muted = true;
        video.setAttribute('loop', '');
        video.loop = true;
        video.style.position = 'fixed';
        video.style.top = '-9999px';
        video.style.left = '-9999px';
        video.style.width = '1px';
        video.style.height = '1px';
        video.style.opacity = '0.01';
        video.style.pointerEvents = 'none';
        video.src = SILENT_VIDEO_URI;
        document.body.appendChild(video);
        fallbackVideoRef.current = video;
      }
      fallbackVideoRef.current.play().catch(() => {});
    } catch {
      // ignore
    }
  }, []);

  const stopFallback = useCallback(() => {
    if (fallbackVideoRef.current) {
      try {
        fallbackVideoRef.current.pause();
        fallbackVideoRef.current.remove();
      } catch {
        // ignore
      }
      fallbackVideoRef.current = null;
    }
  }, []);

  const releaseLock = useCallback(async () => {
    shouldBeLockedRef.current = false;
    stopFallback();

    if (wakeLockRef.current) {
      try {
        await Promise.resolve(wakeLockRef.current.release());
      } catch (err) {
        console.warn('Wake Lock release failed:', err);
      }
      wakeLockRef.current = null;
    }
    setIsLocked(false);
  }, [stopFallback]);

  const requestLock = useCallback(async () => {
    shouldBeLockedRef.current = true;

    // 1. Try Native W3C Screen Wake Lock API
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        if (wakeLockRef.current && !wakeLockRef.current.released) {
          setIsLocked(true);
          return;
        }

        const sentinel = await (navigator as any).wakeLock.request('screen');
        wakeLockRef.current = sentinel;
        setIsLocked(true);

        sentinel.addEventListener?.('release', () => {
          wakeLockRef.current = null;
          if (!shouldBeLockedRef.current) {
            setIsLocked(false);
          }
        });
        return;
      } catch (err) {
        console.warn('Native Wake Lock request failed, falling back to video keep-alive:', err);
      }
    }

    // 2. Video fallback for older WebKit / Safari or low-power modes
    startFallback();
    setIsLocked(true);
  }, [startFallback]);

  // Automatically re-acquire lock when user switches back to the tab
  useEffect(() => {
    const handleReacquire = async () => {
      if (document.visibilityState === 'visible' && shouldBeLockedRef.current && !wakeLockRef.current) {
        await requestLock();
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleReacquire);
      window.addEventListener('focus', handleReacquire);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleReacquire);
        window.removeEventListener('focus', handleReacquire);
      }
    };
  }, [requestLock]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      shouldBeLockedRef.current = false;
      stopFallback();
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
  }, [stopFallback]);

  return {
    isSupported,
    isLocked,
    requestLock,
    releaseLock,
  };
}
