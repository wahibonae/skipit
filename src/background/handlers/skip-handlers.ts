/**
 * Skip activation and control handlers
 * Manages the lifecycle of skip sessions on Netflix tabs
 */

import type { TabSkipState, ExtensionMessage } from "../../lib/types";
import { getTabState, setTabState, clearTabState } from "./tab-state";
import { extractNetflixVideoId } from "../utils/netflix-utils";
import { getTimestamps } from "../../lib/api";
import { getAuthToken } from "./auth";

/**
 * Activate skipping on the active Netflix tab
 */
export async function handleActivateSkip(
  message: ExtensionMessage & { type: "ACTIVATE_SKIP" }
) {
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

  // Store per-tab skip state (including preferences for refresh support)
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
    preferences: message.preferences,
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
    return { success: true };
  }

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

  const existingState = await getTabState(tabId);

  // Check if we have existing state for this tab with the SAME video ID
  // This handles the reload case - same content, restore state
  if (
    existingState?.isActive &&
    existingState.netflixVideoId === netflixVideoId &&
    existingState.timestamps
  ) {
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
    await clearTabState(tabId);
  }

  return { success: true, restored: false };
}

/**
 * Refresh active skipping session by re-fetching timestamps from DB.
 * Called after a user submits a new timestamp while skipping is active.
 * Re-applies the fresh timestamps to the active skip session.
 */
export async function handleRefreshActiveSkipping(tabId?: number) {
  if (!tabId) {
    return { success: false, error: "No tab ID" };
  }

  const existingState = await getTabState(tabId);
  if (!existingState?.isActive || !existingState.preferences) {
    // Not actively skipping or no preferences stored, nothing to refresh
    return { success: false };
  }

  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  // Re-fetch timestamps from DB with same preferences
  const { timestamps } = await getTimestamps(
    existingState.contentType,
    existingState.contentId,
    token,
    {
      skipNudity: existingState.preferences.skipNudity,
      skipSex: existingState.preferences.skipSex,
      skipGore: existingState.preferences.skipGore,
      seasonNumber: existingState.seasonNumber,
      episodeNumber: existingState.episodeNumber,
    }
  );

  // Update stored tab state with fresh timestamps
  const updatedState: TabSkipState = {
    ...existingState,
    timestamps,
  };
  await setTabState(updatedState);

  // Re-send to content script to re-apply skipping
  try {
    await chrome.tabs.sendMessage(tabId, {
      type: "START_SKIPPING",
      timestamps,
      contentTitle: existingState.contentTitle,
      netflixVideoId: existingState.netflixVideoId,
    });
    return { success: true };
  } catch (error) {
    console.warn("[Background] Could not refresh skip session:", error);
    return { success: false, error: "Content script not reachable" };
  }
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
