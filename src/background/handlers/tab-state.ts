/**
 * Per-tab state management for skip sessions
 * Uses both in-memory Map and chrome.storage.session for reliability
 */

import type { TabSkipState } from "../../lib/types";

// In-memory cache for fast access
const tabStates = new Map<number, TabSkipState>();
const STORAGE_KEY_PREFIX = "tab_state_";

/**
 * Get storage key for a tab ID
 */
function getStorageKey(tabId: number): string {
  return `${STORAGE_KEY_PREFIX}${tabId}`;
}

/**
 * Get skip state for a specific tab
 * Checks memory first, then falls back to storage (for service worker restarts)
 */
export async function getTabState(tabId: number): Promise<TabSkipState | undefined> {
  // Check memory first (fastest)
  let state = tabStates.get(tabId);
  if (state) {
    return state;
  }

  // Fall back to storage (survives service worker termination)
  try {
    const key = getStorageKey(tabId);
    const result = await chrome.storage.session.get(key);
    state = result[key] as TabSkipState | undefined;

    if (state) {
      // Restore to memory cache
      tabStates.set(tabId, state);
      console.log(
        `[Background] Restored state from storage for tab ${tabId}:`,
        state.contentTitle
      );
    }

    return state;
  } catch (error) {
    console.warn("[Background] Error reading from storage:", error);
    return undefined;
  }
}

/**
 * Set skip state for a specific tab
 * Saves to both memory and storage for reliability
 */
export async function setTabState(state: TabSkipState): Promise<void> {
  // Save to memory (fast access)
  tabStates.set(state.tabId, state);

  // Persist to storage (survives service worker termination)
  try {
    const key = getStorageKey(state.tabId);
    await chrome.storage.session.set({ [key]: state });
  } catch (error) {
    console.warn("[Background] Error writing to storage:", error);
  }

  console.log(
    `[Background] Set state for tab ${state.tabId}:`,
    state.contentTitle
  );
}

/**
 * Clear skip state for a specific tab
 * Removes from both memory and storage
 */
export async function clearTabState(tabId: number): Promise<void> {
  const hadState = tabStates.has(tabId);
  tabStates.delete(tabId);

  // Remove from storage
  try {
    const key = getStorageKey(tabId);
    await chrome.storage.session.remove(key);
  } catch (error) {
    console.warn("[Background] Error removing from storage:", error);
  }

  if (hadState) {
    console.log(`[Background] Cleared state for tab ${tabId}`);
  }
}
