/**
 * Skip utilities
 * Helper functions for checking available skips
 */

import type { NetflixMetadata } from "../../lib/types";
import { matchContent } from "./content-matcher";

/**
 * Check for available skip types when metadata is ready
 * This allows the FAB to show "Skip explicit/violence" instead of "No skips yet"
 * Called when injected script notifies us that metadata is available
 */
export async function checkAvailableSkipsForCurrentVideo(metadata: NetflixMetadata) {
  // Match to TMDB
  const resolved = await matchContent(metadata);
  if (!resolved) {
    window.postMessage(
      {
        type: "SKIPIT_SET_AVAILABLE_SKIP_TYPES",
        data: { skipTypes: [] },
      },
      "*"
    );
    return;
  }

  // Check available skips in database
  chrome.runtime.sendMessage(
    {
      type: "CHECK_AVAILABLE_SKIPS",
      contentType: resolved.mediaType === "tv" ? "episode" : "movie",
      tmdbId: resolved.tmdbId,
      seasonNumber: resolved.seasonNumber,
      episodeNumber: resolved.episodeNumber,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.warn(
          "[Content] Error checking available skips:",
          chrome.runtime.lastError
        );
        window.postMessage(
          {
            type: "SKIPIT_SET_AVAILABLE_SKIP_TYPES",
            data: { skipTypes: [] },
          },
          "*"
        );
        return;
      }

      const skipTypes = response?.skipTypes || [];

      // Send to injected script to update FAB
      window.postMessage(
        {
          type: "SKIPIT_SET_AVAILABLE_SKIP_TYPES",
          data: { skipTypes },
        },
        "*"
      );
    }
  );
}
