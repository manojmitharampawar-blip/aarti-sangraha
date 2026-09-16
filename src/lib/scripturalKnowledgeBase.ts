/**
 * Scriptural RAG Knowledge Base (संत साहित्य व धर्मशास्त्र ज्ञानपीठ)
 *
 * Authentic quotes, citations, and spiritual guidance grounded in:
 * - Dnyaneshwari (Bhavartha Deepika)
 * - Shrimad Dasbodh & Manache Shlok (Samarth Ramdas)
 * - Sant Tukaram Abhang Gatha
 * - Shri Gurucharitra
 * - Nirnaysindhu / Dharmasindhu Vrata Shastra
 */

export interface ScripturalCitation {
  sourceTextMr: string; // e.g. "दासबोध", "ज्ञानेश्वरी", "तुकाराम गाथा"
  chapterOrOviMr: string; // e.g. "दशक २ समास १", "अध्याय ६ ओवी १२"
  verseSnippetDevanagari: string;
  purportMr: string;
  purportEn: string;
  relevanceKeywords: string[];
}

export const SCRIPTURAL_CITATIONS_REGISTRY: ScripturalCitation[] = [
  {
    sourceTextMr: 'दासबोध (समर्थ रामदास)',
    chapterOrOviMr: 'दशक ४ समास ३',
    verseSnippetDevanagari: 'सगुणाचा आधार धरिला । तरी निर्गुण प्रगट जाहला । भक्तीचा महिमा थोर केला । संतांनी लोकीं ॥',
    purportMr: 'सगुण भक्ती (आरती, नामस्मरण व पूजा) ही अंतःकरण शुद्ध करून त्या परमात्म्याशी एकरूप होण्याचा सर्वात सोपा व प्रामाणिक मार्ग आहे.',
    purportEn: 'Revering the personal divine form (Saguna Bhakti) through aarti and remembrance leads naturally to the realization of the formless Supreme Truth.',
    relevanceKeywords: ['भक्ती', 'आरती', 'पूजा', 'सगुण', 'नामस्मरण', 'उपासना', 'दासबोध'],
  },
  {
    sourceTextMr: 'ज्ञानेश्वरी (संत ज्ञानेश्वर)',
    chapterOrOviMr: 'अध्याय ९ ओवी ३५',
    verseSnippetDevanagari: 'माझेनि नामे गर्जती । सुखाचे साम्राज्य भोगिती । तयांसी मी वश त्रिभुवनीं ॥',
    purportMr: 'ज्या ठिकाणी प्रेमाने व भक्तीभावाने ईश्वराचे नामसंकीर्तन आणि आरती केली जाते, तिथे स्वतः ईश्वर प्रसन्न होऊन निवास करतो.',
    purportEn: 'Wherever devotees gather and joyously chant the holy names with pure love, the Lord is ever-present, dissolving all worldly sorrows.',
    relevanceKeywords: ['ज्ञानेश्वरी', 'नामसंकीर्तन', 'आरती', 'भक्ती', 'विठ्ठल', 'आनंद'],
  },
  {
    sourceTextMr: 'तुकाराम गाथा (संत तुकाराम)',
    chapterOrOviMr: 'अभंग १६२',
    verseSnippetDevanagari: 'आम्हा घरी धन शब्दांचीच रत्ने । शब्दांचीच शस्त्रे करू यत्न ॥',
    purportMr: 'संतांचे शब्द, अभंग आणि आरत्या हीच आपली खरी संपत्ती आहे. त्यांनी उच्चारलेले शब्द उच्चारल्याने मन शांत व तृप्त होते.',
    purportEn: 'The sacred poetic words of the saints are our true wealth, uplifting the mind and bestowing eternal peace.',
    relevanceKeywords: ['तुकाराम', 'गाथा', 'अभंग', 'शब्द', 'शांती', 'विठ्ठल'],
  },
  {
    sourceTextMr: 'श्री गुरुचरित्र',
    chapterOrOviMr: 'अध्याय १४',
    verseSnippetDevanagari: 'गुरूंचे स्मरण जेथे घडले । तेथे संकट समूळ उडाले । तया विघ्ने न बाधती ॥',
    purportMr: 'सद्गुरूंचे स्मरण (श्री स्वामी समर्थ, श्रीपाद श्रीवल्लभ, दत्त महाराज) जिथे निरंतर चालते, तिथे कोणतीही संकटे किंवा अनिष्ट बाधा टिकत नाहीत.',
    purportEn: 'Wherever the holy name of the Guru is meditated upon, all calamities vanish and divine protection is granted.',
    relevanceKeywords: ['दत्त', 'स्वामी', 'गुरुचरित्र', 'तारक मंत्र', 'संकट', 'गुरुवार', 'साई'],
  },
  {
    sourceTextMr: 'मनाचे श्लोक (समर्थ रामदास)',
    chapterOrOviMr: 'श्लोक १',
    verseSnippetDevanagari: 'गणाधीश जो ईश सर्वा गुणांचा । मुळारंभ आरंभ तो निर्गुणाचा । नमों शारदा मूळ चत्वार वाचा । गमूं पंथ आनंत या राघवाचा ॥',
    purportMr: 'कोणत्याही शुभ कार्याच्या प्रारंभी विघ्नहर्ता गणपती, सरस्वती आणि सद्गुरूंचे स्मरण करून सद्मार्गाने मार्गक्रमण करावे.',
    purportEn: 'Commence every auspicious endeavor with reverence to Lord Ganesha, Goddess Saraswati, and the Divine Guru for clarity and virtue.',
    relevanceKeywords: ['गणेश', 'गणपती', 'शारदा', 'मनाचे श्लोक', 'आरंभ', 'रामदास', 'सुखकर्ता'],
  },
  {
    sourceTextMr: 'धर्मसिंधु / निर्णयसिंधु',
    chapterOrOviMr: 'व्रत परिच्छेद',
    verseSnippetDevanagari: 'प्रदोषसमये पूजा कर्तव्या सर्वसिद्धिदा । दीपदानेन पापानि नश्यन्ति च पदे पदे ॥',
    purportMr: 'प्रदोष काळात आणि संध्यासमयी दिवा लावून देवाची आरती ओवाळल्याने घरातील नकारात्मकता दूर होते आणि सर्व मनोकामना पूर्ण होतात.',
    purportEn: 'Lighting a lamp and offering aarti during twilight (Sandhya/Pradosh) purifies the home, dispelling negativity and inviting auspiciousness.',
    relevanceKeywords: ['दिवा', 'आरती', 'संध्याकाळ', 'प्रदोष', 'नियम', 'शास्त्र', 'धर्मसिंधु'],
  },
];

/**
 * Searches relevant scriptural citations based on user query
 */
export function findScripturalCitations(query: string): ScripturalCitation[] {
  const norm = query.toLowerCase().trim();

  const matched = SCRIPTURAL_CITATIONS_REGISTRY.filter(citation =>
    citation.relevanceKeywords.some(kw => norm.includes(kw.toLowerCase()))
  );

  return matched.length > 0 ? matched : [SCRIPTURAL_CITATIONS_REGISTRY[0]];
}
