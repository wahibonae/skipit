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
  /* No backdrop-filter here: blurring the backdrop makes the compositor read
     back the pixels behind the button, and Netflix's video is a protected
     surface (Edge uses PlayReady hardware DRM, so the readback is refused and
     the whole player paints black while these buttons are visible). The
     backgrounds below are near-opaque, so the blur was barely visible anyway. */
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
  background: rgba(255, 110, 79, 1);
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
  /* No backdrop-filter - see .skipit-mark-btn above. */
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

/* FAB Label row - Skipit wordmark, plus the discreet badge when enabled */
.skipit-fab-label-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ff6f4f;
}
/* Fully opaque: the wordmark inherits this as currentColor, and a dimmed logo
   reads as washed out. The 0.9 here was a holdover from the old text label. */
.skipit-fab.active .skipit-fab-label-row {
  color: #ffffff;
}

/* Wordmark replaces the old "Skipit ⏩︎" text: it already contains the arrows.
   Drawn in a single colour via currentColor, so the row's colour drives it. */
.skipit-fab-logo {
  display: flex;
  align-items: center;
}
.skipit-fab-logo svg {
  height: 16px;
  width: auto;
  display: block;
}

/* Discreet markers - both hidden unless the mode is on. The pill rides the
   label row in the states that keep their text; the caption sits under the
   wordmark on the collapsed tile, where a pill would break the centring. */
.skipit-discreet-badge {
  display: none;
  align-items: center;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.92);
}
.skipit-discreet-caption {
  display: none;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  line-height: 1;
  opacity: 0.72;
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

/* Vote Prompt Styles: mirrors .skipit-notification with added buttons row */
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
/* Strip icon background in vote prompt — show bare icon only */
.skipit-vote-prompt .skipit-notification-icon {
  background: none !important;
}
/* Row 1: icon + text: reuses .skipit-notification-icon and .skipit-notification-text */
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

/* Thanks notification: green circle + checkmark */
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
  width: 12px;
  height: 12px;
}

/* ===========================================
   SEEK BUTTONS (-2s / +2s) - inline row with Mark scene
   =========================================== */
.skipit-mark-row {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}
.skipit-mark-row .skipit-seek-btn[data-delta="2000"] {
  margin-left: 6px;
}
.skipit-mark-row .skipit-mark-btn {
  margin-left: 6px;
}

.skipit-seek-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(26, 26, 26, 0.85);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  padding: 0 10px;
  color: white;
  opacity: 0.8;
  transition: transform 0.12s ease, background 0.2s ease, opacity 0.2s ease;
  /* No backdrop-filter - see .skipit-mark-btn above. */
}
#skipit-buttons-wrapper:hover .skipit-seek-btn:not(.locked) {
  opacity: 1;
}
.skipit-seek-icon { flex: 0 0 auto; }
.skipit-seek-btn:hover { background: rgba(26, 26, 26, 0.95); }
.skipit-seek-btn:active { transform: scale(0.92); }
.skipit-seek-btn.locked { opacity: 0.6; cursor: not-allowed; }
.skipit-seek-btn.locked:active { transform: none; }

/* ===========================================
   NETFLIX STYLE MODIFIER (.style-netflix)
   Applies a white standby / red active palette to FAB, Mark, and Seek buttons.
   Default values are placeholders until exact hex values are provided.
   =========================================== */

/* Skipit FAB */
.skipit-fab.style-netflix {
  background: var(--skipit-netflix-bg-standby, rgba(255, 255, 255, 0.92));
  color: var(--skipit-netflix-text-standby, #141414);
}
.skipit-fab.style-netflix .skipit-fab-label-row,
.skipit-fab.style-netflix .skipit-fab-types {
  color: var(--skipit-netflix-text-standby, #141414);
}
.skipit-fab.style-netflix .skipit-discreet-badge {
  background: rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.75);
}
.skipit-fab.style-netflix:hover {
  background: var(--skipit-netflix-bg-standby-hover, #ffffff);
}
.skipit-fab.style-netflix.active,
.skipit-fab.style-netflix.active:hover {
  background: var(--skipit-netflix-bg-active, #e50914);
  color: #ffffff;
}
.skipit-fab.style-netflix.active .skipit-fab-label-row,
.skipit-fab.style-netflix.active .skipit-fab-types {
  color: #ffffff;
}
.skipit-fab.style-netflix.active .skipit-discreet-badge {
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
}

/* Mark Scene */
.skipit-mark-btn.style-netflix {
  background: var(--skipit-netflix-bg-standby, rgba(255, 255, 255, 0.92));
  color: var(--skipit-netflix-text-standby, #141414);
}
.skipit-mark-btn.style-netflix:hover {
  background: var(--skipit-netflix-bg-standby-hover, #ffffff);
}
.skipit-mark-btn.style-netflix.recording {
  background: var(--skipit-netflix-bg-active, #e50914);
  color: #ffffff;
}
.skipit-mark-btn.style-netflix.recording .skipit-mark-icon {
  color: #ffffff;
}

/* Seek (-2s / +2s) */
.skipit-seek-btn.style-netflix {
  background: var(--skipit-netflix-bg-standby, rgba(255, 255, 255, 0.92));
  color: var(--skipit-netflix-text-standby, #141414);
}
.skipit-seek-btn.style-netflix:hover {
  background: var(--skipit-netflix-bg-standby-hover, #ffffff);
}

/* ==========================================================================
   Discreet mode: the FAB collapses to the Skipit wordmark alone, so no skip
   category is ever named on screen. Composes with both FAB styles.
   ========================================================================== */

/* The .disabled and .locked states are excluded from the tile throughout: their
   wording ("No skips yet", "Content not recognized", "Sign in to skip") names no
   category, and it is the only thing telling the user why the button is dead.
   They keep the full two-line button and instead show the "Discreet" badge, so
   the mode is still visibly on. */
.skipit-fab.discreet.disabled .skipit-discreet-badge,
.skipit-fab.discreet.locked .skipit-discreet-badge {
  display: inline-flex;
}

/* Working states collapse to a tile: the status line goes, the wordmark grows,
   and the caption takes the status line's place under it. */
.skipit-fab.discreet:not(.disabled):not(.locked) .skipit-fab-types {
  display: none;
}
.skipit-fab.discreet:not(.disabled):not(.locked) .skipit-discreet-caption {
  display: block;
}
.skipit-fab.discreet:not(.disabled):not(.locked) .skipit-fab-logo svg {
  height: 26px;
}
/* min-width sets the tile width independently of the wordmark. The two-line
   lockup (wordmark + caption) is close enough in height to the normal button
   that toggling the mode does not shift the stack. */
.skipit-fab.discreet:not(.disabled):not(.locked) {
  min-width: 160px;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12px 26px;
  gap: 6px;
}

/* Loading is the one state that has no colour/opacity hook of its own.
   Needs its own keyframe: skipit-pulse peaks at opacity 1, which would
   override a static opacity and pulse the mark up to full brightness.
   Applied to the whole lockup so the caption pulses with the wordmark. */
@keyframes skipit-logo-pulse {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 0.25; }
}
.skipit-fab.discreet.loading:not(.disabled):not(.locked) .skipit-fab-label-row,
.skipit-fab.discreet.loading:not(.disabled):not(.locked) .skipit-discreet-caption {
  animation: skipit-logo-pulse 1.6s ease-in-out infinite;
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

// FAB visual style: "classic" (default) | "netflix"
let currentFabStyle = "classic";

// Discreet mode: hide skip category names on every ambient on-screen surface
// (FAB, skip toast, vote prompt, timeline tooltip). Composes with currentFabStyle.
let currentDiscreetMode = false;

// Track if we were in fullscreen before opening a modal
let wasFullscreenBeforeModal = false;

// Track if video was playing before opening mark-scene modal
let wasPlayingBeforeMarkModal = false;

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
const VOTE_PROMPT_DISPLAY_DURATION = 5000; // Auto-hide after 5s of playback
let activeVotePromptSkipId = null;
let votePromptTimeout = null;
let votePromptShownForCurrentVisit = false; // Prevents re-show within same segment visit
let votePromptPlayTimeElapsed = 0; // Tracks playing time since prompt was shown
let votePromptLastCheckedTime = -1; // For seek detection
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
 * Skipit wordmark paths, mirrored from src/popup/components/SkipitLogo.tsx.
 * Drawn in a single colour via currentColor so each FAB style/state drives it.
 */
const SKIPIT_LOGO_PATHS = [
  // S
  "M53.923706,182.938858 C45.910275,180.096268 38.267155,177.397995 30.719603,174.454681 C27.240578,173.097977 26.121256,170.803329 28.226728,167.084396 C32.872292,158.878860 37.203308,150.495224 41.761826,141.999451 C46.697880,144.361740 51.326084,146.864365 56.169132,148.840424 C70.594238,154.726166 85.530739,157.166702 101.007004,154.292099 C104.025230,153.731491 107.091705,152.468124 109.695221,150.828918 C115.969963,146.878311 115.713478,138.029205 108.866913,135.284103 C99.517784,131.535660 89.598083,129.232010 80.151573,125.697952 C72.443100,122.814125 64.345253,120.074608 57.693645,115.442322 C42.168049,104.630028 41.635815,86.812485 48.533268,70.635323 C54.986195,55.500740 67.653923,47.239792 82.929909,42.868225 C109.273392,35.329456 135.075485,36.996235 160.191360,48.228279 C163.586746,49.746731 164.640625,51.398167 162.726196,55.003380 C158.381165,63.185863 154.389557,71.556030 150.757751,78.840073 C140.275864,75.909149 130.442169,72.481461 120.323952,70.525360 C110.656685,68.656433 100.781555,69.016312 91.633202,73.777306 C87.666725,75.841545 85.087486,78.883301 84.976662,83.500908 C84.862793,88.245354 87.941399,90.884285 91.903786,92.199455 C101.480530,95.378105 111.153290,98.274223 120.824753,101.158798 C130.439163,104.026360 139.728928,107.444344 146.778503,115.058517 C157.789810,126.951698 155.888672,146.201813 148.706650,158.340469 C138.742905,175.180664 122.503143,182.275879 104.264610,185.308945 C87.556541,188.087494 70.810509,187.332718 53.923706,182.938858 z",
  // k
  "M196.920319,175.178131 C196.355408,178.195541 195.839767,180.789536 195.270691,183.652344 C182.627441,183.652344 170.057404,183.652344 156.634628,183.652344 C166.649307,133.525406 176.611877,83.659225 186.653580,33.396988 C199.315659,33.396988 212.010361,33.396988 225.302185,33.396988 C220.196014,59.006496 215.144058,84.344055 209.808578,111.103615 C213.865280,107.810013 216.988434,105.353188 220.025620,102.794357 C231.063538,93.494972 242.054398,84.139565 253.126099,74.880737 C254.049072,74.108887 255.441711,73.500351 256.620300,73.493065 C271.119080,73.403488 285.618652,73.434143 300.117950,73.466370 C300.694244,73.467651 301.269836,73.793930 302.597992,74.197174 C283.809967,90.388542 265.519653,106.150986 246.697220,122.372032 C258.839264,142.524994 271.000031,162.708969 283.560638,183.556656 C281.501221,183.725388 280.139679,183.930786 278.777679,183.933777 C267.111542,183.959503 255.439758,183.744614 243.782272,184.062866 C239.879288,184.169434 237.865189,182.805481 236.007614,179.580414 C230.141571,169.395905 223.980377,159.381180 217.904404,149.318237 C217.397324,148.478424 216.673126,147.769714 215.949631,146.876404 C205.447479,153.431946 197.083282,161.263321 196.920319,175.178131 z",
  // i (body)
  "M331.792908,150.019348 C329.505371,161.485062 327.298645,172.531982 325.060974,183.733612 C312.369415,183.733612 299.945862,183.733612 286.698120,183.733612 C288.202301,176.044113 289.616699,168.640686 291.102020,161.251541 C296.722473,133.290344 302.401825,105.340881 307.937103,77.362885 C308.413544,74.954704 308.745819,73.351128 311.744934,73.381500 C323.222260,73.497742 334.701508,73.428505 347.113220,73.428505 C341.976440,99.103683 336.925049,124.352127 331.792908,150.019348 z",
  // i (dot)
  "M316.486572,27.507133 C325.226410,19.632277 335.155121,18.344467 345.537659,21.705141 C360.905853,26.679613 361.278656,43.368942 353.225891,52.791763 C345.584991,61.732662 329.867523,63.900536 319.888062,57.720795 C309.693573,51.407902 308.241638,39.506001 316.486572,27.507133 z",
  // p
  "M471.427399,155.426117 C461.500824,171.502884 447.947479,182.040314 429.389923,184.850800 C413.331146,187.282867 398.110046,185.700409 386.312256,171.421417 C385.725006,173.170975 385.155426,174.423615 384.886261,175.737793 C381.857391,190.526749 378.949310,205.341324 375.754639,220.093964 C375.461182,221.449097 373.438354,223.397034 372.181580,223.425323 C360.709045,223.683456 349.228302,223.576996 336.740509,223.576996 C337.781769,217.869308 338.663208,212.592117 339.713837,207.348816 C348.182037,165.086868 356.627625,122.820229 365.216949,80.582848 C367.005341,71.788490 365.517456,73.560112 373.932465,73.455742 C383.411163,73.338173 392.892456,73.428673 402.870667,73.428673 C402.459961,76.482971 402.100464,79.156456 401.640045,82.580627 C403.197845,81.765358 404.218811,81.393936 405.052124,80.771385 C433.025146,59.873508 473.883423,76.770439 478.985352,111.226334 C481.281464,126.733307 478.825195,141.282364 471.427399,155.426117 M395.147614,121.025017 C394.854279,121.974831 394.418304,122.905807 394.290039,123.877411 C393.205994,132.089127 392.020935,140.234802 397.591888,147.633270 C405.314331,157.888992 426.059845,156.436234 434.030304,145.565811 C438.746704,139.133392 440.926758,131.885376 440.828705,124.203194 C440.648529,110.082779 432.856293,102.628250 419.717010,102.618065 C408.158783,102.609108 399.572876,108.895523 395.147614,121.025017 z",
  // i (body 2)
  "M490.626404,133.463654 C494.525299,114.368240 498.229248,95.663475 502.127197,76.999207 C502.407135,75.658707 504.083771,73.608421 505.146271,73.586372 C516.939819,73.341568 528.740356,73.432175 541.120239,73.432175 C533.706360,110.512779 526.398010,147.065231 519.063171,183.750076 C506.340668,183.750076 493.912903,183.750076 480.688141,183.750076 C483.995453,166.898254 487.237091,150.381226 490.626404,133.463654 z",
  // i (dot 2)
  "M510.325745,54.660133 C504.272522,48.436069 503.803986,41.361858 506.477142,34.056076 C509.518280,25.744671 516.390747,21.829741 524.663635,20.506788 C532.420044,19.266422 540.066772,20.198259 546.332275,25.416742 C555.390625,32.961346 554.031494,48.595619 543.779602,56.180939 C534.258911,63.225269 517.434509,62.732269 510.325745,54.660133 z",
  // t
  "M606.506287,154.608719 C606.942139,160.075577 606.677795,165.716751 607.119995,171.301971 C607.382324,174.615067 608.758789,177.839935 609.781555,181.419739 C598.108459,186.361526 585.869629,187.060699 573.666748,184.299774 C555.414368,180.170151 546.034302,164.347229 549.778748,145.067810 C552.182739,132.690369 554.659912,120.327141 557.096130,107.955956 C557.126221,107.802818 557.048950,107.628532 556.925537,106.881424 C552.018127,106.881424 546.975525,106.881424 541.204895,106.881424 C543.247437,96.698807 545.149658,87.215622 547.112854,77.428650 C551.254089,77.428650 555.082214,77.168640 558.857788,77.502426 C562.568298,77.830444 563.721130,76.188171 564.271423,72.831833 C565.398438,65.958862 566.815491,59.126984 568.364807,52.335606 C568.650513,51.083553 570.106323,49.156471 571.050781,49.139496 C583.140869,48.922211 595.236267,48.996101 607.556885,48.996101 C605.756775,58.187386 603.947449,67.425209 602.026123,77.235359 C610.381409,77.235359 618.454712,77.235359 627.106323,77.235359 C625.211426,86.764862 623.540833,95.693031 621.519836,104.541161 C621.310059,105.459473 619.032471,106.438278 617.689026,106.475410 C610.705078,106.668442 603.712891,106.565292 595.999329,106.565292 C593.524719,119.778816 590.696838,132.870483 588.752380,146.092072 C587.752258,152.893005 592.613892,156.746521 599.756592,155.996613 C601.891968,155.772446 603.988770,155.182083 606.506287,154.608719 z",
  // Double arrow
  "M606.909302,154.457947 C606.909302,141.831406 606.909302,129.204865 606.909302,115.996277 C611.849182,115.996277 616.296387,115.875031 620.734131,116.027611 C626.031616,116.209724 629.737793,113.594017 630.692078,108.785446 C632.847534,97.923470 634.527039,86.948051 635.883240,75.955002 C636.496033,70.988548 633.131897,68.047615 628.145813,68.009544 C623.515320,67.974182 618.884399,68.001999 613.896301,68.001999 C614.336060,65.997726 614.686523,64.564751 614.961670,63.117439 C616.016846,57.567093 619.666565,56.166992 624.214905,59.836903 C633.525146,67.348953 642.705261,75.022171 651.950134,82.615440 C663.338928,91.969696 674.739624,101.309502 686.133850,110.657173 C687.383240,111.682175 688.623779,112.717995 690.122925,113.959564 C690.122925,99.003281 690.072632,84.083466 690.155273,69.164406 C690.178345,64.999840 691.417236,61.195747 695.577271,59.311436 C699.982483,57.316048 704.245422,57.411785 708.152649,60.775867 C709.900635,62.280853 712.007874,63.365635 713.775452,64.851234 C726.949036,75.923134 740.062439,87.066544 753.229492,98.146217 C758.167969,102.301781 763.087769,106.492668 768.212646,110.410393 C776.354675,116.634583 776.714600,124.662666 768.851440,131.250198 C748.868164,147.991684 728.842468,164.682571 708.865906,181.432007 C705.030151,184.648087 700.753906,185.336685 696.303528,183.455399 C691.873352,181.582687 690.050354,177.893738 690.082153,173.043015 C690.179138,158.259232 690.117310,143.474411 690.117310,127.989815 C682.913391,133.911942 676.234863,139.366653 669.595459,144.868668 C659.739136,153.036591 649.902222,161.227921 640.074097,169.429764 C635.658508,173.114716 631.232910,176.790482 626.904724,180.576523 C622.052124,184.821243 616.607727,185.394211 610.136719,181.603424 C608.758789,177.839935 607.382324,174.615067 607.119995,171.301971 C606.677795,165.716751 606.942139,160.075577 606.909302,154.457947 z",
];

/**
 * Create the Skipit wordmark SVG using safe DOM methods.
 * Colour comes from the button's `color` via currentColor.
 */
function createSkipitLogoSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 800 240");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Skipit");
  SKIPIT_LOGO_PATHS.forEach((d) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
  });
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

    // Extract year from first season (TV) or directly from video (movies)
    let year = null;
    if (video.seasons && video.seasons.length > 0) {
      year = video.seasons[0].year || null;
    } else if (video.year) {
      year = video.year;
    }

    const result = {
      title: video.title,
      type: isEpisode ? "episode" : "movie",
      seasonNumber: seasonNumber,
      episodeNumber: episodeNumber,
      episodeTitle: episodeTitle,
      netflixId: sessionKey,
      year: year,
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
    "skipit-fab" +
    (isAuthenticated ? " disabled" : " locked") +
    (currentFabStyle === "netflix" ? " style-netflix" : "") +
    (currentDiscreetMode ? " discreet" : "");
  button.setAttribute("aria-label", getFabAriaLabel());

  // Create lock icon (hidden when authenticated)
  const lockIcon = document.createElement("span");
  lockIcon.className = "skipit-locked-icon";
  lockIcon.style.display = isAuthenticated ? "none" : "flex";
  lockIcon.appendChild(createLockIconSVG());

  // Branding row (top line): the wordmark, plus a mode badge in discreet mode.
  // The wordmark contains the double-arrow, so it replaces the old
  // "Skipit \u23E9\uFE0E" text label outright.
  const labelRow = document.createElement("span");
  labelRow.className = "skipit-fab-label-row";

  const logo = document.createElement("span");
  logo.className = "skipit-fab-logo";
  logo.appendChild(createSkipitLogoSVG());

  // Marks discreet mode in the states that keep their text ("No skips yet",
  // "Sign in to skip"), which would otherwise look identical either way.
  const badge = document.createElement("span");
  badge.className = "skipit-discreet-badge";
  badge.textContent = "Discreet";

  labelRow.appendChild(logo);
  labelRow.appendChild(badge);

  // Same word as a caption under the wordmark on the collapsed tile, where a
  // pill on the row would push the wordmark off centre.
  const caption = document.createElement("span");
  caption.className = "skipit-discreet-caption";
  caption.textContent = "Discreet";

  // Skip types line (subtitle - bottom line)
  // Always created, even in discreet mode: updateSkipitFAB bails early without it.
  // Discreet mode hides it via CSS instead.
  const typesLine = document.createElement("span");
  typesLine.className = "skipit-fab-types";
  typesLine.textContent = isAuthenticated ? "Detecting content..." : "Sign in to skip";

  button.appendChild(lockIcon);
  button.appendChild(labelRow);
  button.appendChild(typesLine);
  button.appendChild(caption);
  button.addEventListener("click", handleSkipitFABClick);

  return button;
}

/**
 * Accessible name for the FAB. Discreet mode does not change it: neither string
 * names a category, and "Skip content with Skipit" tells a screen reader user
 * what a logo-only button actually does.
 */
function getFabAriaLabel() {
  return isAuthenticated ? "Skip content with Skipit" : "Sign in to skip content";
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

  // "loading" is the only state discreet mode can't express through .active /
  // .disabled / .locked, so it gets its own class for the pulse.
  button.classList.remove("loading");

  if (isSkipping) {
    // Active skipping state - red background
    // Use activeSkippingTypes (what's actually being skipped), not availableSkipTypes
    button.classList.add("active");
    button.classList.remove("disabled");
    const typeText = formatSkipTypes(activeSkippingTypes);
    typesLine.textContent = typeText
      ? activeSkippingTypes.length >= 2
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
    button.classList.add("loading");
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

  // Update Seek buttons (-2s / +2s)
  document.querySelectorAll(".skipit-seek-btn").forEach((btn) => {
    const delta = Number(btn.dataset.delta);
    if (authenticated) {
      btn.classList.remove("locked");
      btn.setAttribute(
        "aria-label",
        `Seek ${delta > 0 ? "forward" : "back"} 2 seconds`
      );
    } else {
      btn.classList.add("locked");
      btn.setAttribute("aria-label", "Sign in to use");
    }
  });

  // Update FAB button
  const fabButton = document.getElementById(FAB_BUTTON_ID);
  if (fabButton) {
    if (authenticated) {
      fabButton.classList.remove("locked");
      fabButton.setAttribute("aria-label", getFabAriaLabel());
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
      fabButton.setAttribute("aria-label", getFabAriaLabel());
      const lockIcon = fabButton.querySelector(".skipit-locked-icon");
      if (lockIcon) lockIcon.style.display = "flex";
      // Update FAB for locked state
      const typesLine = fabButton.querySelector(".skipit-fab-types");
      if (typesLine) typesLine.textContent = "Sign in to skip";
    }
  }
}

/**
 * Toggle discreet mode on an already-rendered FAB.
 * Called when the user flips the toggle in the popup.
 */
function applyDiscreetModeToExistingButtons(enabled) {
  const fabButton = document.getElementById(FAB_BUTTON_ID);
  if (!fabButton) return;
  fabButton.classList.toggle("discreet", enabled);
}

/**
 * Apply the chosen FAB style class to any already-rendered buttons.
 * Called when the user toggles the style in the popup.
 */
function applyFabStyleToExistingButtons(style) {
  const isNetflix = style === "netflix";
  [FAB_BUTTON_ID, BUTTON_ID].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("style-netflix", isNetflix);
  });
  document.querySelectorAll(".skipit-seek-btn").forEach((btn) => {
    btn.classList.toggle("style-netflix", isNetflix);
  });
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
  button.className =
    "skipit-mark-btn" +
    (isAuthenticated ? "" : " locked") +
    (currentFabStyle === "netflix" ? " style-netflix" : "");
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

    // Track playback and fullscreen state before pausing
    const video = document.querySelector("video");
    wasPlayingBeforeMarkModal = video ? !video.paused : false;
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
// SEEK BUTTONS (-2s / +2s)
// ============================================================================

const SEEK_SPIN_PATH =
  "M1281.317627,1416.404663 C1361.859009,1380.508545 1426.927002,1326.612305 1475.812500,1253.621094 C1524.587769,1180.794434 1548.991089,1100.269165 1550.130615,1012.388977 C1582.026733,1012.388977 1613.755127,1012.388977 1645.741699,1012.388977 C1645.741699,1022.525208 1646.219971,1032.660522 1645.619019,1042.731323 C1644.889526,1054.955444 1643.354248,1067.136963 1641.981812,1079.315918 C1638.821289,1107.366577 1632.730225,1134.839722 1624.804688,1161.882690 C1615.951294,1192.091797 1604.163940,1221.204956 1589.958374,1249.279297 C1570.429932,1287.873169 1546.792725,1323.755493 1518.793579,1356.820068 C1484.850098,1396.904297 1446.054810,1431.383667 1402.184814,1460.220947 C1363.288086,1485.789185 1322.023071,1506.541382 1277.811279,1521.216309 C1246.005981,1531.773071 1213.637207,1540.339844 1180.251465,1543.834839 C1156.329590,1546.339111 1132.260864,1548.258179 1108.226929,1548.677002 C1075.679077,1549.244385 1043.428589,1545.311035 1011.395813,1539.187378 C965.871521,1530.484375 922.271240,1516.147339 880.655457,1495.906250 C842.645203,1477.418823 806.799805,1455.317871 774.585632,1427.844116 C757.277710,1413.082886 740.348572,1397.754883 724.396606,1381.552246 C692.055847,1348.703491 664.889038,1311.869507 642.229309,1271.636108 C622.956726,1237.416748 607.458679,1201.682861 595.806335,1164.200806 C586.330444,1133.719971 579.564514,1102.606445 576.519470,1070.927612 C574.090088,1045.653564 572.834473,1020.108887 573.413818,994.738220 C574.459167,948.958130 582.158081,904.059753 595.503357,860.149292 C611.328674,808.078369 634.679260,759.649292 665.005920,714.542480 C687.592163,680.948486 713.680969,650.298523 743.281250,622.680664 C784.824280,583.919922 830.955261,551.694397 882.262085,527.251099 C920.534851,509.017426 960.341370,495.087128 1002.107666,486.846863 C1027.533569,481.830505 1053.032471,477.711761 1078.926880,477.123077 C1102.372192,476.590057 1125.929810,475.858917 1149.274658,477.515747 C1172.148438,479.139130 1194.930542,483.021759 1217.550781,487.048248 C1267.548340,495.947998 1314.477661,514.006409 1358.987915,538.012329 C1380.006836,549.348633 1399.757446,563.049072 1419.958374,575.874451 C1422.584473,577.541809 1424.001587,577.620544 1426.207397,575.390503 C1452.214478,549.096802 1478.312500,522.893188 1504.399292,496.678528 C1504.605835,496.471039 1504.986450,496.436768 1505.814209,496.118378 C1523.940308,595.621521 1542.045044,695.007507 1560.278931,795.102478 C1463.195190,774.019958 1366.748779,753.075806 1270.038208,732.074280 C1298.330811,703.747253 1326.301880,675.741943 1354.862915,647.146118 C1345.995361,641.538452 1337.857178,635.918152 1329.287109,631.059875 C1301.736328,615.441895 1273.173706,602.055786 1242.800781,592.749207 C1217.824707,585.096191 1192.445190,579.430664 1166.561890,575.782532 C1141.779297,572.289612 1116.893433,570.984375 1091.960449,572.101257 C1057.981689,573.623474 1024.609009,579.388428 991.796204,588.406250 C961.225952,596.807861 932.183533,608.882507 904.247925,623.827698 C878.550903,637.575256 854.599609,653.847656 832.088989,672.299316 C794.555908,703.064819 762.996826,739.119873 737.190857,780.171875 C709.968445,823.477112 690.666748,870.062805 679.812378,920.124268 C671.961548,956.332581 668.556580,992.962219 670.147095,1029.919312 C671.313354,1057.017212 675.041077,1083.874634 681.283203,1110.345215 C696.344666,1174.215088 724.987671,1231.516968 765.489258,1282.866577 C801.721619,1328.803345 845.604248,1365.994751 896.442993,1395.075073 C932.925903,1415.943604 971.674500,1431.097046 1012.456665,1440.582397 C1032.514160,1445.247437 1053.192139,1447.393799 1073.670044,1450.060059 C1095.521729,1452.905151 1117.528564,1452.577148 1139.451416,1450.923584 C1169.302246,1448.671875 1198.877075,1444.318970 1227.504028,1435.289917 C1245.509644,1429.611084 1263.188354,1422.896484 1281.317627,1416.404663 z";

const SEEK_DIGIT_PATH =
  "M964.468872,1185.000000 C964.648132,1171.679443 964.714478,1158.855347 965.111755,1146.041748 C965.173950,1144.035522 966.219666,1141.492065 967.689209,1140.183838 C986.051331,1123.836670 1004.573975,1107.670044 1023.058777,1091.460815 C1039.424927,1077.109497 1055.743286,1062.703003 1072.177856,1048.430420 C1090.234009,1032.749634 1108.632324,1017.454529 1126.447632,1001.506653 C1142.539795,987.101379 1155.272827,970.083740 1158.597290,948.157410 C1163.053711,918.764038 1152.019653,895.891479 1119.759766,889.376953 C1098.643799,885.112854 1079.083618,890.340027 1062.097778,904.199158 C1049.886108,914.162964 1040.313477,926.432495 1030.877563,938.859924 C1029.786865,940.296326 1028.647705,941.695923 1027.457153,943.206421 C1006.690613,927.148987 986.148315,911.264832 964.474182,894.505554 C972.162903,884.428650 979.411133,873.634583 987.952148,863.984741 C1010.964233,837.985596 1039.913574,821.706970 1073.996216,815.462280 C1110.372314,808.797363 1146.506714,810.080994 1180.562012,825.854004 C1217.412598,842.921692 1240.815063,871.186340 1247.026367,912.265747 C1253.032471,951.989685 1242.638062,987.171021 1217.980713,1018.543396 C1201.400024,1039.639648 1180.594971,1056.281982 1160.385376,1073.529053 C1141.465698,1089.675293 1122.174072,1105.385620 1103.058228,1121.302368 C1097.835693,1125.650757 1092.656616,1130.051147 1086.714844,1135.052979 C1143.374878,1135.052979 1199.464844,1135.052979 1255.758667,1135.052979 C1255.758667,1160.795288 1255.758667,1185.717407 1255.758667,1211.052246 C1158.681885,1211.052246 1061.769531,1211.052246 964.464905,1211.052246 C964.464905,1202.412720 964.464905,1193.956421 964.468872,1185.000000 z";

function createSeekIconSVG(direction) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "570 475 1080 1080");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("fill", "currentColor");
  svg.classList.add("skipit-seek-icon");

  const spin = document.createElementNS(svgNS, "path");
  spin.setAttribute("d", SEEK_SPIN_PATH);

  const digit = document.createElementNS(svgNS, "path");
  digit.setAttribute("d", SEEK_DIGIT_PATH);

  if (direction === "back") {
    // Mirror only the spin so the rotation arrow points the other way; "2" stays upright.
    const flipped = document.createElementNS(svgNS, "g");
    flipped.setAttribute("transform", "translate(2220, 0) scale(-1, 1)");
    flipped.appendChild(spin);
    svg.appendChild(flipped);
    svg.appendChild(digit);
  } else {
    svg.appendChild(spin);
    svg.appendChild(digit);
  }

  return svg;
}

function createSeekButton(deltaMs) {
  const direction = deltaMs > 0 ? "forward" : "back";
  const button = document.createElement("button");
  button.className =
    "skipit-seek-btn" +
    (isAuthenticated ? "" : " locked") +
    (currentFabStyle === "netflix" ? " style-netflix" : "");
  button.dataset.delta = String(deltaMs);
  button.setAttribute(
    "aria-label",
    isAuthenticated ? `Seek ${direction} 2 seconds` : "Sign in to use"
  );

  button.appendChild(createSeekIconSVG(direction));

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      window.postMessage({ type: "SKIPIT_OPEN_AUTH_POPUP" }, "*");
      return;
    }

    const api = window.skipitNetflixPlayer;
    if (!api || !api.isReady()) return;
    const current = api.getCurrentTime();
    if (current == null || Number.isNaN(current)) return;
    api.seek(Math.max(0, current + deltaMs));
  });

  return button;
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

  // Create Mark row (bottom): [-2s] [+2s] [Mark scene]
  const markRow = document.createElement("div");
  markRow.className = "skipit-mark-row";
  markRow.appendChild(createSeekButton(-2000));
  markRow.appendChild(createSeekButton(2000));
  const markButton = createMarkButton();
  markRow.appendChild(markButton);
  wrapper.appendChild(markRow);

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
    const netflixPreplayContainer = document.querySelector(
      ".watch-video--skip-preplay"
    );
    const hasNetflixSkipButton =
      (netflixSkipContainer && netflixSkipContainer.children.length > 0) ||
      (netflixPreplayContainer && netflixPreplayContainer.children.length > 0);
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

const SEGMENT_DISCREET_LABEL = "Skipit ⏩︎";

/**
 * Tooltip text for a timeline segment.
 * Discreet mode replaces the category with the Skipit wordmark.
 */
function getSegmentLabel(skipType, isPending) {
  if (currentDiscreetMode) {
    return isPending
      ? `${SEGMENT_DISCREET_LABEL} (unverified)`
      : SEGMENT_DISCREET_LABEL;
  }

  if (isPending) {
    const pendingLabels = {
      Nudity: "Nudity (unverified)",
      nudity: "Nudity (unverified)",
      Sex: "Sex (unverified)",
      sex: "Sex (unverified)",
      Gore: "Gore (unverified)",
      gore: "Gore (unverified)",
    };
    return pendingLabels[skipType] || "Unverified skip";
  }

  const typeLabels = {
    nudity: "Nudity",
    sex: "Sex",
    gore: "Gore",
    default: "Skip",
  };
  return typeLabels[skipType] || "Skip";
}

/**
 * Rewrite tooltip labels on segments already in the DOM.
 * Called when discreet mode is toggled mid-playback so the change lands
 * without waiting for a re-render.
 */
function refreshSegmentLabels() {
  document.querySelectorAll(".skipit-segment").forEach((segment) => {
    const isPending = segment.classList.contains("skipit-segment--pending");
    segment.dataset.label = getSegmentLabel(segment.dataset.type, isPending);
  });
}

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
    const label = getSegmentLabel(skipType, false);

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

    const label = getSegmentLabel(skipType, true);

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
        clearPendingSkips();
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
 *
 * Prompt behavior:
 * - Shows for 5s of playing time then auto-hides
 * - Pausing keeps the prompt visible (timer paused)
 * - After auto-hide, won't re-show while still in segment
 * - Seeking out and back in re-triggers the prompt
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
      const video = document.querySelector("video");
      const isPaused = video && video.paused;
      let inRange = false;

      // Detect seek: time jumped more than 500ms from last tick
      if (votePromptLastCheckedTime >= 0 && Math.abs(currentTime - votePromptLastCheckedTime) > 500) {
        votePromptShownForCurrentVisit = false;
        votePromptPlayTimeElapsed = 0;
      }
      votePromptLastCheckedTime = currentTime;

      for (let i = 0; i < pendingSkips.length; i++) {
        const skip = pendingSkips[i];
        const promptStart = skip.startTime - VOTE_PROMPT_LEAD_TIME;

        if (currentTime >= promptStart && currentTime < skip.endTime) {
          inRange = true;

          // Prompt is currently visible for this skip
          if (activeVotePromptSkipId === skip.id) {
            // Count playing time toward auto-dismiss
            if (!isPaused) {
              votePromptPlayTimeElapsed += 100;
              if (votePromptPlayTimeElapsed >= VOTE_PROMPT_DISPLAY_DURATION) {
                hideVotePrompt();
                votePromptShownForCurrentVisit = true;
              }
            }
            // If paused, do nothing: prompt stays, timer paused
          } else if (!votePromptShownForCurrentVisit) {
            // First time entering this segment visit -> show prompt
            showVotePrompt(skip);
            votePromptPlayTimeElapsed = 0;
          }
          break;
        }
      }

      if (!inRange) {
        // User is outside all pending skip ranges -> reset for next visit
        votePromptShownForCurrentVisit = false;
        votePromptPlayTimeElapsed = 0;
        if (activeVotePromptSkipId !== null) {
          hideVotePrompt();
        }
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
 * Clear all pending skip state (segments, checker, dismissed set)
 * Call this only on video/content change or auth logout, NOT on manual stop skipping
 */
function clearPendingSkips() {
  pendingSkips = [];
  removePendingTimelineSegments();
  stopPendingSkipChecker();
  votePromptShownForCurrentVisit = false;
  votePromptPlayTimeElapsed = 0;
  votePromptLastCheckedTime = -1;
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

  // Create title with type (discreet mode drops the category name)
  const titleSpan = document.createElement("span");
  titleSpan.className = "skipit-notification-title";
  titleSpan.textContent = currentDiscreetMode
    ? "Scene skipped"
    : `Skipped ${formattedType} scene`;

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
  // The prompt fires BEFORE the skip, so discreet wording stays forward-looking.
  titleSpan.textContent = currentDiscreetMode
    ? "Skip this scene?"
    : `${formattedType} scene?`;

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
  upLabel.textContent = "Yes, skip it";
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
  // "No, it's not" is short for "it's not a <category> scene", which is
  // meaningless once the category is hidden.
  downLabel.textContent = currentDiscreetMode ? "No, it's fine" : "No, it's not";
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
      // Video changed - stop any active skipping
      if (skippingForVideoIdFromUrl !== null) {
        stopSkipChecking();
      }

      // Always clear pending skips for old video
      clearPendingSkips();

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
      const source = event.data.source;
      if (source === "mark-scene") {
        if (wasPlayingBeforeMarkModal) {
          playVideo();
        }
        wasPlayingBeforeMarkModal = false;
      } else {
        playVideo();
      }
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
        }
        clearPendingSkips();
      }
    } else if (type === "SKIPIT_SET_FAB_STYLE") {
      // Update FAB visual style ("classic" | "netflix")
      const style =
        event.data.data?.style === "netflix" ? "netflix" : "classic";
      currentFabStyle = style;
      applyFabStyleToExistingButtons(style);
    } else if (type === "SKIPIT_SET_DISCREET_MODE") {
      // Toggle discreet mode (hide category names on ambient surfaces)
      const enabled = event.data.data?.enabled === true;
      if (enabled !== currentDiscreetMode) {
        currentDiscreetMode = enabled;
        applyDiscreetModeToExistingButtons(enabled);
        refreshSegmentLabels();
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
