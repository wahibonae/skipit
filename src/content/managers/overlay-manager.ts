/**
 * Timestamp overlay manager
 * Manages the timestamp marking overlay UI lifecycle
 */

import type { AutoDetectedContent } from "../../lib/types";
import { TimestampOverlay } from "../timestamp-overlay";
import { state } from "../utils/state";
import { checkAvailableSkipsForCurrentVideo } from "../utils/skip-utils";

/**
 * Initialize the timestamp overlay
 */
export function initializeOverlay() {
  if (state.timestampOverlay) return;

  state.timestampOverlay = new TimestampOverlay(handleSaveTimestamp, handleCancelMarking);

  console.log("[Content] Timestamp overlay initialized");
}

/**
 * Show the marking overlay
 */
export function showMarkingOverlay(
  startTime: number,
  endTime: number,
  autoDetected: AutoDetectedContent | null,
  isLoading: boolean = false
) {
  initializeOverlay();

  console.log("[Content] Showing overlay with auto-detected:", autoDetected, "loading:", isLoading);
  state.timestampOverlay?.show(startTime, endTime, autoDetected, isLoading);
}

/**
 * Update the overlay with auto-detected content after loading
 */
export function updateOverlayContent(autoDetected: AutoDetectedContent | null) {
  state.timestampOverlay?.setAutoDetectedContent(autoDetected);
}

/**
 * Handle saving a timestamp
 */
async function handleSaveTimestamp(data: {
  startTime: number;
  endTime: number;
  type: "Nudity" | "Sex" | "Gore";
  contentType: "movie" | "episode";
  contentId: number;
  contentTitle: string;
  seasonNumber?: number;
  episodeNumber?: number;
}): Promise<void> {
  console.log("[Content] Saving timestamp:", data);

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "SAVE_TIMESTAMP",
        startTime: data.startTime,
        endTime: data.endTime,
        timestampType: data.type, // Single type
        contentType: data.contentType,
        contentId: data.contentId,
        contentTitle: data.contentTitle,
        seasonNumber: data.seasonNumber,
        episodeNumber: data.episodeNumber,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (response?.success) {
          console.log("[Content] Timestamp saved successfully");
          // Reset marking state in injected script
          window.postMessage({ type: "SKIPIT_RESET_MARKING" }, "*");

          // Refresh available skip types so FAB updates immediately
          if (state.lastNetflixMetadata) {
            console.log("[Content] Refreshing available skip types after save");
            checkAvailableSkipsForCurrentVideo(state.lastNetflixMetadata);
          }

          resolve();
        } else {
          reject(new Error(response?.error || "Failed to save timestamp"));
        }
      }
    );
  });
}

/**
 * Handle cancel marking
 */
function handleCancelMarking() {
  console.log("[Content] Marking cancelled");
  // Reset marking state in injected script
  window.postMessage({ type: "SKIPIT_RESET_MARKING" }, "*");
}
