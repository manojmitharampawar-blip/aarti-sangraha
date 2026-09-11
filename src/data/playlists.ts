import { Playlist } from '@/types';

export const playlists: Playlist[] = [
  {
    id: 'ganesh-utsav-sequence',
    slug: 'ganesh-utsav-sequence',
    title: 'Ganesh Utsav Complete Sequence',
    titleDevanagari: 'गणेशोत्सव संपूर्ण आरती क्रम',
    description: 'Traditional sequence chanted during Ganesh Chaturthi and daily morning/evening pooja.',
    occasion: 'Ganesh Festival & Daily Pooja',
    aartiIds: [
      'ganesha-sukhkarta',
      'ganesha-shendur-lal',
      'shiva-lavthavti',
      'devi-durge-durgat',
      'vitthal-yuge-atthavis',
      'datta-trigunatmak',
      'concluding-ghalin-lotangan',
      'concluding-mantra-pushpanjali',
    ],
  },
  {
    id: 'sandhya-aarti-daily',
    slug: 'sandhya-aarti-daily',
    title: 'Daily Sandhya Aarti Sequence',
    titleDevanagari: 'नित्य संध्या आरती संग्रह',
    description: 'Essential daily twilight aartis for auspiciousness and peace at home.',
    occasion: 'Daily Evening',
    aartiIds: [
      'ganesha-sukhkarta',
      'shiva-lavthavti',
      'devi-durge-durgat',
      'concluding-ghalin-lotangan',
    ],
  },
  {
    id: 'navratri-devi-sangraha',
    slug: 'navratri-devi-sangraha',
    title: 'Navratri Devi Aarti Sangraha',
    titleDevanagari: 'नवरात्र देवी आरती संग्रह',
    description: 'Sacred aartis for the 9 days of Navratri celebrating the divine feminine.',
    occasion: 'Navratri & Friday Pooja',
    aartiIds: [
      'ganesha-sukhkarta',
      'devi-durge-durgat',
      'devi-mahalakshmi',
      'concluding-ghalin-lotangan',
    ],
  },
  {
    id: 'shiva-aradhana',
    slug: 'shiva-aradhana',
    title: 'Lord Shiva Aradhana',
    titleDevanagari: 'भगवान शिव उपासना',
    description: 'Dedicated to Mahadev for Mondays and Pradosh/Mahashivratri.',
    occasion: 'Monday & Mahashivratri',
    aartiIds: [
      'ganesha-sukhkarta',
      'shiva-lavthavti',
      'shiva-karpur-gauram',
      'concluding-ghalin-lotangan',
    ],
  },
];
