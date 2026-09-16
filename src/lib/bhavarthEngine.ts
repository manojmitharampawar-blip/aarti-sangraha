/**
 * Devotional Bhavarth (भावार्थ) Engine
 *
 * Retrieves verse-by-verse devotional translations and spiritual significance
 * for any hymn stanza in Marathi and English.
 */

import { BHAVARTH_REGISTRY, StanzaBhavarth } from '@/data/bhavarthData';
import { Stanza, AartiItem } from '@/types';

export interface EnrichedStanzaMeaning {
  marathiMeaning: string;
  englishMeaning: string;
  keywords: string[];
  isCurated: boolean;
}

/**
 * Common Prakrit & Sanskrit devotional term dictionary for contextual meaning generation
 */
const PRAKRIT_DEVOTIONAL_GLOSSARY: Record<string, { mr: string; en: string }> = {
  'सुखकर्ता': { mr: 'सर्व सुखांची निर्मिती करणारा', en: 'Bestower of supreme joy' },
  'दुःखहर्ता': { mr: 'दुःखांचा नाश करणारा', en: 'Dispeller of all grief' },
  'विघ्न': { mr: 'संकट किंवा अडथळे', en: 'Obstacles and adversities' },
  'कृपा': { mr: 'अहेतुक दया व अनुग्रह', en: 'Unconditional divine grace' },
  'चरण': { mr: 'पवित्र पादपद्म', en: 'Sacred lotus feet' },
  'दर्शन': { mr: 'साक्षात दिव्य रूप पाहणे', en: 'Divine sight and communion' },
  'आनंद': { mr: 'आत्मिक परमानंद', en: 'Spiritual bliss' },
  'संकट': { mr: 'जीवनातील आपत्ती', en: 'Calamity and distress' },
  'आरती': { mr: 'भावपूर्ण दीप ओवाळणे', en: 'Reverent flame offering' },
  'प्रसन्न': { mr: 'भक्तावर अनुग्रहित होणे', en: 'Bestowing auspicious blessings' },
  'सद्गुरु': { mr: 'अज्ञानाचा अंधकार दूर करणारे गुरु', en: 'The true spiritual master' },
  'मुक्ती': { mr: 'भवसागरातून सुटका / मोक्ष', en: 'Spiritual liberation from rebirth' },
  'भक्ती': { mr: 'निष्काम भगवत्प्रेम', en: 'Pure, unconditional devotion' },
  'तारक': { mr: 'संसारसागरातून उद्धरणारा', en: 'Saviour and redeemer of souls' },
  'अवतार': { mr: 'धर्मरक्षणासाठी देवाचे प्रकटीकरण', en: 'Divine incarnation for righteousness' },
};

/**
 * Retrieves the Bhavarth for a specific stanza of an Aarti/Stotra
 */
export function getStanzaBhavarth(
  aartiSlug: string,
  stanzaIndex: number,
  stanza?: Stanza,
  aartiItem?: AartiItem
): EnrichedStanzaMeaning {
  const profile = BHAVARTH_REGISTRY[aartiSlug];

  if (profile) {
    const curated = profile.stanzas.find(
      s => s.stanzaNumber === stanzaIndex + 1 || s.stanzaNumber === (stanza?.stanzaNumber || 1)
    );
    if (curated) {
      return {
        marathiMeaning: curated.marathi,
        englishMeaning: curated.english,
        keywords: curated.keyInsights || [],
        isCurated: true,
      };
    }
  }

  // If not curated stanza, dynamically derive meaning from stanza lines and glossary
  const lines = stanza?.devanagari || [];
  const fullText = lines.join(' ');
  const matchedGlossary: string[] = [];
  const detectedKeywords: string[] = [];

  for (const [key, val] of Object.entries(PRAKRIT_DEVOTIONAL_GLOSSARY)) {
    if (fullText.includes(key)) {
      matchedGlossary.push(`${key} (${val.mr})`);
      detectedKeywords.push(key);
      if (detectedKeywords.length >= 3) break;
    }
  }

  const deityName = aartiItem?.deity || 'देवता';
  const aartiTitle = aartiItem?.titleDevanagari || 'आरती';

  const defaultMarathi =
    matchedGlossary.length > 0
      ? `या कडव्यात ${aartiTitle}च्या माध्यमातून ${matchedGlossary.join(
          ', '
        )} या संकल्पनांचा उल्लेख करून भक्तीभावाने ईश्वराची स्तुती केली आहे. भक्ताच्या अंतःकरणात शांती व भक्तीभाव निर्माण करणारी ही ओळ आहे.`
      : `या कडव्यात देवाचे दिव्य स्वरूप, करुणा आणि भक्तांच्या रक्षणाची प्रार्थना भक्तीमय स्वरात व्यक्त झाली आहे.`;

  const defaultEnglish =
    matchedGlossary.length > 0
      ? `This verse reveres the divine presence with sacred expressions of devotion (${detectedKeywords.join(
          ', '
        )}), invoking spiritual peace, protection, and boundless grace.`
      : `This verse glorifies the divine attributes, seeking divine blessings, protection, and eternal peace.`;

  return {
    marathiMeaning: defaultMarathi,
    englishMeaning: defaultEnglish,
    keywords: detectedKeywords.length > 0 ? detectedKeywords : ['भक्ती', 'उपासना', 'कृपा'],
    isCurated: false,
  };
}
