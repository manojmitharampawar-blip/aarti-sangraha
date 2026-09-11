import { describe, it, expect } from 'vitest';
import {
  CATEGORY_REGISTRY,
  getHymnTypeBadge,
  filterHymnsByCategory,
  getCategoryCounts,
  calculateChantingTimeMinutes,
} from '@/lib/categories';
import { aartis } from '@/data/aartis';
import { AartiItem } from '@/types';

describe('Scalable Devotional Category Registry & Metadata', () => {
  it('contains registered categories with required fields', () => {
    expect(CATEGORY_REGISTRY.length).toBeGreaterThanOrEqual(6);
    const ids = CATEGORY_REGISTRY.map(c => c.id);
    expect(ids).toContain('all');
    expect(ids).toContain('aarti');
    expect(ids).toContain('stotra');
    expect(ids).toContain('mantra');
    expect(ids).toContain('kavach');
    expect(ids).toContain('abhang');
  });

  it('correctly maps existing and future hymn types to localized badges without crashing', () => {
    // Standard existing types
    expect(getHymnTypeBadge('aarti', true).label).toBe('आरती');
    expect(getHymnTypeBadge('stotra', true).label).toBe('स्तोत्र');
    expect(getHymnTypeBadge('ashtak', true).label).toBe('अष्टक');
    expect(getHymnTypeBadge('chalisa', true).label).toBe('चालीसा');
    expect(getHymnTypeBadge('mantra', true).label).toBe('मंत्र');

    // Future scalable types
    expect(getHymnTypeBadge('sukta', true).label).toBe('सूक्त');
    expect(getHymnTypeBadge('kavach', true).label).toBe('कवच');
    expect(getHymnTypeBadge('namavali', true).label).toBe('नामावली');
    expect(getHymnTypeBadge('abhang', true).label).toBe('अभंग');
    expect(getHymnTypeBadge('bhajan', true).label).toBe('भजन');
  });

  it('filters hymns accurately by category ID', () => {
    const all = filterHymnsByCategory(aartis, 'all');
    expect(all.length).toBe(aartis.length);

    const aartisList = filterHymnsByCategory(aartis, 'aarti');
    expect(aartisList.every(h => h.type === 'aarti' || h.type === 'chalisa')).toBe(true);

    const stotrasList = filterHymnsByCategory(aartis, 'stotra');
    expect(stotrasList.every(h => h.type === 'stotra' || h.type === 'ashtak')).toBe(true);
  });

  it('calculates category counts dynamically across all hymns', () => {
    const counts = getCategoryCounts(aartis);
    expect(counts.all).toBe(aartis.length);
    expect(counts.aarti).toBeGreaterThan(0);
    expect(counts.stotra).toBeGreaterThan(0);
  });

  it('calculates estimated chanting time in minutes reliably', () => {
    const sampleStanzas = aartis[0].stanzas;
    const timeMins = calculateChantingTimeMinutes(sampleStanzas);
    expect(timeMins).toBeGreaterThanOrEqual(1);
  });
});
