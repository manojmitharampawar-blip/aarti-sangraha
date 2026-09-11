import Fuse from 'fuse.js';
import { AartiItem, DeityId, HymnType } from '@/types';

export interface FilterOptions {
  deity?: DeityId | 'all';
  type?: HymnType | 'all';
  language?: string | 'all';
}

const fuseOptions = {
  keys: [
    { name: 'titleDevanagari', weight: 0.35 },
    { name: 'titleTransliteration', weight: 0.35 },
    { name: 'firstLineDevanagari', weight: 0.15 },
    { name: 'firstLineTransliteration', weight: 0.15 },
    { name: 'tags', weight: 0.2 },
    { name: 'author', weight: 0.1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

export function searchHymns(hymns: AartiItem[], query: string): AartiItem[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return hymns;
  }

  const fuse = new Fuse(hymns, fuseOptions);
  const results = fuse.search(trimmed);
  return results.map(result => result.item);
}

export function filterHymns(hymns: AartiItem[], options: FilterOptions): AartiItem[] {
  return hymns.filter(hymn => {
    if (options.deity && options.deity !== 'all' && hymn.deity !== options.deity) {
      return false;
    }
    if (options.type && options.type !== 'all' && hymn.type !== options.type) {
      return false;
    }
    if (options.language && options.language !== 'all' && hymn.language !== options.language) {
      return false;
    }
    return true;
  });
}
