/**
 * Quick panel manager
 * Manages the in-page skip activation panel UI lifecycle
 */

import type { NetflixMetadata } from "../../lib/types";
import { QuickPanel } from "../quick-panel";
import { state } from "../utils/state";

/**
 * Initialize the quick panel
 */
export function initializeQuickPanel() {
  if (state.quickPanel) return;

  state.quickPanel = new QuickPanel(handleQuickPanelStart, handleQuickPanelClose);
  console.log("[Content] Quick panel initialized");
}

/**
 * Handle quick panel start skipping
 */
export async function handleQuickPanelStart(
  tmdbId: number,
  contentType: "movie" | "episode",
  contentTitle: string,
  preferences: { nudity: boolean; sex: boolean; gore: boolean },
  seasonNumber?: number,
  episodeNumber?: number
): Promise<void> {
  console.log("[Content] Quick panel start skipping:", contentTitle);

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "QUICK_SKIP_ACTIVATE",
        contentType,
        tmdbId,
        contentTitle,
        preferences: {
          skipNudity: preferences.nudity,
          skipSex: preferences.sex,
          skipGore: preferences.gore,
        },
        seasonNumber,
        episodeNumber,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (response?.success) {
          console.log("[Content] Quick skip activated successfully");
          resolve();
        } else {
          reject(new Error(response?.error || "Failed to activate skipping"));
        }
      }
    );
  });
}

/**
 * Handle quick panel close
 */
function handleQuickPanelClose() {
  console.log("[Content] Quick panel closed");
}

/**
 * Show the quick panel when FAB is clicked
 */
export function showQuickPanel(metadata: NetflixMetadata | null) {
  initializeQuickPanel();
  state.quickPanel?.show(metadata);
}
