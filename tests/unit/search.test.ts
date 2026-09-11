import { describe, it, expect } from 'vitest';
import { searchHymns, filterHymns } from '@/lib/search';
import { AartiItem } from '@/types';

const mockAartis: AartiItem[] = [
  {
    id: 'ganesha-sukhkarta',
    slug: 'sukhkarta-dukhharta',
    titleDevanagari: 'सुखकर्ता दुःखहर्ता',
    titleTransliteration: 'Sukhkarta Dukhharta',
    firstLineDevanagari: 'सुखकर्ता दुःखहर्ता वार्ता विघ्नाची',
    firstLineTransliteration: 'Sukhkarta dukhharta varta vighnachi',
    deity: 'ganesha',
    type: 'aarti',
    language: 'marathi',
    author: 'Samarth Ramdas',
    stanzas: [
      {
        stanzaNumber: 1,
        isChorus: true,
        devanagari: ['सुखकर्ता दुःखहर्ता वार्ता विघ्नाची', 'नुरवी पुरवी प्रेम कृपा जयाची'],
        transliteration: ['Sukhkarta dukhharta varta vighnachi', 'Nuravi puravi prema krupa jayachi'],
      }
    ],
    tags: ['ganesh', 'sukhkarta', 'marathi', 'pratham pujya'],
  },
  {
    id: 'shiva-lavthavti',
    slug: 'lavthavti-vikrala',
    titleDevanagari: 'लवथवती विक्राळा',
    titleTransliteration: 'Lavthavti Vikrala',
    firstLineDevanagari: 'लवथवती विक्राळा ब्रह्मांडी माळा',
    firstLineTransliteration: 'Lavthavti vikrala brahmandi mala',
    deity: 'shiva',
    type: 'aarti',
    language: 'marathi',
    stanzas: [
      {
        stanzaNumber: 1,
        isChorus: true,
        devanagari: ['लवथवती विक्राळा ब्रह्मांडी माळा'],
        transliteration: ['Lavthavti vikrala brahmandi mala'],
      }
    ],
    tags: ['shiva', 'mahadev', 'bholenath', 'shankara'],
  },
  {
    id: 'hanuman-chalisa',
    slug: 'hanuman-chalisa',
    titleDevanagari: 'हनुमान चालीसा',
    titleTransliteration: 'Hanuman Chalisa',
    firstLineDevanagari: 'श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि',
    firstLineTransliteration: 'Shri Guru charan saroj raj nij manu mukuru sudhari',
    deity: 'hanuman',
    type: 'chalisa',
    language: 'hindi',
    author: 'Tulsidas',
    stanzas: [],
    tags: ['hanuman', 'bajrangbali', 'chalisa'],
  }
];

describe('Search & Filter Engine', () => {
  it('finds hymns by exact or partial Devanagari query', () => {
    const results = searchHymns(mockAartis, 'सुखकर्ता');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toBe('sukhkarta-dukhharta');
  });

  it('finds hymns by English phonetic transliteration query', () => {
    const results = searchHymns(mockAartis, 'sukhkarta');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toBe('sukhkarta-dukhharta');
  });

  it('finds hymns with fuzzy matching and minor typos', () => {
    const results = searchHymns(mockAartis, 'lavtavti');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toBe('lavthavti-vikrala');
  });

  it('filters hymns strictly by deity', () => {
    const ganeshaHymns = filterHymns(mockAartis, { deity: 'ganesha' });
    expect(ganeshaHymns.length).toBe(1);
    expect(ganeshaHymns[0].deity).toBe('ganesha');

    const shivaHymns = filterHymns(mockAartis, { deity: 'shiva' });
    expect(shivaHymns.length).toBe(1);
    expect(shivaHymns[0].deity).toBe('shiva');
  });

  it('filters hymns by hymn type', () => {
    const chalisas = filterHymns(mockAartis, { type: 'chalisa' });
    expect(chalisas.length).toBe(1);
    expect(chalisas[0].slug).toBe('hanuman-chalisa');

    const aartis = filterHymns(mockAartis, { type: 'aarti' });
    expect(aartis.length).toBe(2);
  });

  it('returns all hymns when query is empty', () => {
    const results = searchHymns(mockAartis, '');
    expect(results.length).toBe(mockAartis.length);
  });
});
