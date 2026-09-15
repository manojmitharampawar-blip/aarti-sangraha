import { describe, it, expect } from 'vitest';
import { getSolarTimings } from '@/lib/panchangEngine';

describe('Solar Timings & Panchang Calculations', () => {
  it('calculates valid sunrise and sunset times for Pune', () => {
    const testDate = new Date('2026-09-15T10:00:00+05:30');
    const timings = getSolarTimings(18.5204, 73.8567, testDate);

    expect(timings).toBeDefined();
    expect(timings.sunrise).toMatch(/^\d{2}:\d{2}$/);
    expect(timings.sunset).toMatch(/^\d{2}:\d{2}$/);

    // In September in Pune, sunrise is ~06:20-06:25 AM and sunset is ~18:30-18:40 PM
    const [riseH, riseM] = timings.sunrise.split(':').map(Number);
    const [setH, setM] = timings.sunset.split(':').map(Number);

    expect(riseH).toBe(6);
    expect(riseM).toBeGreaterThanOrEqual(15);
    expect(riseM).toBeLessThanOrEqual(30);

    expect(setH).toBe(18);
    expect(setM).toBeGreaterThanOrEqual(25);
    expect(setM).toBeLessThanOrEqual(45);
  });

  it('handles northern latitudes and default coordinates', () => {
    const defaultTimings = getSolarTimings();
    expect(defaultTimings.sunrise).toBeDefined();
    expect(defaultTimings.sunset).toBeDefined();
  });
});
