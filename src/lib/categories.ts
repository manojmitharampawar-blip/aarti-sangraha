import { HymnType, AartiItem } from '@/types';

export interface CategoryMeta {
  id: string;
  labelDevanagari: string;
  labelEnglish: string;
  types: HymnType[];
  badgeClass: string;
  iconName: 'Sparkles' | 'Flame' | 'BookOpen' | 'Music' | 'Shield' | 'Scroll' | 'Layers';
  descriptionDevanagari: string;
}

export const CATEGORY_REGISTRY: CategoryMeta[] = [
  {
    id: 'all',
    labelDevanagari: 'सर्व संग्रह',
    labelEnglish: 'All',
    types: [],
    badgeClass: 'bg-stone-500/10 text-stone-700 dark:text-stone-300 border-stone-500/20',
    iconName: 'Layers',
    descriptionDevanagari: 'सर्व उपलब्ध आरत्या, स्तोत्रे व प्रार्थना',
  },
  {
    id: 'aarti',
    labelDevanagari: 'आरती व चालीसा',
    labelEnglish: 'Aarti & Chalisa',
    types: ['aarti', 'chalisa'],
    badgeClass: 'bg-saffron-500/10 text-saffron-700 dark:text-saffron-400 border-saffron-500/25',
    iconName: 'Flame',
    descriptionDevanagari: 'सकाळ व सांजवेळची मंगल दीप आराधना',
  },
  {
    id: 'stotra',
    labelDevanagari: 'स्तोत्र व अष्टक',
    labelEnglish: 'Stotra & Ashtak',
    types: ['stotra', 'ashtak'],
    badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25',
    iconName: 'BookOpen',
    descriptionDevanagari: 'ऋषीमुनी विरचित पवित्र स्तुती व महिमा',
  },
  {
    id: 'mantra',
    labelDevanagari: 'मंत्र व सूक्त',
    labelEnglish: 'Mantra & Sukta',
    types: ['mantra', 'sukta'],
    badgeClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25',
    iconName: 'Sparkles',
    descriptionDevanagari: 'वेदोक्त सूक्ते, गायत्री व बीजमंत्र',
  },
  {
    id: 'kavach',
    labelDevanagari: 'कवच व नामावली',
    labelEnglish: 'Kavach & Names',
    types: ['kavach', 'namavali'],
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    iconName: 'Shield',
    descriptionDevanagari: 'दैवी संरक्षण कवच व १०८ / सहस्र नामावली',
  },
  {
    id: 'abhang',
    labelDevanagari: 'अभंग व भजन',
    labelEnglish: 'Abhang & Bhajan',
    types: ['abhang', 'bhajan'],
    badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25',
    iconName: 'Music',
    descriptionDevanagari: 'संतवाणी, भक्तीपदे व कीर्तन अभंग',
  },
];

/**
 * Returns badge styling and localized label for any HymnType.
 * Guaranteed 100% backward compatible with existing calls.
 */
export function getHymnTypeBadge(type: HymnType, isDevanagari: boolean) {
  switch (type) {
    case 'stotra':
      return {
        label: isDevanagari ? 'स्तोत्र' : 'Stotra',
        className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/25',
      };
    case 'ashtak':
      return {
        label: isDevanagari ? 'अष्टक' : 'Ashtak',
        className: 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/25',
      };
    case 'mantra':
      return {
        label: isDevanagari ? 'मंत्र' : 'Mantra',
        className: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/25',
      };
    case 'sukta':
      return {
        label: isDevanagari ? 'सूक्त' : 'Sukta',
        className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/25',
      };
    case 'chalisa':
      return {
        label: isDevanagari ? 'चालीसा' : 'Chalisa',
        className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25',
      };
    case 'kavach':
      return {
        label: isDevanagari ? 'कवच' : 'Kavach',
        className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25',
      };
    case 'namavali':
      return {
        label: isDevanagari ? 'नामावली' : 'Namavali',
        className: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/25',
      };
    case 'abhang':
      return {
        label: isDevanagari ? 'अभंग' : 'Abhang',
        className: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/25',
      };
    case 'bhajan':
      return {
        label: isDevanagari ? 'भजन' : 'Bhajan',
        className: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border border-pink-500/25',
      };
    case 'aarti':
    default:
      return {
        label: isDevanagari ? 'आरती' : 'Aarti',
        className: 'bg-saffron-500/10 text-saffron-700 dark:text-saffron-400 border border-saffron-500/25',
      };
  }
}

/**
 * Filter an array of AartiItems based on a registered category ID
 */
export function filterHymnsByCategory(hymns: AartiItem[], categoryId: string): AartiItem[] {
  if (categoryId === 'all') return hymns;
  const category = CATEGORY_REGISTRY.find(c => c.id === categoryId);
  if (!category || category.types.length === 0) return hymns;
  return hymns.filter(h => category.types.includes(h.type));
}

/**
 * Calculate count of items for each category in the registry
 */
export function getCategoryCounts(hymns: AartiItem[]): Record<string, number> {
  const counts: Record<string, number> = { all: hymns.length };
  CATEGORY_REGISTRY.forEach(cat => {
    if (cat.id !== 'all') {
      counts[cat.id] = hymns.filter(h => cat.types.includes(h.type)).length;
    }
  });
  return counts;
}

/**
 * Calculate reading / chanting time estimate in minutes
 */
export function calculateChantingTimeMinutes(stanzas: AartiItem['stanzas']): number {
  const totalLines = stanzas.reduce((sum, s) => sum + s.devanagari.length, 0);
  return Math.max(1, Math.round(totalLines / 7));
}
