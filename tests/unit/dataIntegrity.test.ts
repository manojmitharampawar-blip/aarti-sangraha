import { describe, it, expect } from 'vitest';
import { aartis } from '@/data/aartis';
import { deities } from '@/data/deities';
import { playlists } from '@/data/playlists';

describe('Data Integrity & Schema Validation', () => {
  it('ensures all aarti slugs and IDs are unique', () => {
    const ids = aartis.map(a => a.id);
    const slugs = aartis.map(a => a.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('ensures every aarti has valid stanzas in both Devanagari and transliteration', () => {
    aartis.forEach(aarti => {
      expect(aarti.stanzas.length).toBeGreaterThan(0);
      aarti.stanzas.forEach(stanza => {
        expect(stanza.devanagari.length).toBeGreaterThan(0);
        expect(stanza.transliteration.length).toBeGreaterThan(0);
      });
    });
  });

  it('ensures every aarti references a valid deity in deities catalog', () => {
    const validDeityIds = new Set(deities.map(d => d.id));
    aartis.forEach(aarti => {
      expect(validDeityIds.has(aarti.deity)).toBe(true);
    });
  });

  it('ensures all playlist aartiIds reference existing aartis', () => {
    const existingAartiIds = new Set(aartis.map(a => a.id));
    playlists.forEach(playlist => {
      playlist.aartiIds.forEach(id => {
        expect(existingAartiIds.has(id)).toBe(true);
      });
    });
  });

  it('includes all revered Maharashtra saints and festival hymns requested', () => {
    const slugs = aartis.map(a => a.slug);
    const expectedHymns = [
      'aarti-dnyanraja',
      'aarti-tukaram',
      'aarti-gauri-mata',
      'aarti-sai-baba',
      'aarti-ambe-mata-navratri',
      'aarti-samarth-ramdas',
      'aarti-nityanand-maharaj',
      'aarti-swami-samarth',
      'aarti-gajanan-maharaj',
      'om-jai-jagdish-hare',
      'aarti-bal-krishna',
      'aarti-khanderaya-jejuri',
    ];

    expectedHymns.forEach(slug => {
      expect(slugs).toContain(slug);
    });
  });
});
