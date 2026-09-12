'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { UNIFORM_SCROLL_SPEEDS } from '@/components/ThemeProvider';

export interface UseAutoScrollOptions {
  threshold?: number;
  onReachEnd?: () => void;
}

export function useAutoScroll(
  initialSpeed: number = 1,
  options?: UseAutoScrollOptions | (() => void)
) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

  // Normalize options (support function or object)
  const onReachEnd = typeof options === 'function' ? options : options?.onReachEnd;
  const threshold = typeof options === 'object' ? options?.threshold ?? 20 : 20;

  const onReachEndRef = useRef(onReachEnd);
  onReachEndRef.current = onReachEnd;

  const hasTriggeredEndRef = useRef(false);

  const stop = useCallback(() => {
    setIsScrolling(false);
  }, []);

  const start = useCallback(() => {
    setIsScrolling(true);
    hasTriggeredEndRef.current = false;
  }, []);

  const toggle = useCallback(() => {
    setIsScrolling(prev => {
      if (!prev) {
        hasTriggeredEndRef.current = false;
      }
      return !prev;
    });
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeed(current => {
      const idx = UNIFORM_SCROLL_SPEEDS.indexOf(current as (typeof UNIFORM_SCROLL_SPEEDS)[number]);
      const nextIdx = (idx + 1) % UNIFORM_SCROLL_SPEEDS.length;
      return UNIFORM_SCROLL_SPEEDS[nextIdx];
    });
  }, []);

  const resetEndTrigger = useCallback(() => {
    hasTriggeredEndRef.current = false;
  }, []);

  useEffect(() => {
    if (!isScrolling) return;

    // Interval inversely proportional to speed (e.g. 1x = 45ms, 0.5x = 90ms, 1.5x = 30ms, 2x = 22ms)
    const interval = Math.max(16, Math.floor(45 / speed));

    const intervalId = setInterval(() => {
      if (typeof window !== 'undefined') {
        const windowHeight = window.innerHeight || 800;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const scrollHeight =
          document.documentElement.scrollHeight || document.body.scrollHeight || 1000;

        // Check if reached the bottom of page
        if (windowHeight + scrollY >= scrollHeight - threshold) {
          if (onReachEndRef.current && !hasTriggeredEndRef.current) {
            hasTriggeredEndRef.current = true;
            onReachEndRef.current();
          }
          return;
        } else {
          // If scrolled away from bottom, reset flag
          if (windowHeight + scrollY < scrollHeight - threshold - 50) {
            hasTriggeredEndRef.current = false;
          }
        }

        window.scrollBy({
          top: 1,
          left: 0,
          behavior: 'auto',
        });
      }
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [isScrolling, speed, threshold]);

  return {
    isScrolling,
    speed,
    setSpeed,
    cycleSpeed,
    start,
    stop,
    toggle,
    resetEndTrigger,
  };
}
