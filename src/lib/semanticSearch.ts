import { AartiItem } from '@/types';
import {
  DEVOTIONAL_INTENT_CATEGORIES,
  HYMN_SEMANTIC_PROFILES,
  SemanticIntentProfile,
} from './semanticIndex';

export interface SemanticSearchResult {
  hymn: AartiItem;
  score: number; // 0 to 100 percentage match
  primaryIntentKey?: string;
  reasonMr?: string;
  reasonEn?: string;
}

/**
 * Normalizes query string for semantic extraction
 */
function normalizeQuery(str: string): string {
  return str
    .toLowerCase()
    .replace(/[।॥,.!?:;'"(){}\[\]\-_/\\#@$%^&*+=~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract intent weights vector from a natural language query
 */
export function extractQueryIntents(query: string): Record<string, number> {
  const normalized = normalizeQuery(query);
  if (!normalized) return {};

  const words = normalized.split(' ').filter(w => w.length > 1);
  const detectedIntents: Record<string, number> = {};

  for (const cat of DEVOTIONAL_INTENT_CATEGORIES) {
    let matchScore = 0;
    for (const kw of cat.keywords) {
      const lowerKw = kw.toLowerCase();
      // Exact word match
      if (words.includes(lowerKw)) {
        matchScore += 1.0;
      } else if (normalized.includes(lowerKw)) {
        matchScore += 0.7;
      }
    }

    if (matchScore > 0) {
      detectedIntents[cat.key] = Math.min(matchScore, 2.5);
    }
  }

  // Normalize vector to sum of 1.0
  const total = Object.values(detectedIntents).reduce((acc, v) => acc + v, 0);
  if (total > 0) {
    for (const k in detectedIntents) {
      detectedIntents[k] = detectedIntents[k] / total;
    }
  }

  return detectedIntents;
}

/**
 * Computes Cosine Similarity between query intent vector and hymn profile vector
 */
function computeCosineSimilarity(
  queryVector: Record<string, number>,
  hymnWeights: Record<string, number>
): number {
  const queryKeys = Object.keys(queryVector);
  if (queryKeys.length === 0) return 0;

  let dotProduct = 0;
  let queryMagSq = 0;
  let hymnMagSq = 0;

  for (const key of queryKeys) {
    const qVal = queryVector[key] || 0;
    queryMagSq += qVal * qVal;
    if (hymnWeights[key]) {
      dotProduct += qVal * hymnWeights[key];
    }
  }

  for (const key in hymnWeights) {
    const hVal = hymnWeights[key] || 0;
    hymnMagSq += hVal * hVal;
  }

  if (queryMagSq === 0 || hymnMagSq === 0) return 0;

  const similarity = dotProduct / (Math.sqrt(queryMagSq) * Math.sqrt(hymnMagSq));
  return Math.min(Math.max(similarity, 0), 1);
}

/**
 * Keyword overlap similarity based on Marathi & English devotional keywords
 */
function computeKeywordSimilarity(query: string, profile: SemanticIntentProfile): number {
  const normalized = normalizeQuery(query);
  const queryTokens = normalized.split(' ').filter(t => t.length > 1);
  if (queryTokens.length === 0) return 0;

  let matches = 0;
  for (const kw of profile.semanticKeywords) {
    const normKw = normalizeQuery(kw);
    for (const token of queryTokens) {
      if (normKw.includes(token) || token.includes(normKw)) {
        matches += 1;
        break;
      }
    }
  }

  return Math.min(matches / Math.max(queryTokens.length, 1), 1);
}

/**
 * Main AI Semantic Search function.
 * Evaluates semantic vectors, intent profiles, and keywords to rank hymns by situational intent.
 */
export function semanticSearchHymns(
  hymns: AartiItem[],
  query: string,
  targetIntentKey?: string
): SemanticSearchResult[] {
  const trimmed = query.trim();

  // Case 1: Searching strictly by a selected Intent Category (e.g. chip click)
  if (targetIntentKey && targetIntentKey !== 'all') {
    const cat = DEVOTIONAL_INTENT_CATEGORIES.find(c => c.key === targetIntentKey);
    const results: SemanticSearchResult[] = [];

    for (const hymn of hymns) {
      const profile = HYMN_SEMANTIC_PROFILES[hymn.id] || HYMN_SEMANTIC_PROFILES[hymn.slug];
      let score = 0;

      if (profile && profile.intentWeights[targetIntentKey]) {
        score = profile.intentWeights[targetIntentKey];
      } else {
        // Dynamic fallback score checking tags and meaning
        const textToSearch = `${hymn.meaningSummary || ''} ${hymn.tags.join(' ')} ${hymn.titleDevanagari}`.toLowerCase();
        if (cat) {
          const matched = cat.keywords.filter(kw => textToSearch.includes(kw.toLowerCase()));
          if (matched.length > 0) {
            score = 0.4 + Math.min(matched.length * 0.15, 0.45);
          }
        }
      }

      if (score > 0.3) {
        results.push({
          hymn,
          score: Math.round(score * 100),
          primaryIntentKey: targetIntentKey,
          reasonMr: profile?.devotionalPurpose.mr || cat?.labelMr,
          reasonEn: profile?.devotionalPurpose.en || cat?.labelEn,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  if (!trimmed) {
    return hymns.map(hymn => ({
      hymn,
      score: 100,
    }));
  }

  const queryIntents = extractQueryIntents(trimmed);
  const hasDetectedIntents = Object.keys(queryIntents).length > 0;
  const results: SemanticSearchResult[] = [];

  for (const hymn of hymns) {
    const profile = HYMN_SEMANTIC_PROFILES[hymn.id] || HYMN_SEMANTIC_PROFILES[hymn.slug];
    let semanticScore = 0;
    let matchedIntent: string | undefined;

    if (profile) {
      if (hasDetectedIntents) {
        semanticScore = computeCosineSimilarity(queryIntents, profile.intentWeights);
        // Find best matching intent for reasoning
        let bestVal = 0;
        for (const k in queryIntents) {
          if ((profile.intentWeights[k] || 0) > bestVal) {
            bestVal = profile.intentWeights[k];
            matchedIntent = k;
          }
        }
      }

      // Add keyword overlap bonus
      const kwScore = computeKeywordSimilarity(trimmed, profile);
      semanticScore = Math.max(semanticScore, kwScore);
    }

    // Lexical exact title / deity match bonus
    const normTitleDev = normalizeQuery(hymn.titleDevanagari);
    const normTitleEng = normalizeQuery(hymn.titleTransliteration);
    const normQuery = normalizeQuery(trimmed);

    let lexicalScore = 0;
    if (normTitleDev.includes(normQuery) || normTitleEng.includes(normQuery)) {
      lexicalScore = 0.95;
    } else if (normQuery.includes(normTitleDev) || normQuery.includes(normTitleEng)) {
      lexicalScore = 0.9;
    } else if (hymn.tags.some(t => normQuery.includes(t.toLowerCase()))) {
      lexicalScore = 0.8;
    }

    // Combined Hybrid Score (Weighted)
    const combinedScore = Math.max(semanticScore * 0.9, lexicalScore);

    if (combinedScore > 0.25) {
      const topCat = matchedIntent ? DEVOTIONAL_INTENT_CATEGORIES.find(c => c.key === matchedIntent) : undefined;
      results.push({
        hymn,
        score: Math.round(combinedScore * 100),
        primaryIntentKey: matchedIntent,
        reasonMr: profile?.devotionalPurpose.mr || (topCat ? topCat.labelMr : undefined),
        reasonEn: profile?.devotionalPurpose.en || (topCat ? topCat.labelEn : undefined),
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
