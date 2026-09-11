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

  it('includes all four daily prahar aartis sung in Shirdi temple', () => {
    const slugs = aartis.map(a => a.slug);
    expect(slugs).toContain('shirdi-sai-kakad-aarti');
    expect(slugs).toContain('shirdi-sai-madhyan-aarti');
    expect(slugs).toContain('shirdi-sai-dhoop-aarti');
    expect(slugs).toContain('shirdi-sai-shej-aarti');
  });

  it('includes aartis for Surya Dev, Shani Dev, Saraswati, Santoshi Mata, Gayatri, and Sant Eknath', () => {
    const slugs = aartis.map(a => a.slug);
    expect(slugs).toContain('aarti-surya-dev');
    expect(slugs).toContain('aarti-shani-dev');
    expect(slugs).toContain('aarti-saraswati-mata');
    expect(slugs).toContain('aarti-santoshi-mata');
    expect(slugs).toContain('aarti-gayatri-mata');
    expect(slugs).toContain('aarti-sant-eknath');
  });

  it('includes daily temple prahar aartis for Pandharpur, Akkalkot, Shegaon, Kolhapur and Tuljapur', () => {
    const slugs = aartis.map(a => a.slug);
    expect(slugs).toContain('pandharpur-vitthal-kakad-aarti');
    expect(slugs).toContain('pandharpur-vitthal-shej-aarti');
    expect(slugs).toContain('rukhumai-aarti');
    expect(slugs).toContain('akkalkot-swami-kakad-aarti');
    expect(slugs).toContain('akkalkot-swami-shej-aarti');
    expect(slugs).toContain('shegaon-gajanan-kakad-aarti');
    expect(slugs).toContain('kolhapur-ambabai-karveer-aarti');
    expect(slugs).toContain('kolhapur-ambabai-kakad-aarti');
    expect(slugs).toContain('tuljabhavani-aarti');
    expect(slugs).toContain('ganesha-kakad-aarti');
  });

  it('includes Mata Parvati and Lord Kartikeya Swami aartis', () => {
    const slugs = aartis.map(a => a.slug);
    expect(slugs).toContain('aarti-parvati-mata');
    expect(slugs).toContain('aarti-kartikeya-swami');
  });
});
