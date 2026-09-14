import { describe, it, expect } from 'vitest';
import { aartis } from '@/data/aartis';
import { extractQueryIntents, semanticSearchHymns } from '@/lib/semanticSearch';
import { DEVOTIONAL_INTENT_CATEGORIES } from '@/lib/semanticIndex';

describe('In-Browser AI Semantic Vector Search', () => {
  it('extracts correct spiritual intents from natural language queries', () => {
    const crisisQuery = extractQueryIntents('मला मोठ्या संकटातून निवारण हवे आहे');
    expect(crisisQuery['sankat_nivaran']).toBeGreaterThan(0);

    const healthQuery = extractQueryIntents('health healing cure disease illness');
    expect(healthQuery['aarogya_swasthya']).toBeGreaterThan(0);

    const wisdomQuery = extractQueryIntents('अभ्यास आणि परीक्षेसाठी सरस्वती वंदना');
    expect(wisdomQuery['vidya_buddhi']).toBeGreaterThan(0);

    const fearQuery = extractQueryIntents('protection from enemy and fear shield');
    expect(fearQuery['bhaya_shatru_nivaran']).toBeGreaterThan(0);

    const wealthQuery = extractQueryIntents('धन समृद्धी आणि व्यापार वाढीसाठी');
    expect(wealthQuery['dhana_samriddhi']).toBeGreaterThan(0);
  });

  it('ranks crisis-removal hymns at top for "संकट निवारण" query', () => {
    const results = semanticSearchHymns(aartis, 'संकट निवारण');
    expect(results.length).toBeGreaterThan(0);

    const topSlugs = results.slice(0, 5).map(r => r.hymn.slug);
    // Should include iconic obstacle-removal hymns
    const hasObstacleHymn = topSlugs.some(slug =>
      ['sankata-nashana-ganesh-stotra', 'ganapati-atharvashirsha', 'ghora-kashtoddharana-stotra', 'sukhkarta-dukhharta'].includes(slug)
    );
    expect(hasObstacleHymn).toBe(true);
    expect(results[0].score).toBeGreaterThanOrEqual(70);
  });

  it('ranks health and solar hymns at top for "आरोग्य आणि दीर्घायुष्य" (Health & Longevity)', () => {
    const results = semanticSearchHymns(aartis, 'आरोग्य आणि दीर्घायुष्य');
    expect(results.length).toBeGreaterThan(0);

    const topSlugs = results.slice(0, 5).map(r => r.hymn.slug);
    expect(topSlugs).toContain('aditya-hridaya-stotra');
    expect(results[0].reasonMr).toBeDefined();
  });

  it('ranks Saraswati Vandana and Atharvashirsha at top for "अभ्यास आणि परीक्षा" (Study & Exams)', () => {
    const results = semanticSearchHymns(aartis, 'अभ्यास परीक्षा ज्ञान');
    expect(results.length).toBeGreaterThan(0);

    const topSlugs = results.slice(0, 5).map(r => r.hymn.slug);
    const hasWisdomHymn = topSlugs.some(slug =>
      ['saraswati-vandana', 'aarti-saraswati-mata', 'ganapati-atharvashirsha'].includes(slug)
    );
    expect(hasWisdomHymn).toBe(true);
  });

  it('ranks Shree Suktam at top for "wealth prosperity money" intent', () => {
    const results = semanticSearchHymns(aartis, 'wealth prosperity money');
    expect(results.length).toBeGreaterThan(0);

    const topSlugs = results.slice(0, 5).map(r => r.hymn.slug);
    const hasWealthHymn = topSlugs.some(slug =>
      ['shree-suktam', 'mahalakshmi-ashtakam', 'aarti-mahalakshmi'].includes(slug)
    );
    expect(hasWealthHymn).toBe(true);
  });

  it('correctly filters and ranks by target intent key directly', () => {
    const results = semanticSearchHymns(aartis, '', 'bhaya_shatru_nivaran');
    expect(results.length).toBeGreaterThan(0);

    const topSlugs = results.slice(0, 7).map(r => r.hymn.slug);
    expect(topSlugs).toContain('ram-raksha-stotra');
    expect(topSlugs).toContain('maruti-stotra-bhimrupi');
  });

  it('ensures all intent categories have defined icons and keywords', () => {
    expect(DEVOTIONAL_INTENT_CATEGORIES.length).toBe(10);
    DEVOTIONAL_INTENT_CATEGORIES.forEach(cat => {
      expect(cat.key).toBeDefined();
      expect(cat.icon).toBeDefined();
      expect(cat.keywords.length).toBeGreaterThan(5);
    });
  });
});
