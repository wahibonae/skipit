/**
 * Window message handlers
 * Handles messages from the injected script via postMessage
 */

import { state } from "../utils/state";
import { getCachedContent } from "../utils/cache-manager";
import { matchContent } from "../utils/content-matcher";
import { checkAvailableSkipsForCurrentVideo } from "../utils/skip-utils";
import { startAuthStateWatcher, checkAndPropagateAuthState, openAuthPopup } from "../managers/auth-manager";
import { showMarkingOverlay, updateOverlayContent } from "../managers/overlay-manager";
import { showQuickPanel, handleQuickPanelStart } from "../managers/quick-panel-manager";
import { reportContentReady } from "./initialization";

/**
 * Set up window message handlers for injected script communication
 */
export function setupWindowMessageHandlers() {
  window.addEventListener("message", (event) => {
    // Only accept messages from same window
    if (event.source !== window) return;

    const { type } = event.data;

    if (type === "SKIPIT_NETFLIX_READY") {
      state.isNetflixReady = true;

      // Start auth state watcher to detect sign-in and update buttons
      startAuthStateWatcher();

      // Notify background that we're ready
      // Background will restore state if needed based on video ID
      reportContentReady();
    }

    if (type === "SKIPIT_CURRENT_TIME") {
      // Available for analytics if needed
    }

    // Timestamp marking messages
    if (type === "SKIPIT_MARK_STARTED") {
      // Could show a toast/notification here if desired
    }

    if (type === "SKIPIT_MARK_ENDED") {
      const { startTime, endTime, metadata } = event.data;

      // Store metadata for popup auto-detection
      if (metadata) {
        state.lastNetflixMetadata = metadata;
      }

      if (metadata) {
        // Check if we have cached content (instant)
        const cached = getCachedContent(metadata.netflixId);

        if (cached) {
          // We have cached content - show immediately with content
          const autoDetected = {
            ...cached,
            seasonNumber: metadata.seasonNumber,
            episodeNumber: metadata.episodeNumber,
          };
          showMarkingOverlay(startTime, endTime, autoDetected, false);
        } else {
          // Need to fetch from network - show loading state immediately
          showMarkingOverlay(startTime, endTime, null, true);

          // Fetch content in background and update overlay
          matchContent(metadata)
            .then((autoDetected) => {
              updateOverlayContent(autoDetected);
            })
            .catch((error) => {
              console.warn("[Content] Auto-detection failed:", error);
              updateOverlayContent(null);
            });
        }
      } else {
        // No metadata available, show manual search immediately
        showMarkingOverlay(startTime, endTime, null, false);
      }
    }

    if (type === "SKIPIT_MARK_ERROR") {
      console.error("[Content] Marking error:", event.data.error);
      // Could show a toast/notification here if desired
    }

    // Quick panel FAB button clicked
    if (type === "SKIPIT_FAB_CLICKED") {
      // Store metadata for popup auto-detection
      if (event.data.metadata) {
        state.lastNetflixMetadata = event.data.metadata;
      }
      showQuickPanel(event.data.metadata);
    }

    // Single-category auto-start skipping (bypasses quick panel)
    if (type === "SKIPIT_AUTO_START_SKIPPING") {
      const { metadata, skipType } = event.data;

      // Store metadata
      if (metadata) {
        state.lastNetflixMetadata = metadata;
      }

      // Match content to TMDB
      if (metadata) {
        matchContent(metadata)
          .then((resolved) => {
            if (!resolved) {
              return;
            }

            // Build preferences with only the single skip type enabled
            const preferences = {
              nudity: skipType.toLowerCase() === "nudity",
              sex: skipType.toLowerCase() === "sex",
              gore: skipType.toLowerCase() === "gore",
            };

            const contentType = resolved.mediaType === "tv" ? "episode" : "movie";

            // Start skipping directly (bypass quick panel)
            handleQuickPanelStart(
              resolved.tmdbId,
              contentType as "movie" | "episode",
              resolved.title,
              preferences,
              resolved.seasonNumber ?? undefined,
              resolved.episodeNumber ?? undefined
            ).catch((error) => {
              console.error("[Content] Auto-start failed:", error);
            });
          })
          .catch((error) => {
            console.error("[Content] Content matching failed:", error);
          });
      }
    }

    // FAB button clicked while skipping - stop request
    if (type === "SKIPIT_STOP_REQUEST") {
      // Tell background to stop skipping
      chrome.runtime.sendMessage({ type: "STOP_SKIP" }, () => {
        if (chrome.runtime.lastError) {
          console.warn(
            "[Content] Error stopping skip:",
            chrome.runtime.lastError
          );
        }
      });
    }

    // Auth popup request from injected script (user clicked locked button)
    if (type === "SKIPIT_OPEN_AUTH_POPUP") {
      openAuthPopup();
    }

    // Auth check request from injected script (on player ready)
    if (type === "SKIPIT_REQUEST_AUTH_CHECK") {
      checkAndPropagateAuthState();
    }

    // Metadata ready notification from injected script
    if (type === "SKIPIT_METADATA_READY") {
      const metadata = event.data.data?.metadata;
      if (metadata) {
        state.lastNetflixMetadata = metadata;
        checkAvailableSkipsForCurrentVideo(metadata);
      }
    }

  });
}
