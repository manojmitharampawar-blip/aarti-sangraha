export type ScriptType = 'devanagari' | 'transliteration' | 'dual';

export type FontFamilyType = 'sans' | 'serif' | 'mukta';

export type LineSpacingType = 'compact' | 'normal' | 'relaxed';

export type TextAlignType = 'center' | 'left';

export type HymnType =
  | 'aarti'
  | 'chalisa'
  | 'stotra'
  | 'ashtak'
  | 'mantra'
  | 'sukta'
  | 'kavach'
  | 'namavali'
  | 'abhang'
  | 'bhajan';

export type DeityId =
  | 'ganesha'
  | 'shiva'
  | 'devi'
  | 'hanuman'
  | 'vitthal'
  | 'dattatreya'
  | 'krishna'
  | 'rama'
  | 'surya'
  | 'sarvajanik'
  | 'vishnu'
  | 'gauri'
  | 'saibaba'
  | 'swamisamarth'
  | 'gajananmaharaj'
  | 'dnyaneshwar'
  | 'tukaram'
  | 'ramdas'
  | 'nityanand'
  | 'khandoba'
  | 'shanidev'
  | 'saraswati'
  | 'santoshimata'
  | 'eknath'
  | 'gayatri'
  | 'parvati'
  | 'kartikeya';

export interface Deity {
  id: DeityId;
  nameDevanagari: string;
  nameTransliteration: string;
  description: string;
  primaryDay?: string;
  color: string;
  icon: string;
}

export interface Stanza {
  stanzaNumber: number;
  sectionTitle?: string;
  isChorus?: boolean;
  devanagari: string[];
  transliteration: string[];
  meaning?: string;
}

export interface AartiItem {
  id: string;
  slug: string;
  titleDevanagari: string;
  titleTransliteration: string;
  firstLineDevanagari: string;
  firstLineTransliteration: string;
  deity: DeityId;
  type: HymnType;
  language: 'marathi' | 'sanskrit' | 'hindi';
  author?: string;
  meaningSummary?: string;
  tags: string[];
  stanzas: Stanza[];
}

export interface Playlist {
  id: string;
  slug: string;
  title: string;
  titleDevanagari: string;
  description: string;
  occasion: string;
  aartiIds: string[];
}

export interface CustomGroup {
  id: string;
  name: string;
  description?: string;
  aartiIds: string[];
  createdAt: number;
  updatedAt: number;
}
