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
      console.log("[Content] Netflix player is ready");
      state.isNetflixReady = true;

      // Start auth state watcher to detect sign-in and update buttons
      startAuthStateWatcher();

      // Notify background that we're ready
      // Background will restore state if needed based on video ID
      reportContentReady();
    }

    if (type === "SKIPIT_CURRENT_TIME") {
      // We can use this for debugging or analytics
      // For now, just log occasionally
      if (Math.random() < 0.01) {
        // Log 1% of the time
        console.log("[Content] Current time:", event.data.currentTime);
      }
    }

    // Timestamp marking messages
    if (type === "SKIPIT_MARK_STARTED") {
      console.log("[Content] Marking started at:", event.data.startTime);
      // Could show a toast/notification here if desired
    }

    if (type === "SKIPIT_MARK_ENDED") {
      console.log(
        "[Content] Marking ended:",
        event.data.startTime,
        "→",
        event.data.endTime,
        "metadata:",
        event.data.metadata
      );

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
          console.log(
            "[Content] Using cached content, showing overlay immediately"
          );
          const autoDetected = {
            ...cached,
            seasonNumber: metadata.seasonNumber,
            episodeNumber: metadata.episodeNumber,
          };
          showMarkingOverlay(startTime, endTime, autoDetected, false);
        } else {
          // Need to fetch from network - show loading state immediately
          console.log("[Content] No cache, showing loading overlay");
          showMarkingOverlay(startTime, endTime, null, true);

          // Fetch content in background and update overlay
          matchContent(metadata)
            .then((autoDetected) => {
              console.log("[Content] Auto-detection result:", autoDetected);
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
      console.log("[Content] FAB clicked, metadata:", event.data.metadata);
      // Store metadata for popup auto-detection
      if (event.data.metadata) {
        state.lastNetflixMetadata = event.data.metadata;
      }
      showQuickPanel(event.data.metadata);
    }

    // Single-category auto-start skipping (bypasses quick panel)
    if (type === "SKIPIT_AUTO_START_SKIPPING") {
      const { metadata, skipType } = event.data;
      console.log("[Content] Auto-starting skipping for single type:", skipType);

      // Store metadata
      if (metadata) {
        state.lastNetflixMetadata = metadata;
      }

      // Match content to TMDB
      if (metadata) {
        matchContent(metadata)
          .then((resolved) => {
            if (!resolved) {
              console.warn("[Content] Could not match content for auto-start");
              return;
            }

            // Build preferences with only the single skip type enabled
            const preferences = {
              nudity: skipType.toLowerCase() === "nudity",
              sex: skipType.toLowerCase() === "sex",
              gore: skipType.toLowerCase() === "gore",
            };

            const contentType = resolved.mediaType === "tv" ? "episode" : "movie";

            console.log("[Content] Auto-starting with preferences:", preferences);

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
      console.log("[Content] Stop request from FAB");
      // Tell background to stop skipping
      chrome.runtime.sendMessage({ type: "STOP_SKIP" }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn(
            "[Content] Error stopping skip:",
            chrome.runtime.lastError
          );
        } else {
          console.log("[Content] Skip stopped via FAB:", response);
        }
      });
    }

    // Auth popup request from injected script (user clicked locked button)
    if (type === "SKIPIT_OPEN_AUTH_POPUP") {
      openAuthPopup();
    }

    // Auth check request from injected script (on player ready)
    if (type === "SKIPIT_REQUEST_AUTH_CHECK") {
      console.log("[Content] Auth check requested, checking with background...");
      checkAndPropagateAuthState();
    }

    // Metadata ready notification from injected script
    if (type === "SKIPIT_METADATA_READY") {
      const metadata = event.data.data?.metadata;
      if (metadata) {
        console.log(
          "[Content] Metadata ready from injected script:",
          metadata.title
        );
        state.lastNetflixMetadata = metadata;
        checkAvailableSkipsForCurrentVideo(metadata);
      }
    }

    // Vote on skip group from injected script
    if (type === "SKIPIT_SKIP_VOTE") {
      const { skipGroupId, voteType } = event.data;
      console.log("[Content] Vote request:", skipGroupId, voteType);

      chrome.runtime.sendMessage(
        {
          type: "VOTE_SKIP",
          skipGroupId,
          voteType,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.warn("[Content] Vote error:", chrome.runtime.lastError);
            window.postMessage(
              {
                type: "SKIPIT_VOTE_RESULT",
                data: { success: false, error: chrome.runtime.lastError.message },
              },
              "*"
            );
            return;
          }

          console.log("[Content] Vote response:", response);
          window.postMessage(
            {
              type: "SKIPIT_VOTE_RESULT",
              data: response,
            },
            "*"
          );
        }
      );
    }
  });
}
