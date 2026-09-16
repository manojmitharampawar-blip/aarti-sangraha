/**
 * Upasana AI & Spiritual Guidance Engine
 *
 * Provides intelligent, scriptural, and sattvic guidance on daily sadhana,
 * Panchang deities, aarti rituals, stotra pathan, and saint wisdom.
 */

export interface UpasanaGuidance {
  topic: string;
  questionDevanagari: string;
  answerDevanagari: string;
  answerEnglish: string;
  recommendedHymnSlugs: string[];
  recommendedDeityId?: string;
  ritualsTips: string[];
}

export const UPASANA_KNOWLEDGE_BASE: UpasanaGuidance[] = [
  {
    topic: 'daily-somwar',
    questionDevanagari: 'सोमवारची उपासना व शिवपूजा कशी करावी?',
    answerDevanagari:
      'सोमवार हा महादेवांचा अत्यंत प्रिय वार मानला जातो. या दिवशी स्नान करून पांढरे किंवा स्वच्छ वस्त्र परिधान करावे. शिवलिंगास जल, दुग्ध व बिल्वपत्र (बेल) अर्पण करावे. "ॐ नमः शिवाय" मंत्राचा जप आणि "लवथवती विक्राळा" आरती किंवा "बिल्वाष्टकम" पठण केल्यास मानसिक शांती व आरोग्य लाभते.',
    answerEnglish:
      'Monday is dedicated to Lord Shiva. Devotees offer water, milk, and sacred Bilva leaves to the Shiva Linga. Chanting the Panchakshara mantra "Om Namah Shivaya" alongside Bilvashtakam or Shiva Tandava Stotra brings mental tranquility and spiritual purification.',
    recommendedHymnSlugs: ['lavthavti-vikrala', 'bilvashtakam', 'shiva-panchakshara-stotra'],
    recommendedDeityId: 'shiva',
    ritualsTips: [
      'बिल्वपत्र वाहताना गुळगुळीत बाजू पिंडीवर ठेवावी.',
      'महादेवाला तुळस किंवा केतकीचे फूल अर्पण करू नये.',
      'प्रदोष काळात (संध्याकाळी) दिवा लावून पंचाक्षर स्तोत्र म्हणावे.',
    ],
  },
  {
    topic: 'daily-mangalwar',
    questionDevanagari: 'मंगळवारची गणेश व देवी उपासना कशी करावी?',
    answerDevanagari:
      'मंगळवार हा श्री गणपती व कुलदेवीचा शुभ वार आहे. गणपतीला रक्तचंदन, लाल जास्वंदाचे फूल आणि २१ दुर्वांच्या जुड्या अर्पण कराव्यात. "सुखकर्ता दुःखहर्ता" आरती आणि "गणपती अथर्वशीर्ष" पठण करावे. तसेच कुलदेवीची "दुर्गे दुर्घट भारी" आरती गाऊन घरात धूप दाखवावा.',
    answerEnglish:
      'Tuesday is dedicated to Lord Ganesha and Mother Durga. Devotees offer red hibiscus flowers and 21 blades of sacred Durva grass to Ganesha, reciting the Ganapati Atharvashirsha for intellectual clarity, followed by the Durge Durgat Bhari aarti for household protection.',
    recommendedHymnSlugs: ['sukhkarta-dukhharta', 'ganapati-atharvashirsha', 'durge-durgat-bhari'],
    recommendedDeityId: 'ganesha',
    ritualsTips: [
      'गणपतीला मोदक किंवा गूळ-खोबऱ्याचा नैवेद्य अर्पण करावा.',
      'दुर्वांची जोडी नेहमी तीन किंवा पाच पानांची असावी.',
      'घरात कापूर जाळून नकारात्मकता दूर करावी.',
    ],
  },
  {
    topic: 'daily-guruwar',
    questionDevanagari: 'गुरुवारची दत्त, स्वामी समर्थ व साईबाबा उपासना कशी करावी?',
    answerDevanagari:
      'गुरुवार हा सद्गुरूंचा पवित्र वार आहे. या दिवशी दत्त महाराज, स्वामी समर्थ किंवा साईबाबांच्या पादुकांची पूजा करावी. पिवळे फूल आणि पेढ्याचा नैवेद्य दाखवावा. "तारक मंत्र", "दत्त बावनी" किंवा "आरती साई बाबा (सौख्यदातार जीवा)" पठण केल्याने सर्व भय, चिंता व संकटे नष्ट होतात.',
    answerEnglish:
      'Thursday is dedicated to the Supreme Guru principle (Lord Dattatreya, Swami Samarth, and Sai Baba). Devotees meditate on the holy Padukas, chanting the Swami Samarth Tarak Mantra and Datta Bavani for peace, protection, and overcoming distress.',
    recommendedHymnSlugs: ['trigunatmak-traimurti', 'swami-samarth-tarak-mantra', 'aarti-sai-baba-saukhyadata'],
    recommendedDeityId: 'dattatreya',
    ritualsTips: [
      'गुरुवारच्या दिवशी गुरूचरित्रातील अध्याय किंवा तारक मंत्र ११ वेळा म्हणावा.',
      'सद्गुरूंच्या पादुकांवर अत्तर व चंदन लावावे.',
      'अन्नदान किंवा भुकेलेल्यांना भोजन देणे अत्यंत पुण्यकारक मानले जाते.',
    ],
  },
  {
    topic: 'daily-shaniwar',
    questionDevanagari: 'शनिवारची मारुती व शनिदेव उपासना कशी करावी?',
    answerDevanagari:
      'शनिवार हा संकटमोचन हनुमान व शनिदेवांचा वार आहे. या दिवशी मारुतीरायांना शेंदूर आणि रुईच्या पानांची माळ अर्पण करावी. तिळाच्या किंवा मोहरीच्या तेलाचा दिवा लावावा. समर्थ रामदास स्वामींचे "भीमरूपी मारुती स्तोत्र" आणि "हनुमान चालीसा" किमान तीन वेळा पठण करावे.',
    answerEnglish:
      'Saturday is sacred to Lord Hanuman and Shanidev. Devotees light a sesame/mustard oil lamp and offer Calotropis (Rui) garlands to Maruti, chanting the Bhimrupi Maruti Stotra and Hanuman Chalisa to eliminate negative planetary influences and cultivate inner strength.',
    recommendedHymnSlugs: ['maruti-stotra-bhimrupi', 'hanuman-chalisa', 'aarti-shani-dev'],
    recommendedDeityId: 'hanuman',
    ritualsTips: [
      'हनुमानाला रुईच्या फुलांची किंवा ११ पानांची माळ अर्पण करावी.',
      'संध्याकाळी मारुती मंदिरात जाऊन प्रदक्षिणा घालावी.',
      'हनुमान चालीसा पाठ केल्यावर मनातील सर्व भीती दूर होते.',
    ],
  },
  {
    topic: 'sankashti-chaturthi',
    questionDevanagari: 'संकष्टी चतुर्थीचे व्रत व नियम काय आहेत?',
    answerDevanagari:
      'संकष्टी चतुर्थी ही प्रत्येक वद्य चतुर्थीला येते. या दिवशी दिवसभर उपवास ठेवून संध्याकाळी चंद्रोदयानंतर गणपतीची षोडशोपचारे पूजा करावी. २१ मोदकांचा नैवेद्य दाखवून चंद्राला अर्घ्य दिले जाते. त्यानंतर "संकटनाशन गणेश स्तोत्र" व अथर्वशीर्ष पठण करून उपवास सोडावा.',
    answerEnglish:
      'Sankashti Chaturthi is observed on the 4th day of the waning moon (Krishna Paksha). Devotees fast through the day, perform puja upon moonrise, offer 21 modaks and Arghya to the moon, reciting the Sankata Nashana Stotra to dissolve all obstacles.',
    recommendedHymnSlugs: ['sankata-nashana-ganesh-stotra', 'ganapati-atharvashirsha'],
    recommendedDeityId: 'ganesha',
    ritualsTips: [
      'मंगळवारी संकष्टी आल्यास तिला "अंगारकी संकष्टी" म्हणतात, तिचे फळ सहस्रपट मानले जाते.',
      'चंद्राचे दर्शन घेऊन पाण्याचा अर्घ्य दिल्यानंतरच भोजन घ्यावे.',
    ],
  },
  {
    topic: 'ritual-aarti-rules',
    questionDevanagari: 'आरती कशी ओवाळावी व आरतीचे शास्त्र काय आहे?',
    answerDevanagari:
      'आरती करताना ताटात शुद्ध तुपाचा किंवा कापराचा दिवा लावावा. आरती घड्याळाच्या काट्याच्या दिशेने (Clockwise) चरणांपासून मस्तकापर्यंत गोलाकार ओवाळावी. प्रथम चरणांवर चार वेळा, नाभीवर दोन वेळा, मुखावर एक वेळा आणि सर्वांगावर सात वेळा ओवाळण्याचा संकेत आहे. समवेत घंटी आणि टाळांचा मधुर नाद करावा.',
    answerEnglish:
      'When performing Aarti, use a pure ghee or camphor flame. Wave the aarti plate gently in a clockwise circle from the deity’s lotus feet to the crown. The scriptural tradition suggests 4 times at feet, 2 at the navel, 1 at the countenance, and 7 times encompassing the entire divine form, accompanied by sacred temple bells.',
    recommendedHymnSlugs: ['sukhkarta-dukhharta', 'ghalin-lotangan', 'mantra-pushpanjali'],
    ritualsTips: [
      'आरती झाल्यानंतर दोन्ही हातांनी ज्योतीचा स्पर्श घेऊन डोळ्यांना व मस्तकाला लावावा.',
      'शेवटी "घालीन लोटांगण" आणि "मंत्रपुष्पांजली" अर्पण करून पूजा पूर्ण करावी.',
    ],
  },
];

/**
 * Intelligent Query Matcher for Upasana AI
 */
export function queryUpasanaGuidance(query: string): UpasanaGuidance {
  const norm = query.toLowerCase().trim();

  // 1. Specific Tithis / Events
  if (norm.includes('संकष्टी') || norm.includes('चतुर्थी') || norm.includes('अंगारकी')) {
    return UPASANA_KNOWLEDGE_BASE.find(i => i.topic === 'sankashti-chaturthi')!;
  }

  // 2. Specific Deities / Days
  if (norm.includes('सोमवार') || norm.includes('शिव') || norm.includes('शंभो') || norm.includes('महादेव')) {
    return UPASANA_KNOWLEDGE_BASE.find(i => i.topic === 'daily-somwar')!;
  }
  if (norm.includes('मंगळवार') || norm.includes('गणेश') || norm.includes('गणपती')) {
    return UPASANA_KNOWLEDGE_BASE.find(i => i.topic === 'daily-mangalwar')!;
  }
  if (norm.includes('गुरुवार') || norm.includes('दत्त') || norm.includes('स्वामी') || norm.includes('साई')) {
    return UPASANA_KNOWLEDGE_BASE.find(i => i.topic === 'daily-guruwar')!;
  }
  if (norm.includes('शनिवार') || norm.includes('मारुती') || norm.includes('हनुमान') || norm.includes('शनि')) {
    return UPASANA_KNOWLEDGE_BASE.find(i => i.topic === 'daily-shaniwar')!;
  }

  // 3. Ritual Rules
  if (norm.includes('आरती कशी') || norm.includes('ओवाळ') || norm.includes('आरती नियम') || norm.includes('शास्त्र')) {
    return UPASANA_KNOWLEDGE_BASE.find(i => i.topic === 'ritual-aarti-rules')!;
  }

  // Fallback based on day of week
  const dayIndex = new Date().getDay();
  if (dayIndex === 1) return UPASANA_KNOWLEDGE_BASE[0]; // सोम
  if (dayIndex === 2) return UPASANA_KNOWLEDGE_BASE[1]; // मंगळ
  if (dayIndex === 4) return UPASANA_KNOWLEDGE_BASE[2]; // गुरु
  if (dayIndex === 6) return UPASANA_KNOWLEDGE_BASE[3]; // शनि

  return UPASANA_KNOWLEDGE_BASE[5]; // Default to aarti rules & rituals
}
