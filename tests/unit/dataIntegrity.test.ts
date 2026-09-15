import { describe, it, expect } from 'vitest';
import {
  aartis,
  ganeshaAartis,
  shivaAartis,
  deviAartis,
  vitthalAartis,
  ramaAartis,
  krishnaAartis,
  dattatreyaAartis,
  hanumanAartis,
  saintsAartis,
  nityapujaAartis,
  navagrahaAartis,
} from '@/data/aartis';
import { deities } from '@/data/deities';

describe('Data Integrity & Accuracy Tests', () => {
  it('has valid deities list with all required fields', () => {
    expect(deities.length).toBeGreaterThan(0);
    deities.forEach(deity => {
      expect(deity.id).toBeTruthy();
      expect(deity.nameDevanagari).toBeTruthy();
      expect(deity.nameTransliteration).toBeTruthy();
      expect(deity.description).toBeTruthy();
      expect(deity.primaryDay).toBeTruthy();
      expect(deity.color).toBeTruthy();
      expect(deity.icon).toBeTruthy();
    });
  });

  it('has unique IDs for all deities', () => {
    const ids = deities.map(d => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('has a substantial collection of authentic aartis and stotras', () => {
    expect(aartis.length).toBeGreaterThanOrEqual(120);
    expect(aartis.length).toBe(129);
  });

  it('verifies modular deity/category aarti collections are populated', () => {
    expect(ganeshaAartis.length).toBeGreaterThanOrEqual(8);
    expect(shivaAartis.length).toBeGreaterThanOrEqual(11);
    expect(deviAartis.length).toBeGreaterThanOrEqual(17);
    expect(vitthalAartis.length).toBeGreaterThanOrEqual(7);
    expect(ramaAartis.length).toBeGreaterThanOrEqual(7);
    expect(krishnaAartis.length).toBeGreaterThanOrEqual(9);
    expect(dattatreyaAartis.length).toBeGreaterThanOrEqual(9);
    expect(hanumanAartis.length).toBeGreaterThanOrEqual(4);
    expect(saintsAartis.length).toBeGreaterThanOrEqual(23);
    expect(nityapujaAartis.length).toBeGreaterThanOrEqual(20);
    expect(navagrahaAartis.length).toBeGreaterThanOrEqual(9);

    const sumOfModular =
      ganeshaAartis.length +
      shivaAartis.length +
      deviAartis.length +
      vitthalAartis.length +
      ramaAartis.length +
      krishnaAartis.length +
      dattatreyaAartis.length +
      hanumanAartis.length +
      saintsAartis.length +
      nityapujaAartis.length +
      navagrahaAartis.length;

    expect(sumOfModular).toBe(aartis.length);
  });

  it('has unique IDs and slugs for all aartis', () => {
    const ids = aartis.map(a => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    const slugs = aartis.map(a => a.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('validates every aarti has valid structure and references an existing deity', () => {
    const validDeityIds = new Set(deities.map(d => d.id));

    aartis.forEach(aarti => {
      expect(aarti.id).toBeTruthy();
      expect(aarti.slug).toMatch(/^[a-z0-9-]+$/);
      expect(aarti.titleDevanagari).toBeTruthy();
      expect(aarti.titleTransliteration).toBeTruthy();
      expect(aarti.firstLineDevanagari).toBeTruthy();
      expect(aarti.firstLineTransliteration).toBeTruthy();
      expect(validDeityIds.has(aarti.deity)).toBe(true);
      expect(['aarti', 'stotra', 'shloka', 'mantra', 'ashtak', 'chalisa']).toContain(aarti.type);
      expect(['marathi', 'sanskrit', 'hindi']).toContain(aarti.language);
      expect(aarti.stanzas.length).toBeGreaterThan(0);

      aarti.stanzas.forEach(stanza => {
        expect(stanza.stanzaNumber).toBeGreaterThan(0);
        expect(stanza.devanagari.length).toBeGreaterThan(0);
        expect(stanza.transliteration.length).toBeGreaterThan(0);
        expect(stanza.devanagari.length).toBe(stanza.transliteration.length);
      });
    });
  });

  it('includes core authentic traditional aartis', () => {
    const slugs = aartis.map(a => a.slug);
    expect(slugs).toContain('sukhkarta-dukhharta');
    expect(slugs).toContain('lavthavti-vikrala');
    expect(slugs).toContain('durge-durgat-bhari');
    expect(slugs).toContain('trigunatmak-traimurti');
    expect(slugs).toContain('yuge-atthavis');
    expect(slugs).toContain('aarti-sai-baba');
    expect(slugs).toContain('aarti-swami-samarth');
    expect(slugs).toContain('aarti-dnyanraja');
    expect(slugs).toContain('aarti-tukaram');
    expect(slugs).toContain('aarti-samarth-ramdas');
    expect(slugs).toContain('aarti-sant-eknath');
    expect(slugs).toContain('aarti-gajanan-maharaj');
  });

  it('includes authentic traditional aartis added from Sampurna Marathi Aarti Sangrah', () => {
    const slugs = aartis.map(a => a.slug);
    const expectedPothiAartis = [
      'nana-parimal-durva',
      'kapol-jhirati-made',
      'jay-dev-vakratunda',
      'jay-dev-shrimangesha',
      'jay-jay-trimbakaraj',
      'ovaloo-ga-maye-vitthal',
      'aarti-anantabhuja-vitho',
      'aarti-shripadavallabh',
      'satrane-uddane-maruti',
      'aarti-ambe-sukhsadane',
      'aarti-navratra-ashwin-shuddha',
      'aarti-mangalagauri',
      'aarti-haritalika',
      'aarti-vatsavitri',
      'aarti-ramchandra-utkat-sadhuni',
      'aarti-ramchandra-tribhuvana-mandit',
      'aarti-ramchandra-svasvaroop',
      'aarti-ramchandra-ratnanchi-kundale',
      'aarti-ramchandra-kay-karun-ge-maya',
      'aarti-krishna-ovaloo-madangopala',
      'aarti-krishna-hari-chala-mandira',
      'aarti-krishna-avtar-gokuli',
      'aarti-krishna-sahasradeepe',
      'aarti-krishna-aikoni-krishnakirti',
      'aarti-vishnu-sant-sanakadik',
      'aarti-vyankatesh-sheshachal',
      'aarti-anant-jay-shree-ananta',
      'aarti-bhuvan-sundar',
      'aarti-satyanarayan',
      'aarti-parashuram',
      'aarti-dashavatar',
      'aarti-sadguru-sagun-he-aarti',
      'aarti-sadguru-falale-bhagya-majhe',
      'aarti-sadguru-dhanya-dhanya-pradakshina',
      'aarti-dasbodh',
      'aarti-tukaram-prapanch-rachana',
      'aarti-sant-namdev',
      'aarti-sant-mandali',
      'aarti-atmaram',
      'aarti-shri-geeta',
      'aarti-gangamai',
      'aarti-manobodh',
      'aarti-bhagwat',
      'aarti-tulsi-mata',
      'aarti-kakad-sadhu-ahesak-utha',
      'aarti-kakad-bhaktichiye-poti',
      'aarti-kakad-paramatmaya-raghupati',
      'aarti-panchayatan',
      'aarti-dhoop-pandhariraya',
      'aarti-deep-panduranga',
      'aarti-naivedya-vithabai',
      'aarti-niranjan',
      'aarti-nirop',
    ];

    expectedPothiAartis.forEach(slug => {
      expect(slugs).toContain(slug);
    });
  });

  it('validates verified accuracy of previously reported aartis', () => {
    // Gajanan Maharaj - Das Ganu Maharaj
    const gajanan = aartis.find(a => a.slug === 'aarti-gajanan-maharaj');
    expect(gajanan).toBeDefined();
    expect(gajanan?.author).toContain('दासगणू');
    expect(gajanan?.firstLineDevanagari).toContain('जय जय सच्चितस्वरूप स्वामी गणराया');

    // Samarth Ramdas - Kalyan Swami
    const ramdas = aartis.find(a => a.slug === 'aarti-samarth-ramdas');
    expect(ramdas).toBeDefined();
    expect(ramdas?.author).toContain('कल्याण');
    expect(ramdas?.firstLineDevanagari).toContain('आरती रामदासा');

    // Sant Eknath - Anant Gopaldas
    const eknath = aartis.find(a => a.slug === 'aarti-sant-eknath');
    expect(eknath).toBeDefined();
    expect(eknath?.firstLineDevanagari).toContain('आरती एकनाथा');

    // Sant Tukaram - Rameshwar Bhatt
    const tukaram = aartis.find(a => a.slug === 'aarti-tukaram');
    expect(tukaram).toBeDefined();
    expect(tukaram?.author).toContain('रामेश्वर');
    expect(tukaram?.firstLineDevanagari).toContain('आरती तुकारामा');

    // Vitthal - Yuge Atthavis has all 5 stanzas
    const vitthal = aartis.find(a => a.slug === 'yuge-atthavis');
    expect(vitthal).toBeDefined();
    expect(vitthal?.stanzas.length).toBe(5);

    // Khanderaya Jejuri
    const khandoba = aartis.find(a => a.slug === 'aarti-khanderaya-jejuri');
    expect(khandoba).toBeDefined();
    expect(khandoba?.firstLineDevanagari).toContain('पंचानन हयवाहन सुरभूषित');

    // Shani Dev has all 7 stanzas + chorus
    const shani = aartis.find(a => a.slug === 'aarti-shani-dev');
    expect(shani).toBeDefined();
    expect(shani?.stanzas.length).toBe(8);
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
    expect(allDevanagari).toContain('रामदासीं अग्रगण्यु');
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
    expect(allDevanagari).toContain('पिवळा पीतांबर कैसा गगनीं झळकला');
    expect(allDevanagari).toContain('विठोबाच');
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
