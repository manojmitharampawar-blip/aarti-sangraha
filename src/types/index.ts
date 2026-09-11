export type ScriptType = 'devanagari' | 'transliteration';

export type HymnType = 'aarti' | 'chalisa' | 'stotra' | 'ashtak' | 'mantra';

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
  | 'sarvajanik';

export interface Stanza {
  stanzaNumber: number;
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
  language: 'marathi' | 'hindi' | 'sanskrit';
  author?: string;
  stanzas: Stanza[];
  meaningSummary?: string;
  defaultSpeed?: number;
  tags: string[];
}

export interface Deity {
  id: DeityId;
  nameDevanagari: string;
  nameTransliteration: string;
  description: string;
  primaryDay: string; // e.g. 'Tuesday'
  color: string;
  icon: string;
  count?: number;
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
