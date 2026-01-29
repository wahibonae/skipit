/**
 * Skip activation and control handlers
 * Manages the lifecycle of skip sessions on Netflix tabs
 */

import type { TabSkipState, ExtensionMessage } from "../../lib/types";
import { getTabState, setTabState, clearTabState } from "./tab-state";
import { extractNetflixVideoId } from "../utils/netflix-utils";

/**
 * Activate skipping on the active Netflix tab
 */
export async function handleActivateSkip(
  message: ExtensionMessage & { type: "ACTIVATE_SKIP" }
) {
  console.log("[Background] Activating skip for:", message.contentTitle);

  // Find active Netflix tab
  const tabs = await chrome.tabs.query({
    url: "https://*.netflix.com/*",
    active: true,
    currentWindow: true,
  });

  if (tabs.length === 0) {
    throw new Error(
      "No active Netflix tab found. Please navigate to Netflix first."
    );
  }

  const netflixTab = tabs[0];
  if (!netflixTab.id || !netflixTab.url) {
    throw new Error("Invalid tab");
  }

  // Extract Netflix video ID from the tab's URL
  const netflixVideoId = extractNetflixVideoId(netflixTab.url);
  if (!netflixVideoId) {
    throw new Error(
      "Please navigate to a Netflix video (netflix.com/watch/...) first."
    );
  }

  // Store per-tab skip state
  const skipState: TabSkipState = {
    tabId: netflixTab.id,
    netflixVideoId,
    isActive: true,
    contentType: message.contentType,
    contentId: message.contentId,
    contentTitle: message.contentTitle,
    timestamps: message.timestamps,
    seasonNumber: message.seasonNumber,
    episodeNumber: message.episodeNumber,
    activatedAt: Date.now(),
  };

  await setTabState(skipState);

  // Send timestamps to content script
  try {
    await chrome.tabs.sendMessage(netflixTab.id, {
      type: "START_SKIPPING",
      timestamps: message.timestamps,
      contentTitle: message.contentTitle,
      netflixVideoId,
    });
    console.log(
      "[Background] Skip activated successfully for tab",
      netflixTab.id
    );
    return { success: true };
  } catch (error) {
    // Content script not loaded - clear the state we just set
    await clearTabState(netflixTab.id);
    console.error("[Background] Content script not found:", error);
    throw new Error(
      "Please refresh the Netflix page and try again. The extension needs to reload on the page."
    );
  }
}

/**
 * Stop skipping for a specific tab or the active tab
 */
export async function handleStopSkip(specificTabId?: number) {
  let tabId = specificTabId;

  // If no specific tab ID, find the active Netflix tab
  if (!tabId) {
    const tabs = await chrome.tabs.query({
      url: "https://*.netflix.com/*",
      active: true,
      currentWindow: true,
    });
    tabId = tabs[0]?.id;
  }

  if (!tabId) {
    console.log("[Background] No tab to stop skipping on");
    return { success: true };
  }

  console.log("[Background] Stopping skip for tab", tabId);

  // Clear tab state
  await clearTabState(tabId);

  // Notify content script
  try {
    await chrome.tabs.sendMessage(tabId, { type: "STOP_SKIPPING" });
  } catch (error) {
    // Tab might not have content script loaded, ignore
    console.warn("[Background] Could not send stop message to tab:", tabId);
  }

  return { success: true };
}

/**
 * Get current skip status for a specific tab or the active tab
 */
export async function handleGetSkipStatus(specificTabId?: number) {
  let tabId = specificTabId;

  // If no specific tab ID, find the active Netflix tab
  if (!tabId) {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    tabId = tabs[0]?.id;
  }

  if (!tabId) {
    return { isActive: false };
  }

  const state = await getTabState(tabId);

  if (!state || !state.isActive) {
    return { isActive: false };
  }

  return {
    isActive: true,
    contentTitle: state.contentTitle,
    contentType: state.contentType,
    contentId: state.contentId,
    netflixVideoId: state.netflixVideoId,
    seasonNumber: state.seasonNumber,
    episodeNumber: state.episodeNumber,
  };
}

/**
 * Handle content script reporting it's ready
 * This is called when the content script loads/reloads
 */
export async function handleContentReady(
  tabId: number | undefined,
  netflixVideoId: string,
  _url: string
) {
  if (!tabId) {
    console.warn("[Background] Content ready but no tab ID");
    return { success: false };
  }

  console.log(
    `[Background] Content ready on tab ${tabId}, video ID: ${netflixVideoId}`
  );

  const existingState = await getTabState(tabId);

  // Check if we have existing state for this tab with the SAME video ID
  // This handles the reload case - same content, restore state
  if (
    existingState?.isActive &&
    existingState.netflixVideoId === netflixVideoId &&
    existingState.timestamps
  ) {
    console.log(
      `[Background] Restoring skip state for tab ${tabId}:`,
      existingState.contentTitle
    );

    // Send timestamps to content script to resume skipping
    try {
      await chrome.tabs.sendMessage(tabId, {
        type: "START_SKIPPING",
        timestamps: existingState.timestamps,
        contentTitle: existingState.contentTitle,
        netflixVideoId,
      });
      return { success: true, restored: true };
    } catch (error) {
      console.warn("[Background] Could not restore skip state:", error);
      return { success: false };
    }
  }

  // If video ID changed, clear the old state (user navigated to different content)
  if (existingState && existingState.netflixVideoId !== netflixVideoId) {
    console.log(
      `[Background] Video ID changed on tab ${tabId}: ${existingState.netflixVideoId} -> ${netflixVideoId}`
    );
    await clearTabState(tabId);
  }

  return { success: true, restored: false };
}

/**
 * Ping content script to verify actual skipping state
 * Used by popup to ensure displayed state matches reality
 */
export async function handleContentPing(
  tabId?: number
): Promise<{ isSkipping: boolean; netflixVideoId: string | null }> {
  if (!tabId) {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    tabId = tabs[0]?.id;
  }

  if (!tabId) {
    return { isSkipping: false, netflixVideoId: null };
  }

  try {
    const response = await chrome.tabs.sendMessage(tabId, { type: "PING" });
    return {
      isSkipping: response?.isSkipping ?? false,
      netflixVideoId: response?.netflixVideoId ?? null,
    };
  } catch {
    // Content script not loaded
    return { isSkipping: false, netflixVideoId: null };
  }
}
