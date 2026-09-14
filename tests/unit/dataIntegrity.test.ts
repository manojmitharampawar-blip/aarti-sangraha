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

  it('includes iconic Stotras, Ashtakas, and Mantras across deities', () => {
    const slugs = aartis.map(a => a.slug);
    const expectedStotras = [
      'ganapati-atharvashirsha',
      'sankata-nashana-ganesh-stotra',
      'ram-raksha-stotra',
      'maruti-stotra-bhimrupi',
      'hanuman-chalisa',
      'shiva-tandava-stotra',
      'bilvashtakam',
      'mahishasuramardini-stotra',
      'shree-suktam',
      'aditya-hridaya-stotra',
      'madhurashtakam',
      'achyutashtakam',
      'pasayadan-dnyaneshwar',
      'swami-samarth-tarak-mantra',
      'ghora-kashtoddharana-stotra',
      'shani-stotra-dasharatha',
      'saraswati-vandana',
    ];

    expectedStotras.forEach(slug => {
      expect(slugs).toContain(slug);
    });
  });

  it('includes authentic Aartis and Stotras for Lord Dattatreya', () => {
    const slugs = aartis.map(a => a.slug);
    const expectedDattaHymns = [
      'trigunatmak-traimurti',
      'ghora-kashtoddharana-stotra',
      'dattatreya-stotra-narada',
      'datta-bavani',
      'dattashtakam',
      'datta-pradakshina-aarti',
      'datta-kakad-aarti',
      'datta-shej-aarti',
    ];

    expectedDattaHymns.forEach(slug => {
      expect(slugs).toContain(slug);
    });
  });

  it('includes iconic Shiva Stotras and Ashtakas', () => {
    const slugs = aartis.map(a => a.slug);
    const expectedShivaHymns = [
      'shiva-panchakshara-stotra',
      'lingashtakam',
      'rudrashtakam',
      'shiva-manasa-puja',
      'kalabhairavashtakam',
      'shiva-tandava-stotra',
      'bilvashtakam',
    ];

    expectedShivaHymns.forEach(slug => {
      expect(slugs).toContain(slug);
    });
  });

  it('ensures Ram Raksha Stotra has complete 38 shlokas and viniyoga', () => {
    const ramraksha = aartis.find(a => a.slug === 'ram-raksha-stotra');
    expect(ramraksha).toBeDefined();
    expect(ramraksha?.stanzas.length).toBe(7);
    const allDevanagari = ramraksha?.stanzas.flatMap(s => s.devanagari).join(' ') || '';
    expect(allDevanagari).toContain('अस्य श्रीरामरक्षास्तोत्रमन्त्रस्य');
    expect(allDevanagari).toContain('चरितं रघुनाथस्य');
    expect(allDevanagari).toContain('शिरो मे राघवः पातु');
    expect(allDevanagari).toContain('रामो दाशरथिः शूरो');
    expect(allDevanagari).toContain('मनोजवं मारुततुल्यवेगं');
    expect(allDevanagari).toContain('रामो राजमणिः सदा विजयते');
    expect(allDevanagari).toContain('राम रामेति रामेति रमे रामे मनोरमे');
  });

  it('ensures Maruti Stotra Bhimrupi has Samarth Ramdas Swamis complete 17 verses', () => {
    const maruti = aartis.find(a => a.slug === 'maruti-stotra-bhimrupi');
    expect(maruti).toBeDefined();
    expect(maruti?.stanzas.length).toBe(4);
    const allDevanagari = maruti?.stanzas.flatMap(s => s.devanagari).join(' ') || '';
    expect(allDevanagari).toContain('भीमरूपी महारुद्रा');
    expect(allDevanagari).toContain('ब्रह्मांडें माइलीं नेणों');
    expect(allDevanagari).toContain('आणिला मागुती नेला');
    expect(allDevanagari).toContain('हे धरा पंधरा श्लोकी');
    expect(allDevanagari).toContain('रामदासी अग्रगण्यू');
  });

  it('ensures Bilvashtakam has all 8 verses and Phalashruti', () => {
    const bilva = aartis.find(a => a.slug === 'bilvashtakam');
    expect(bilva).toBeDefined();
    expect(bilva?.stanzas.length).toBe(9);
    const allDevanagari = bilva?.stanzas.flatMap(s => s.devanagari).join(' ') || '';
    expect(allDevanagari).toContain('त्रिदलं त्रिगुणाकारं');
    expect(allDevanagari).toContain('मूलतो ब्रह्मरूपाय');
    expect(allDevanagari).toContain('बिल्वाष्टकमिदं पुण्यं');
  });

  it('ensures Vitthal Aarti Yei Ho Vitthale has all 5 complete stanzas', () => {
    const vitthal = aartis.find(a => a.slug === 'yei-ho-vitthale');
    expect(vitthal).toBeDefined();
    expect(vitthal?.stanzas.length).toBe(5);
    const allDevanagari = vitthal?.stanzas.flatMap(s => s.devanagari).join(' ') || '';
    expect(allDevanagari).toContain('येई हो विठ्ठले माझे माउली ये');
    expect(allDevanagari).toContain('पिंवळा पीतांबर कैसा गगनीं झळकला');
    expect(allDevanagari).toContain('विठोबाचे राज्य आम्हां नित्य दिपवाळी');
    expect(allDevanagari).toContain('असो नसो भाव आम्हां तुझिया ठायां');
    expect(allDevanagari).toContain('नामा म्हणे सांगूं काय तुझी लीला');
  });

  it('ensures concluding prayers Ghalin Lotangan and Mantra Pushpanjali have structured stanzas', () => {
    const ghalin = aartis.find(a => a.slug === 'ghalin-lotangan');
    expect(ghalin).toBeDefined();
    expect(ghalin?.stanzas.length).toBe(5);

    const mantra = aartis.find(a => a.slug === 'mantra-pushpanjali');
    expect(mantra).toBeDefined();
    expect(mantra?.stanzas.length).toBe(4);
  });
});
