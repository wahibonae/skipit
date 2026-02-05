/**
 * Content matching utilities
 * Matches Netflix metadata to TMDB content
 */

import type { NetflixMetadata, AutoDetectedContent } from "../../lib/types";
import { getCachedContent, setCachedContent } from "./cache-manager";

/**
 * Match Netflix metadata to TMDB content
 * Returns resolved content with TMDB ID or null if not found
 * Uses cache to avoid duplicate network calls
 */
export async function matchContent(
  metadata: NetflixMetadata
): Promise<AutoDetectedContent | null> {
  // Check cache first
  const cached = getCachedContent(metadata.netflixId);
  if (cached) {
    // Update season/episode in case user navigated to different episode
    return {
      ...cached,
      seasonNumber: metadata.seasonNumber,
      episodeNumber: metadata.episodeNumber,
    };
  }

  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "MATCH_CONTENT",
        title: metadata.title,
        contentType: metadata.type,
        seasonNumber: metadata.seasonNumber,
        episodeNumber: metadata.episodeNumber,
        includeCounts: false, // Only need TMDB match, not timestamp counts
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.warn(
            "[Content] Error matching content:",
            chrome.runtime.lastError
          );
          resolve(null);
          return;
        }

        if (response?.success && response.tmdbId) {
          const result: AutoDetectedContent = {
            tmdbId: response.tmdbId,
            title: response.contentTitle || metadata.title,
            mediaType:
              response.mediaType ||
              (metadata.type === "episode" ? "tv" : "movie"),
            seasonNumber: metadata.seasonNumber,
            episodeNumber: metadata.episodeNumber,
          };
          // Cache the result
          setCachedContent(metadata.netflixId, result);
          resolve(result);
        } else {
          resolve(null);
        }
      }
    );
  });
}
