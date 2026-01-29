/**
 * Chrome runtime message handlers
 * Handles messages from background script
 */

import { state } from "../utils/state";
import { startSkipping, stopSkipping } from "../managers/skip-controller";
import { requestNetflixMetadata } from "../utils/netflix-detector";
import { matchContent } from "../utils/content-matcher";

/**
 * Set up chrome.runtime.onMessage handlers
 */
export function setupChromeMessageHandlers() {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log("[Content] Received message:", message.type);

    if (message.type === "START_SKIPPING") {
      startSkipping(
        message.timestamps,
        message.contentTitle,
        message.netflixVideoId
      )
        .then(() => {
          sendResponse({ success: true });
        })
        .catch((error) => {
          console.error("[Content] Start skipping error:", error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep message channel open for async response
    }

    if (message.type === "STOP_SKIPPING") {
      stopSkipping();
      sendResponse({ success: true });
      return false;
    }

    // Ping from popup/background to verify actual state
    if (message.type === "PING") {
      sendResponse({
        isSkipping: state.isSkipping,
        netflixVideoId: state.currentNetflixVideoId,
        contentTitle: state.currentContentTitle,
      });
      return false;
    }

    // Get detected content for popup auto-detection
    if (message.type === "GET_DETECTED_CONTENT") {
      console.log("[Content] Handling GET_DETECTED_CONTENT request");

      // Request fresh metadata from injected script
      requestNetflixMetadata()
        .then(async (metadata) => {
          console.log(
            "[Content] requestNetflixMetadata resolved with:",
            metadata
          );
          if (metadata) {
            console.log("[Content] Got metadata, matching content:", metadata);
            try {
              // Use the matchContent function to resolve TMDB ID
              const resolved = await matchContent(metadata);
              console.log("[Content] matchContent resolved with:", resolved);
              sendResponse({
                success: !!resolved,
                content: resolved,
                metadata: metadata,
              });
            } catch (matchError) {
              console.error("[Content] matchContent error:", matchError);
              sendResponse({ success: false, error: String(matchError) });
            }
          } else {
            console.log("[Content] No metadata available");
            sendResponse({ success: false, content: null });
          }
        })
        .catch((error) => {
          console.error("[Content] Error getting detected content:", error);
          sendResponse({ success: false, error: error.message });
        });

      return true; // Keep message channel open for async response
    }

    return false;
  });
}
