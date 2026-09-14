import { describe, it, expect } from 'vitest';
import { getHinduTithi, getCurrentMuhurat } from '@/lib/panchangEngine';
import { getDevotionalRecommendation, getSadhanaStreak, recordSadhanaSession } from '@/lib/devotionalRecommender';

describe('Phase 5: Devotional Daily Rituals & Panchang Recommender', () => {
  it('computes valid Hindu Tithi and Paksha from date', () => {
    const testDate = new Date(2026, 8, 15); // Sept 15, 2026
    const tithi = getHinduTithi(testDate);

    expect(tithi.tithiNumber).toBeGreaterThanOrEqual(1);
    expect(tithi.tithiNumber).toBeLessThanOrEqual(15);
    expect(['शुक्ल पक्ष', 'कृष्ण पक्ष']).toContain(tithi.paksha);
    expect(tithi.tithiNameMr).toBeTruthy();
  });

  it('determines accurate devotional muhurats based on time of day', () => {
    // 5:00 AM -> Brahmamuhurta
    const brahmaDate = new Date(2026, 0, 1, 5, 0, 0);
    expect(getCurrentMuhurat(brahmaDate).periodName).toBe('brahma');

    // 8:00 AM -> Pratahkaal
    const pratahDate = new Date(2026, 0, 1, 8, 0, 0);
    expect(getCurrentMuhurat(pratahDate).periodName).toBe('pratah');

    // 1:00 PM -> Madhyanh
    const madhyanhDate = new Date(2026, 0, 1, 13, 0, 0);
    expect(getCurrentMuhurat(madhyanhDate).periodName).toBe('madhyanh');

    // 6:30 PM -> Sandhyakaal
    const sandhyaDate = new Date(2026, 0, 1, 18, 30, 0);
    expect(getCurrentMuhurat(sandhyaDate).periodName).toBe('sandhya');

    // 10:30 PM -> Nishakaal
    const nishaDate = new Date(2026, 0, 1, 22, 30, 0);
    expect(getCurrentMuhurat(nishaDate).periodName).toBe('nisha');
  });

  it('generates personalized devotional recommendations with curated hymns', () => {
    // Thursday (Guruwar - Datta Maharaj)
    const thursdayDate = new Date(2026, 8, 17); // Sept 17, 2026 is a Thursday
    const rec = getDevotionalRecommendation(thursdayDate);

    expect(rec.dayNameMr).toBe('गुरुवार');
    expect(rec.headlineTitle).toContain('दत्त');
    expect(rec.recommendedHymns.length).toBeGreaterThan(0);
    expect(rec.suggestedPlaylist).toBeDefined();
  });

  it('tracks sadhana streak sessions cleanly in memory/local fallback', () => {
    const streak = getSadhanaStreak();
    expect(streak.currentStreak).toBeGreaterThanOrEqual(1);

    const updated = recordSadhanaSession();
    expect(updated.completedToday).toBe(true);
  });
});
