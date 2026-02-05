/**
 * Auto-detection cache management
 * Caches MATCH_CONTENT results and timestamp counts to avoid duplicate network calls
 */

import type { AutoDetectedContent, TimestampCounts } from "../../lib/types";

interface CachedContent {
  netflixId: string;
  result: AutoDetectedContent;
  timestamp: number;
}

interface CachedCounts {
  tmdbId: number;
  counts: TimestampCounts;
  timestamp: number;
}

// Cache for MATCH_CONTENT results - keyed by Netflix ID
let contentCache: CachedContent | null = null;
// Cache for timestamp counts - keyed by TMDB ID
let countsCache: CachedCounts | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached content if available and not expired
 */
export function getCachedContent(netflixId: string): AutoDetectedContent | null {
  if (!contentCache) return null;
  if (contentCache.netflixId !== netflixId) return null;
  if (Date.now() - contentCache.timestamp > CACHE_TTL) {
    contentCache = null;
    return null;
  }
  return contentCache.result;
}

/**
 * Cache content match result
 */
export function setCachedContent(netflixId: string, result: AutoDetectedContent) {
  contentCache = {
    netflixId,
    result,
    timestamp: Date.now(),
  };
}

/**
 * Get cached timestamp counts if available and not expired
 */
export function getCachedCounts(tmdbId: number): TimestampCounts | null {
  if (!countsCache) return null;
  if (countsCache.tmdbId !== tmdbId) return null;
  if (Date.now() - countsCache.timestamp > CACHE_TTL) {
    countsCache = null;
    return null;
  }
  return countsCache.counts;
}

/**
 * Cache timestamp counts
 */
export function setCachedCounts(tmdbId: number, counts: TimestampCounts) {
  countsCache = {
    tmdbId,
    counts,
    timestamp: Date.now(),
  };
}

/**
 * Clear the content cache
 */
export function clearContentCache() {
  contentCache = null;
  countsCache = null;
}
