/**
 * In-Browser Devotional Intent & Semantic Vector Index
 *
 * Provides a high-dimensional intent ontology for all 76+ aartis and stotras.
 * Enables zero-latency, 100% offline-ready semantic vector search without server calls.
 */

export interface SemanticIntentProfile {
  id: string; // matches AartiItem.id
  primaryIntents: string[]; // e.g. ['sankat_nivaran', 'vidya_buddhi']
  intentWeights: Record<string, number>; // normalized weights 0.0 - 1.0
  semanticKeywords: string[]; // Marathi, Sanskrit and English synonyms
  devotionalPurpose: {
    mr: string;
    en: string;
  };
}

export const DEVOTIONAL_INTENT_CATEGORIES = [
  {
    key: 'sankat_nivaran',
    labelMr: 'संकट निवारण व अडथळे दूर करणे',
    labelEn: 'Overcoming Crises & Obstacles',
    icon: '🛡️',
    keywords: [
      'संकट', 'विघ्न', 'अडचण', 'कष्ट', 'निवारण', 'संकटमोचन', 'विघ्नहर्ता',
      'संकटनाशन', 'त्रास', 'संकष्टी', 'विपत्ती', 'crisis', 'trouble',
      'obstacles', 'hardship', 'protection', 'problems', 'difficulties'
    ],
  },
  {
    key: 'aarogya_swasthya',
    labelMr: 'आरोग्य, दीर्घायुष्य व व्याधीमुक्ती',
    labelEn: 'Health, Longevity & Healing',
    icon: '🌿',
    keywords: [
      'आरोग्य', 'रोग', 'व्याधी', 'दीर्घायुष्य', 'स्वास्थ्य', 'औषध', 'निरोगी',
      'पीडा', 'आजारी', 'आयुष्य', 'अमृत', 'health', 'healing', 'cure',
      'illness', 'longevity', 'medicine', 'disease', 'recovery'
    ],
  },
  {
    key: 'vidya_buddhi',
    labelMr: 'विद्या, बुद्धी, ज्ञान व अभ्यास',
    labelEn: 'Wisdom, Education & Intellect',
    icon: '💡',
    keywords: [
      'विद्या', 'बुद्धी', 'ज्ञान', 'अभ्यास', 'परीक्षा', 'स्मरणशक्ती', 'मती',
      'सरस्वती', 'शारदा', 'एकाग्रता', 'intellect', 'education', 'exam',
      'wisdom', 'memory', 'study', 'student', 'knowledge', 'concentration'
    ],
  },
  {
    key: 'shanti_samadhan',
    labelMr: 'मनःशांती, ध्यान व चिंतामुक्ती',
    labelEn: 'Inner Peace, Mental Calm & Anxiety Relief',
    icon: '🕊️',
    keywords: [
      'शांती', 'मन', 'ध्यान', 'समाधान', 'शांतता', 'चित्त', 'एकाग्रता', 'चिंता',
      'नैराश्य', 'शांत', 'तणाव', 'सद्बुद्धी', 'peace', 'calm', 'depression',
      'anxiety', 'stress', 'meditation', 'mind', 'mental', 'serenity'
    ],
  },
  {
    key: 'dhana_samriddhi',
    labelMr: 'धन, ऐश्वर्य, व्यापार व समृद्धी',
    labelEn: 'Wealth, Abundance & Prosperity',
    icon: '💰',
    keywords: [
      'धन', 'लक्ष्मी', 'समृद्धी', 'वैभव', 'संपत्ती', 'ऐश्वर्य', 'व्यापार',
      'बरकत', 'कुबेर', 'यशोगाथा', 'नफा', 'wealth', 'prosperity', 'money',
      'business', 'fortune', 'abundance', 'success', 'finances', 'growth'
    ],
  },
  {
    key: 'bhaya_shatru_nivaran',
    labelMr: 'भयमुक्ती, शत्रूभय व सुरक्षा कवच',
    labelEn: 'Protection, Fearlessness & Shield',
    icon: '⚔️',
    keywords: [
      'भय', 'भीती', 'शत्रू', 'दृष्ट', 'भूतबाधा', 'सुरक्षा', 'कवच', 'रक्षण',
      'काळभैरव', 'संरक्षण', 'निर्भय', 'fear', 'protection', 'armor',
      'ghost', 'enemy', 'shield', 'evil', 'defense', 'courage'
    ],
  },
  {
    key: 'paap_mukti_moksha',
    labelMr: 'पापमुक्ती, प्रायश्चित्त व मोक्ष',
    labelEn: 'Spiritual Cleansing & Salvation',
    icon: '🪷',
    keywords: [
      'पाप', 'मुक्ती', 'मोक्ष', 'उद्धार', 'प्रायश्चित्त', 'गंगा', 'जन्ममरण',
      'कर्म', 'पवित्र', 'शुद्धी', 'पापनाशन', 'sins', 'liberation',
      'moksha', 'spiritual', 'salvation', 'cleansing', 'karma'
    ],
  },
  {
    key: 'bhakti_samarpan',
    labelMr: 'भक्ती, प्रेम, शरण व समर्पण',
    labelEn: 'Devotion, Surrender & Grace',
    icon: '🙏',
    keywords: [
      'भक्ती', 'शरण', 'समर्पण', 'लोटांगण', 'लीन', 'नामस्मरण', 'भजन',
      'प्रेम', 'माऊली', 'विठू', 'कृपा', 'devotion', 'surrender', 'love',
      'prayer', 'bhakti', 'grace', 'humility', 'namasmaran'
    ],
  },
  {
    key: 'karya_siddhi',
    labelMr: 'कार्यसिद्धी, मनोकामना व यश',
    labelEn: 'Success, Victory & Manifestation',
    icon: '🌟',
    keywords: [
      'कार्यसिद्धी', 'यश', 'विजय', 'फल', 'मनोकामना', 'संकल्प', 'सफलता',
      'काम', 'प्रारंभ', 'जय', 'victory', 'success', 'achievement',
      'fulfillment', 'goals', 'wishes', 'auspicious'
    ],
  },
  {
    key: 'graha_shani_dosha',
    labelMr: 'ग्रहपीडा, शनीदोष व नवग्रह शांती',
    labelEn: 'Planetary Relief & Shani Dosha',
    icon: '🪐',
    keywords: [
      'शनी', 'साडेसाती', 'ग्रह', 'नवग्रह', 'दोष', 'पीडा', 'दशा', 'कष्ट',
      'अडचणी', 'सूर्य', 'shani', 'sade sati', 'planetary', 'astrology',
      'dosha', 'saturn', 'horoscope'
    ],
  },
];

/**
 * Pre-compiled semantic vector index for the hymns
 */
export const HYMN_SEMANTIC_PROFILES: Record<string, SemanticIntentProfile> = {
  // GANESH HYMNS
  'ganesh-sukhkarta-dukhharta': {
    id: 'ganesh-sukhkarta-dukhharta',
    primaryIntents: ['sankat_nivaran', 'karya_siddhi', 'shanti_samadhan'],
    intentWeights: { sankat_nivaran: 0.95, karya_siddhi: 0.9, shanti_samadhan: 0.8 },
    semanticKeywords: ['विघ्नहर्ता', 'संकटमुक्ती', 'आनंद', 'प्रारंभ', 'सुखकर्ता', 'दुःखहर्ता', 'गणपती', 'शुभ'],
    devotionalPurpose: {
      mr: 'सर्व दुःखांचे हरण करून विघ्न निवारणासाठी व शुभ कार्यारंभासाठी',
      en: 'Overcoming obstacles, dissolving sorrows, and initiating auspicious deeds',
    },
  },
  'ganapati-atharvashirsha': {
    id: 'ganapati-atharvashirsha',
    primaryIntents: ['sankat_nivaran', 'vidya_buddhi', 'karya_siddhi', 'paap_mukti_moksha'],
    intentWeights: { vidya_buddhi: 0.98, sankat_nivaran: 0.96, karya_siddhi: 0.95, paap_mukti_moksha: 0.85 },
    semanticKeywords: ['उपनिषद', 'ब्रह्म', 'विद्या', 'बुद्धी', 'ज्ञान', 'सर्वविघ्ननाशक', 'महामंत्र', 'अभ्यास', 'पापनाशन'],
    devotionalPurpose: {
      mr: 'अथर्ववेदातील दिव्य उपनिषद; बुद्धी, स्मरणशक्ती, कार्यसिद्धी व सर्व विघ्नांच्या मुळापासून नाशासाठी',
      en: 'Vedic Upanishad for divine wisdom, supreme intellect, memory power, and obstacle eradication',
    },
  },
  'sankata-nashana-ganesh-stotra': {
    id: 'sankata-nashana-ganesh-stotra',
    primaryIntents: ['sankat_nivaran', 'vidya_buddhi', 'dhana_samriddhi', 'karya_siddhi'],
    intentWeights: { sankat_nivaran: 0.99, vidya_buddhi: 0.9, dhana_samriddhi: 0.85, karya_siddhi: 0.9 },
    semanticKeywords: ['नारद पुराण', 'बारा नावे', 'संकटनाशन', 'संकष्टी', 'विद्यार्थी', 'धनार्थी', 'पुत्रार्थी', 'मोक्षार्थी'],
    devotionalPurpose: {
      mr: 'नारद मुनी विरचित १२ दिव्य नामे; कोणत्याही बिकट संकटातून तात्काळ मुक्ती मिळवण्यासाठी',
      en: 'Sage Naradas 12 divine names of Ganesha for immediate deliverance from acute troubles',
    },
  },

  // RAMA HYMNS
  'ram-raksha-stotra': {
    id: 'ram-raksha-stotra',
    primaryIntents: ['bhaya_shatru_nivaran', 'aarogya_swasthya', 'sankat_nivaran', 'karya_siddhi'],
    intentWeights: { bhaya_shatru_nivaran: 0.99, aarogya_swasthya: 0.95, sankat_nivaran: 0.92, karya_siddhi: 0.9 },
    semanticKeywords: ['बुधकौशिक', 'अंगरक्षा', 'कवच', 'रोगमुक्ती', 'शत्रूनाश', 'भीती', 'दीर्घायुष्य', 'वज्रपंजर', 'सुरक्षा'],
    devotionalPurpose: {
      mr: 'भगवान श्रीरामाचे सिद्ध सुरक्षा कवच; सर्व रोग, भीती, आपत्ती व शत्रूभयापासून अभेद्य रक्षण करण्यासाठी',
      en: 'Supreme protective spiritual armor of Lord Rama for health, longevity, and total protection',
    },
  },

  // HANUMAN HYMNS
  'maruti-stotra-bhimrupi': {
    id: 'maruti-stotra-bhimrupi',
    primaryIntents: ['aarogya_swasthya', 'bhaya_shatru_nivaran', 'sankat_nivaran', 'graha_shani_dosha'],
    intentWeights: { aarogya_swasthya: 0.98, bhaya_shatru_nivaran: 0.96, sankat_nivaran: 0.92, graha_shani_dosha: 0.88 },
    semanticKeywords: ['समर्थ रामदास', 'भीमरूपी', 'शक्ती', 'आरोग्य', 'व्याधी', 'भूतप्रेत', 'शनीदोष', 'बळ', 'उत्साह'],
    devotionalPurpose: {
      mr: 'समर्थ रामदास स्वामी विरचित; शारीरिक बळ, उत्साह, दुर्धर रोगमुक्ती व भूतबाधा-भीती नाशासाठी',
      en: 'Empowerment stotra by Samarth Ramdas Swami for physical vitality, health recovery, and courage',
    },
  },
  'hanuman-chalisa': {
    id: 'hanuman-chalisa',
    primaryIntents: ['bhaya_shatru_nivaran', 'aarogya_swasthya', 'sankat_nivaran', 'vidya_buddhi'],
    intentWeights: { bhaya_shatru_nivaran: 0.99, aarogya_swasthya: 0.96, sankat_nivaran: 0.95, vidya_buddhi: 0.9 },
    semanticKeywords: ['तुलसीदास', 'चालीसा', 'संकटमोचन', 'बल बुद्धी विद्या', 'नासै रोग हरै सब पीरा', 'भूत पिशाच'],
    devotionalPurpose: {
      mr: 'संत तुलसीदास विरचित ४० चौपाया; बल, बुद्धी, भयमुक्ती व संकटांतून कायमस्वरूपी मुक्ततेसाठी',
      en: 'Sant Tulsidas iconic 40 verses for removing fear, restoring physical health, and granting wisdom',
    },
  },

  // SHIVA HYMNS
  'shiva-tandava-stotra': {
    id: 'shiva-tandava-stotra',
    primaryIntents: ['dhana_samriddhi', 'bhaya_shatru_nivaran', 'karya_siddhi', 'shanti_samadhan'],
    intentWeights: { dhana_samriddhi: 0.92, bhaya_shatru_nivaran: 0.9, karya_siddhi: 0.92, shanti_samadhan: 0.85 },
    semanticKeywords: ['रावण', 'तांडव', 'जटाटवी', 'ऐश्वर्य', 'रथ', 'गज', 'तुरंग', 'शक्ती', 'विजय', 'शंभो'],
    devotionalPurpose: {
      mr: 'रावण विरचित तेजस्वी स्तुती; ऐश्वर्य, मानसिक बळ, उच्च आत्मविश्वास व स्थिर समृद्धीसाठी',
      en: 'Vibrant hymn by Ravana for grand prosperity, inner strength, and elevated spiritual energy',
    },
  },
  'bilvashtakam': {
    id: 'bilvashtakam',
    primaryIntents: ['paap_mukti_moksha', 'shanti_samadhan', 'bhakti_samarpan'],
    intentWeights: { paap_mukti_moksha: 0.98, shanti_samadhan: 0.9, bhakti_samarpan: 0.9 },
    semanticKeywords: ['आदि शंकराचार्य', 'त्रिदलं', 'बेलपत्र', 'पापनाशन', 'शिवार्पण', 'त्रिजन्मपाप', 'शिवलोक'],
    devotionalPurpose: {
      mr: 'आदि शंकराचार्य विरचित; तिन्ही जन्मांच्या पापांच्या क्षालनासाठी व भगवान शिवाची परम कृपा मिळवण्यासाठी',
      en: 'Cleansing of karmic sins through offering sacred Bilva leaves to Lord Shiva',
    },
  },
  'kalabhairavashtakam': {
    id: 'kalabhairavashtakam',
    primaryIntents: ['bhaya_shatru_nivaran', 'paap_mukti_moksha', 'sankat_nivaran'],
    intentWeights: { bhaya_shatru_nivaran: 0.99, paap_mukti_moksha: 0.95, sankat_nivaran: 0.92 },
    semanticKeywords: ['कालभैरव', 'काशी', 'मृत्यूभय', 'यमदूत', 'शत्रू', 'भीती', 'दुष्टग्रह', 'पापनाशक'],
    devotionalPurpose: {
      mr: 'काशीचे कोतवाल कालभैरवाची स्तुती; भीती, अकाल मृत्यूचे भय, शत्रू व दुष्ट बाधांच्या संपूर्ण उच्चाटनासाठी',
      en: 'Powerful ode to Kalabhairava for destroying fear of death, negative energies, and malevolent forces',
    },
  },
  'shiva-panchakshara-stotra': {
    id: 'shiva-panchakshara-stotra',
    primaryIntents: ['paap_mukti_moksha', 'shanti_samadhan', 'bhakti_samarpan'],
    intentWeights: { paap_mukti_moksha: 0.95, shanti_samadhan: 0.95, bhakti_samarpan: 0.9 },
    semanticKeywords: ['नमः शिवाय', 'पंचाक्षर', 'आदि शंकराचार्य', 'नागेन्द्रहाराय', 'शांती', 'मोक्ष'],
    devotionalPurpose: {
      mr: 'ॐ नमः शिवाय या पंचाक्षर मंत्राचे ध्यान; चित्तशुद्धी व अंतिम मोक्षप्राप्तीसाठी',
      en: 'Meditation on the sacred five syllables Om Namah Shivaya for mental purity and spiritual liberation',
    },
  },

  // DEVI & MAHALAKSHMI HYMNS
  'shree-suktam': {
    id: 'shree-suktam',
    primaryIntents: ['dhana_samriddhi', 'karya_siddhi', 'sankat_nivaran'],
    intentWeights: { dhana_samriddhi: 0.99, karya_siddhi: 0.92, sankat_nivaran: 0.85 },
    semanticKeywords: ['ऋग्वेद', 'हिरण्यवर्णां', 'लक्ष्मी', 'धन', 'वैभव', 'दारिद्र्य', 'अलक्ष्मी नाश', 'सुवर्ण', 'अन्नधान्य'],
    devotionalPurpose: {
      mr: 'ऋग्वेदातील परम पवित्र वैदिक सूक्त; दारिद्र्य नाश करून घरात चिरंतन लक्ष्मी, धन व वैभव वृद्धीसाठी',
      en: 'Vedic Rigvedic hymn invoking Goddess Lakshmi for total eradication of poverty and eternal prosperity',
    },
  },
  'mahalakshmi-ashtakam': {
    id: 'mahalakshmi-ashtakam',
    primaryIntents: ['dhana_samriddhi', 'karya_siddhi', 'sankat_nivaran'],
    intentWeights: { dhana_samriddhi: 0.97, karya_siddhi: 0.9, sankat_nivaran: 0.85 },
    semanticKeywords: ['नमस्तेस्तु महामाये', 'कोल्हापूर', 'अंबाबाई', 'श्रीपीठ', 'धन', 'राज्य', 'सर्वपापहरे'],
    devotionalPurpose: {
      mr: 'इंद्राने केलेली महालक्ष्मीची स्तुती; सर्व संकटांचे हरण करून राज्य, यश व अखंड संपत्ती मिळवण्यासाठी',
      en: 'Indras hymn to Goddess Mahalakshmi for bestowal of wealth, noble sovereignty, and removing distress',
    },
  },
  'mahishasuramardini-stotra': {
    id: 'mahishasuramardini-stotra',
    primaryIntents: ['bhaya_shatru_nivaran', 'karya_siddhi', 'sankat_nivaran'],
    intentWeights: { bhaya_shatru_nivaran: 0.98, karya_siddhi: 0.95, sankat_nivaran: 0.9 },
    semanticKeywords: ['अयि गिरिनन्दिनि', 'दुर्गा', 'शत्रूनाश', 'विजय', 'असुर', 'पराक्रम', 'आत्मविश्वास', 'नवरात्र'],
    devotionalPurpose: {
      mr: 'आदिशक्तीचे पराक्रमी स्तोत्र; संकटांवर विजय मिळवण्यासाठी, आत्मविश्वास वाढवण्यासाठी व शत्रूनाशासाठी',
      en: 'Triumphant hymn of Goddess Durga for victory in struggles, fearlessness, and supreme courage',
    },
  },

  // SARASWATI HYMNS
  'saraswati-vandana': {
    id: 'saraswati-vandana',
    primaryIntents: ['vidya_buddhi', 'shanti_samadhan', 'karya_siddhi'],
    intentWeights: { vidya_buddhi: 0.99, shanti_samadhan: 0.9, karya_siddhi: 0.85 },
    semanticKeywords: ['या कुन्देन्दु', 'शारदा', 'विद्या', 'कला', 'संगीत', 'ज्ञान', 'परीक्षा', 'स्मरण', 'जडता'],
    devotionalPurpose: {
      mr: 'विद्यादेवतेचे नमन; बुद्धीची जडता दूर करून अभ्यास, कला व ज्ञानामध्ये अग्रगण्य प्रगतीसाठी',
      en: 'Invocation of Goddess Saraswati to dispel ignorance and grant artistic intellect and memory power',
    },
  },

  // SURYA HYMN
  'aditya-hridaya-stotra': {
    id: 'aditya-hridaya-stotra',
    primaryIntents: ['aarogya_swasthya', 'karya_siddhi', 'bhaya_shatru_nivaran', 'sankat_nivaran'],
    intentWeights: { aarogya_swasthya: 0.99, karya_siddhi: 0.98, bhaya_shatru_nivaran: 0.92, sankat_nivaran: 0.9 },
    semanticKeywords: ['अगस्त्य ऋषी', 'सूर्य', 'आरोग्य', 'नेत्ररोग', 'दीर्घायुष्य', 'रण', 'विजय', 'तेज', 'उत्साह'],
    devotionalPurpose: {
      mr: 'अगस्त्य ऋषींनी रामाला युद्धापूर्वी दिलेले सूर्य स्तोत्र; दुर्धर रोग, डोळ्यांचे विकार व युद्धासारख्या बिकट स्थितीत विजयासाठी',
      en: 'Sage Agastyas solar hymn to Sri Rama for invincible victory, radiant eye health, and long life',
    },
  },

  // SHANI HYMN
  'shani-stotra-dasharatha': {
    id: 'shani-stotra-dasharatha',
    primaryIntents: ['graha_shani_dosha', 'sankat_nivaran', 'shanti_samadhan'],
    intentWeights: { graha_shani_dosha: 0.99, sankat_nivaran: 0.95, shanti_samadhan: 0.9 },
    semanticKeywords: ['राजा दशरथ', 'शनी', 'साडेसाती', 'पीडा', 'दोष', 'ग्रहशांती', 'शांतता', 'कष्ट निवारण'],
    devotionalPurpose: {
      mr: 'राजा दशरथ विरचित; शनीची साडेसाती, ढय्या, अनिष्ट ग्रहपीडा व सततच्या अडथळ्यांवर शांती मिळवण्यासाठी',
      en: 'King Dasharathas hymn to Lord Shani for mitigating Sade-Sati afflictions and planetary hardships',
    },
  },

  // DATTATREYA & SWAMI SAMARTH HYMNS
  'swami-samarth-tarak-mantra': {
    id: 'swami-samarth-tarak-mantra',
    primaryIntents: ['bhaya_shatru_nivaran', 'sankat_nivaran', 'shanti_samadhan', 'bhakti_samarpan'],
    intentWeights: { bhaya_shatru_nivaran: 0.99, sankat_nivaran: 0.96, shanti_samadhan: 0.95, bhakti_samarpan: 0.9 },
    semanticKeywords: ['निःशंक हो निर्भय हो', 'स्वामी समर्थ', 'अक्कलकोट', 'तारक मंत्र', 'भीती', 'संकट', 'धीर'],
    devotionalPurpose: {
      mr: 'अक्कलकोट स्वामी समर्थांचे अभयवचन; अत्यंत नैराश्य, भीती, चिंता व अडचणींमध्ये असीम धीर मिळवण्यासाठी',
      en: 'Divine solace mantra of Swami Samarth assuring absolute protection from fear and distress',
    },
  },
  'ghora-kashtoddharana-stotra': {
    id: 'ghora-kashtoddharana-stotra',
    primaryIntents: ['sankat_nivaran', 'bhaya_shatru_nivaran', 'aarogya_swasthya'],
    intentWeights: { sankat_nivaran: 0.99, bhaya_shatru_nivaran: 0.92, aarogya_swasthya: 0.9 },
    semanticKeywords: ['वासुदेवानंद सरस्वती', 'टेंबे स्वामी', 'घोर कष्ट', 'दत्त', 'निवारण', 'संकटमुक्ती', 'विपत्ती'],
    devotionalPurpose: {
      mr: 'प.पू. टेंबे स्वामी विरचित; अत्यंत घोर, न सुटणाऱ्या संकटांतून व कौटुंबिक विवंचनेतून मुक्तीसाठी',
      en: 'Tembe Swamis powerful stotra for miraculous deliverance from deep agony and insoluble dilemmas',
    },
  },

  // MAHARASHTRA SAINTS & PRAYERS
  'pasayadan-dnyaneshwar': {
    id: 'pasayadan-dnyaneshwar',
    primaryIntents: ['shanti_samadhan', 'paap_mukti_moksha', 'bhakti_samarpan'],
    intentWeights: { shanti_samadhan: 0.99, paap_mukti_moksha: 0.95, bhakti_samarpan: 0.95 },
    semanticKeywords: ['ज्ञानेश्वर', 'विश्वशांती', 'पसायदान', 'दुरितांचे तिमिर जावो', 'सद्बुद्धी', 'मनःशांती', 'कल्याण'],
    devotionalPurpose: {
      mr: 'संत ज्ञानेश्वर महाराजांची विश्वप्रार्थना; अंतःकरणात परम शांती, विश्वाचे कल्याण व सद्गुणांच्या वाढीसाठी',
      en: 'Sant Dnyaneshwars universal blessing prayer for global peace, goodwill, and inner serenity',
    },
  },
  'vitthal-yei-ho-vitthale': {
    id: 'vitthal-yei-ho-vitthale',
    primaryIntents: ['bhakti_samarpan', 'shanti_samadhan'],
    intentWeights: { bhakti_samarpan: 0.99, shanti_samadhan: 0.95 },
    semanticKeywords: ['नामदेव', 'विठ्ठल', 'पंढरपूर', 'माऊली', 'प्रेम', 'भक्ती', 'आर्त हाक', 'दर्शन'],
    devotionalPurpose: {
      mr: 'संत नामदेवांची आर्त भक्ती; मनातील विरह दूर करून विठू माऊलीच्या चरणी संपूर्ण समर्पित होण्यासाठी',
      en: 'Soulful calling of Sant Namdev to Lord Vitthala for intimate devotional communion and peace',
    },
  },
  'concluding-ghalin-lotangan': {
    id: 'concluding-ghalin-lotangan',
    primaryIntents: ['bhakti_samarpan', 'paap_mukti_moksha', 'shanti_samadhan'],
    intentWeights: { bhakti_samarpan: 0.99, paap_mukti_moksha: 0.95, shanti_samadhan: 0.9 },
    semanticKeywords: ['शरण', 'लोटांगण', 'कायेन वाचा', 'त्वमेव माता', 'अच्युतं केशवं', 'महामंत्र', 'समर्पण'],
    devotionalPurpose: {
      mr: 'पूजा समाप्तीची शरण प्रार्थना; तन, मन व वाणीने घडलेले सर्व कर्म प्रभू चरणी अर्पण करण्यासाठी',
      en: 'Concluding prayer of total surrender, submitting all thoughts and deeds unto the Supreme Lord',
    },
  },
  'concluding-mantra-pushpanjali': {
    id: 'concluding-mantra-pushpanjali',
    primaryIntents: ['shanti_samadhan', 'dhana_samriddhi', 'karya_siddhi'],
    intentWeights: { shanti_samadhan: 0.98, dhana_samriddhi: 0.95, karya_siddhi: 0.92 },
    semanticKeywords: ['ऋग्वेद', 'कुबेर', 'साम्राज्य', 'स्वस्ति', 'पुष्पांजली', 'सुराज्य', 'समृद्धी', 'शांती'],
    devotionalPurpose: {
      mr: 'ऋग्वेदातील राष्ट्रीय व वैश्विक प्रार्थना; देश, कुटुंब व समाजात समृद्धी, आरोग्य व सुराज्यासाठी',
      en: 'Vedic benediction chanting for national abundance, peace, righteousness, and auspicious welfare',
    },
  },
};
