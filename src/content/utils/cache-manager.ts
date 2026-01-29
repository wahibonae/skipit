/**
 * Auto-detection cache management
 * Caches MATCH_CONTENT results to avoid duplicate network calls
 */

import type { AutoDetectedContent } from "../../lib/types";

interface CachedContent {
  netflixId: string;
  result: AutoDetectedContent;
  timestamp: number;
}

// Cache for MATCH_CONTENT results - keyed by Netflix ID
let contentCache: CachedContent | null = null;
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
  console.log("[Content] Using cached TMDB match for:", netflixId);
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
  console.log("[Content] Cached TMDB match for:", netflixId);
}

/**
 * Clear the content cache
 */
export function clearContentCache() {
  contentCache = null;
}
