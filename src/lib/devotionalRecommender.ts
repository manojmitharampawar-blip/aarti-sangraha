/**
 * Devotional Predictive Recommendation & Sadhana Engine
 *
 * Recommends the optimal daily spiritual hymns based on:
 * 1. Current Hindu Tithi & Vratas (एकादशी, चतुर्थी, प्रदोष, etc.)
 * 2. Day of Week (वार - महादेव, दत्त, मारुती, etc.)
 * 3. Muhurat of the Day (प्रभात, गोधूलि सांध्य, शयन)
 * 4. Devotee's local Sadhana streak
 */

import { AartiItem, Deity, Playlist } from '@/types';
import { aartis } from '@/data/aartis';
import { deities } from '@/data/deities';
import { playlists } from '@/data/playlists';
import { getHinduTithi, getCurrentMuhurat, HinduTithiInfo, MuhuratPeriod } from './panchangEngine';

export interface DevotionalRecommendation {
  tithiInfo: HinduTithiInfo;
  muhurat: MuhuratPeriod;
  dayNameMr: string;
  specialBadge?: string;
  headlineTitle: string;
  subTitle: string;
  recommendedHymns: AartiItem[];
  suggestedPlaylist?: Playlist;
}

const DAY_DEITY_MAP: Record<number, { dayMr: string; deityId: string }> = {
  0: { dayMr: 'रविवार', deityId: 'ganpati' }, // Or Surya
  1: { dayMr: 'सोमवार', deityId: 'shankar' },
  2: { dayMr: 'मंगळवार', deityId: 'ganpati' },
  3: { dayMr: 'बुधवार', deityId: 'vitthal' },
  4: { dayMr: 'गुरुवार', deityId: 'datta' },
  5: { dayMr: 'शुक्रवार', deityId: 'devi' },
  6: { dayMr: 'शनिवार', deityId: 'hanuman' },
};

export function getDevotionalRecommendation(date: Date = new Date()): DevotionalRecommendation {
  const tithiInfo = getHinduTithi(date);
  const muhurat = getCurrentMuhurat(date);
  const dayOfWeek = date.getDay();
  const dayConfig = DAY_DEITY_MAP[dayOfWeek] || { dayMr: 'आज', deityId: 'ganpati' };

  let targetDeityId = dayConfig.deityId;
  let headlineTitle = '';
  let subTitle = '';
  let specialBadge = tithiInfo.specialVrataMr;

  // 1. Check for prominent lunar events override (Ekadashi, Chaturthi, Pradosh)
  if (tithiInfo.isChaturthi) {
    targetDeityId = 'ganpati';
    headlineTitle = tithiInfo.isSankashti ? 'संकष्टी चतुर्थी विशेष गणेश उपासना' : 'विनायक चतुर्थी मंगल स्तोत्र पठण';
    subTitle = 'विघ्नहर्त्या गणरायाची आराधना करून कार्यसिद्धीचा आशीर्वाद प्राप्त करा.';
  } else if (tithiInfo.isEkadashi) {
    targetDeityId = 'vitthal';
    headlineTitle = 'पविटर एकादशी: विठू माऊली नामस्मरण व हरिपाठ';
    subTitle = 'अवघा रंग एक झाला; पंढरीनाथाच्या नामात लीन होऊन पुण्य प्राप्त करा.';
  } else if (tithiInfo.isPradosh) {
    targetDeityId = 'shankar';
    headlineTitle = 'प्रदोष व्रत: कैलासपती महादेव शिव आराधना';
    subTitle = 'त्रिनेत्र शंकराचे स्तोत्र पठण व महाआरतीने सर्व संकटांचे निवारण करा.';
  } else if (tithiInfo.isPurnima) {
    headlineTitle = 'सत्यनारायण पौर्णिमा: महालक्ष्मी व विष्णू कृपा';
    subTitle = 'सुख, शांती आणि ऐश्वर्यासाठी श्री सत्यनारायण व लक्ष्मी पूजन करा.';
  } else {
    // Normal day-based devotion
    switch (dayConfig.deityId) {
      case 'shankar':
        headlineTitle = 'सोमवार: देवाधिदेव महादेव शिव उपासना';
        subTitle = 'भोळ्या शंकराची आरती व कर्पूरगौरम् स्तुतीने मन शांत व निर्मळ करा.';
        break;
      case 'ganpati':
        headlineTitle = 'मंगळवार: विघ्नहर्ता गणपती बाप्पा उपासना';
        subTitle = 'सुखकर्ता दुःखहर्ता व अथर्वशीर्ष पठणाने नवीन कार्याची मंगल सुरुवात करा.';
        break;
      case 'vitthal':
        headlineTitle = 'बुधवार: पांडुरंग विठूराया व ज्ञानोबा-तुकाराम भजन';
        subTitle = 'येई ओ विठ्ठले माझे माऊली; भक्तीरसात तल्लीन व्हा.';
        break;
      case 'datta':
        headlineTitle = 'गुरुवार: श्री गुरुदेव दत्त व स्वामी समर्थ उपासना';
        subTitle = 'भिऊ नकोस मी तुझ्या पाठीशी आहे; गुरूंच्या कृपेने भवसागर पार करा.';
        break;
      case 'devi':
        headlineTitle = 'शुक्रवार: आदिशक्ती आई अंबाबाई व महालक्ष्मी महापूजा';
        subTitle = 'दुर्गे दुर्घट भारी व महिषासुरमर्दिनी स्तोत्राने शक्ती व समृद्धी मिळवा.';
        break;
      case 'hanuman':
        headlineTitle = 'शनिवार: संकटमोचन मारुतीराया व शनिदेव उपासना';
        subTitle = 'मारुती स्तोत्र व हनुमान चालीसा पठणाने सर्व भीती व ग्रहांचे निवारण करा.';
        break;
      default:
        headlineTitle = 'रविवार: तेजपुंज सूर्यदेव व गायत्री उपासना';
        subTitle = 'आरोग्य व बुद्धीच्या वृद्धीसाठी तेजमय प्रार्थना करा.';
    }
  }

  // 2. Fetch curated hymns for this deity and muhurat
  let matchedHymns = aartis.filter(a => a.deity === targetDeityId);
  if (matchedHymns.length === 0) {
    matchedHymns = aartis.slice(0, 4);
  }

  // Prioritize based on time of day (Morning: Stotras first; Evening: Aartis first)
  if (muhurat.periodName === 'pratah' || muhurat.periodName === 'brahma') {
    matchedHymns.sort((a, b) => (a.type === 'stotra' ? -1 : 1));
  } else if (muhurat.periodName === 'sandhya') {
    matchedHymns.sort((a, b) => (a.type === 'aarti' ? -1 : 1));
  }

  // Find matching playlist if any
  const suggestedPlaylist =
    playlists.find(
      p =>
        p.slug.includes(targetDeityId) ||
        p.titleDevanagari.includes(headlineTitle.slice(0, 4)) ||
        p.occasion.toLowerCase().includes(targetDeityId)
    ) || playlists[0];

  return {
    tithiInfo,
    muhurat,
    dayNameMr: dayConfig.dayMr,
    specialBadge,
    headlineTitle,
    subTitle,
    recommendedHymns: matchedHymns.slice(0, 4),
    suggestedPlaylist,
  };
}

const STREAK_KEY = 'aarti_sadhana_streak_v1';
const LAST_DATE_KEY = 'aarti_sadhana_last_date';

export interface SadhanaStreak {
  currentStreak: number;
  completedToday: boolean;
  totalSessions: number;
}

export function getSadhanaStreak(): SadhanaStreak {
  if (typeof window === 'undefined') {
    return { currentStreak: 1, completedToday: false, totalSessions: 1 };
  }

  try {
    const streakStr = localStorage.getItem(STREAK_KEY);
    const lastDate = localStorage.getItem(LAST_DATE_KEY);
    const today = new Date().toISOString().split('T')[0];

    const currentStreak = streakStr ? parseInt(streakStr, 10) : 1;
    const completedToday = lastDate === today;

    return {
      currentStreak: isNaN(currentStreak) ? 1 : Math.max(1, currentStreak),
      completedToday,
      totalSessions: currentStreak,
    };
  } catch {
    return { currentStreak: 1, completedToday: false, totalSessions: 1 };
  }
}

export function recordSadhanaSession(): SadhanaStreak {
  if (typeof window === 'undefined') {
    return { currentStreak: 1, completedToday: true, totalSessions: 1 };
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem(LAST_DATE_KEY);
    const currentStreakStr = localStorage.getItem(STREAK_KEY);
    let streak = currentStreakStr ? parseInt(currentStreakStr, 10) : 0;

    if (lastDate !== today) {
      streak += 1;
      localStorage.setItem(LAST_DATE_KEY, today);
      localStorage.setItem(STREAK_KEY, streak.toString());
    }

    return {
      currentStreak: streak,
      completedToday: true,
      totalSessions: streak,
    };
  } catch {
    return { currentStreak: 1, completedToday: true, totalSessions: 1 };
  }
}
