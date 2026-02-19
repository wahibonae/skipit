/**
 * Pending skip utilities
 * Fetches pending skips for verification and sends them to the injected script
 */

import type { NetflixMetadata } from "../../lib/types";
import { matchContent } from "./content-matcher";
import { state } from "./state";

/**
 * Fetch pending skips for the current video and send to injected script
 */
export async function fetchAndSendPendingSkips(metadata: NetflixMetadata) {
  const resolved = await matchContent(metadata);
  if (!resolved) {
    return;
  }

  const contentType = resolved.mediaType === "tv" ? "episode" : "movie";

  chrome.runtime.sendMessage(
    {
      type: "FETCH_PENDING_SKIPS",
      contentType,
      tmdbId: resolved.tmdbId,
      seasonNumber: resolved.seasonNumber ?? undefined,
      episodeNumber: resolved.episodeNumber ?? undefined,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.warn(
          "[Content] Error fetching pending skips:",
          chrome.runtime.lastError
        );
        return;
      }

      if (response?.success && response.pendingSkips) {
        state.pendingSkipsForVideo = response.pendingSkips;

        // Send to injected script
        window.postMessage(
          {
            type: "SKIPIT_SET_PENDING_SKIPS",
            data: { pendingSkips: response.pendingSkips },
          },
          "*"
        );
      }
    }
  );
}
