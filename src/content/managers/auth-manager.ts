/**
 * Authentication bridge for FAB and Mark Scene buttons
 * Manages auth state checking and propagation to injected script
 */

import { APP_URL } from "../../lib/config";
import { state } from "../utils/state";

// The background service worker may be asleep when the page asks (MV3): the
// message then fails with lastError, which says nothing about sign-in. Retry a
// few times before giving up, and never report that as signed out.
const AUTH_CHECK_RETRIES = 4;
const AUTH_CHECK_RETRY_MS = 500;

// True until a real answer has been posted to the injected script. While true,
// the watcher posts its first real answer even if it matches lastKnownAuthState
// (which starts as false), so a signed-out user still gets a decision.
let authAnswerPending = true;

/** One CHECK_AUTH_STATUS round trip. null = no answer (background asleep). */
function requestAuthStatus(): Promise<{ isAuthenticated: boolean } | null> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "CHECK_AUTH_STATUS" }, (resp) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve(resp || { isAuthenticated: false });
    });
  });
}

function postAuthState(isAuthenticated: boolean): void {
  authAnswerPending = false;
  state.lastKnownAuthState = isAuthenticated;
  window.postMessage(
    { type: "SKIPIT_AUTH_STATE_UPDATE", data: { isAuthenticated } },
    "*"
  );
}

/**
 * Check auth status and propagate to injected script (runs on every player
 * ready). Only a real answer is posted. A signed-out answer while we last knew
 * the user as signed in is left to the watcher, which needs two in a row (a
 * single one can be a Clerk or network blip).
 */
export async function checkAndPropagateAuthState(): Promise<void> {
  try {
    for (let attempt = 0; attempt <= AUTH_CHECK_RETRIES; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, AUTH_CHECK_RETRY_MS));
      }
      const response = await requestAuthStatus();
      if (!response) continue;

      if (
        !response.isAuthenticated &&
        state.lastKnownAuthState &&
        !authAnswerPending
      ) {
        return; // The watcher confirms sign-outs
      }
      postAuthState(response.isAuthenticated);
      return;
    }
    // Still no answer: the watcher (every 3s) posts the first real one
    console.warn("[Content] Auth check got no answer from the background yet");
  } catch (error) {
    console.error("[Content] Error checking auth state:", error);
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
let cachedProfanityMute = false;
let cachedProfanityTipSeen = false;

const appearanceSettingsLoaded = chrome.storage.local
  .get(["fab_style", "discreet_mode", "profanity_mute", "profanity_tip_seen"])
  .then((res) => {
    cachedFabStyle = res.fab_style === "netflix" ? "netflix" : "classic";
    cachedDiscreetMode = res.discreet_mode === true;
    cachedProfanityMute = res.profanity_mute === true;
    cachedProfanityTipSeen = res.profanity_tip_seen === true;
    markProfanityTipSeenIfMuteOn();
  })
  .catch((error) => {
    console.warn("[Content] Error reading appearance settings:", error);
  });

/**
 * Anyone who has had mute on already knows the feature, so the first-time tip
 * must never appear for them (e.g. right after they switch it off).
 */
function markProfanityTipSeenIfMuteOn(): void {
  if (!cachedProfanityMute || cachedProfanityTipSeen) return;
  cachedProfanityTipSeen = true;
  chrome.storage.local.set({ profanity_tip_seen: true }).catch((error) => {
    console.warn("[Content] Error saving profanity_tip_seen:", error);
  });
}

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
 * Forward the profanity mute setting (and whether its on-page tip was ever
 * shown) to the injected script.
 */
function postProfanityMute(): void {
  window.postMessage(
    {
      type: "SKIPIT_SET_PROFANITY_MUTE",
      data: { enabled: cachedProfanityMute, tipSeen: cachedProfanityTipSeen },
    },
    "*"
  );
}

/**
 * Read profanity mute from chrome.storage.local and forward to injected script.
 */
export async function propagateProfanityMute(): Promise<void> {
  await appearanceSettingsLoaded;
  postProfanityMute();
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

    if (changes.profanity_mute || changes.profanity_tip_seen) {
      if (changes.profanity_mute) {
        cachedProfanityMute = changes.profanity_mute.newValue === true;
      }
      if (changes.profanity_tip_seen) {
        cachedProfanityTipSeen = changes.profanity_tip_seen.newValue === true;
      }
      markProfanityTipSeenIfMuteOn();
      postProfanityMute();
    }
  });
}

/**
 * Start periodic auth state checking
 * This allows buttons to unlock when user signs in via popup
 */
export function startAuthStateWatcher(): void {
  if (state.authCheckInterval) return;

  // A single failed check (background asleep, Clerk or network blip) looks the
  // same as a sign-out, so a sign-out only counts after this many in a row.
  // Sign-in is still picked up on the first check.
  const SIGNED_OUT_CONFIRMATIONS = 2;
  let signedOutStreak = 0;

  // Check every 3 seconds for auth state changes
  state.authCheckInterval = setInterval(async () => {
    try {
      // null = background asleep: skip this tick rather than sign out
      const response = await requestAuthStatus();
      if (!response) return;

      // No answer posted yet (the player-ready check got none): post this one
      // even if it matches the default, so the mute gate gets a decision
      if (authAnswerPending) {
        signedOutStreak = 0;
        postAuthState(response.isAuthenticated);
        return;
      }

      if (response.isAuthenticated) {
        signedOutStreak = 0;
      } else if (state.lastKnownAuthState) {
        signedOutStreak += 1;
        if (signedOutStreak < SIGNED_OUT_CONFIRMATIONS) return;
      }

      // Only propagate if state changed
      if (response.isAuthenticated !== state.lastKnownAuthState) {
        signedOutStreak = 0;
        postAuthState(response.isAuthenticated);
      }
    } catch {
      // Ignore errors in background polling
    }
  }, 3000);
}
