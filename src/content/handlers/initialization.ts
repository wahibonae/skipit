/**
 * Content script initialization
 * Handles reporting ready state and initial setup
 */

import { state } from "../utils/state";
import { extractNetflixVideoId, injectNetflixScript } from "../utils/netflix-detector";

/**
 * Report to background that content script is ready
 */
export function reportContentReady() {
  const videoId = extractNetflixVideoId(window.location.href);
  if (!videoId) {
    // Not on a watch page - ensure FAB shows not skipping
    window.postMessage(
      {
        type: "SKIPIT_UPDATE_FAB_STATE",
        data: { isSkipping: false },
      },
      "*"
    );
    return;
  }

  state.currentNetflixVideoId = videoId;

  // Note: Available skip types will be checked when injected script sends SKIPIT_METADATA_READY

  chrome.runtime.sendMessage(
    {
      type: "CONTENT_READY",
      netflixVideoId: videoId,
      url: window.location.href,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.warn(
          "[Content] Error reporting ready:",
          chrome.runtime.lastError
        );
        // Error - assume not skipping
        window.postMessage(
          {
            type: "SKIPIT_UPDATE_FAB_STATE",
            data: { isSkipping: false },
          },
          "*"
        );
        return;
      }

      if (response?.restored) {
        // Background restored state, START_SKIPPING will be sent which updates FAB
      } else {
        // No state to restore - ensure FAB shows not skipping
        window.postMessage(
          {
            type: "SKIPIT_UPDATE_FAB_STATE",
            data: { isSkipping: false },
          },
          "*"
        );
      }
    }
  );
}

/**
 * Initialize content script on Netflix pages
 */
export function initializeContentScript() {
  if (!window.location.hostname.includes("netflix.com")) {
    return;
  }

  // Extract initial video ID
  state.currentNetflixVideoId = extractNetflixVideoId(window.location.href);

  // Inject script immediately
  injectNetflixScript().catch((error) => {
    console.error("[Content] Error injecting Netflix script on load:", error);
  });

  // If Netflix is already ready (unlikely but possible), report immediately
  // Otherwise, we'll report when SKIPIT_NETFLIX_READY message is received
}
