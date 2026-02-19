/**
 * Background Service Worker - Entry Point
 * Routes messages from popup and content scripts to appropriate handlers
 */

import { clearTabState, getTabState } from "./handlers/tab-state";
import { extractNetflixVideoId } from "./utils/netflix-utils";

// Handler imports
import {
  handleActivateSkip,
  handleStopSkip,
  handleGetSkipStatus,
  handleContentReady,
  handleContentPing,
  handleRefreshActiveSkipping,
} from "./handlers/skip-handlers";
import {
  handleSaveTimestamp,
  handleSearchContent,
  handleGetEpisodes,
} from "./handlers/timestamp-handlers";
import {
  handleCheckAuthStatus,
  handleGetUserPreferences,
  handleMatchContent,
  handleQuickSkipActivate,
} from "./handlers/quick-panel-handlers";
import {
  handleGetDetectedContent,
  handleOpenAuthPopup,
} from "./handlers/popup-handlers";
import {
  handleCheckAvailableSkips,
} from "./handlers/skip-availability-handlers";
import {
  handleFetchPendingSkips,
  handleVoteOnSkip,
  handleSaveUserPreferences,
} from "./handlers/voting-handlers";

// ============================================================================
// MESSAGE ROUTER
// ============================================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // Skip activation and control
  if (message.type === "ACTIVATE_SKIP") {
    handleActivateSkip(message)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error activating skip:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (message.type === "STOP_SKIP") {
    handleStopSkip(message.tabId)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error stopping skip:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (message.type === "GET_SKIP_STATUS") {
    handleGetSkipStatus(message.tabId)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error getting skip status:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  // Content script lifecycle
  if (message.type === "CONTENT_READY") {
    handleContentReady(sender.tab?.id, message.netflixVideoId, message.url)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error handling content ready:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (message.type === "CONTENT_PING") {
    if (!sender.tab) {
      handleContentPing(message.tabId)
        .then(sendResponse)
        .catch((error) => {
          console.error("[Background] Error pinging content:", error);
          sendResponse({ isSkipping: false, netflixVideoId: null });
        });
      return true;
    }
  }

  // Refresh active skipping session (after user submits a new timestamp)
  if (message.type === "REFRESH_ACTIVE_SKIPPING") {
    handleRefreshActiveSkipping(sender.tab?.id)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error refreshing active skipping:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  // Timestamp operations
  if (message.type === "SAVE_TIMESTAMP") {
    handleSaveTimestamp(message)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error saving timestamp:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (message.type === "SEARCH_CONTENT") {
    handleSearchContent(message.query)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error searching content:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (message.type === "GET_EPISODES") {
    handleGetEpisodes(message.tvShowId)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error getting episodes:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  // Quick Panel operations
  if (message.type === "CHECK_AUTH_STATUS") {
    handleCheckAuthStatus()
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error checking auth:", error);
        sendResponse({ isAuthenticated: false, error: error.message });
      });
    return true;
  }

  if (message.type === "GET_USER_PREFERENCES") {
    handleGetUserPreferences()
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error getting user preferences:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (message.type === "MATCH_CONTENT") {
    handleMatchContent(message)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error matching content:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (message.type === "QUICK_SKIP_ACTIVATE") {
    handleQuickSkipActivate(message)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error activating quick skip:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  // Popup operations
  if (message.type === "GET_DETECTED_CONTENT") {
    handleGetDetectedContent(message.tabId)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error getting detected content:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (message.type === "OPEN_AUTH_POPUP") {
    handleOpenAuthPopup()
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error opening auth popup:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  // Voting and verification
  if (message.type === "FETCH_PENDING_SKIPS") {
    handleFetchPendingSkips(message)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error fetching pending skips:", error);
        sendResponse({ success: false, pendingSkips: [] });
      });
    return true;
  }

  if (message.type === "VOTE_ON_SKIP") {
    handleVoteOnSkip(message)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error voting on skip:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (message.type === "SAVE_USER_PREFERENCES") {
    handleSaveUserPreferences(message)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error saving preferences:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  // Skip availability check
  if (message.type === "CHECK_AVAILABLE_SKIPS") {
    handleCheckAvailableSkips(message)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Background] Error checking available skips:", error);
        sendResponse({ success: false, skipTypes: [] });
      });
    return true;
  }

  return false;
});

// ============================================================================
// TAB LIFECYCLE HANDLERS
// ============================================================================

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener(async (tabId) => {
  await clearTabState(tabId);
});

// Handle tab URL changes (navigation within tab)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only act on URL changes for Netflix pages
  if (!tab.url?.includes("netflix.com")) return;

  const existingState = await getTabState(tabId);
  if (!existingState) return;

  // If URL changed, check if video ID is different
  if (changeInfo.url) {
    const newVideoId = extractNetflixVideoId(changeInfo.url);

    // User navigated away from watch page or to different video
    if (!newVideoId || newVideoId !== existingState.netflixVideoId) {
      await clearTabState(tabId);

      // Try to notify content script to stop
      try {
        await chrome.tabs.sendMessage(tabId, { type: "STOP_SKIPPING" });
      } catch {
        // Content script might not be loaded yet
      }
    }
  }

  // When page finishes loading on a watch page, content script will report CONTENT_READY
  // and we'll restore state if video ID matches (handled in handleContentReady)
});
