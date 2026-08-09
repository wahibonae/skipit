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
  // Try to open the extension popup via background
  chrome.runtime.sendMessage({ type: "OPEN_AUTH_POPUP" }, (response) => {
    if (chrome.runtime.lastError || !response?.success) {
      // Fallback: Open the web app auth page
      window.open(`${APP_URL}/extension-auth`, "_blank");
    }
  });
}

/**
 * Last known appearance settings, kept in sync by the storage watcher below.
 *
 * Cached because the injected script renders its buttons visible immediately on
 * SKIPIT_NETFLIX_READY: awaiting a storage read at that point would show the
 * default (verbose) button for a frame before discreet mode could correct it.
 *
 * Netflix is an SPA, so the content script survives navigations while the
 * injected script re-fires READY. That means these values are replayed on every
 * navigation and MUST NOT go stale, hence the watcher writing back to them.
 */
let cachedFabStyle: "classic" | "netflix" = "classic";
let cachedDiscreetMode = false;

const appearanceSettingsLoaded = chrome.storage.local
  .get(["fab_style", "discreet_mode"])
  .then((res) => {
    cachedFabStyle = res.fab_style === "netflix" ? "netflix" : "classic";
    cachedDiscreetMode = res.discreet_mode === true;
  })
  .catch((error) => {
    console.warn("[Content] Error reading appearance settings:", error);
  });

/**
 * Read FAB style from chrome.storage.local and forward to injected script.
 */
export async function propagateFabStyle(): Promise<void> {
  await appearanceSettingsLoaded;
  window.postMessage(
    { type: "SKIPIT_SET_FAB_STYLE", data: { style: cachedFabStyle } },
    "*"
  );
}

/**
 * Read discreet mode from chrome.storage.local and forward to injected script.
 */
export async function propagateDiscreetMode(): Promise<void> {
  await appearanceSettingsLoaded;
  window.postMessage(
    { type: "SKIPIT_SET_DISCREET_MODE", data: { enabled: cachedDiscreetMode } },
    "*"
  );
}

/**
 * Watch chrome.storage for appearance changes (FAB style, discreet mode) and
 * forward them to the injected script.
 *
 * Guarded: SKIPIT_NETFLIX_READY fires again on every SPA navigation, and
 * chrome.storage.onChanged has no dedupe, so an unguarded call would stack a
 * fresh listener per navigation and post N duplicate messages per toggle.
 */
let fabStyleWatcherStarted = false;

export function startFabStyleWatcher(): void {
  if (fabStyleWatcherStarted) return;
  fabStyleWatcherStarted = true;

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;

    if (changes.fab_style) {
      cachedFabStyle =
        changes.fab_style.newValue === "netflix" ? "netflix" : "classic";
      window.postMessage(
        { type: "SKIPIT_SET_FAB_STYLE", data: { style: cachedFabStyle } },
        "*"
      );
    }

    if (changes.discreet_mode) {
      cachedDiscreetMode = changes.discreet_mode.newValue === true;
      window.postMessage(
        { type: "SKIPIT_SET_DISCREET_MODE", data: { enabled: cachedDiscreetMode } },
        "*"
      );
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
