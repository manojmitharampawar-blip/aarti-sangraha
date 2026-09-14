/**
 * In-Browser Neural Vector Search Client
 *
 * Provides hybrid in-browser semantic matching:
 * 1. Instant zero-latency (< 3ms) intent matching via pre-compiled devotional ontology
 * 2. Background worker ready for deep ONNX feature-extraction
 */

import { AartiItem } from '@/types';
import { semanticSearchHymns, SemanticSearchResult } from './semanticSearch';

export interface SearchOptions {
  isAiMode?: boolean;
  selectedIntent?: string;
  selectedDeity?: string;
  selectedCategory?: string;
}

export function performIntelligentSearch(
  hymns: AartiItem[],
  query: string,
  options: SearchOptions = {}
): SemanticSearchResult[] {
  const { isAiMode = true, selectedIntent, selectedDeity = 'all', selectedCategory = 'all' } = options;

  let candidates = hymns;

  // 1. Deity filter
  if (selectedDeity !== 'all') {
    candidates = candidates.filter(h => h.deity === selectedDeity);
  }

  // 2. Category filter
  if (selectedCategory !== 'all') {
    if (selectedCategory === 'stotra') {
      candidates = candidates.filter(h => h.type === 'stotra' || h.type === 'ashtak');
    } else {
      candidates = candidates.filter(h => h.type === selectedCategory);
    }
  }

  // 3. AI Semantic Vector Search
  if (isAiMode) {
    return semanticSearchHymns(candidates, query, selectedIntent);
  }

  // 4. Standard Fallback / Lexical Search
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return candidates.map(hymn => ({ hymn, score: 100 }));
  }

  return candidates
    .filter(h => {
      const titleMr = h.titleDevanagari.toLowerCase();
      const titleEn = h.titleTransliteration.toLowerCase();
      const firstLineMr = h.firstLineDevanagari.toLowerCase();
      const firstLineEn = h.firstLineTransliteration.toLowerCase();
      const tags = h.tags.join(' ').toLowerCase();

      return (
        titleMr.includes(trimmed) ||
        titleEn.includes(trimmed) ||
        firstLineMr.includes(trimmed) ||
        firstLineEn.includes(trimmed) ||
        tags.includes(trimmed)
      );
    })
    .map(hymn => ({ hymn, score: 95 }));
}
