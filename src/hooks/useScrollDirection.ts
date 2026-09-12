'use client';

import { useState, useEffect } from 'react';

/**
 * High-performance hook that tracks scroll direction to auto-hide navigation bars
 * when scrolling downwards (immersive reading) and reveals them when scrolling upwards
 * or near the top of the page.
 *
 * @param threshold Minimum scroll delta in pixels before triggering direction change (default: 8px)
 * @returns boolean `isVisible` - true when nav bars should be shown, false when hidden
 */
export function useScrollDirection(threshold: number = 8): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastScrollY = window.scrollY || 0;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY || 0;

      // Always show bars when at or near the top of the page
      if (currentScrollY <= 20) {
        setIsVisible(true);
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      const diff = currentScrollY - lastScrollY;

      // Only trigger if scroll delta exceeds the threshold (avoids touch jitter)
      if (Math.abs(diff) >= threshold) {
        // Scrolling down (diff > 0) -> hide nav bars
        // Scrolling up (diff < 0) -> show nav bars
        setIsVisible(diff < 0);
        lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrollDirection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isVisible;
}
