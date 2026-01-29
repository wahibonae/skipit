/**
 * Popup-related handlers
 * Handles communication between popup UI and content scripts
 */

/**
 * Get detected content from the Netflix tab for popup auto-detection
 * This proxies the request to the content script which has access to Netflix metadata
 */
export async function handleGetDetectedContent(
  tabId?: number
): Promise<{
  success: boolean;
  content?: unknown;
  metadata?: unknown;
  error?: string;
}> {
  console.log("[Background] Getting detected content for tab:", tabId);

  // Find the tab to query
  let targetTabId = tabId;

  if (!targetTabId) {
    // Find active Netflix tab
    const tabs = await chrome.tabs.query({
      url: "https://*.netflix.com/*",
      active: true,
      currentWindow: true,
    });

    if (tabs.length === 0 || !tabs[0].id) {
      return { success: false, error: "No active Netflix tab found" };
    }

    targetTabId = tabs[0].id;
  }

  try {
    // Send message to content script to get detected content
    const response = await chrome.tabs.sendMessage(targetTabId, {
      type: "GET_DETECTED_CONTENT",
    });

    console.log("[Background] Got detected content response:", response);
    return response;
  } catch (error) {
    console.error("[Background] Error getting detected content:", error);
    return { success: false, error: "Could not communicate with Netflix tab" };
  }
}

/**
 * Try to open the extension popup for authentication
 * Falls back to returning failure if not possible (content script will open web auth)
 */
export async function handleOpenAuthPopup(): Promise<{ success: boolean }> {
  try {
    // chrome.action.openPopup() may not work in all contexts
    // It requires a user gesture and the popup may not open from content script context
    await chrome.action.openPopup();
    console.log("[Background] Opened auth popup successfully");
    return { success: true };
  } catch (error) {
    console.warn("[Background] Could not open popup:", error);
    // Return failure - content script will open web auth page as fallback
    return { success: false };
  }
}
