/**
 * In-Browser Hindu Panchang & Lunar Tithi Engine
 *
 * Computes Tithi, Paksha, Hindu Day (वार), and Special Muhurats / Vratas
 * completely on-device using lunar phase calculations (zero API calls or latency).
 */

export type PakshaType = 'शुक्ल पक्ष' | 'कृष्ण पक्ष';

export interface HinduTithiInfo {
  tithiNumber: number; // 1 to 15
  tithiNameMr: string;
  paksha: PakshaType;
  lunarDayTotal: number; // 1 to 30
  isEkadashi: boolean;
  isChaturthi: boolean;
  isSankashti: boolean;
  isVinayaka: boolean;
  isPradosh: boolean;
  isPurnima: boolean;
  isAmavasya: boolean;
  specialVrataMr?: string;
}

export interface MuhuratPeriod {
  nameMr: string;
  periodName: 'brahma' | 'pratah' | 'madhyanh' | 'sandhya' | 'nisha';
  recommendedActionMr: string;
  isCurrent: boolean;
}

const TITHI_NAMES = [
  'प्रतिपदा',
  'द्वितीया',
  'तृतीया',
  'चतुर्थी',
  'पंचमी',
  'षष्ठी',
  'सप्तमी',
  'अष्टमी',
  'नवमी',
  'दशमी',
  'एकादशी',
  'द्वादशी',
  'त्रयोदशी',
  'चतुर्दशी',
  'पौर्णिमा', // 15 Shukla
];

/**
 * Approximate lunar phase calculation (synodic month = 29.530588853 days)
 * Standard astronomical epoch: Jan 6, 2000, 18:14 UTC (New Moon)
 */
export function getHinduTithi(date: Date = new Date()): HinduTithiInfo {
  // Epoch for a known New Moon (Amavasya)
  const epoch = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)).getTime();
  const current = date.getTime();
  const diffDays = (current - epoch) / (1000 * 60 * 60 * 24);

  const synodicMonth = 29.530588853;
  const phaseDays = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;

  // Each tithi is 1/30th of a synodic lunar month (~0.98435 days)
  const tithiIndex = Math.floor((phaseDays / synodicMonth) * 30); // 0 to 29
  const lunarDayTotal = tithiIndex + 1; // 1 to 30

  const isShukla = lunarDayTotal <= 15;
  const paksha: PakshaType = isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';

  let tithiNumber = isShukla ? lunarDayTotal : lunarDayTotal - 15;
  let tithiNameMr = '';

  if (isShukla) {
    tithiNameMr = TITHI_NAMES[tithiNumber - 1];
  } else {
    if (tithiNumber === 15) {
      tithiNameMr = 'अमावास्या';
    } else {
      tithiNameMr = TITHI_NAMES[tithiNumber - 1];
    }
  }

  const isEkadashi = tithiNumber === 11;
  const isChaturthi = tithiNumber === 4;
  const isSankashti = !isShukla && isChaturthi;
  const isVinayaka = isShukla && isChaturthi;
  const isPradosh = tithiNumber === 13;
  const isPurnima = isShukla && tithiNumber === 15;
  const isAmavasya = !isShukla && tithiNumber === 15;

  let specialVrataMr: string | undefined;

  if (isSankashti) {
    specialVrataMr = 'संकष्टी चतुर्थी (गणपती उपासना व उपवास)';
  } else if (isVinayaka) {
    specialVrataMr = 'विनायक चतुर्थी (श्री गणेश सिद्धी पूजा)';
  } else if (isEkadashi) {
    specialVrataMr = 'पवित्र एकादशी (विठ्ठल-विष्णू नामस्मरण)';
  } else if (isPradosh) {
    specialVrataMr = 'प्रदोष व्रत (महादेव शिव उपासना)';
  } else if (isPurnima) {
    specialVrataMr = 'सत्यनारायण पौर्णिमा (महालक्ष्मी महाआरती)';
  } else if (isAmavasya) {
    specialVrataMr = 'दर्श अमावास्या (मारुती उपासना व पितृस्मरण)';
  }

  return {
    tithiNumber,
    tithiNameMr,
    paksha,
    lunarDayTotal,
    isEkadashi,
    isChaturthi,
    isSankashti,
    isVinayaka,
    isPradosh,
    isPurnima,
    isAmavasya,
    specialVrataMr,
  };
}

/**
 * Identifies the current devotional Muhurat of the day
 */
export function getCurrentMuhurat(date: Date = new Date()): MuhuratPeriod {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes >= 240 && totalMinutes < 360) {
    // 4:00 AM to 6:00 AM
    return {
      nameMr: 'ब्राह्ममुहूर्त',
      periodName: 'brahma',
      recommendedActionMr: 'ध्यान, गायत्री व काकड आरतीसाठी सर्वोत्तम समय',
      isCurrent: true,
    };
  } else if (totalMinutes >= 360 && totalMinutes < 690) {
    // 6:00 AM to 11:30 AM
    return {
      nameMr: 'प्रातःकाल (प्रभात समय)',
      periodName: 'pratah',
      recommendedActionMr: 'सूर्य नमस्कार, नित्य स्तोत्र पठण व प्रभात पूजा',
      isCurrent: true,
    };
  } else if (totalMinutes >= 690 && totalMinutes < 990) {
    // 11:30 AM to 4:30 PM
    return {
      nameMr: 'मध्यान्ह काल',
      periodName: 'madhyanh',
      recommendedActionMr: 'मध्यान्ह महाआरती, नैवेद्य व शांत नामस्मरण',
      isCurrent: true,
    };
  } else if (totalMinutes >= 990 && totalMinutes < 1230) {
    // 4:30 PM to 8:30 PM
    return {
      nameMr: 'गोधूलि व सांध्य काल',
      periodName: 'sandhya',
      recommendedActionMr: 'दीप प्रज्वलन, शुभं करोति व संध्या आरती',
      isCurrent: true,
    };
  } else {
    // 8:30 PM to 4:00 AM
    return {
      nameMr: 'शयन व शांत काल',
      periodName: 'nisha',
      recommendedActionMr: 'शेज आरती, रामरक्षा व मनःशांती ध्यान',
      isCurrent: true,
    };
  }
}
