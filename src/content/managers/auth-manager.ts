/**
 * Authentication bridge for FAB and Mark Scene buttons
 * Manages auth state checking and propagation to injected script
 */

import { APP_URL } from "../../lib/config";
import { state } from "../utils/state";

/**
 * Check auth status and propagate to injected script
 */
export async function checkAndPropagateAuthState(): Promise<void> {
  try {
    const response = await new Promise<{ isAuthenticated: boolean }>(
      (resolve) => {
        chrome.runtime.sendMessage({ type: "CHECK_AUTH_STATUS" }, (resp) => {
          if (chrome.runtime.lastError) {
            console.warn(
              "[Content] Error checking auth:",
              chrome.runtime.lastError
            );
            resolve({ isAuthenticated: false });
            return;
          }
          resolve(resp || { isAuthenticated: false });
        });
      }
    );

    console.log("[Content] Auth state:", response.isAuthenticated);
    state.lastKnownAuthState = response.isAuthenticated;

    // Send auth state to injected script
    window.postMessage(
      {
        type: "SKIPIT_AUTH_STATE_UPDATE",
        data: { isAuthenticated: response.isAuthenticated },
      },
      "*"
    );
  } catch (error) {
    console.error("[Content] Error checking auth state:", error);
    window.postMessage(
      {
        type: "SKIPIT_AUTH_STATE_UPDATE",
        data: { isAuthenticated: false },
      },
      "*"
    );
  }
}

/**
 * Open authentication popup or fallback to web app
 */
export function openAuthPopup(): void {
  console.log("[Content] Opening auth popup requested");

  // Try to open the extension popup via background
  chrome.runtime.sendMessage({ type: "OPEN_AUTH_POPUP" }, (response) => {
    if (chrome.runtime.lastError || !response?.success) {
      // Fallback: Open the web app auth page
      console.log("[Content] Opening web auth page as fallback");
      window.open(`${APP_URL}/extension-auth`, "_blank");
    }
  });
}

/**
 * Start periodic auth state checking
 * This allows buttons to unlock when user signs in via popup
 */
export function startAuthStateWatcher(): void {
  if (state.authCheckInterval) return;

  // Check every 3 seconds for auth state changes
  state.authCheckInterval = setInterval(async () => {
    try {
      const response = await new Promise<{ isAuthenticated: boolean }>(
        (resolve) => {
          chrome.runtime.sendMessage({ type: "CHECK_AUTH_STATUS" }, (resp) => {
            if (chrome.runtime.lastError) {
              resolve({ isAuthenticated: false });
              return;
            }
            resolve(resp || { isAuthenticated: false });
          });
        }
      );

      // Only propagate if state changed
      if (response.isAuthenticated !== state.lastKnownAuthState) {
        console.log("[Content] Auth state changed:", response.isAuthenticated);
        state.lastKnownAuthState = response.isAuthenticated;

        window.postMessage(
          {
            type: "SKIPIT_AUTH_STATE_UPDATE",
            data: { isAuthenticated: response.isAuthenticated },
          },
          "*"
        );
      }
    } catch {
      // Ignore errors in background polling
    }
  }, 3000);
}
