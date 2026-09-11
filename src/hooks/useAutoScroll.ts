'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useAutoScroll(initialSpeed: number = 1) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const animationFrameRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number>(0);

  const stop = useCallback(() => {
    setIsScrolling(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsScrolling(true);
  }, []);

  const toggle = useCallback(() => {
    setIsScrolling(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isScrolling) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const interval = Math.max(16, Math.floor(50 / speed));

    const intervalId = setInterval(() => {
      if (typeof window !== 'undefined') {
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
  }, [isScrolling, speed]);

  return {
    isScrolling,
    speed,
    setSpeed,
    start,
    stop,
    toggle,
  };
}
