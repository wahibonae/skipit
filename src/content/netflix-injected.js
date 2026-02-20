// Auto-generated - DO NOT EDIT DIRECTLY
// Edit files in src/content/injected/ and run: node src/content/injected/build.js
// This script runs in the MAIN world to access Netflix's global objects

// Check if script already loaded (prevent duplicate injection)
if (!window.skipitNetflixInjected) {
  window.skipitNetflixInjected = true;

const BUTTON_STYLES = `
/* ===========================================
   SKIPIT BUTTONS - Positioned above Netflix's skip buttons
   =========================================== */

/* Skipit Wrapper - Contains both FAB and Mark buttons */
#skipit-buttons-wrapper {
  position: absolute;
  bottom: 150px;
  right: 26px;
  z-index: 2147483646;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease, bottom 0.25s ease;
  pointer-events: none;
}
#skipit-buttons-wrapper.visible {
  opacity: 1;
  pointer-events: auto;
}
/* Shift up when Netflix's Skip Intro/Recap button is visible */
#skipit-buttons-wrapper.netflix-skip-visible {
  bottom: 200px;
}

/* Mark Button - Subtle dark pill */
.skipit-mark-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(26, 26, 26, 0.85);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  padding: 10px 16px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  font-family: Netflix Sans, Helvetica Neue, Segoe UI, Roboto, sans-serif;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.skipit-mark-btn:hover {
  background: rgba(26, 26, 26, 0.95);
}
.skipit-mark-btn .skipit-mark-icon {
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
}
.skipit-mark-btn.recording {
  background: rgba(255, 110, 79, 0.9);
  color: white;
}
.skipit-mark-btn.recording .skipit-mark-icon {
  animation: skipit-pulse 1s ease-in-out infinite;
  color: white;
}
@keyframes skipit-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* FAB Button - Primary skip pill with red accent */
.skipit-fab {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  background: rgba(26, 26, 26, 0.9);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  padding: 12px 16px;
  color: white;
  font-family: Netflix Sans, Helvetica Neue, Segoe UI, Roboto, sans-serif;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  text-align: left;
  min-width: 180px;
}
.skipit-fab:hover {
  background: rgba(26, 26, 26, 0.95);
  transform: translateX(-2px);
}
.skipit-fab.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-left-color: #666;
}
.skipit-fab.disabled:hover {
  transform: none;
}
.skipit-fab.active {
  background: rgba(255, 110, 79, 1);
  border-left-color: white;
}
.skipit-fab.active:hover {
  background: rgba(255, 110, 79, 1);
}

/* FAB Label - "Skipit" branding */
.skipit-fab-label {
  font-size: 12px;
  font-weight: 600;
  color: #ff6f4f;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.skipit-fab.active .skipit-fab-label {
  color: rgba(255, 255, 255, 0.9);
}

/* FAB Types - Main CTA text */
.skipit-fab-types {
  font-size: 16px;
  font-weight: 600;
  color: white;
  line-height: 1.2;
}

/* Timeline Segment Styles - positioned above the timeline bar */
.skipit-timeline-segments {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  height: 5px;
  margin-bottom: 2px;
  z-index: 10;
}
.skipit-segment {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 2px;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.skipit-segment:hover {
}
/* Tooltip */
.skipit-segment::after {
  content: attr(data-label);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 11px;
  font-family: Netflix Sans, Helvetica Neue, Segoe UI, Roboto, sans-serif;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 100;
}
.skipit-segment:hover::after {
  opacity: 1;
  transform: translateX(-50%);
}
.skipit-segment--nudity {
  background: linear-gradient(180deg, #FF6EB4 0%, #FF1493 100%);
  box-shadow: 0 0 6px 1px rgba(255, 20, 147, 0.6), 0 0 12px 2px rgba(255, 20, 147, 0.3);
}
.skipit-segment--nudity:hover {
  box-shadow: 0 0 8px 2px rgba(255, 20, 147, 0.8), 0 0 18px 4px rgba(255, 20, 147, 0.4);
}
.skipit-segment--sex {
  background: linear-gradient(180deg, #FF4D4D 0%, #E60000 100%);
  box-shadow: 0 0 6px 1px rgba(230, 0, 0, 0.6), 0 0 12px 2px rgba(230, 0, 0, 0.3);
}
.skipit-segment--sex:hover {
  box-shadow: 0 0 8px 2px rgba(230, 0, 0, 0.8), 0 0 18px 4px rgba(230, 0, 0, 0.4);
}
.skipit-segment--gore {
  background: linear-gradient(180deg, #FFAA00 0%, #FF6600 100%);
  box-shadow: 0 0 6px 1px rgba(255, 102, 0, 0.6), 0 0 12px 2px rgba(255, 102, 0, 0.3);
}
.skipit-segment--gore:hover {
  box-shadow: 0 0 8px 2px rgba(255, 102, 0, 0.8), 0 0 18px 4px rgba(255, 102, 0, 0.4);
}
.skipit-segment--default {
  background: linear-gradient(180deg, #FF6EB4 0%, #FF1493 100%);
  box-shadow: 0 0 6px 1px rgba(255, 20, 147, 0.6), 0 0 12px 2px rgba(255, 20, 147, 0.3);
}

/* Pending (unverified) segments - neutral gray with dashed look */
.skipit-timeline-segments--pending-container {
  margin-bottom: 8px;
}
.skipit-segment--pending {
  background: rgba(180, 180, 180, 0.7);
  opacity: 0.75;
  cursor: pointer;
  border: 1px dashed rgba(255, 255, 255, 0.4);
}
.skipit-segment--pending:hover {
  opacity: 1;
  box-shadow: 0 0 6px 1px rgba(180, 180, 180, 0.6);
}

/* Skip Notification Styles */
.skipit-notification {
  position: absolute;
  bottom: 160px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  font-family: Netflix Sans, Helvetica Neue, Segoe UI, Roboto, sans-serif;
  font-size: 14px;
  padding: 10px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: none;
  z-index: 2147483645;
  opacity: 0;
  transition: opacity 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
.skipit-notification.visible {
  opacity: 1;
}
.skipit-notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}
.skipit-notification-icon svg {
  width: 14px;
  height: 14px;
}
.skipit-notification-icon--nudity {
  background: #EC4899;
}
.skipit-notification-icon--sex {
  background: #EF4444;
}
.skipit-notification-icon--gore {
  background: #F97316;
}
.skipit-notification-icon--default {
  background: #EC4899;
}
.skipit-notification-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.skipit-notification-title {
  font-weight: 600;
  font-size: 13px;
}
.skipit-notification-time {
  font-size: 12px;
  opacity: 0.8;
}

.skipit-notification-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.skipit-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
  line-height: 1;
}
.skipit-close-btn:hover {
  color: white;
}
/* Locked state for buttons when not authenticated */
.skipit-mark-btn.locked,
.skipit-fab.locked {
  opacity: 0.6;
  cursor: not-allowed;
  position: relative;
}
.skipit-mark-btn.locked:hover,
.skipit-fab.locked:hover {
  transform: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}
.skipit-locked-icon {
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.skipit-locked-icon svg {
  width: 12px;
  height: 12px;
}
/* Tooltip for locked buttons */
.skipit-mark-btn.locked::after,
.skipit-fab.locked::after {
  content: 'Sign in to use';
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 10;
}
.skipit-mark-btn.locked:hover::after,
.skipit-fab.locked:hover::after {
  opacity: 1;
}

/* Vote Prompt Styles — mirrors .skipit-notification with added buttons row */
.skipit-vote-prompt {
  position: absolute;
  bottom: 160px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  font-family: Netflix Sans, Helvetica Neue, Segoe UI, Roboto, sans-serif;
  font-size: 14px;
  padding: 10px 16px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 2147483645;
  opacity: 0;
  transition: opacity 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
}
.skipit-vote-prompt.visible {
  opacity: 1;
}
/* Row 1: icon + text — reuses .skipit-notification-icon and .skipit-notification-text */
.skipit-vote-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
/* Row 2: centered buttons */
.skipit-vote-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}
.skipit-vote-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border: none;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: Netflix Sans, Helvetica Neue, Segoe UI, Roboto, sans-serif;
  transition: all 0.15s ease;
}
.skipit-vote-btn svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}
.skipit-vote-btn--upvote {
  background: #ff6f4f;
  color: white;
}
.skipit-vote-btn--upvote:hover {
  background: #e5593b;
}
.skipit-vote-btn--downvote {
  background: rgba(107, 114, 128, 0.6);
  color: white;
}
.skipit-vote-btn--downvote:hover {
  background: rgba(107, 114, 128, 0.85);
}

/* Thanks notification — green circle + checkmark */
.skipit-thanks-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #10B981;
  flex-shrink: 0;
}
.skipit-thanks-icon svg {
  width: 14px;
  height: 14px;
}

`;

// ============================================================================
// STATE VARIABLES
// ============================================================================

// Timestamp marking state
let markingState = {
  isMarking: false,
  startTime: null, // in milliseconds
  endTime: null, // in milliseconds
};

// Authentication state
let isAuthenticated = false;

// Watcher initialization flags (prevent duplicate watchers)
let buttonWatcherInitialized = false;
let videoChangeWatcherInitialized = false;

// Button IDs and constants
const BUTTON_ID = "skipit-mark-button";
const FAB_BUTTON_ID = "skipit-fab-button";
const WRAPPER_ID = "skipit-buttons-wrapper";

// FAB state
let fabSkippingActive = false;
let lastMetadata = null;
let lastNetflixId = null; // Track video ID to detect navigation
let availableSkipTypes = []; // All skip types available in DB (for display when NOT skipping)
let activeSkippingTypes = []; // Skip types currently being skipped (for display when skipping)
let loadingStatus = "detecting"; // "detecting" | "loading" | "ready" | "not_recognized"
let isContentClean = false; // Whether this content is marked as clean

// Track if we were in fullscreen before opening a modal
let wasFullscreenBeforeModal = false;

// Skip checking state
let activeTimestamps = [];
let originalTimestamps = []; // Unmerged timestamps for timeline rendering
let skipCheckInterval = null;
let lastSkipTime = 0;
const SKIP_COOLDOWN = 500; // 500ms cooldown between skips
let skippingForVideoIdFromUrl = null; // Video ID extracted from URL when skipping started

// Timeline segments state
const SEGMENTS_CONTAINER_ID = "skipit-timeline-segments";
let segmentsResizeObserver = null;
let segmentsTimelineObserver = null;

// Notification state
const NOTIFICATION_ID = "skipit-notification";
const NOTIFICATION_DURATION = 4000; // Auto-dismiss after 4s
const SEGMENT_COOLDOWN = 5000; // Don't re-notify same segment for 5s

let notificationTimeout = null;
let lastNotifiedSegment = null; // { start, end, timestamp }

// Pending skip verification state
let pendingSkips = [];
let pendingSegmentsRendered = false;
const VOTE_PROMPT_LEAD_TIME = 3000; // Show prompt 3s before segment
let activeVotePromptSkipId = null;
let votePromptTimeout = null;
let pendingSkipCheckInterval = null;
const PENDING_SEGMENTS_CONTAINER_ID = "skipit-timeline-segments--pending";
let pendingSegmentsTimelineObserver = null;


// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format time in seconds to MM:SS or HH:MM:SS
 */
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format milliseconds to MM:SS or HH:MM:SS
 */
function formatTimeMs(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format skip type for display (e.g., "nudity")
 */
function formatSkipType(type) {
  if (!type) return "";
  const typeNames = {
    Nudity: "nudity",
    nudity: "nudity",
    Sex: "sex",
    sex: "sex",
    Gore: "gore",
    gore: "gore",
  };
  return typeNames[type] || type.toLowerCase();
}

/**
 * Format skip types for display (e.g., "nudity/sex")
 * Handles both single type string and array of types
 */
function formatSkipTypes(types) {
  if (!types || types.length === 0) return "";
  // Normalize to array - handle both string and array inputs
  const typesArray = Array.isArray(types) ? types : [types];
  const formatted = typesArray.map((t) => formatSkipType(t)).filter(Boolean);
  const unique = [...new Set(formatted)];
  return unique.join("/");
}

/**
 * Create lock icon SVG using safe DOM methods
 */
function createLockIconSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
  );
  svg.appendChild(path);
  return svg;
}

/**
 * Inject styles for the buttons
 */
function injectStyles() {
  if (document.getElementById("skipit-mark-styles")) return;

  const style = document.createElement("style");
  style.id = "skipit-mark-styles";
  style.textContent = BUTTON_STYLES;
  document.head.appendChild(style);
}


// ============================================================================
// NETFLIX PLAYER API
// ============================================================================

/**
 * Check if Netflix player is available and ready
 */
function isNetflixPlayerReady() {
  try {
    const netflix = window.netflix;
    return !!(
      netflix &&
      netflix.appContext &&
      netflix.appContext.state &&
      netflix.appContext.state.playerApp
    );
  } catch (error) {
    return false;
  }
}

/**
 * Get current playback time in milliseconds
 */
function getCurrentTime() {
  try {
    if (!isNetflixPlayerReady()) {
      throw new Error("Netflix player not ready");
    }

    const netflix = window.netflix;
    const videoPlayer =
      netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];
    const player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);

    return player.getCurrentTime();
  } catch (error) {
    console.error("[Netflix Injected] Error getting current time:", error);
    return 0;
  }
}

/**
 * Seek to specific time in milliseconds
 * This is the official Netflix skip code from CLAUDE.md
 */
function seek(milliseconds) {
  try {
    if (!isNetflixPlayerReady()) {
      throw new Error("Netflix player not ready");
    }

    // Official Netflix skip code
    const netflix = window.netflix;
    const videoPlayer =
      netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];
    const player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);
    player.seek(milliseconds);
  } catch (error) {
    console.error("[Netflix Injected] Error seeking:", error);
    throw error;
  }
}

/**
 * Extract Netflix video ID from URL (e.g., /watch/81234567 -> 81234567)
 * This is 100% reliable - URLs change immediately on navigation
 */
function getVideoIdFromUrl() {
  const match = window.location.pathname.match(/\/watch\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Pause the video
 */
function pauseVideo() {
  const video = document.querySelector("video");
  if (video && !video.paused) {
    video.pause();
  }
}

/**
 * Exit fullscreen mode if active
 * Returns a promise that resolves when fullscreen is exited
 */
function exitFullscreenIfActive() {
  if (document.fullscreenElement) {
    return document.exitFullscreen().catch((err) => {
      console.warn("[Netflix Injected] Exit fullscreen error:", err);
    });
  }
  return Promise.resolve();
}

/**
 * Play the video
 */
function playVideo() {
  const video = document.querySelector("video");
  if (video && video.paused) {
    video
      .play()
      .catch((err) =>
        console.warn("[Netflix Injected] Could not play video:", err)
      );
  }
}

/**
 * Enter fullscreen mode
 */
function enterFullscreen() {
  const playerContainer =
    document.querySelector(".watch-video") ||
    document.querySelector('[data-uia="player"]') ||
    document.documentElement;

  if (!document.fullscreenElement && playerContainer) {
    playerContainer
      .requestFullscreen()
      .catch((err) =>
        console.warn("[Netflix Injected] Could not enter fullscreen:", err)
      );
  }
}

/**
 * Extract metadata from Netflix's internal API
 * Returns: { title, type, seasonNumber, episodeNumber, episodeTitle, netflixId }
 */
function extractNetflixMetadata() {
  try {
    if (!isNetflixPlayerReady()) return null;

    const state = window.netflix.appContext.state;
    const playerState = state.playerApp.getState();
    const videoMetadata = playerState.videoPlayer.videoMetadata;
    const sessionKey = Object.keys(videoMetadata)[0];

    if (!sessionKey) return null;

    const metadata = videoMetadata[sessionKey];

    // Netflix nests video data: metadata._video._video contains the actual data
    const videoWrapper = metadata._video;
    if (!videoWrapper) return null;

    const video = videoWrapper._video || videoWrapper;
    if (!video) return null;

    // Determine content type - Netflix uses "show" for TV series
    const isEpisode =
      video.type === "show" ||
      video.type === "episode" ||
      video.currentEpisode !== undefined ||
      video.seasons !== undefined;

    let seasonNumber = null;
    let episodeNumber = null;
    let episodeTitle = null;

    // For TV shows, find current episode in seasons array
    if (isEpisode && video.seasons && video.currentEpisode) {
      const currentEpisodeId = video.currentEpisode;

      // Search through seasons to find the current episode
      for (const season of video.seasons) {
        if (season.episodes) {
          for (const episode of season.episodes) {
            if (
              episode.episodeId === currentEpisodeId ||
              episode.id === currentEpisodeId
            ) {
              seasonNumber = season.seq || null;
              episodeNumber = episode.seq || null;
              episodeTitle = episode.title || null;
              break;
            }
          }
        }
        if (seasonNumber !== null) break;
      }
    }

    const result = {
      title: video.title,
      type: isEpisode ? "episode" : "movie",
      seasonNumber: seasonNumber,
      episodeNumber: episodeNumber,
      episodeTitle: episodeTitle,
      netflixId: sessionKey,
    };

    return result;
  } catch (error) {
    console.error("[Netflix Injected] Error extracting metadata:", error);
    return null;
  }
}

// Export Netflix player interface to window
window.skipitNetflixPlayer = {
  getCurrentTime: getCurrentTime,
  seek: seek,
  isReady: isNetflixPlayerReady,
};


// ============================================================================
// SKIPIT FAB BUTTON (Quick Skip Access)
// ============================================================================

/**
 * Create the Skipit FAB button element
 * New 3-line structure: label, types, content
 */
function createSkipitFAB() {
  const button = document.createElement("button");
  button.id = FAB_BUTTON_ID;
  button.className =
    "skipit-fab" + (isAuthenticated ? " disabled" : " locked");
  button.setAttribute(
    "aria-label",
    isAuthenticated ? "Skip content with Skipit" : "Sign in to skip content"
  );

  // Create lock icon (hidden when authenticated)
  const lockIcon = document.createElement("span");
  lockIcon.className = "skipit-locked-icon";
  lockIcon.style.display = isAuthenticated ? "none" : "flex";
  lockIcon.appendChild(createLockIconSVG());

  // "Skipit" branding label (top line)
  const label = document.createElement("span");
  label.className = "skipit-fab-label";
  label.textContent = "Skipit \u23E9\uFE0E";

  // Skip types line (subtitle - bottom line)
  const typesLine = document.createElement("span");
  typesLine.className = "skipit-fab-types";
  typesLine.textContent = isAuthenticated ? "Detecting content..." : "Sign in to skip";

  button.appendChild(lockIcon);
  button.appendChild(label);
  button.appendChild(typesLine);
  button.addEventListener("click", handleSkipitFABClick);

  return button;
}

/**
 * Handle Skipit FAB button click
 */
function handleSkipitFABClick(event) {
  event.preventDefault();
  event.stopPropagation();

  // Check authentication first (but allow stopping if already skipping)
  if (!isAuthenticated && !fabSkippingActive) {
    window.postMessage({ type: "SKIPIT_OPEN_AUTH_POPUP" }, "*");
    return;
  }

  // If no skips available and not currently skipping, don't proceed (disabled state)
  if (availableSkipTypes.length === 0 && !fabSkippingActive) {
    return;
  }

  const metadata = extractNetflixMetadata();
  lastMetadata = metadata;

  if (fabSkippingActive) {
    // Currently skipping - stop it (toggle behavior)
    window.postMessage(
      {
        type: "SKIPIT_STOP_REQUEST",
      },
      "*"
    );
  } else {
    // Not skipping - check if we can auto-start or need to show quick panel
    if (availableSkipTypes.length === 1) {
      // Single category available - auto-start skipping immediately (no quick panel)
      const singleType = availableSkipTypes[0];
      window.postMessage(
        {
          type: "SKIPIT_AUTO_START_SKIPPING",
          metadata: metadata,
          skipType: singleType,
        },
        "*"
      );
    } else {
      // Multiple categories - open the quick panel for user selection
      // Track fullscreen state, pause video, exit fullscreen first
      wasFullscreenBeforeModal = !!document.fullscreenElement;
      pauseVideo();
      exitFullscreenIfActive().then(() => {
        window.postMessage(
          {
            type: "SKIPIT_FAB_CLICKED",
            metadata: metadata,
          },
          "*"
        );
      });
    }
  }
}

/**
 * Update FAB button display based on metadata, skip state, and available types
 * @param {Object} metadata - Netflix content metadata
 * @param {boolean} isSkipping - Whether skipping is currently active
 * @param {Array} skipTypes - Array of available skip types (optional)
 */
function updateSkipitFAB(metadata, isSkipping, skipTypes = null) {
  const button = document.getElementById(FAB_BUTTON_ID);
  if (!button) return;

  const typesLine = button.querySelector(".skipit-fab-types");

  if (!typesLine) return;

  fabSkippingActive = isSkipping;

  // Update available skip types if provided
  if (skipTypes !== null) {
    availableSkipTypes = skipTypes;
  }

  if (isSkipping) {
    // Active skipping state - red background
    // Use activeSkippingTypes (what's actually being skipped), not availableSkipTypes
    button.classList.add("active");
    button.classList.remove("disabled");
    const typeText = formatSkipTypes(activeSkippingTypes);
    typesLine.textContent = typeText
      ? activeSkippingTypes.length >= 3
        ? `Skipping ${typeText}`
        : `Skipping ${typeText} scenes`
      : "Skipping";
  } else if (availableSkipTypes && availableSkipTypes.length > 0) {
    // Has skips available - show skip types
    button.classList.remove("active", "disabled");
    const typeText = formatSkipTypes(availableSkipTypes);
    typesLine.textContent = availableSkipTypes.length >= 3
      ? `Skip ${typeText}`
      : `Skip ${typeText} scenes`;
  } else if (loadingStatus === "not_recognized") {
    // Content couldn't be matched
    button.classList.remove("active");
    button.classList.add("disabled");
    typesLine.textContent = "Content not recognized";
  } else if (loadingStatus !== "ready") {
    // Still loading - show specific loading status
    button.classList.remove("active", "disabled");
    const statusText = {
      "detecting": "Detecting content...",
      "loading": "Loading skips..."
    };
    typesLine.textContent = statusText[loadingStatus] || "Loading...";
  } else if (isContentClean) {
    // Content marked as clean by admin
    button.classList.remove("active");
    button.classList.add("disabled");
    typesLine.textContent = "No skips (clean)";
  } else {
    // No skips available - disabled state
    button.classList.remove("active");
    button.classList.add("disabled");
    typesLine.textContent = "No skips yet";
  }
}

/**
 * Update both FAB and Mark button visual states based on auth
 * Called when auth state changes
 */
function updateButtonsAuthState(authenticated) {
  isAuthenticated = authenticated;

  // Update Mark Scene button
  const markButton = document.getElementById(BUTTON_ID);
  if (markButton) {
    if (authenticated) {
      markButton.classList.remove("locked");
      markButton.setAttribute("aria-label", "Mark scene");
      const lockIcon = markButton.querySelector(".skipit-locked-icon");
      if (lockIcon) lockIcon.style.display = "none";
      const label = markButton.querySelector(".skipit-mark-label");
      if (label && !markingState.isMarking) label.textContent = "Mark scene";
    } else {
      markButton.classList.add("locked");
      markButton.setAttribute("aria-label", "Sign in to contribute");
      const lockIcon = markButton.querySelector(".skipit-locked-icon");
      if (lockIcon) lockIcon.style.display = "flex";
      const label = markButton.querySelector(".skipit-mark-label");
      if (label && !markingState.isMarking) label.textContent = "Sign in";
    }
  }

  // Update FAB button
  const fabButton = document.getElementById(FAB_BUTTON_ID);
  if (fabButton) {
    if (authenticated) {
      fabButton.classList.remove("locked");
      fabButton.setAttribute("aria-label", "Skip content with Skipit");
      const lockIcon = fabButton.querySelector(".skipit-locked-icon");
      if (lockIcon) lockIcon.style.display = "none";

      // Re-fetch skip types since initial fetch may have failed due to no auth
      const metadata = extractNetflixMetadata();
      if (metadata) {
        // Reset to loading state and trigger fresh fetch
        availableSkipTypes = [];
        isContentClean = false;
        loadingStatus = "detecting";
        updateSkipitFAB(metadata, fabSkippingActive);

        // Notify content script to re-fetch skip types
        window.postMessage(
          {
            type: "SKIPIT_METADATA_READY",
            data: { metadata },
          },
          "*"
        );
      } else {
        updateSkipitFAB(null, fabSkippingActive);
      }
    } else {
      fabButton.classList.add("locked");
      fabButton.setAttribute("aria-label", "Sign in to skip content");
      const lockIcon = fabButton.querySelector(".skipit-locked-icon");
      if (lockIcon) lockIcon.style.display = "flex";
      // Update FAB for locked state
      const typesLine = fabButton.querySelector(".skipit-fab-types");
      if (typesLine) typesLine.textContent = "Sign in to skip";
    }
  }
}


// ============================================================================
// MARK SCENE BUTTON
// ============================================================================

/**
 * Create the mark button element
 */
function createMarkButton() {
  const button = document.createElement("button");
  button.id = BUTTON_ID;
  button.className = "skipit-mark-btn" + (isAuthenticated ? "" : " locked");
  button.setAttribute(
    "aria-label",
    isAuthenticated ? "Mark scene" : "Sign in to contribute"
  );

  // Create lock icon (hidden when authenticated)
  const lockIcon = document.createElement("span");
  lockIcon.className = "skipit-locked-icon";
  lockIcon.style.display = isAuthenticated ? "none" : "flex";
  lockIcon.appendChild(createLockIconSVG());

  // Create plus icon (text-based)
  const iconWrapper = document.createElement("span");
  iconWrapper.className = "skipit-mark-icon";
  iconWrapper.textContent = "+";

  // Create label
  const label = document.createElement("span");
  label.className = "skipit-mark-label";
  label.textContent = isAuthenticated ? "Mark scene" : "Sign in";

  button.appendChild(lockIcon);
  button.appendChild(iconWrapper);
  button.appendChild(label);
  button.addEventListener("click", handleMarkButtonClick);

  return button;
}

/**
 * Handle mark button click
 */
function handleMarkButtonClick(event) {
  event.preventDefault();
  event.stopPropagation();

  // Check authentication first
  if (!isAuthenticated) {
    window.postMessage({ type: "SKIPIT_OPEN_AUTH_POPUP" }, "*");
    return;
  }

  const currentTime = getCurrentTime(); // Keep in milliseconds for overlay

  if (!markingState.isMarking) {
    // Start marking - capture start time
    markingState.isMarking = true;
    markingState.startTime = currentTime;
    markingState.endTime = null;

    updateButtonState(true);

    // Notify content script
    window.postMessage(
      {
        type: "SKIPIT_MARK_STARTED",
        startTime: currentTime,
      },
      "*"
    );
  } else {
    // End marking - capture end time
    markingState.endTime = currentTime;
    markingState.isMarking = false;

    let startTime = markingState.startTime;
    let endTime = markingState.endTime;

    // Handle edge cases
    if (startTime === endTime) {
      // Same time - ignore and reset
      resetMarkingState();
      return;
    }

    // If start > end, swap them
    if (startTime > endTime) {
      [startTime, endTime] = [endTime, startTime];
    }

    updateButtonState(false);

    // Track fullscreen state before exiting, pause video and exit fullscreen
    wasFullscreenBeforeModal = !!document.fullscreenElement;
    pauseVideo();
    exitFullscreenIfActive().then(() => {
      // Small delay to let fullscreen exit complete visually
      setTimeout(() => {
        // Get Netflix metadata for auto-detection
        const metadata = extractNetflixMetadata();

        // Notify content script to show overlay
        window.postMessage(
          {
            type: "SKIPIT_MARK_ENDED",
            startTime: startTime,
            endTime: endTime,
            metadata: metadata,
          },
          "*"
        );
      }, 100);
    });
  }
}

/**
 * Update button visual state
 */
function updateButtonState(isRecording) {
  const button = document.getElementById(BUTTON_ID);
  if (!button) return;

  // Update icon (text-based)
  const iconWrapper = button.querySelector(".skipit-mark-icon");
  if (iconWrapper) {
    iconWrapper.textContent = isRecording ? "\u25CF" : "+";
  }

  // Update label
  const label = button.querySelector(".skipit-mark-label");
  if (label) {
    label.textContent = isRecording ? "Marking... tap to end" : "Mark scene";
  }

  if (isRecording) {
    button.classList.add("recording");
  } else {
    button.classList.remove("recording");
  }
}

/**
 * Reset marking state
 */
function resetMarkingState() {
  markingState.isMarking = false;
  markingState.startTime = null;
  markingState.endTime = null;
  updateButtonState(false);
}


// ============================================================================
// BUTTON INJECTION AND VISIBILITY
// ============================================================================

/**
 * Inject Skipit buttons wrapper - positioned above Netflix's skip buttons
 * Only injects on /watch/ pages (not browse page with auto-playing trailers)
 */
function injectSkipitButtons() {
  // Don't inject if already exists
  if (document.getElementById(WRAPPER_ID)) return;

  // Only inject on watch pages (not browse page with auto-playing trailers)
  const videoIdFromUrl = getVideoIdFromUrl();
  if (!videoIdFromUrl) {
    return;
  }

  // Find the video element first
  const video = document.querySelector("video");
  if (!video) return;

  // Find player container
  let playerContainer =
    video.closest(".watch-video--player-view") ||
    video.closest('[data-uia="video-canvas"]')?.parentElement ||
    video.closest(".nf-player-container") ||
    video.parentElement?.parentElement?.parentElement ||
    document.querySelector(".watch-video") ||
    document.querySelector('[data-uia="player"]');

  if (!playerContainer) return;

  // Inject styles
  injectStyles();

  // Ensure player container has relative positioning for absolute children
  const playerStyle = getComputedStyle(playerContainer);
  if (playerStyle.position === "static") {
    playerContainer.style.position = "relative";
  }

  // Create wrapper with both buttons
  const wrapper = document.createElement("div");
  wrapper.id = WRAPPER_ID;

  // Create FAB button (top)
  const fabButton = createSkipitFAB();
  wrapper.appendChild(fabButton);

  // Create Mark button (bottom)
  const markButton = createMarkButton();
  wrapper.appendChild(markButton);

  // Append to player container (positioned above Netflix's skip buttons via CSS)
  playerContainer.appendChild(wrapper);

  // Update FAB with metadata if available
  const metadata = extractNetflixMetadata();
  if (metadata) {
    lastMetadata = metadata;
    if (lastNetflixId === null) {
      lastNetflixId = metadata.netflixId;
      loadingStatus = "detecting";
      window.postMessage(
        {
          type: "SKIPIT_METADATA_READY",
          data: { metadata },
        },
        "*"
      );
    }
    updateSkipitFAB(metadata, fabSkippingActive);
  }

  // Start watching visibility
  watchButtonsVisibility();
}

/**
 * Show/hide buttons based on mouse activity (like Netflix controls)
 */
function watchButtonsVisibility() {
  const wrapper = document.getElementById(WRAPPER_ID);
  if (!wrapper) return;

  const HIDE_DELAY = 4000; // 4 seconds, matches Netflix
  let hideTimeout = null;
  let isHoveringButtons = false;

  function showButtons() {
    wrapper.classList.add("visible");
  }

  function hideButtons() {
    wrapper.classList.remove("visible");
  }

  function shouldStayVisible() {
    // Stay visible if: video paused, hovering our buttons, or marking
    const video = document.querySelector("video");
    const isPaused = video && video.paused;
    return isPaused || isHoveringButtons || markingState.isMarking;
  }

  function scheduleHide() {
    clearTimeout(hideTimeout);
    if (!shouldStayVisible()) {
      hideTimeout = setTimeout(hideButtons, HIDE_DELAY);
    }
  }

  function onMouseMove() {
    showButtons();
    scheduleHide();
  }

  // Track hover state on our buttons
  wrapper.addEventListener("mouseenter", () => {
    isHoveringButtons = true;
    clearTimeout(hideTimeout);
    showButtons();
  });

  wrapper.addEventListener("mouseleave", () => {
    isHoveringButtons = false;
    scheduleHide();
  });

  // Listen for mouse movement on the player area
  const playerContainer =
    document.querySelector(".watch-video") ||
    document.querySelector(".nf-player-container") ||
    document.body;

  playerContainer.addEventListener("mousemove", onMouseMove);

  // Handle video pause/play state changes
  const video = document.querySelector("video");
  if (video) {
    video.addEventListener("pause", () => {
      clearTimeout(hideTimeout);
      showButtons();
    });
    video.addEventListener("play", scheduleHide);
  }

  // Check Netflix skip button position (keep this part)
  function updateSkipButtonPosition() {
    const netflixSkipContainer = document.querySelector(
      ".watch-video--skip-content"
    );
    const hasNetflixSkipButton =
      netflixSkipContainer && netflixSkipContainer.children.length > 0;
    wrapper.classList.toggle("netflix-skip-visible", hasNetflixSkipButton);
  }

  updateSkipButtonPosition();
  setInterval(updateSkipButtonPosition, 500);

  // Start visible, then schedule hide
  showButtons();
  scheduleHide();
}

/**
 * Start watching for player and re-inject buttons when needed
 */
function startButtonWatcher() {
  // Prevent duplicate watchers (memory leak prevention)
  if (buttonWatcherInitialized) {
    return;
  }
  buttonWatcherInitialized = true;

  // Initial injection attempt
  injectSkipitButtons();

  // Watch for DOM changes (Netflix recreates player elements frequently)
  const observer = new MutationObserver(() => {
    // Check if wrapper still exists
    if (!document.getElementById(WRAPPER_ID)) {
      injectSkipitButtons();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Also check periodically as backup
  setInterval(() => {
    if (!document.getElementById(WRAPPER_ID)) {
      injectSkipitButtons();
    }
  }, 2000);
}


// ============================================================================
// TIMELINE SEGMENTS
// ============================================================================

/**
 * Get the timeline bar element and its duration
 * Returns: { timelineBar, duration } or null if not found
 */
function getTimelineInfo() {
  const timeline = document.querySelector('[data-uia="timeline"]');
  if (!timeline) return null;

  const timelineBar = document.querySelector('[data-uia="timeline-bar"]');
  if (!timelineBar) return null;

  const duration = parseInt(timeline.getAttribute("max"), 10);
  if (!duration || isNaN(duration)) return null;

  return { timeline, timelineBar, duration };
}

/**
 * Render timeline segments for active timestamps
 * @param {Array} timestamps - Array of [start_ms, end_ms, type?] or {start, end, type?}
 */
function renderTimelineSegments(timestamps) {
  // GUARD: Don't render if skipping is not active
  // This prevents stale segments from setTimeout retries after stopSkipChecking()
  if (!fabSkippingActive || skippingForVideoIdFromUrl === null) {
    return;
  }

  if (!timestamps || timestamps.length === 0) {
    removeTimelineSegments();
    return;
  }

  const info = getTimelineInfo();
  if (!info) {
    // Retry after a short delay (Netflix may still be loading)
    setTimeout(() => renderTimelineSegments(timestamps), 500);
    return;
  }

  const { timelineBar, duration } = info;
  const barWidth = timelineBar.offsetWidth;

  if (barWidth === 0) {
    // Bar not visible yet, retry
    setTimeout(() => renderTimelineSegments(timestamps), 500);
    return;
  }

  // Remove existing segments container
  removeTimelineSegments();

  // Create segments container
  const container = document.createElement("div");
  container.id = SEGMENTS_CONTAINER_ID;
  container.className = "skipit-timeline-segments";

  // Create segments for each timestamp
  timestamps.forEach((timestamp, index) => {
    // Handle both array format [start, end, type?] and object format
    let startMs, endMs, skipType;

    if (Array.isArray(timestamp)) {
      startMs = timestamp[0];
      endMs = timestamp[1];
      skipType = timestamp[2] || "default";
    } else {
      startMs = timestamp.start || timestamp.start_time * 1000;
      endMs = timestamp.end || timestamp.end_time * 1000;
      skipType = timestamp.type || timestamp.skipType || "default";
    }

    // Calculate position and width as percentages
    const leftPercent = (startMs / duration) * 100;
    const widthPercent = ((endMs - startMs) / duration) * 100;

    // Create human-readable label for tooltip
    const typeLabels = {
      nudity: "Nudity",
      sex: "Sex",
      gore: "Gore",
      default: "Skip",
    };
    const label = typeLabels[skipType] || "Skip";

    // Create segment element
    const segment = document.createElement("div");
    segment.className = `skipit-segment skipit-segment--${skipType || "default"}`;
    segment.style.left = `${leftPercent}%`;
    segment.style.width = `${widthPercent}%`;
    segment.dataset.index = index;
    segment.dataset.start = startMs;
    segment.dataset.end = endMs;
    segment.dataset.type = skipType || "default";
    segment.dataset.label = label;

    container.appendChild(segment);
  });

  // Insert container into the timeline-bar element
  // The container is positioned with bottom: 100% so it appears above the bar
  timelineBar.style.position = "relative";
  timelineBar.appendChild(container);

  // Set up resize observer to update segments when bar size changes
  setupSegmentsResizeObserver(timelineBar);

  // Set up observer for timeline recreation
  setupTimelineObserver(timestamps);
}

/**
 * Remove timeline segments from the DOM
 */
function removeTimelineSegments() {
  const container = document.getElementById(SEGMENTS_CONTAINER_ID);
  if (container) {
    container.remove();
  }

  // Clean up observers
  if (segmentsResizeObserver) {
    segmentsResizeObserver.disconnect();
    segmentsResizeObserver = null;
  }

  if (segmentsTimelineObserver) {
    segmentsTimelineObserver.disconnect();
    segmentsTimelineObserver = null;
  }
}

/**
 * Set up ResizeObserver to update segment positions when timeline resizes
 */
function setupSegmentsResizeObserver(timelineBar) {
  if (segmentsResizeObserver) {
    segmentsResizeObserver.disconnect();
  }

  segmentsResizeObserver = new ResizeObserver(() => {
    // Segments use percentage positioning, so they auto-resize
  });

  segmentsResizeObserver.observe(timelineBar);
}

/**
 * Render pending timeline segments for verification
 * @param {Array} pendingSkipsData - Array of { id, startTime, endTime, type }
 */
function renderPendingTimelineSegments(pendingSkipsData) {
  if (!pendingSkipsData || pendingSkipsData.length === 0) {
    removePendingTimelineSegments();
    return;
  }

  const info = getTimelineInfo();
  if (!info) {
    setTimeout(() => renderPendingTimelineSegments(pendingSkipsData), 500);
    return;
  }

  const { timelineBar, duration } = info;
  const barWidth = timelineBar.offsetWidth;

  if (barWidth === 0) {
    setTimeout(() => renderPendingTimelineSegments(pendingSkipsData), 500);
    return;
  }

  // Remove existing pending segments
  removePendingTimelineSegments();

  const container = document.createElement("div");
  container.id = PENDING_SEGMENTS_CONTAINER_ID;
  container.className = "skipit-timeline-segments skipit-timeline-segments--pending-container";

  pendingSkipsData.forEach((skip, index) => {
    const startMs = skip.startTime;
    const endMs = skip.endTime;
    const skipType = skip.type || "pending";

    const leftPercent = (startMs / duration) * 100;
    const widthPercent = ((endMs - startMs) / duration) * 100;

    const typeLabels = {
      Nudity: "Nudity (unverified)",
      nudity: "Nudity (unverified)",
      Sex: "Sex (unverified)",
      sex: "Sex (unverified)",
      Gore: "Gore (unverified)",
      gore: "Gore (unverified)",
    };
    const label = typeLabels[skipType] || "Unverified skip";

    const segment = document.createElement("div");
    segment.className = "skipit-segment skipit-segment--pending";
    segment.style.left = `${leftPercent}%`;
    segment.style.width = `${widthPercent}%`;
    segment.dataset.index = index;
    segment.dataset.start = startMs;
    segment.dataset.end = endMs;
    segment.dataset.type = skipType;
    segment.dataset.label = label;
    segment.dataset.skipId = skip.id;

    // Click handler: seek to 3s before segment start
    segment.addEventListener("click", (e) => {
      e.stopPropagation();
      const seekTo = Math.max(0, startMs - VOTE_PROMPT_LEAD_TIME);
      seek(seekTo);
    });

    container.appendChild(segment);
  });

  timelineBar.style.position = "relative";
  timelineBar.appendChild(container);

  // Set up observer for timeline recreation (same pattern as active segments)
  setupPendingTimelineObserver(pendingSkipsData);
}

/**
 * Remove pending timeline segments
 */
function removePendingTimelineSegments() {
  const container = document.getElementById(PENDING_SEGMENTS_CONTAINER_ID);
  if (container) {
    container.remove();
  }
  pendingSegmentsRendered = false;

  if (pendingSegmentsTimelineObserver) {
    pendingSegmentsTimelineObserver.disconnect();
    pendingSegmentsTimelineObserver = null;
  }
}

/**
 * Set up MutationObserver to re-render pending segments if timeline is recreated
 */
function setupPendingTimelineObserver(pendingSkipsData) {
  if (pendingSegmentsTimelineObserver) {
    pendingSegmentsTimelineObserver.disconnect();
  }

  // Capture the video ID at the time pending segments were rendered
  const videoIdAtRender = getVideoIdFromUrl();

  pendingSegmentsTimelineObserver = new MutationObserver(() => {
    if (!document.getElementById(PENDING_SEGMENTS_CONTAINER_ID)) {
      // Check if video changed -> if so, clean up instead of re-rendering
      const currentVideoId = getVideoIdFromUrl();
      if (currentVideoId !== videoIdAtRender) {
        pendingSkips = [];
        removePendingTimelineSegments();
        stopPendingSkipChecker();
        return;
      }

      // Same video, re-render if we still have pending skips
      if (pendingSkips.length > 0) {
        renderPendingTimelineSegments(pendingSkips);
      }
    }
  });

  pendingSegmentsTimelineObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Set up MutationObserver to re-render segments if timeline is recreated
 */
function setupTimelineObserver(timestamps) {
  if (segmentsTimelineObserver) {
    segmentsTimelineObserver.disconnect();
  }

  segmentsTimelineObserver = new MutationObserver(() => {
    // Check if our segments container was removed
    if (!document.getElementById(SEGMENTS_CONTAINER_ID)) {
      // Only re-render if we're still on the same video (by URL video ID)
      const currentVideoId = getVideoIdFromUrl();

      if (skippingForVideoIdFromUrl === null) {
        // No active skipping, nothing to do
        return;
      }

      if (currentVideoId !== skippingForVideoIdFromUrl) {
        // Video changed - user navigated away. Stop skipping immediately.
        stopSkipChecking();
        return;
      }

      // Same video, safe to re-render using original unmerged timestamps for per-type colors
      if (originalTimestamps.length > 0) {
        renderTimelineSegments(originalTimestamps);
      }
    }
  });

  // Observe the body for major DOM changes
  segmentsTimelineObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}


// ============================================================================
// SKIP CHECKING
// ============================================================================

/**
 * Merge overlapping/adjacent timestamps into continuous ranges.
 * Prevents frame cuts when consecutive scenes of different types
 * (e.g., nudity then sex) are both being skipped.
 */
function mergeOverlappingTimestamps(timestamps) {
  if (timestamps.length <= 1) return timestamps;

  const sorted = [...timestamps].sort((a, b) => a[0] - b[0]);
  const merged = [[sorted[0][0], sorted[0][1], sorted[0][2]]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
      // Combine types (deduplicated)
      const types = new Set(last[2].split(",").concat(current[2].split(",")));
      last[2] = [...types].join(",");
    } else {
      merged.push([current[0], current[1], current[2]]);
    }
  }

  return merged;
}

/**
 * Start checking for timestamps to skip
 * This is the ONLY function that should activate skipping state
 */
function startSkipChecking(timestamps) {
  // Get current video ID from URL and metadata
  const videoIdFromUrl = getVideoIdFromUrl();
  const metadata = extractNetflixMetadata();

  if (!videoIdFromUrl) {
    console.warn(
      "[Netflix Injected] Cannot start skipping - not on a /watch/ page"
    );
    return;
  }

  // Extract unique skip types from timestamps being skipped
  const types = [...new Set(timestamps.map((t) => t[2] || "default"))];
  activeSkippingTypes = types; // Track what's actually being skipped

  // Store originals for timeline rendering, merge overlapping for skip logic
  originalTimestamps = timestamps;
  activeTimestamps = mergeOverlappingTimestamps(timestamps);
  skippingForVideoIdFromUrl = videoIdFromUrl; // URL-based video ID is the source of truth
  fabSkippingActive = true;
  if (metadata?.netflixId) {
    lastNetflixId = metadata.netflixId;
  }

  // Clear existing interval if any
  if (skipCheckInterval) {
    clearInterval(skipCheckInterval);
  }

  // Update FAB to show skipping is active (uses activeSkippingTypes internally)
  updateSkipitFAB(metadata, true);

  // Render timeline segments to visualize skip zones
  renderTimelineSegments(timestamps);

  // Check every 50ms for timestamps to skip
  skipCheckInterval = setInterval(() => {
    if (!isNetflixPlayerReady()) return;

    try {
      const currentTime = getCurrentTime();

      // Send current time to content script for monitoring
      window.postMessage(
        {
          type: "SKIPIT_CURRENT_TIME",
          currentTime: currentTime,
        },
        "*"
      );

      // Check if we should skip
      const now = Date.now();
      if (now - lastSkipTime < SKIP_COOLDOWN) {
        // Recently skipped, wait for cooldown
        return;
      }

      for (let i = 0; i < activeTimestamps.length; i++) {
        const timestamp = activeTimestamps[i];
        const start = timestamp[0];
        const end = timestamp[1];
        const skipType = timestamp[2] || "default"; // Single type string

        if (currentTime >= start && currentTime < end) {
          // Auto-skip the content
          seek(end);
          lastSkipTime = now;

          // Show notification
          showSkipNotification(skipType, start, end);

          break; // Only skip one timestamp at a time
        }
      }
    } catch (error) {
      console.error("[Netflix Injected] Error in skip check:", error);
    }
  }, 50); // Check every 50ms
}

// ============================================================================
// PENDING SKIP CHECKER (for verification voting)
// ============================================================================

/**
 * Start checking for pending skips to show vote prompts
 * Runs on a separate 100ms interval
 */
function startPendingSkipChecker() {
  if (pendingSkipCheckInterval) {
    clearInterval(pendingSkipCheckInterval);
  }

  pendingSkipCheckInterval = setInterval(() => {
    if (!isNetflixPlayerReady()) return;
    if (pendingSkips.length === 0) return;

    try {
      const currentTime = getCurrentTime();
      let shouldShowPrompt = false;

      for (let i = 0; i < pendingSkips.length; i++) {
        const skip = pendingSkips[i];

        const promptStart = skip.startTime - VOTE_PROMPT_LEAD_TIME;

        // Auto-dismiss if past endTime (don't permanently dismiss because user may seek back)
        if (activeVotePromptSkipId === skip.id && currentTime >= skip.endTime) {
          hideVotePrompt();
          shouldShowPrompt = false;
          break;
        }

        // If we have an active prompt for a different skip, ignore others
        if (activeVotePromptSkipId !== null && activeVotePromptSkipId !== skip.id) continue;

        // Show prompt when within [startTime - 3s, endTime)
        if (currentTime >= promptStart && currentTime < skip.endTime) {
          showVotePrompt(skip);
          shouldShowPrompt = true;
          break;
        }
      }

      // If no skip matched but a prompt is showing, user seeked out of range then dismiss it
      if (!shouldShowPrompt && activeVotePromptSkipId !== null) {
        hideVotePrompt();
      }
    } catch (error) {
      console.error("[Netflix Injected] Error in pending skip check:", error);
    }
  }, 100);
}

/**
 * Stop the pending skip checker
 */
function stopPendingSkipChecker() {
  if (pendingSkipCheckInterval) {
    clearInterval(pendingSkipCheckInterval);
    pendingSkipCheckInterval = null;
  }
  hideVotePrompt();
}

/**
 * Stop checking for timestamps
 * This is the ONLY function that should deactivate skipping state
 */
function stopSkipChecking() {
  // Clear interval
  if (skipCheckInterval) {
    clearInterval(skipCheckInterval);
    skipCheckInterval = null;
  }

  // Clear skipping state (but preserve availableSkipTypes - they're still in DB)
  activeTimestamps = [];
  originalTimestamps = [];
  skippingForVideoIdFromUrl = null;
  fabSkippingActive = false;
  activeSkippingTypes = []; // Clear what was being skipped
  // Note: Don't clear availableSkipTypes here - video change detection handles that

  // Remove timeline segments
  removeTimelineSegments();

  // Clean up pending skips
  pendingSkips = [];
  removePendingTimelineSegments();
  stopPendingSkipChecker();

  // Clean up notification
  cleanupNotification();

  // Update FAB to show skipping is NOT active (preserves available skip types)
  const metadata = extractNetflixMetadata();
  if (metadata) {
    updateSkipitFAB(metadata, false);
  }
}


// ============================================================================
// SKIP NOTIFICATIONS
// ============================================================================

/**
 * Get or create the notification element
 */
function getOrCreateNotification() {
  let notification = document.getElementById(NOTIFICATION_ID);
  if (notification) return notification;

  // Find player container
  const video = document.querySelector("video");
  if (!video) return null;

  let playerContainer =
    video.closest(".watch-video--player-view") ||
    video.closest('[data-uia="video-canvas"]')?.parentElement ||
    document.querySelector(".watch-video") ||
    video.parentElement?.parentElement?.parentElement;

  if (!playerContainer) return null;

  // Create notification element
  notification = document.createElement("div");
  notification.id = NOTIFICATION_ID;
  notification.className = "skipit-notification";

  playerContainer.appendChild(notification);
  return notification;
}

/**
 * Build notification content using safe DOM methods
 */
function buildNotificationContent(notification, skipType, startMs, endMs) {
  // Clear existing content
  notification.textContent = "";

  const formattedType = skipType && skipType.includes(",")
    ? formatSkipTypes(skipType.split(","))
    : (formatSkipType(skipType) || "content");

  // Create header container
  const headerDiv = document.createElement("div");
  headerDiv.className = "skipit-notification-header";

  // Create icon container - use first type for styling when multiple types are merged
  const iconType = skipType && skipType.includes(",") ? skipType.split(",")[0] : (skipType || "default");
  const iconDiv = document.createElement("div");
  iconDiv.className = `skipit-notification-icon skipit-notification-icon--${iconType}`;

  // Create SVG icon
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z");
  svg.appendChild(path);
  iconDiv.appendChild(svg);

  // Create text container
  const textDiv = document.createElement("div");
  textDiv.className = "skipit-notification-text";

  // Create title with type
  const titleSpan = document.createElement("span");
  titleSpan.className = "skipit-notification-title";
  titleSpan.textContent = `Skipped ${formattedType} scene`;

  // Create time range
  const timeSpan = document.createElement("span");
  timeSpan.className = "skipit-notification-time";
  timeSpan.textContent = `${formatTimeMs(startMs)} \u2192 ${formatTimeMs(endMs)}`;

  textDiv.appendChild(titleSpan);
  textDiv.appendChild(timeSpan);

  headerDiv.appendChild(iconDiv);
  headerDiv.appendChild(textDiv);
  notification.appendChild(headerDiv);
}

/**
 * Show skip notification
 * @param {string} skipType - Single type string like 'nudity', 'sex', or 'gore'
 * @param {number} startMs - Start time in milliseconds
 * @param {number} endMs - End time in milliseconds
 */
function showSkipNotification(skipType, startMs, endMs) {
  // Check cooldown for this specific segment
  const now = Date.now();
  if (
    lastNotifiedSegment &&
    lastNotifiedSegment.start === startMs &&
    lastNotifiedSegment.end === endMs &&
    now - lastNotifiedSegment.timestamp < SEGMENT_COOLDOWN
  ) {
    return;
  }

  // Update last notified segment
  lastNotifiedSegment = { start: startMs, end: endMs, timestamp: now };

  const notification = getOrCreateNotification();
  if (!notification) return;

  // Clear existing timeout
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  // Build notification content
  buildNotificationContent(notification, skipType, startMs, endMs);

  // Show notification
  requestAnimationFrame(() => {
    notification.classList.add("visible");
  });

  // Auto-dismiss
  notificationTimeout = setTimeout(() => {
    hideSkipNotification();
  }, NOTIFICATION_DURATION);
}

/**
 * Hide skip notification
 */
function hideSkipNotification() {
  const notification = document.getElementById(NOTIFICATION_ID);
  if (notification) {
    notification.classList.remove("visible");
  }

  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
}

// ============================================================================
// VOTE PROMPT FOR PENDING SKIPS
// ============================================================================

const VOTE_PROMPT_ID = "skipit-vote-prompt";

/**
 * Show vote prompt for a pending skip
 */
function showVotePrompt(skip) {
  // Don't show if already showing for this skip AND element still exists in DOM
  // (Netflix UI updates during seeking can remove foreign DOM elements)
  if (activeVotePromptSkipId === skip.id && document.getElementById(VOTE_PROMPT_ID)) return;

  // Remove any existing prompt
  hideVotePrompt();

  activeVotePromptSkipId = skip.id;

  // Find player container
  const video = document.querySelector("video");
  if (!video) return;

  let playerContainer =
    video.closest(".watch-video--player-view") ||
    video.closest('[data-uia="video-canvas"]')?.parentElement ||
    document.querySelector(".watch-video") ||
    video.parentElement?.parentElement?.parentElement;

  if (!playerContainer) return;

  // Create prompt element (mirrors .skipit-notification structure)
  const prompt = document.createElement("div");
  prompt.id = VOTE_PROMPT_ID;
  prompt.className = "skipit-vote-prompt";

  // Row 1: [icon circle] [title + time] — same as active skip notification
  const headerDiv = document.createElement("div");
  headerDiv.className = "skipit-vote-header";

  const typeLabel = formatSkipType(skip.type) || "default";
  const iconDiv = document.createElement("div");
  iconDiv.className = `skipit-notification-icon skipit-notification-icon--${typeLabel}`;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z");
  svg.appendChild(path);
  iconDiv.appendChild(svg);

  const textDiv = document.createElement("div");
  textDiv.className = "skipit-notification-text";

  const titleSpan = document.createElement("span");
  titleSpan.className = "skipit-notification-title";
  const formattedType = typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);
  titleSpan.textContent = `Unverified ${formattedType} scene`;

  const timeSpan = document.createElement("span");
  timeSpan.className = "skipit-notification-time";
  timeSpan.textContent = `${formatTimeMs(skip.startTime)} \u2192 ${formatTimeMs(skip.endTime)}`;

  textDiv.appendChild(titleSpan);
  textDiv.appendChild(timeSpan);

  headerDiv.appendChild(iconDiv);
  headerDiv.appendChild(textDiv);

  // Row 2: centered buttons
  const buttons = document.createElement("div");
  buttons.className = "skipit-vote-buttons";

  const upvoteBtn = document.createElement("button");
  upvoteBtn.className = "skipit-vote-btn skipit-vote-btn--upvote";
  // Thumbs up icon
  const upIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  upIcon.setAttribute("viewBox", "0 0 24 24");
  upIcon.setAttribute("fill", "currentColor");
  const upPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  upPath.setAttribute("d", "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z");
  upIcon.appendChild(upPath);
  upvoteBtn.appendChild(upIcon);
  const upLabel = document.createElement("span");
  upLabel.textContent = "Upvote & Skip";
  upvoteBtn.appendChild(upLabel);
  upvoteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    handleVote(skip.id, 1, skip.endTime);
  });

  const downvoteBtn = document.createElement("button");
  downvoteBtn.className = "skipit-vote-btn skipit-vote-btn--downvote";
  // Thumbs down icon
  const downIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  downIcon.setAttribute("viewBox", "0 0 24 24");
  downIcon.setAttribute("fill", "currentColor");
  const downPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  downPath.setAttribute("d", "M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z");
  downIcon.appendChild(downPath);
  downvoteBtn.appendChild(downIcon);
  const downLabel = document.createElement("span");
  downLabel.textContent = "Downvote";
  downvoteBtn.appendChild(downLabel);
  downvoteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    handleVote(skip.id, -1, null);
  });

  buttons.appendChild(upvoteBtn);
  buttons.appendChild(downvoteBtn);

  prompt.appendChild(headerDiv);
  prompt.appendChild(buttons);

  playerContainer.appendChild(prompt);

  // Fade in
  requestAnimationFrame(() => {
    prompt.classList.add("visible");
  });
}

/**
 * Hide the vote prompt
 */
function hideVotePrompt() {
  const prompt = document.getElementById(VOTE_PROMPT_ID);
  if (prompt) {
    prompt.classList.remove("visible");
    setTimeout(() => prompt.remove(), 250);
  }
  activeVotePromptSkipId = null;

  if (votePromptTimeout) {
    clearTimeout(votePromptTimeout);
    votePromptTimeout = null;
  }
}

/**
 * Handle a vote action
 */
function handleVote(skipGroupId, voteType, seekToMs) {
  hideVotePrompt();

  // If upvote, seek to end time immediately
  if (voteType === 1 && seekToMs !== null) {
    seek(seekToMs);
  }

  // Send vote to content script (which bridges to background)
  window.postMessage(
    {
      type: "SKIPIT_VOTE_ON_SKIP",
      skipGroupId: skipGroupId,
      voteType: voteType,
      endTime: seekToMs,
    },
    "*"
  );

  // Remove from local pending skips
  pendingSkips = pendingSkips.filter((s) => s.id !== skipGroupId);

  // Re-render pending timeline segments
  renderPendingTimelineSegments(pendingSkips);
}

/**
 * Clean up notification on stop
 */
function cleanupNotification() {
  hideSkipNotification();
  lastNotifiedSegment = null;

  const notification = document.getElementById(NOTIFICATION_ID);
  if (notification) {
    notification.remove();
  }
}


// ============================================================================
// VIDEO CHANGE WATCHER
// ============================================================================

/**
 * Watch for video changes and update FAB accordingly
 */
function startVideoChangeWatcher() {
  // Prevent duplicate watchers (memory leak prevention)
  if (videoChangeWatcherInitialized) {
    return;
  }
  videoChangeWatcherInitialized = true;

  setInterval(() => {
    const metadata = extractNetflixMetadata();
    if (!metadata) return;

    const currentNetflixId = metadata.netflixId;

    // Detect video change
    if (lastNetflixId !== null && currentNetflixId !== lastNetflixId) {
      // Video changed - stop any active skipping (also cleans pending skips)
      if (skippingForVideoIdFromUrl !== null) {
        stopSkipChecking();
      } else if (pendingSkips.length > 0) {
        // Not actively skipping, but pending skips need cleanup
        pendingSkips = [];
        removePendingTimelineSegments();
        stopPendingSkipChecker();
      }

      // Reset marking state for new video (prevents stale timestamps)
      if (markingState.isMarking) {
        resetMarkingState();
      }

      // Update tracking for new video
      lastNetflixId = currentNetflixId;
      lastMetadata = metadata;

      // Reset skip types state for new video
      availableSkipTypes = [];
      isContentClean = false;
      loadingStatus = "detecting";

      // Notify content script that metadata is ready for new video
      window.postMessage(
        {
          type: "SKIPIT_METADATA_READY",
          data: { metadata },
        },
        "*"
      );

      // Update FAB for new video
      updateSkipitFAB(metadata, false);
    } else if (lastNetflixId === null) {
      // First time seeing this video
      lastNetflixId = currentNetflixId;
      lastMetadata = metadata;

      isContentClean = false;
      loadingStatus = "detecting";

      window.postMessage(
        {
          type: "SKIPIT_METADATA_READY",
          data: { metadata },
        },
        "*"
      );

      updateSkipitFAB(metadata, fabSkippingActive);
    } else if (JSON.stringify(metadata) !== JSON.stringify(lastMetadata)) {
      // Same video but metadata changed (e.g., title loaded)
      lastMetadata = metadata;
      updateSkipitFAB(metadata, fabSkippingActive);
    }
  }, 2000);
}


// ============================================================================
// MESSAGE HANDLER
// ============================================================================

/**
 * Set up message listener for content script communication
 */
function setupMessageHandler() {
  window.addEventListener("message", (event) => {
    // Only accept messages from same window
    if (event.source !== window) return;

    const type = event.data.type;
    const data = event.data.data;

    if (type === "SKIPIT_START_SKIP_CHECKING") {
      startSkipChecking(data.timestamps);
    } else if (type === "SKIPIT_STOP_SKIP_CHECKING") {
      stopSkipChecking();
    } else if (type === "SKIPIT_GET_CURRENT_TIME") {
      const currentTime = getCurrentTime();
      window.postMessage(
        {
          type: "SKIPIT_CURRENT_TIME_RESPONSE",
          currentTime: currentTime,
        },
        "*"
      );
    } else if (type === "SKIPIT_RESET_MARKING") {
      // Reset marking state (called after save/cancel)
      resetMarkingState();
    } else if (type === "SKIPIT_UPDATE_FAB_STATE") {
      // Update FAB button state (called when skipping starts/stops)
      const metadata =
        data?.metadata || lastMetadata || extractNetflixMetadata();
      const skipTypes = data?.skipTypes || null;
      updateSkipitFAB(metadata, data?.isSkipping || false, skipTypes);
    } else if (type === "SKIPIT_LOADING_STATUS") {
      // Update loading status from content script
      const status = data?.status;
      if (status) {
        loadingStatus = status;
        if (status !== "ready") {
          isContentClean = false;
        }
        const metadata = lastMetadata || extractNetflixMetadata();
        updateSkipitFAB(metadata, fabSkippingActive);
      }
    } else if (type === "SKIPIT_SET_AVAILABLE_SKIP_TYPES") {
      // Set available skip types before skipping starts (from content script)
      const skipTypes = data?.skipTypes || [];
      const metadata =
        data?.metadata || lastMetadata || extractNetflixMetadata();
      availableSkipTypes = skipTypes;
      isContentClean = data?.isClean || false;
      loadingStatus = "ready"; // Done loading, show actual state
      updateSkipitFAB(metadata, fabSkippingActive, skipTypes);
    } else if (type === "SKIPIT_GET_NETFLIX_METADATA") {
      // Return current Netflix metadata
      const metadata = extractNetflixMetadata();
      window.postMessage(
        {
          type: "SKIPIT_NETFLIX_METADATA",
          metadata: metadata,
        },
        "*"
      );
    } else if (type === "SKIPIT_MODAL_CLOSED") {
      // Modal was closed - restore playback and fullscreen state
      playVideo();
      if (wasFullscreenBeforeModal) {
        enterFullscreen();
        wasFullscreenBeforeModal = false;
      }
    } else if (type === "SKIPIT_AUTH_STATE_UPDATE") {
      // Update auth state from content script
      const authenticated = event.data.data?.isAuthenticated || false;
      updateButtonsAuthState(authenticated);

      // Stop skipping and clean up pending skips when user signs out
      if (!authenticated) {
        if (fabSkippingActive) {
          stopSkipChecking();
        } else if (pendingSkips.length > 0) {
          pendingSkips = [];
          removePendingTimelineSegments();
          stopPendingSkipChecker();
        }
      }
    } else if (type === "SKIPIT_SET_PENDING_SKIPS") {
      // Receive pending skips for verification
      const pendingSkipsData = event.data.data?.pendingSkips || [];
      pendingSkips = pendingSkipsData;

      if (pendingSkips.length > 0) {
        renderPendingTimelineSegments(pendingSkips);
        startPendingSkipChecker();
      }
    } else if (type === "SKIPIT_VOTE_RESULT") {
      // Vote result from content script
      const resultData = event.data.data;
      if (resultData?.success) {
        showSkipNotification("default", 0, 0);
        // Override the notification content to show "Thanks for helping!" with green circle + checkmark
        const notification = document.getElementById(NOTIFICATION_ID);
        if (notification) {
          notification.textContent = "";

          // Green circle with checkmark icon
          const iconDiv = document.createElement("div");
          iconDiv.className = "skipit-thanks-icon";
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("viewBox", "0 0 24 24");
          svg.setAttribute("fill", "currentColor");
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z");
          svg.appendChild(path);
          iconDiv.appendChild(svg);

          const text = document.createElement("span");
          text.className = "skipit-notification-title";
          text.textContent = "Thanks for helping!";

          notification.appendChild(iconDiv);
          notification.appendChild(text);
          notification.classList.add("visible");
          setTimeout(() => {
            notification.classList.remove("visible");
          }, NOTIFICATION_DURATION);
        }
      }
    }
  });
}


// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Notify content script that Netflix player is ready
 */
function notifyPlayerReady() {
  if (isNetflixPlayerReady()) {
    window.postMessage({ type: "SKIPIT_NETFLIX_READY" }, "*");

    // Request auth state check immediately so buttons show correct state
    window.postMessage({ type: "SKIPIT_REQUEST_AUTH_CHECK" }, "*");

    // Start button watchers after player is ready
    startButtonWatcher();
    startVideoChangeWatcher();
  } else {
    // Retry after 500ms
    setTimeout(notifyPlayerReady, 500);
  }
}

// Set up message handler
setupMessageHandler();

// Wait for Netflix player to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", notifyPlayerReady);
} else {
  notifyPlayerReady();
}

}
