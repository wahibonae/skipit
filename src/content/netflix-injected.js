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

/* ===========================================
   TOAST
   One component for every message on the player. One mark at the head
   (wordmark, scene colour, accent glyph, or amber warning); colour only in
   the mark. 12px corner on one line, 20px on two (--block).
   =========================================== */
.skipit-toast {
  position: absolute;
  bottom: 160px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  font-family: Netflix Sans, Helvetica Neue, Segoe UI, Roboto, sans-serif;
  padding: 9px 18px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  z-index: 2147483645;
  opacity: 0;
  transition: opacity 0.25s ease;
}
.skipit-toast.visible {
  opacity: 1;
}

/* --- the mark --------------------------------------------------------- */
.skipit-toast-mark {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.skipit-toast-mark svg {
  display: block;
}
.skipit-toast-mark--brand svg {
  height: 17px;
  width: auto;
  color: #ff6f4f;
}
.skipit-toast-mark--action {
  color: #ff6f4f;
}
.skipit-toast-mark--action svg {
  width: 16px;
  height: 16px;
}
.skipit-toast-mark--warn {
  color: #f5a524;
}
.skipit-toast-mark--warn svg {
  width: 16px;
  height: 16px;
}

.skipit-toast-mark--scene svg {
  width: 18px;
  height: 18px;
}
.skipit-toast-mark--nudity {
  color: #FF6EB4;
}
.skipit-toast-mark--sex {
  color: #FF5A5A;
}
.skipit-toast-mark--gore {
  color: #FF9500;
}
.skipit-toast-mark--default {
  color: #FF6EB4;
}
.skipit-toast-mark--accent {
  color: #ff6f4f;
}

/* --- the message ------------------------------------------------------- */
.skipit-toast-gap {
  width: 11px;
  flex-shrink: 0;
}
.skipit-toast-div {
  width: 1px;
  align-self: stretch;
  background: rgba(255, 255, 255, 0.22);
  margin: 0 13px;
  flex-shrink: 0;
}
.skipit-toast-primary {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}
.skipit-toast-secondary {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.62);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
/* The only text allowed to wrap; its toast takes --block */
.skipit-toast-message {
  font-size: 14px;
  line-height: 1.4;
  max-width: 300px;
}
.skipit-toast--block {
  border-radius: 20px;
}
.skipit-toast--block .skipit-toast-mark {
  align-self: flex-start;
  margin-top: 1px;
}

/* --- entrances ---------------------------------------------------------- */

/* Rise: fires many times per film, so it's the quietest */
.skipit-toast--rise {
  transform: translateX(-50%) translateY(5px);
  transition: opacity 0.24s ease, transform 0.24s ease;
}
.skipit-toast--rise.visible {
  transform: translateX(-50%) translateY(0);
}

/* Handoff: the wordmark collapses while the message unrolls, so the capsule
   resizes in one move */
.skipit-toast-swap {
  display: grid;
  grid-template-columns: 1fr;
  opacity: 1;
  transition: grid-template-columns 0.4s cubic-bezier(0.2, 0.8, 0.3, 1),
    opacity 0.24s ease;
}
.skipit-toast-swap > span {
  overflow: hidden;
  display: flex;
  align-items: center;
}
.skipit-toast--handoff.opened .skipit-toast-swap {
  grid-template-columns: 0fr;
  opacity: 0;
}

/* Open: the mark lands, the message unrolls from it */
.skipit-toast-reveal {
  display: grid;
  grid-template-columns: 0fr;
  opacity: 0;
  transition: grid-template-columns 0.4s cubic-bezier(0.2, 0.8, 0.3, 1),
    opacity 0.3s ease 0.06s;
}
.skipit-toast-reveal > span {
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
}
.skipit-toast--open.opened .skipit-toast-reveal,
.skipit-toast--handoff.opened .skipit-toast-reveal {
  grid-template-columns: 1fr;
  opacity: 1;
}

/* Stamp: reserved for a marked scene */
.skipit-toast--stamp {
  transform: translateX(-50%) scale(0.94);
  transition: opacity 0.18s ease, transform 0.3s cubic-bezier(0.2, 1.5, 0.4, 1);
}
.skipit-toast--stamp.visible {
  transform: translateX(-50%) scale(1);
}
.skipit-toast--stamp .skipit-toast-mark {
  transform: scale(2.2) rotate(-12deg);
  opacity: 0;
  transition: transform 0.34s cubic-bezier(0.2, 1.2, 0.3, 1), opacity 0.2s ease;
}
.skipit-toast--stamp.visible .skipit-toast-mark {
  transform: scale(1) rotate(0deg);
  opacity: 1;
}
.skipit-toast-ring {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
}
.skipit-toast--stamp.visible .skipit-toast-ring {
  animation: skipit-toast-pulse 0.62s ease-out 0.06s;
}
@keyframes skipit-toast-pulse {
  0% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(255, 111, 79, 0.5);
  }
  100% {
    opacity: 0;
    box-shadow: 0 0 0 16px rgba(255, 111, 79, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .skipit-toast,
  .skipit-toast-reveal,
  .skipit-toast-swap,
  .skipit-toast--stamp .skipit-toast-mark {
    transition-duration: 0.01ms !important;
  }
  .skipit-toast--stamp.visible .skipit-toast-ring {
    animation: none;
  }
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

/* Vote prompt: a --block toast with pointer events and a row of buttons */
.skipit-vote-prompt {
  pointer-events: auto;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  padding: 11px 16px 12px;
}
.skipit-vote-header {
  display: flex;
  align-items: center;
}
.skipit-vote-actions {
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
  white-space: nowrap;
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
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
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
// Pending reveal frame, cancelled on hide: rAF pauses in a hidden tab while setTimeout keeps firing
let notificationFrame = null;
// Handoff timer: the wordmark holds alone, then the message takes over
let notificationSwapTimeout = null;
let lastNotifiedSegment = null; // { start, end, timestamp }
// The activation toast owns the shared element until then, so the checker can't overwrite it at once
let announceHoldUntil = 0;
// A skip toast waiting for the activation toast's hold to end
let deferredSkipToastTimeout = null;

// Pending skip verification state
let pendingSkips = [];
let pendingSegmentsRendered = false;
const VOTE_PROMPT_LEAD_TIME = 3000; // Show prompt 3s before segment
const VOTE_PROMPT_DISPLAY_DURATION = 5000; // Auto-hide after 5s of playback
let activeVotePromptSkipId = null;
// Prompt reveal frame, cancelled on hide so a same-frame hide isn't undone
let votePromptFrame = null;
let votePromptTimeout = null;
let votePromptShownForCurrentVisit = false; // Prevents re-show within same segment visit
let votePromptPlayTimeElapsed = 0; // Tracks playing time since prompt was shown
let votePromptLastCheckedTime = -1; // For seek detection
let pendingSkipCheckInterval = null;
const PENDING_SEGMENTS_CONTAINER_ID = "skipit-timeline-segments--pending";
let pendingSegmentsTimelineObserver = null;

// Profanity mute state (independent of skip checking - separate lifecycle)
let profanityMuteEnabled = false;
let profanityMuteInterval = null;
let profanityObserver = null;
let profanityObservedContainer = null;
let profanityMutedByUs = false; // True only while WE muted the video (never override a user mute)
let profanityMutedVideo = null; // The <video> we muted, so we unmute the same element
let profanityUserTookOver = false; // User changed mute during a muted line: hands off until it ends
let profanityVolumeAtMute = null; // Volume when we muted the line (a change means "let me hear")
let profanityLineLang = null; // Last known subtitle language for this video (getter can blip)
let profanityTrackSetAt = 0; // When we last set the silent track (to retry if it never confirms)
let profanityTrackRetries = 0; // Silent track re-sets for this video (capped)
let profanityOwnedTrackKey = null; // Silent subtitle track Skipit turned on because the user had subs off
let profanityVideoId = null; // Video the track bookkeeping belongs to
let profanityNextTrackAttemptAt = 0; // Backoff when no usable track exists
let profanityTrackSetCount = 0; // Diagnostics: setTimedTextTrack calls (1 per video is expected)
let profanityPendingFrom = null; // { key, at }: our track we just asked Netflix to switch away from (getter lags)
let profanityGaveUpTrack = null; // { videoId, key, at }: silent track we gave up on, still ours if Netflix applies it late
let profanityAudioRepickLang = null; // Audio language we already re-picked the silent track for (once per video)
const PROFANITY_HIDE_CLASS = "skipit-pm-hide-subs";
const PROFANITY_OWNED_TRACK_KEY = "skipit_pm_owned_track"; // localStorage marker prefix (+ ":" + tab id), survives reloads
const PROFANITY_TAB_ID_KEY = "skipit_pm_tab_id"; // sessionStorage: this tab's id (kept across reloads, not shared with other tabs)
// Muting runs only while signed in AND the setting is on. Each is null until
// the content script has reported it, so neither alone starts (or stops) muting.
let profanityMuteSetting = null; // chrome.storage profanity_mute
let profanityAuthKnown = null; // Last auth state seen by the mute module
let profanityActiveSynced = null; // Last active value acted on
let profanityTipSeen = null; // chrome.storage profanity_tip_seen
let profanityTipTimeout = null;
const PROFANITY_CHIP_ID = "skipit-pm-chip";
const PROFANITY_TIP_ID = "skipit-pm-tip";
const PROFANITY_TIP_OPEN_CLASS = "skipit-pm-tip-open";


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
 * Round a span to a length a person would say out loud.
 * Deliberately coarse: a skip group's bounds are re-averaged as people contribute,
 * so rounding to 5s keeps the number stable across recalculations.
 */
function formatDurationMs(ms) {
  const seconds = Math.max(0, Math.round(ms / 1000));

  if (seconds < 60) {
    // Never "0s": a sub-3s span is still a real skip
    const rounded = Math.max(5, Math.round(seconds / 5) * 5);
    // 58s rounds to 60, which reads as a minute
    if (rounded < 60) return `${rounded}s`;
  }

  const minutes = seconds / 60;
  if (minutes <= 3) {
    const halves = Math.round(minutes * 2) / 2;
    return `${Number.isInteger(halves) ? halves : `${Math.floor(halves)}\u00BD`} min`;
  }

  return `${Math.round(minutes)} min`;
}

/**
 * The element Netflix's player lives in, where our overlays get appended.
 */
function getPlayerContainer() {
  const video = document.querySelector("video");
  if (!video) return null;

  return (
    video.closest(".watch-video--player-view") ||
    video.closest('[data-uia="video-canvas"]')?.parentElement ||
    document.querySelector(".watch-video") ||
    video.parentElement?.parentElement?.parentElement ||
    null
  );
}

/**
 * Build a single-path icon SVG.
 * strokeWidth rounds the corners by stroking the filled shape's own edge; it is
 * not an outline, so the fill stays.
 */
function createIconSVG(pathData, strokeWidth) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  if (strokeWidth) {
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", String(strokeWidth));
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  svg.appendChild(path);
  return svg;
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

  // Signed out, the only useful action is signing in, so don't show loading/empty states.
  // Unless already skipping: a token can expire mid-film and the click still stops it.
  if (!isAuthenticated && !isSkipping) {
    button.classList.remove("active", "disabled", "loading");
    typesLine.textContent = "Sign in to skip";
    return;
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
      // The locked wording lives in updateSkipitFAB
      updateSkipitFAB(null, fabSkippingActive);
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

  // Create FAB row (top): [mute chip] [FAB]
  const fabRow = document.createElement("div");
  fabRow.className = "skipit-fab-row";
  fabRow.appendChild(createProfanityChip());
  fabRow.appendChild(createSkipitFAB());
  wrapper.appendChild(fabRow);

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

  // Show for a few seconds after (re)injection, then fade
  startButtonsVisibilityWatcher();
  noteButtonsActivity();
}

// ============================================================================
// AUTO-HIDE
// Visibility is worked out from the current state on every tick instead of
// being switched by one-off events. Event-driven timers got stuck: a `pause`
// with no matching `play` on the same element (for example if the <video> is
// replaced, since removing a playing video fires `pause`) left the buttons on
// screen with no hide timer until the mouse moved again.
// ============================================================================

const BUTTONS_HIDE_DELAY = 3000;
const BUTTONS_VISIBILITY_TICK = 250;
let buttonsLastActivity = 0;
let buttonsVisibilityWatcherInitialized = false;

/**
 * True when the player has a video and none of them is playing. Checking every
 * <video> (not just the first) means a leftover paused element sitting next to
 * the one that's playing can't keep the buttons on screen.
 */
function isPlayerPaused(wrapper) {
  let videos = wrapper.parentElement?.querySelectorAll("video");
  if (!videos || videos.length === 0) videos = document.querySelectorAll("video");
  if (videos.length === 0) return false;
  return !Array.from(videos).some((video) => !video.paused);
}

function shouldButtonsBeVisible(wrapper) {
  return (
    isPlayerPaused(wrapper) ||
    wrapper.matches(":hover") ||
    markingState.isMarking ||
    Date.now() - buttonsLastActivity < BUTTONS_HIDE_DELAY
  );
}

/** Runs every tick, and right away on events that should change it quickly. */
function updateButtonsVisibility() {
  const wrapper = document.getElementById(WRAPPER_ID);
  if (!wrapper) return;
  wrapper.classList.toggle("visible", shouldButtonsBeVisible(wrapper));
  updateSkipButtonPosition(wrapper);
}

/** Restart the hide countdown and show the buttons now. */
function noteButtonsActivity() {
  buttonsLastActivity = Date.now();
  updateButtonsVisibility();
}

function onButtonsMouseMove() {
  buttonsLastActivity = Date.now();
  // Mousemove fires at frame rate; only do DOM work when there's something to
  // show. The tick handles hiding.
  const wrapper = document.getElementById(WRAPPER_ID);
  if (wrapper && !wrapper.classList.contains("visible")) {
    updateButtonsVisibility();
  }
}

/**
 * On resume, keep the buttons up for the usual delay if they're already
 * showing (paused, then played), but don't pop them up for plays nobody asked
 * for, such as the next episode autoplaying.
 */
function onButtonsVideoPlay() {
  const wrapper = document.getElementById(WRAPPER_ID);
  if (wrapper && wrapper.classList.contains("visible")) {
    noteButtonsActivity();
  } else {
    updateButtonsVisibility();
  }
}

/** Move up when Netflix's Skip Intro/Recap button is on screen. */
function updateSkipButtonPosition(wrapper) {
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

/**
 * Set up the auto-hide once per page. Listeners sit on `document` so they keep
 * working when Netflix replaces the player or the <video> element, and every
 * lookup happens at tick time, so a re-injected wrapper is picked up for free.
 */
function startButtonsVisibilityWatcher() {
  if (buttonsVisibilityWatcherInitialized) return;
  buttonsVisibilityWatcherInitialized = true;

  document.addEventListener("mousemove", onButtonsMouseMove, { passive: true });

  // Media events don't bubble, but the capture phase on document still sees
  // them, whichever <video> element fired them.
  document.addEventListener("play", onButtonsVideoPlay, true);
  document.addEventListener("pause", updateButtonsVisibility, true);

  setInterval(updateButtonsVisibility, BUTTONS_VISIBILITY_TICK);
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
function startSkipChecking(timestamps, announce = false) {
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

  // After the early return above, so a start that never took effect can't claim it did
  if (announce) {
    showSkippingActiveNotification(types);
  }

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
  // Unconditional: the player may not be ready, and the FAB must not keep
  // reading "Skipping" (e.g. after a sign-out stopped skipping).
  updateSkipitFAB(extractNetflixMetadata(), false);
}


// ============================================================================
// TOASTS
// Every message Skipit puts on the player is this one component: a mark, a
// line of text and an entrance. See the TOAST block in styles/player.css.
// ============================================================================

const ICON_CHECK = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";
const ICON_BOOKMARK = "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z";
const ICON_WARNING = "M12 2 1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V8h2v5z";
// Spaced 3 units apart so the 1.8 stroke doesn't weld the two triangles together
const ICON_FORWARD = "M5 5.8 10.6 12 5 18.2Z M13.6 5.8 19.2 12 13.6 18.2Z";

// A notice has to be read, not just noticed, so it stays up longer
const NOTICE_DURATION = 8000;
// Display guard only: stops a pathologically long message from covering the video
const NOTICE_MAX_LENGTH = 400;
// How long the wordmark holds alone before the message takes over (inside the duration)
const HANDOFF_HOLD = 850;
// How long the activation toast keeps the shared element to itself
const ANNOUNCE_HOLD = 2000;

/**
 * Get or create the shared toast element.
 */
function getOrCreateToast() {
  let toast = document.getElementById(NOTIFICATION_ID);
  if (toast) return toast;

  const playerContainer = getPlayerContainer();
  if (!playerContainer) return null;

  toast = document.createElement("div");
  toast.id = NOTIFICATION_ID;
  playerContainer.appendChild(toast);
  return toast;
}

/**
 * Build the head of a toast: the wordmark, a scene's timeline colour, or a glyph.
 */
function createToastMark(mark) {
  const wrap = document.createElement("span");

  if (mark.kind === "scene") {
    // Tinted with the scene's timeline colour so toast and segment read as one thing
    wrap.className =
      "skipit-toast-mark skipit-toast-mark--scene" +
      ` skipit-toast-mark--${mark.type || "default"}`;
    wrap.appendChild(createIconSVG(ICON_FORWARD, 1.8));
    return wrap;
  }

  wrap.className = `skipit-toast-mark skipit-toast-mark--${mark.kind}`;
  wrap.appendChild(
    mark.kind === "brand"
      ? createSkipitLogoSVG()
      : createIconSVG(mark.path, mark.stroke)
  );
  return wrap;
}

function createToastSpan(className, text) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  return span;
}

/**
 * Render one toast into the shared element.
 *
 * @param {object} spec
 * @param {object} spec.mark      - {kind: "brand"|"scene"|"action"|"warn", type?, path?, stroke?}
 * @param {string} [spec.primary] - the message, one line
 * @param {string} [spec.secondary] - a muted detail after it
 * @param {string} [spec.message] - a sentence that is allowed to wrap
 * @param {string} [spec.entrance] - "rise" (default) | "open" | "stamp" | "handoff"
 * @param {number} [spec.duration]
 * @param {boolean} [spec.skipEvent] - about skipping itself, so cleared on stop
 *
 * The element is shared, so every toast reuses the one dismissal timer; a
 * second timer would strip `visible` from whatever is showing when it fires.
 */
function renderToast(spec) {
  const toast = getOrCreateToast();
  if (!toast) return;

  // This element no longer shows the last skipped segment, so drop its cooldown
  lastNotifiedSegment = null;

  // A message about the user's own action is newer than a held-back skip toast,
  // so it wins (as on main) and ends the hold.
  if (!spec.skipEvent) {
    cancelDeferredSkipToast();
    announceHoldUntil = 0;
  }

  if (notificationTimeout) clearTimeout(notificationTimeout);
  if (notificationSwapTimeout) clearTimeout(notificationSwapTimeout);
  if (notificationFrame) cancelAnimationFrame(notificationFrame);

  const entrance = spec.entrance || "rise";
  const block = Boolean(spec.message);

  toast.className =
    "skipit-toast" +
    ` skipit-toast--${entrance}` +
    (block ? " skipit-toast--block" : "");
  toast.textContent = "";
  // Only skip toasts are cleared when skipping stops; see cleanupNotification
  toast.dataset.skipEvent = spec.skipEvent ? "true" : "";

  if (entrance === "stamp") {
    const ring = document.createElement("span");
    ring.className = "skipit-toast-ring";
    toast.appendChild(ring);
  }

  // Handoff: the wordmark shows alone, then collapses as the message unrolls
  if (entrance === "handoff") {
    const swap = document.createElement("span");
    swap.className = "skipit-toast-swap";
    const swapInner = document.createElement("span");
    swapInner.appendChild(createToastMark({ kind: "brand" }));
    swap.appendChild(swapInner);
    toast.appendChild(swap);
  } else {
    toast.appendChild(createToastMark(spec.mark));
  }

  // The message either unrolls out of the mark, or simply follows it
  let body = toast;
  if (entrance === "open" || entrance === "handoff") {
    const reveal = document.createElement("span");
    reveal.className = "skipit-toast-reveal";
    body = document.createElement("span");
    reveal.appendChild(body);
    toast.appendChild(reveal);
  }

  if (entrance === "handoff") {
    body.appendChild(createToastMark(spec.mark));
  }

  // A rule after the wordmark; other marks just get a gap
  body.appendChild(
    createToastSpan(spec.mark.kind === "brand" ? "skipit-toast-div" : "skipit-toast-gap", "")
  );

  if (spec.message) {
    body.appendChild(createToastSpan("skipit-toast-message", spec.message));
  } else {
    body.appendChild(createToastSpan("skipit-toast-primary", spec.primary));
    if (spec.secondary) {
      body.appendChild(createToastSpan("skipit-toast-gap", ""));
      body.appendChild(createToastSpan("skipit-toast-secondary", spec.secondary));
    }
  }

  // Tracked so hide can cancel it: rAF pauses in a hidden tab while the dismiss
  // timer still fires, which would re-show the toast with no timer left.
  notificationFrame = requestAnimationFrame(() => {
    notificationFrame = null;
    toast.classList.add("visible");
    if (entrance === "open") {
      // A second frame, so the capsule has a closed state to open from
      notificationFrame = requestAnimationFrame(() => {
        notificationFrame = null;
        toast.classList.add("opened");
      });
    } else if (entrance === "handoff") {
      notificationSwapTimeout = setTimeout(() => {
        notificationSwapTimeout = null;
        toast.classList.add("opened");
      }, HANDOFF_HOLD);
    }
  });

  notificationTimeout = setTimeout(hideSkipNotification, spec.duration || NOTIFICATION_DURATION);
}

/**
 * A scene was skipped.
 * @param {string} skipType - Type, or a comma list for merged overlapping scenes
 * @param {number} startMs
 * @param {number} endMs
 */
function showSkipNotification(skipType, startMs, endMs) {
  const now = Date.now();
  if (
    lastNotifiedSegment &&
    lastNotifiedSegment.start === startMs &&
    lastNotifiedSegment.end === endMs &&
    now - lastNotifiedSegment.timestamp < SEGMENT_COOLDOWN
  ) {
    return;
  }

  // The activation toast still owns the element: show this one once it's done
  // (e.g. Start pressed just before or inside a scene). Latest skip wins.
  if (now < announceHoldUntil) {
    lastNotifiedSegment = { start: startMs, end: endMs, timestamp: now };
    cancelDeferredSkipToast();
    deferredSkipToastTimeout = setTimeout(() => {
      deferredSkipToastTimeout = null;
      renderSkipToast(skipType, startMs, endMs);
    }, announceHoldUntil - now);
    return;
  }

  renderSkipToast(skipType, startMs, endMs);
}

function cancelDeferredSkipToast() {
  if (deferredSkipToastTimeout) {
    clearTimeout(deferredSkipToastTimeout);
    deferredSkipToastTimeout = null;
  }
}

/** Render the "Skipped … scene" toast and start that segment's cooldown. */
function renderSkipToast(skipType, startMs, endMs) {
  // Overlapping scenes arrive merged as a comma list: the mark takes the first
  // type, the words take all of them.
  const types = skipType ? String(skipType).split(",") : [];
  const formatted = formatSkipTypes(types);

  renderToast({
    mark: { kind: "scene", type: types[0] || "default" },
    primary: currentDiscreetMode
      ? "Scene skipped"
      : `Skipped ${formatted || "content"} scene`,
    secondary: `(${formatDurationMs(endMs - startMs)})`,
    entrance: "rise",
    skipEvent: true,
  });

  // renderToast clears the cooldown; restore it for this segment
  lastNotifiedSegment = { start: startMs, end: endMs, timestamp: Date.now() };
}

/** Skipping just started. Same wording as the FAB underneath it. */
function showSkippingActiveNotification(types) {
  cancelDeferredSkipToast();
  announceHoldUntil = Date.now() + ANNOUNCE_HOLD;

  const typeText = formatSkipTypes(types);
  renderToast({
    mark: { kind: "scene", type: "accent" },
    primary: currentDiscreetMode
      ? "Skipping on"
      : typeText
        ? types.length >= 2
          ? `Skipping ${typeText}`
          : `Skipping ${typeText} scenes`
        : "Skipping on",
    entrance: "handoff",
    skipEvent: true,
  });
}

/** A marked scene was accepted. */
function showMarkSavedNotification() {
  renderToast({
    mark: { kind: "action", path: ICON_BOOKMARK },
    primary: "Scene marked",
    entrance: "stamp",
  });
}

/** A vote was recorded. */
function showThanksNotification() {
  renderToast({
    // Material's check is drawn thin, so a light stroke matches the other glyphs' weight
    mark: { kind: "action", path: ICON_CHECK, stroke: 1.1 },
    primary: "Thanks for helping!",
    entrance: "open",
  });
}

/** A refusal or warning the user needs to actually read. */
function showNoticeNotification(message) {
  renderToast({
    mark: { kind: "warn", path: ICON_WARNING },
    message:
      typeof message === "string" &&
      message.trim() &&
      message.length <= NOTICE_MAX_LENGTH
        ? message
        : "Something went wrong. Please try again.",
    entrance: "rise",
    duration: NOTICE_DURATION,
  });
}

/**
 * Hide whatever is on screen.
 */
function hideSkipNotification() {
  const toast = document.getElementById(NOTIFICATION_ID);
  if (toast) {
    toast.classList.remove("visible", "opened");
  }

  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
  if (notificationSwapTimeout) {
    clearTimeout(notificationSwapTimeout);
    notificationSwapTimeout = null;
  }
  if (notificationFrame) {
    cancelAnimationFrame(notificationFrame);
    notificationFrame = null;
  }
}

// ============================================================================
// VOTE PROMPT
// Same component with buttons. It owns its own element so a skip toast that
// fires mid-decision can't replace the question.
// ============================================================================

const VOTE_PROMPT_ID = "skipit-vote-prompt";

const ICON_THUMB_UP =
  "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z";
const ICON_THUMB_DOWN =
  "M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z";

function createVoteButton(modifier, iconPath, label, onClick) {
  const button = document.createElement("button");
  button.className = `skipit-vote-btn skipit-vote-btn--${modifier}`;
  button.appendChild(createIconSVG(iconPath));
  button.appendChild(createToastSpan("", label));
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick();
  });
  return button;
}

/**
 * Ask whether a pending scene is right. Keeps exact timestamps (not a rounded
 * duration) because the user is judging a specific span.
 */
function showVotePrompt(skip) {
  // Don't re-show for the same skip while its element is still in the DOM.
  // Netflix's own UI updates can remove foreign elements underneath us.
  if (activeVotePromptSkipId === skip.id && document.getElementById(VOTE_PROMPT_ID)) return;

  hideVotePrompt();
  activeVotePromptSkipId = skip.id;

  const playerContainer = getPlayerContainer();
  if (!playerContainer) return;

  const typeLabel = formatSkipType(skip.type) || "default";

  const prompt = document.createElement("div");
  prompt.id = VOTE_PROMPT_ID;
  prompt.className = "skipit-toast skipit-toast--block skipit-toast--rise skipit-vote-prompt";

  const header = document.createElement("span");
  header.className = "skipit-vote-header";
  // In discreet mode the colour must not give the category away
  header.appendChild(
    createToastMark({ kind: "scene", type: currentDiscreetMode ? "accent" : typeLabel })
  );
  header.appendChild(createToastSpan("skipit-toast-gap", ""));
  header.appendChild(
    createToastSpan(
      "skipit-toast-primary",
      // The prompt fires before the skip, so discreet wording stays forward-looking
      currentDiscreetMode
        ? "Skip this scene?"
        : `${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)} scene?`
    )
  );
  header.appendChild(createToastSpan("skipit-toast-div", ""));
  header.appendChild(
    createToastSpan(
      "skipit-toast-secondary",
      `${formatTimeMs(skip.startTime)} → ${formatTimeMs(skip.endTime)}`
    )
  );
  prompt.appendChild(header);

  const actions = document.createElement("span");
  actions.className = "skipit-vote-actions";
  actions.appendChild(
    createVoteButton("upvote", ICON_THUMB_UP, "Yes, skip it", () =>
      handleVote(skip.id, 1, skip.endTime)
    )
  );
  actions.appendChild(
    createVoteButton(
      "downvote",
      ICON_THUMB_DOWN,
      // "No, it's not" means "not a <category> scene", meaningless once the category is hidden
      currentDiscreetMode ? "No, it's fine" : "No, it's not",
      () => handleVote(skip.id, -1, null)
    )
  );
  prompt.appendChild(actions);

  playerContainer.appendChild(prompt);

  votePromptFrame = requestAnimationFrame(() => {
    votePromptFrame = null;
    prompt.classList.add("visible");
  });
}

/**
 * Hide the vote prompt
 */
function hideVotePrompt() {
  if (votePromptFrame !== null) {
    cancelAnimationFrame(votePromptFrame);
    votePromptFrame = null;
  }

  const prompt = document.getElementById(VOTE_PROMPT_ID);
  if (prompt) {
    // Give up the id before the fade, so a re-show within 250ms doesn't create a
    // second element under the same id that the next hide can't find.
    prompt.id = "";
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
  lastNotifiedSegment = null;
  announceHoldUntil = 0;
  cancelDeferredSkipToast();

  // A message about the user's own action (marked, voted, a notice) outlives a
  // stop and dismisses itself on its own timer.
  const toast = document.getElementById(NOTIFICATION_ID);
  if (toast && !toast.dataset.skipEvent && notificationTimeout) return;

  hideSkipNotification();
  if (toast) toast.remove();
}


// ============================================================================
// PROFANITY MUTE
// ============================================================================
//
// Mutes the audio for any subtitle line that contains a bad word, and stars the
// word out on screen (e.g. "f***").
//
// Source of truth is ONLY what Netflix renders into the page as the video plays
// (the timed-text DOM). We never fetch or read subtitle files ahead of time.
//
// - Subtitles ON (user's choice): we read the visible line and censor it in place.
// - Subtitles OFF: "silent subtitles" - we turn on a text track in the audio's
//   language and hide it, then read it the same way. Turning the feature off
//   restores "Off". If the user picks a subtitle track themselves, it's theirs:
//   we stop hiding and just read it.
//
// Granularity is the whole line: we mute from the moment the line appears until
// it goes away. When subtitles are silent, that line is shown (starred) while
// it's muted, so the user still gets the context of what was said.

// Word lists, keyed by BCP-47 primary language. "word*" matches the word plus
// any trailing letters (fuck* -> fucking, fucker). Matching is whole-word,
// case-insensitive and Unicode-aware, so "ass" never matches "assassin".
// Each match mutes a whole line, so a word with a common innocent meaning is
// left out: missing a word is better than muting ordinary dialogue.
//
// Adding a language: add a key named after its primary language code ("ar",
// "nl", ...); nothing else needs changing. The list applies whenever the
// subtitles being read are in that language. Have a native speaker review it
// first, and put phrases that must never mute in PROFANITY_EXCEPTIONS below.
// Check it in the Netflix console with
// window.skipitProfanityMute.test("some line", "ar").
const PROFANITY_WORDS = {
  en: [
    "fuck*", "motherfuck*", "fck*", "shit*", "bullshit*", "horseshit*",
    "bitch*", "bastard*", "asshole*", "ass", "arse", "arsehole*", "dumbass*",
    "jackass*", "dick", "dicks", "dickhead*", "cock", "cocks", "cocksuck*",
    "cunt*", "pussy", "pussies", "twat*", "wank*", "whore*", "slut*", "damn",
    "damned", "damnit", "dammit", "goddamn*", "god damn*", "bollocks", "piss",
    "pissed", "cum", "fag", "fags", "faggot*", "nigga*", "nigger*", "retard",
    "retarded", "hell", "crap", "prick", "pricks", "douche*", "tits",
    "blowjob*", "handjob*", "jizz*", "bugger*", "spic", "spics", "kike", "kikes", "wetback*", "tranny", "trannies",
  ],
  // The lists below are conservative and not reviewed by native speakers.
  es: [
    "puta*", "puto*", "mierda*", "joder", "jodido*", "jodida*", "jódete",
    "jodete", "coño", "cabrón", "cabron", "cabrones", "cabrona*", "pendej*",
    "gilipoll*", "chinga*", "verga*", "culero*", "hijueputa*", "carajo",
    "cojones", "cojón", "cojon", "culo", "culos", "follar", "follando",
    "follado", "follada", "cagar", "cago", "cagada", "cagado", "pinche",
    "pinches", "mamada", "mamadas", "pelotudo*", "pelotuda*", "maricón",
    "maricon", "maricones", "marica", "maricas", "joto", "jotos", "sudaca",
    "sudacas", "negrata*",
  ],
  fr: [
    "putain*", "merde*", "merdique*", "emmerd*", "connard*", "connasse*",
    "connerie*", "salope*", "salaud", "salauds", "enculé*", "encule*", "pute*",
    "niquer", "nique", "niqué", "niquée", "ta gueule", "bordel", "chier",
    "chiant", "chiante", "chiants", "chiantes", "foutre", "foutu", "foutue",
    "foutus", "foutues", "bite", "bites", "couille", "couilles", "couillon*",
    "trou du cul", "trou de cul", "enfoiré*", "enfoire*", "bâtard*", "batard*",
    "pétasse*", "petasse*", "pouffiasse*", "branleur*", "branlette*", "branler",
    "pédé", "pédés", "pede", "pedes", "gouine", "gouines", "tarlouze*",
    "négro", "négros", "negro", "negros", "bougnoule*", "bicot*", "youpin*",
  ],
  de: [
    "scheiße*", "scheisse*", "scheiß*", "scheiss*", "fick*", "verfickt*",
    "arsch*", "ärsche", "arschloch*", "hurensohn*", "hure", "huren", "fotze*",
    "wichser*", "wichsen", "schlampe*", "verdammt*", "gottverdammt*", "kacke",
    "kacken", "mistkerl*", "miststück*", "drecksau", "dreckskerl*",
    "drecksack*", "titten", "möse", "moese", "pimmel", "missgeburt*",
    "schwuchtel*", "kanake", "kanaken", "neger", "spast", "spasti", "spasten",
    "itaker", "polacke", "polacken", "tunte", "tunten",
  ],
  pt: [
    "porra*", "caralho*", "merda*", "foda*", "fodase", "fodasse", "foder",
    "fodido*", "fodida*", "fodendo", "puta*", "cacete", "buceta*", "piroca*",
    "xoxota*", "cu", "cuzão", "cuzao", "cabrão", "cabrao", "cabrões", "vadia",
    "vadias", "viado*", "sapatão", "sapatao", "paneleiro*",
  ],
  it: [
    "cazzo*", "cazzat*", "cazzon*", "incazzat*", "sticazzi", "merda*",
    "stronz*", "vaffanculo*", "fanculo*", "puttana*", "mignotta*", "zoccola*",
    "minchia*", "coglion*", "rompicoglion*", "bastard*", "fott*", "cagata",
    "cagate", "frocio", "froci", "ricchion*", "negro", "terrone",
    "terroni",
  ],
};

// Spans that look like a match but are not swearing (titles, names, phrases).
// A match inside one of these is left alone. Same rules as the lists above,
// except "." is literal and every space matches any whitespace.
const PROFANITY_EXCEPTIONS = {
  en: [
    "cum laude", "Moby Dick", "Moby-Dick", "Hell's Kitchen", "Hell’s Kitchen", "spic and span", "Philip K. Dick", "Philip K Dick", "Dick Tracy",
    "Dick Van Dyke",
  ],
};

// Netflix's rendered subtitle container. Kept as a list so a Netflix markup
// change only needs a selector added here.
const TIMEDTEXT_SELECTORS = [".player-timedtext"];

const PROFANITY_CHECK_INTERVAL = 500;

// How the silent track is hidden. opacity (not display:none) so Netflix keeps
// rendering cues into the DOM. Kept as one rule so it's easy to swap.
const PROFANITY_HIDE_CSS = "opacity: 0 !important;";
const PROFANITY_TRACK_RETRY_MS = 5000;
const PROFANITY_REVEAL_CLASS = "skipit-pm-reveal-line"; // Show a muted line while subs are silent
const PROFANITY_RESTORE_ATTEMPTS = 15; // ~15s for Netflix to load tracks on page load
const PROFANITY_TRACK_MAX_RETRIES = 2; // Re-sets per video if the silent track never shows up
// A marker older than this is ignored: by then the track may be one the user
// chose themselves (e.g. on another device), which we must never hide
const PROFANITY_MARKER_MAX_AGE_MS = 60 * 60 * 1000;
// After giving up on the silent track, it still counts as ours if Netflix
// turns it on this late (unless the user picks a track in the menu first)
const PROFANITY_LATE_TRACK_MS = 2 * 60 * 1000;

const profanityRegexCache = {};
const profanityExceptionCache = {};

function profanityLangKey(bcp47) {
  return (bcp47 || "").toLowerCase().split("-")[0];
}

/** One whole-word, case-insensitive regex for a list of words and phrases. */
function compileWordList(words) {
  const alternatives = [...words]
    // Longest first so "motherfuck*" wins over "fuck*" inside the alternation
    .sort((a, b) => b.length - a.length)
    .map((word) =>
      word
        .replace(/[.*+?^${}()|[\]\\]/g, (c) => (c === "*" ? "*" : "\\" + c))
        .replace(/\*$/, "[\\p{L}\\p{M}]*")
        .replace(/ /g, "\\s+")
    );
  return new RegExp(
    `(?<![\\p{L}\\p{M}\\p{N}])(?:${alternatives.join("|")})(?![\\p{L}\\p{M}\\p{N}])`,
    "giu"
  );
}

/**
 * Build (and cache) the matcher for a subtitle language. Returns null for a
 * language without a list: combining every list would star ordinary words
 * ("fick*" matches "fickle").
 */
function getProfanityRegex(bcp47) {
  const key = profanityLangKey(bcp47);
  if (!PROFANITY_WORDS[key]) return null;
  if (!profanityRegexCache[key]) {
    profanityRegexCache[key] = compileWordList(PROFANITY_WORDS[key]);
  }
  return profanityRegexCache[key];
}

/** The exceptions matcher for a language, or null if it has none. */
function getProfanityExceptionRegex(bcp47) {
  const key = profanityLangKey(bcp47);
  if (!PROFANITY_EXCEPTIONS[key]) return null;
  if (!profanityExceptionCache[key]) {
    profanityExceptionCache[key] = compileWordList(PROFANITY_EXCEPTIONS[key]);
  }
  return profanityExceptionCache[key];
}

/**
 * Star every bad word in a piece of text, skipping matches inside an
 * exception span. Returns the new text, or null if nothing was starred.
 */
function censorText(text, regex, exceptionRegex) {
  regex.lastIndex = 0;
  if (!regex.test(text)) return null;

  const spans = [];
  if (exceptionRegex) {
    for (const m of text.matchAll(exceptionRegex)) {
      spans.push([m.index, m.index + m[0].length]);
    }
  }

  let changed = false;
  regex.lastIndex = 0;
  const result = text.replace(regex, (match, offset) => {
    const end = offset + match.length;
    if (spans.some(([s, e]) => offset < e && end > s)) return match;
    changed = true;
    return censorWord(match);
  });
  return changed ? result : null;
}

/**
 * Keep the first letter, star the rest: "fucking" -> "f******"
 */
function censorWord(word) {
  let seenFirst = false;
  return word.replace(/[\p{L}\p{M}]/gu, (c) => {
    if (!seenFirst) {
      seenFirst = true;
      return c;
    }
    return "*";
  });
}

function profanityLog(...args) {
  try {
    if (localStorage.getItem("skipit_pm_debug") === "1") {
      console.log("[Skipit Mute]", ...args);
    }
  } catch (e) {
    // localStorage can throw in some privacy modes - logging is optional
  }
}

// ----------------------------------------------------------------------------
// Netflix player access
// ----------------------------------------------------------------------------

function getProfanityPlayer() {
  try {
    if (!isNetflixPlayerReady()) return null;
    const videoPlayer =
      window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const sessionId = videoPlayer.getAllPlayerSessionIds()[0];
    return sessionId ? videoPlayer.getVideoPlayerBySessionId(sessionId) : null;
  } catch (error) {
    return null;
  }
}

function callPlayer(player, method, ...args) {
  try {
    if (player && typeof player[method] === "function") {
      return player[method](...args);
    }
  } catch (error) {
    profanityLog(`player.${method} failed:`, error);
  }
  return undefined;
}

/**
 * Identify a track by language + name rather than trackId: the getter may
 * return a different object (or id field) than the one we passed to the setter.
 */
function textTrackKey(track) {
  return track ? `${track.bcp47 || ""}|${track.displayName || ""}` : null;
}

function isOffTextTrack(track) {
  return (
    !track ||
    track.isNoneTrack === true ||
    track.trackId === "none" ||
    /^(off|none)$/i.test(track.displayName || "")
  );
}

function isImageTextTrack(track) {
  return (
    track.isImageBased === true ||
    /image/i.test(String(track.rawTrackType || track.trackType || ""))
  );
}

function isForcedTextTrack(track) {
  return track.isForcedNarrative === true || track.isForced === true;
}

/**
 * Pick a readable text track in the audio's language (exact match first, then
 * same primary language). Returns null if none - a mismatched language
 * wouldn't line up with what's being said.
 */
function pickSilentTextTrack(player) {
  const tracks = callPlayer(player, "getTimedTextTrackList") || [];
  const audioLang = (callPlayer(player, "getAudioTrack")?.bcp47 || "").toLowerCase();
  // No word list for this language: a hidden track would do nothing
  if (!audioLang || !getProfanityRegex(audioLang)) return null;

  const readable = tracks.filter(
    (t) => !isOffTextTrack(t) && !isImageTextTrack(t) && !isForcedTextTrack(t)
  );
  const primary = audioLang.split("-")[0];
  const sameLang = readable.filter(
    (t) => (t.bcp47 || "").toLowerCase().split("-")[0] === primary
  );
  const exact = sameLang.filter((t) => (t.bcp47 || "").toLowerCase() === audioLang);
  // Closed captions are closer to verbatim than subtitles, which condense
  // speech and sometimes drop swear words
  const isCC = (t) =>
    /closed|sdh/i.test(String(t.rawTrackType || "")) ||
    /\b(CC|SDH)\b/.test(t.displayName || "");
  return (
    exact.find(isCC) || exact[0] || sameLang.find(isCC) || sameLang[0] || null
  );
}

/**
 * The only place we change the user's subtitle track. Always logged (it should
 * happen about once per video) so a reset loop is easy to spot.
 */
function setTextTrack(player, track, reason) {
  profanityTrackSetCount++;
  console.log(
    `[Skipit Mute] setTimedTextTrack #${profanityTrackSetCount} -> ` +
      `${track.displayName || track.bcp47} (${reason})`
  );
  callPlayer(player, "setTimedTextTrack", track);
}

// The marker is per tab: localStorage is shared by every Netflix tab, and
// another tab's marker could match a track the user chose here. The tab id
// lives in sessionStorage, which survives this tab's reloads. Chrome copies
// sessionStorage into duplicated tabs, so each marker also records the page
// (document) that wrote it: a live marker under our tab id from another page
// means we're a copy, and we take a new id (unless this page is a reload or a
// discarded tab coming back: then it's our own crashed page). On pagehide or
// freeze the marker is marked closed; a closed, fresh marker is picked up by
// the next /watch/ page (this tab reloaded, or a new tab), so a silent track
// left on is still recognised.
const profanityDocId = Math.random().toString(36).slice(2, 10);
let profanityTabId = null;

function newProfanityTabId() {
  profanityTabId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  try {
    sessionStorage.setItem(PROFANITY_TAB_ID_KEY, profanityTabId);
  } catch (e) {
    // No sessionStorage: the marker only lasts this page
  }
  return profanityTabId;
}

function getProfanityTabId() {
  if (profanityTabId) return profanityTabId;
  try {
    profanityTabId = sessionStorage.getItem(PROFANITY_TAB_ID_KEY);
  } catch (e) {
    // Falls through to a fresh id
  }
  return profanityTabId || newProfanityTabId();
}

function ownedTrackMarkerStorageKey() {
  return `${PROFANITY_OWNED_TRACK_KEY}:${getProfanityTabId()}`;
}

/** A stored marker, or null if missing, unreadable or too old to trust. */
function readMarkerAt(name) {
  try {
    const marker = JSON.parse(localStorage.getItem(name) || "null");
    if (!marker?.key || !(Date.now() - marker.at < PROFANITY_MARKER_MAX_AGE_MS)) return null;
    return marker;
  } catch (e) {
    return null;
  }
}

// How this page was opened, read once at load. A reload (including after a
// crash) or a discarded tab coming back is still this tab.
const profanitySameTabReload = (() => {
  try {
    if (document.wasDiscarded === true) return true;
    return performance.getEntriesByType("navigation")[0]?.type === "reload";
  } catch (e) {
    return false;
  }
})();

/**
 * Another open page (a duplicated tab) holds our tab id: take a new one. A
 * live marker from another page after a reload or discard is our own (the
 * page crashed or was discarded without pagehide), so it is kept.
 */
function ensureOwnTabId({ claiming = false } = {}) {
  const marker = readMarkerAt(ownedTrackMarkerStorageKey());
  if (!marker || marker.closed || marker.doc === profanityDocId) return;
  // Only when claiming at load: on later writes, another page's live marker
  // under our id always means a second tab, never our own crashed page
  if (claiming && profanitySameTabReload) return;
  newProfanityTabId();
}

function listMarkerNames() {
  const prefix = `${PROFANITY_OWNED_TRACK_KEY}:`;
  const names = [];
  for (let i = 0; i < localStorage.length; i++) {
    const name = localStorage.key(i);
    if (name === PROFANITY_OWNED_TRACK_KEY || name?.startsWith(prefix)) names.push(name);
  }
  return names;
}

/**
 * The marker this page would claim: our tab's own, or else the newest closed
 * one another page left (the legacy shared marker counts as closed). Other
 * tabs' live markers are left alone. Read-only.
 */
function findClaimableMarker(names, ownName) {
  let best = null;
  for (const name of names) {
    const marker = readMarkerAt(name);
    if (!marker) continue;
    const closed = marker.closed || name === PROFANITY_OWNED_TRACK_KEY;
    if (name === ownName) return { name, marker };
    if (closed && !(best && best.marker.at >= marker.at)) best = { name, marker };
  }
  return best;
}

/** True if this page has a marker, or could claim one on a /watch/ page. */
function hasClaimableMarker() {
  if (readOwnedTrackMarker()) return true;
  try {
    return !!findClaimableMarker(listMarkerNames(), ownedTrackMarkerStorageKey());
  } catch (e) {
    return false;
  }
}

/**
 * Once per page, on the first /watch/ tick (a /browse page never claims, so
 * the marker waits for the tab that plays the video). Expired markers are
 * dropped.
 */
let profanityMarkerClaimed = false;
function claimOwnedTrackMarker() {
  if (profanityMarkerClaimed) return;
  profanityMarkerClaimed = true;
  try {
    ensureOwnTabId({ claiming: true });
    const ownName = ownedTrackMarkerStorageKey();
    const names = listMarkerNames();
    const live = names.filter((name) => {
      if (readMarkerAt(name)) return true;
      localStorage.removeItem(name);
      return false;
    });
    const best = findClaimableMarker(live, ownName);
    if (best) {
      localStorage.removeItem(best.name);
      localStorage.setItem(
        ownName,
        JSON.stringify({ key: best.marker.key, at: best.marker.at, doc: profanityDocId })
      );
    }
  } catch (e) {
    // Best-effort
  }
}

/** This page's marker, or null if missing or too old to trust. */
function readOwnedTrackMarker() {
  const marker = readMarkerAt(ownedTrackMarkerStorageKey());
  return marker?.doc === profanityDocId ? marker : null;
}

function writeOwnedTrackMarker(key) {
  try {
    ensureOwnTabId();
    if (key) {
      localStorage.setItem(
        ownedTrackMarkerStorageKey(),
        JSON.stringify({ key, at: Date.now(), doc: profanityDocId })
      );
    } else if (readOwnedTrackMarker()) {
      localStorage.removeItem(ownedTrackMarkerStorageKey());
    }
  } catch (e) {
    // Marker is best-effort (used only to recognise our track after a reload)
  }
}

/** pagehide: let the next page (reload or new tab) pick up our marker. */
function setOwnedTrackMarkerClosed(closed) {
  const marker = readOwnedTrackMarker();
  if (!marker || !!marker.closed === closed) return;
  try {
    localStorage.setItem(ownedTrackMarkerStorageKey(), JSON.stringify({ ...marker, closed }));
  } catch (e) {
    // Best-effort
  }
}

/**
 * Keep the marker's age current while the track is ours, so a long session
 * (next episode, reload) still recognises it. Throttled: called every tick.
 */
function refreshOwnedTrackMarker() {
  if (profanityOwnedTrackKey === null) return;
  const marker = readOwnedTrackMarker();
  if (marker?.key === profanityOwnedTrackKey && Date.now() - marker.at < 5 * 60 * 1000) {
    return;
  }
  writeOwnedTrackMarker(profanityOwnedTrackKey);
}

function setSubtitlesHidden(hidden) {
  const root = document.documentElement;
  if (root.classList.contains(PROFANITY_HIDE_CLASS) !== hidden) {
    root.classList.toggle(PROFANITY_HIDE_CLASS, hidden);
  }
}

function injectProfanityStyles() {
  if (document.getElementById("skipit-pm-styles")) return;
  const style = document.createElement("style");
  style.id = "skipit-pm-styles";
  style.textContent =
    TIMEDTEXT_SELECTORS.map(
      (selector) =>
        `.${PROFANITY_HIDE_CLASS} ${selector} { ${PROFANITY_HIDE_CSS} }\n` +
        `.${PROFANITY_HIDE_CLASS}.${PROFANITY_REVEAL_CLASS} ${selector} { opacity: 1 !important; }`
    ).join("\n") + PROFANITY_MENU_CSS;
  document.head.appendChild(style);
}

// ----------------------------------------------------------------------------
// Silent subtitles (subtitles off -> hidden track)
// ----------------------------------------------------------------------------

// True once the getter has reported our track since we set it. Until then we
// never re-set it: the getter can lag behind the setter, and re-setting makes
// Netflix reload the track (a likely cause of late lines).
let profanityOwnedTrackConfirmed = false;

function enableSilentTrack(player, reason) {
  const track = pickSilentTextTrack(player);
  if (!track) {
    profanityNextTrackAttemptAt = Date.now() + PROFANITY_TRACK_RETRY_MS;
    profanityLog("No readable text track in the audio language");
    return;
  }

  // Hide first so the track never flashes on screen
  setSubtitlesHidden(true);
  setTextTrack(player, track, reason);
  profanityOwnedTrackKey = textTrackKey(track);
  profanityOwnedTrackConfirmed = false;
  profanityTrackSetAt = Date.now();
  writeOwnedTrackMarker(profanityOwnedTrackKey);
}

/**
 * Put the user's "subtitles off" choice back if the current track is ours.
 * Returns false if Netflix hasn't loaded its tracks yet (caller retries).
 */
function restoreOffTrack(player, { keepMarker = false } = {}) {
  const marker = readOwnedTrackMarker();
  // A silent track we gave up on counts too: Netflix may have applied it late
  const ownedKey =
    profanityOwnedTrackKey || marker?.key || getLateTrackKey() || null;
  const current = callPlayer(player, "getTimedTextTrack");
  if (!current && ownedKey) return false;
  const currentKey = textTrackKey(current);

  // Our set hasn't landed yet (getter lags): wait for it, or Netflix turns the
  // track on after we've let go and it shows up as the user's (caller retries)
  if (
    profanityOwnedTrackKey !== null &&
    !profanityOwnedTrackConfirmed &&
    currentKey !== profanityOwnedTrackKey &&
    Date.now() - profanityTrackSetAt < PROFANITY_TRACK_RETRY_MS
  ) {
    return false;
  }

  // The track we were switching away from (new audio language) is ours too
  const isOurs =
    currentKey === ownedKey ||
    currentKey === getLateTrackKey() ||
    (profanityPendingFrom !== null && currentKey === profanityPendingFrom.key);
  if (current && !isOffTextTrack(current) && isOurs) {
    const offTrack = (callPlayer(player, "getTimedTextTrackList") || []).find(
      isOffTextTrack
    );
    // No Off entry (yet): retry rather than reveal the silent track
    if (!offTrack) return false;
    setTextTrack(player, offTrack, "restore Off");
  }

  profanityOwnedTrackKey = null;
  profanityOwnedTrackConfirmed = false;
  profanityGaveUpTrack = null;
  profanityPendingFrom = null;
  if (!keepMarker) writeOwnedTrackMarker(null);
  setSubtitlesHidden(false);
  syncSubtitleMenu();
  return true;
}

/** Key of the silent track we gave up on for this video, while it may still turn up. */
function getLateTrackKey() {
  const record = profanityGaveUpTrack;
  if (!record || record.videoId !== profanityVideoId) return null;
  if (!(Date.now() - record.at < PROFANITY_LATE_TRACK_MS)) return null;
  return record.key;
}

/** Treat the current track as our silent one: hide it and keep "Off" ticked. */
function adoptOwnedTrack(key, reason) {
  profanityOwnedTrackKey = key;
  profanityOwnedTrackConfirmed = true;
  profanityGaveUpTrack = null;
  writeOwnedTrackMarker(key);
  setSubtitlesHidden(true);
  syncSubtitleMenu();
  profanityLog("Silent track adopted:", reason);
}

/**
 * The audio language changed (e.g. a dub) while our silent track is on: pick
 * one in the new language, or put "Off" back if there is none. Only for our
 * own track, and once per language per video so a lagging getter can't loop.
 */
function followAudioLanguage(player, current) {
  const audioLang = profanityLangKey(callPlayer(player, "getAudioTrack")?.bcp47);
  if (!audioLang || audioLang === profanityLangKey(current.bcp47)) return;
  if (audioLang === profanityAudioRepickLang) return;

  const fromKey = profanityOwnedTrackKey;
  if (pickSilentTextTrack(player)) {
    profanityAudioRepickLang = audioLang;
    profanityPendingFrom = { key: fromKey, at: Date.now() };
    enableSilentTrack(player, "audio language changed");
  } else if (restoreOffTrack(player)) {
    // No word list or no track for the new language
    profanityAudioRepickLang = audioLang;
    profanityPendingFrom = { key: fromKey, at: Date.now() };
    setSubtitlesHidden(true); // Until Netflix has really switched it off
  }
}

/**
 * Decide who owns the current subtitle track and keep silent subtitles alive.
 * When the user has their own track on, this never hides or changes anything.
 */
function manageTextTrack(player) {
  const current = callPlayer(player, "getTimedTextTrack");
  // undefined: API not available. null: Netflix still loading tracks - don't
  // guess, or we could override a choice the user made.
  if (!current) return;
  const currentKey = textTrackKey(current);

  // We just asked Netflix to switch away from our track (new audio language)
  // and the getter still reports it: wait, hidden. If it never changes,
  // Netflix ignored the set and the track is still ours.
  if (profanityPendingFrom) {
    if (currentKey === profanityPendingFrom.key) {
      if (Date.now() - profanityPendingFrom.at < PROFANITY_TRACK_RETRY_MS) {
        setSubtitlesHidden(true);
        return;
      }
      profanityPendingFrom = null;
      const repickedKey = profanityOwnedTrackKey;
      adoptOwnedTrack(currentKey, "Netflix kept the previous track");
      // Netflix may still apply the re-pick late: then it's ours, not the user's
      if (repickedKey && repickedKey !== currentKey) {
        profanityGaveUpTrack = { videoId: profanityVideoId, key: repickedKey, at: Date.now() };
      }
      return;
    }
    profanityPendingFrom = null;
  }

  if (profanityOwnedTrackKey !== null) {
    if (currentKey === profanityOwnedTrackKey) {
      profanityOwnedTrackConfirmed = true;
      refreshOwnedTrackMarker();
      followAudioLanguage(player, current);
      return;
    }
    if (isOffTextTrack(current)) {
      // Off after we saw our track = the user picked "Off" from the menu:
      // keep muting with a fresh silent track. Off before we ever saw it =
      // the getter is lagging behind our set: wait, don't re-set - unless
      // it's been long enough that Netflix most likely ignored the set.
      if (profanityOwnedTrackConfirmed) {
        enableSilentTrack(player, "user picked Off");
      } else if (Date.now() - profanityTrackSetAt >= PROFANITY_TRACK_RETRY_MS) {
        if (profanityTrackRetries < PROFANITY_TRACK_MAX_RETRIES) {
          profanityTrackRetries++;
          enableSilentTrack(player, "silent track never confirmed");
        } else {
          // Give up for this video. Stay hidden: the user had subtitles off, so
          // if the track did turn on after all, they still shouldn't see it.
          profanityLog("Silent track never confirmed - giving up for this video");
          // Netflix may still apply it late: then it's ours, not the user's
          profanityGaveUpTrack = {
            videoId: profanityVideoId,
            key: profanityOwnedTrackKey,
            at: Date.now(),
          };
          profanityOwnedTrackKey = null;
          writeOwnedTrackMarker(null);
          syncSubtitleMenu();
          profanityNextTrackAttemptAt = Infinity;
        }
      }
      return;
    }
    // A re-pick we gave up on, applied late by Netflix: still ours
    if (currentKey === getLateTrackKey()) {
      adoptOwnedTrack(currentKey, "re-picked track turned on late");
      return;
    }
    // A different real track: the user picked a language. It's theirs - show it.
    releaseSilentTrack("user selected another language");
    return;
  }

  if (isOffTextTrack(current)) {
    if (Date.now() >= profanityNextTrackAttemptAt) enableSilentTrack(player, "subtitles off");
    return;
  }

  // A track is on and we don't own it. After a reload or episode change it may
  // still be the one we turned on earlier: recognise it by the marker.
  const marker = readOwnedTrackMarker();
  if (marker && textTrackKey(current) === marker.key) {
    profanityOwnedTrackKey = marker.key;
    profanityOwnedTrackConfirmed = true;
    setSubtitlesHidden(true);
    return;
  }

  // The silent track we gave up on, applied late by Netflix: still ours
  if (currentKey === getLateTrackKey()) {
    adoptOwnedTrack(currentKey, "silent track turned on late");
    return;
  }

  // User's own visible subtitles
  setSubtitlesHidden(false);
}

// ----------------------------------------------------------------------------
// Subtitle menu: keep "Off" ticked while subtitles are silent
// ----------------------------------------------------------------------------
//
// Netflix's menu ticks the track that's really on (our silent one). While we
// own it, we make "Off" look selected instead, without restructuring Netflix's
// (React) DOM: we only swap the two labels' classes and draw the tick with CSS.
// Clicks behave as if "Off" were really selected: clicking "Off" does nothing,
// clicking the silent track's language shows those subtitles. A small
// "Skipit muting" badge next to "Off" tells the user why muting still works.

const SUBTITLE_MENU_SELECTOR = '[data-uia="selector-audio-subtitle"]';
const SUBTITLE_ITEM_SELECTOR = 'li[data-uia^="subtitle-item-"]';
const SUBTITLE_SELECTED_PREFIX = "subtitle-item-selected-";
const PM_MENU_ATTR = "data-skipit-pm"; // "off" (shown ticked) | "real" (shown unticked) | "silent" (Off not found, left as is)
const PM_CLASS_ATTR = "data-skipit-pm-class"; // label's original class, for undo
const CHECK_ICON_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="m21.3 4.3 1.4 1.4-14 14a1 1 0 0 1-1.4 0l-7-7 1.4-1.4L8 17.58z"/></svg>'
  );

const PM_CHECK_STYLE_ID = "skipit-pm-check-style";
// Layout properties copied from Netflix's real tick so ours sits in exactly
// the same spot (Netflix positions it out of the text flow).
const CHECK_LAYOUT_PROPS = [
  "position", "top", "right", "bottom", "left", "transform", "float",
  "display", "vertical-align", "width", "height", "margin",
];

let profanityMenuObserver = null;

const PROFANITY_MENU_CSS = `
li[${PM_MENU_ATTR}="real"] svg { display: none !important; }
li[${PM_MENU_ATTR}="off"] > div::before {
  content: "";
  width: 24px;
  height: 24px;
  background-color: currentColor;
  -webkit-mask: url("${CHECK_ICON_SVG}") center / contain no-repeat;
  mask: url("${CHECK_ICON_SVG}") center / contain no-repeat;
}
li[${PM_MENU_ATTR}="off"] > div > div::after {
  content: "Skipit muting";
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  vertical-align: middle;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.92);
}`;

/**
 * Copy the real tick's computed layout into our pseudo-element's rule. Only
 * read while Netflix's tick is visible (before we hide it).
 */
function captureCheckLayout(check) {
  const cs = getComputedStyle(check);
  const rules = CHECK_LAYOUT_PROPS.map(
    (prop) => `${prop}: ${cs.getPropertyValue(prop)};`
  ).join(" ");
  let style = document.getElementById(PM_CHECK_STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = PM_CHECK_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `li[${PM_MENU_ATTR}="off"] > div::before { ${rules} }`;
}

/** The label element inside a menu item (the div holding its text). */
function getMenuItemLabel(li) {
  const wrapper = li.firstElementChild;
  if (!wrapper) return null;
  return [...wrapper.children].find((el) => el.tagName !== "svg") || null;
}

function findOffMenuItem(items) {
  const offName = (
    (callPlayer(getProfanityPlayer(), "getTimedTextTrackList") || []).find(isOffTextTrack)
      ?.displayName || "Off"
  ).trim();
  return (
    items.find((li) => li.textContent.trim() === offName) ||
    items.find((li) => li.getAttribute("data-uia") === "subtitle-item-Off") ||
    null
  );
}

/**
 * Make the open menu show "Off" as selected. Idempotent: React may re-render
 * the menu and reset classes, so this re-runs on every DOM change.
 */
function patchSubtitleMenu() {
  const menu = document.querySelector(SUBTITLE_MENU_SELECTOR);
  if (!menu) return;
  const items = [...menu.querySelectorAll(SUBTITLE_ITEM_SELECTOR)];
  const real = items.find((li) =>
    (li.getAttribute("data-uia") || "").startsWith(SUBTITLE_SELECTED_PREFIX)
  );
  if (!real) return;
  const firstPatch = real.getAttribute(PM_MENU_ATTR) !== "real";
  // Marked before looking for "Off": even if Off can't be found (other UI
  // languages), clicking the silent track's language still reveals it. Its
  // tick stays visible until "Off" is found and can take it.
  if (firstPatch) real.setAttribute(PM_MENU_ATTR, "silent");
  const off = findOffMenuItem(items);
  if (!off || real === off) return;

  const realLabel = getMenuItemLabel(real);
  const offLabel = getMenuItemLabel(off);
  if (!realLabel || !offLabel) return;

  // Already patched and React hasn't reset it
  if (
    real.getAttribute(PM_MENU_ATTR) === "real" &&
    off.getAttribute(PM_MENU_ATTR) === "off" &&
    offLabel.className === realLabel.getAttribute(PM_CLASS_ATTR)
  ) {
    return;
  }

  const selectedClass = realLabel.getAttribute(PM_CLASS_ATTR) || realLabel.className;
  const normalClass = offLabel.getAttribute(PM_CLASS_ATTR) || offLabel.className;

  // Draw our tick exactly where Netflix draws its own
  const check = real.querySelector("svg");
  if (check && firstPatch) captureCheckLayout(check);

  realLabel.setAttribute(PM_CLASS_ATTR, selectedClass);
  offLabel.setAttribute(PM_CLASS_ATTR, normalClass);
  realLabel.className = normalClass;
  offLabel.className = selectedClass;
  real.setAttribute(PM_MENU_ATTR, "real");
  off.setAttribute(PM_MENU_ATTR, "off");
}

/** Undo the patch (we no longer own the track, or the feature is off). */
function unpatchSubtitleMenu() {
  document.querySelectorAll(`li[${PM_MENU_ATTR}]`).forEach((li) => {
    const label = getMenuItemLabel(li);
    if (label && label.hasAttribute(PM_CLASS_ATTR)) {
      label.className = label.getAttribute(PM_CLASS_ATTR);
      label.removeAttribute(PM_CLASS_ATTR);
    }
    li.removeAttribute(PM_MENU_ATTR);
  });
}

function syncSubtitleMenu() {
  if (profanityMuteEnabled && profanityOwnedTrackKey !== null) {
    patchSubtitleMenu();
  } else if (document.querySelector(`li[${PM_MENU_ATTR}]`)) {
    unpatchSubtitleMenu();
  }
}

/**
 * Clicks (and Enter/Space) on the patched items, handled before Netflix sees them.
 */
function handleSubtitleMenuActivate(event) {
  if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
  const li = event.target?.closest?.(`li[${PM_MENU_ATTR}]`);
  if (!li) {
    // The user picked a track in the menu: whatever turns on now is theirs,
    // even if it's the silent track we gave up on or are switching away from
    if (event.target?.closest?.(SUBTITLE_ITEM_SELECTOR)) {
      profanityGaveUpTrack = null;
      profanityPendingFrom = null;
    }
    return;
  }

  if (li.getAttribute(PM_MENU_ATTR) === "off") {
    // "Off" looks selected: selecting it again is a no-op, like Netflix's own
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  profanityGaveUpTrack = null;
  profanityPendingFrom = null;

  // The silent track's language: the user wants to see these subtitles.
  // Netflix treats it as already selected, so we just stop hiding it.
  releaseSilentTrack("user selected the silent track's language");
}

/**
 * The user took over the current track: stop hiding it and forget it's ours.
 */
function releaseSilentTrack(reason) {
  profanityOwnedTrackKey = null;
  profanityOwnedTrackConfirmed = false;
  writeOwnedTrackMarker(null);
  setSubtitlesHidden(false);
  syncSubtitleMenu();
  profanityLog("Released silent track:", reason);
}

function startSubtitleMenuWatcher() {
  if (!profanityMenuObserver) {
    // Runs before paint, so the real tick never flashes when the menu opens
    profanityMenuObserver = new MutationObserver(syncSubtitleMenu);
  }
  profanityMenuObserver.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", handleSubtitleMenuActivate, true);
  document.addEventListener("keydown", handleSubtitleMenuActivate, true);
}

function stopSubtitleMenuWatcher() {
  if (profanityMenuObserver) profanityMenuObserver.disconnect();
  document.removeEventListener("click", handleSubtitleMenuActivate, true);
  document.removeEventListener("keydown", handleSubtitleMenuActivate, true);
  unpatchSubtitleMenu();
}

// ----------------------------------------------------------------------------
// Reading lines, censoring and muting
// ----------------------------------------------------------------------------

function findTimedTextContainer() {
  for (const selector of TIMEDTEXT_SELECTORS) {
    const el = document.querySelector(selector);
    if (el) return el;
  }
  return null;
}

/**
 * Star out bad words in the rendered line. Marks each edited element with the
 * text we wrote so we can tell when Netflix replaces the line.
 * Returns true if the current line contains (or contained) a bad word.
 */
function censorContainer(container, regex, exceptionRegex) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const edited = new Set();
  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue;
    if (!text) continue;
    const censored = censorText(text, regex, exceptionRegex);
    if (censored === null) continue;
    node.nodeValue = censored;
    if (node.parentElement) edited.add(node.parentElement);
  }
  edited.forEach((el) => {
    el.setAttribute("data-skipit-censored", el.textContent);
  });

  // Is a line we censored still on screen? (Netflix may reuse the element and
  // swap its text, so compare against what we wrote.)
  let lineActive = false;
  container.querySelectorAll("[data-skipit-censored]").forEach((el) => {
    if (el.textContent === el.getAttribute("data-skipit-censored")) {
      lineActive = true;
    } else {
      el.removeAttribute("data-skipit-censored");
    }
  });
  return lineActive;
}

/**
 * The user unmuted or touched the volume during a muted line: they want to
 * hear it, like in any player. Play the rest of this line (hands off until it
 * ends). Our own mute's event is ignored: still muted, same volume (with a
 * small tolerance in case the player re-applies its volume with rounding).
 */
function handleVolumeChangeDuringLine(event) {
  if (!profanityMutedByUs) return;
  const video = event.target;
  const sameVolume = Math.abs(video.volume - profanityVolumeAtMute) < 0.01;
  if (video.muted === true && sameVolume) return;
  profanityUserTookOver = true;
  if (video.muted) video.muted = false;
}

/**
 * Netflix's own mute state, for diagnostics only (status()). Not used to
 * decide anything: it can lag the <video> element or read another player
 * session, so trusting it could leave the sound off.
 */
function isMutedInNetflix() {
  const player = getProfanityPlayer();
  const muted = callPlayer(player, "isMuted") ?? callPlayer(player, "getMuted");
  return typeof muted === "boolean" ? muted : undefined;
}

function muteForLine() {
  if (profanityMutedByUs || profanityUserTookOver) return;
  const video = document.querySelector("video");
  // Never touch a video the user already muted
  if (!video || video.muted) return;
  profanityVolumeAtMute = video.volume; // Read before muting
  video.muted = true;
  video.addEventListener("volumechange", handleVolumeChangeDuringLine);
  profanityMutedByUs = true;
  profanityMutedVideo = video;
}

/** The line is over: unmute (unless the user took over) and reset for the next one. */
function unmuteAfterLine() {
  if (profanityMutedVideo) {
    profanityMutedVideo.removeEventListener("volumechange", handleVolumeChangeDuringLine);
  }
  // Only what we muted. A detached element is unmuted too: harmless, and
  // Netflix may re-attach the same element.
  if (profanityMutedByUs && !profanityUserTookOver && profanityMutedVideo) {
    profanityMutedVideo.muted = false;
  }
  profanityMutedByUs = false;
  profanityMutedVideo = null;
  profanityUserTookOver = false;
}

function scanSubtitles() {
  if (!profanityMuteEnabled) return;
  const container = profanityObservedContainer || findTimedTextContainer();
  if (!container) {
    unmuteAfterLine();
    return;
  }

  // The getter can briefly return nothing: keep using this video's last
  // known language rather than guessing
  const track = callPlayer(getProfanityPlayer(), "getTimedTextTrack");
  if (track?.bcp47) profanityLineLang = track.bcp47;
  const regex = getProfanityRegex(profanityLineLang);
  if (!regex) {
    document.documentElement.classList.remove(PROFANITY_REVEAL_CLASS);
    unmuteAfterLine();
    return;
  }

  // Disconnect while editing so our own text changes don't re-trigger us
  if (profanityObserver) profanityObserver.disconnect();
  const lineActive = censorContainer(
    container,
    regex,
    getProfanityExceptionRegex(profanityLineLang)
  );
  if (profanityObserver && profanityObservedContainer) {
    observeContainer(profanityObservedContainer);
  }

  // Silent subtitles: show the starred line so the user keeps the context
  document.documentElement.classList.toggle(
    PROFANITY_REVEAL_CLASS,
    lineActive && profanityOwnedTrackKey !== null
  );

  if (lineActive) {
    muteForLine();
  } else {
    unmuteAfterLine();
  }
}

function observeContainer(container) {
  profanityObserver.observe(container, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

/**
 * Attach the observer to Netflix's current subtitle container. Netflix can
 * recreate the player DOM (episode change, SPA navigation), so this is
 * re-checked on every tick.
 */
function ensureSubtitleObserver() {
  const container = findTimedTextContainer();
  if (container === profanityObservedContainer) return;

  if (!profanityObserver) {
    // MutationObserver callbacks run before the next paint, so the uncensored
    // word is never drawn and the mute lands on the frame the line appears.
    profanityObserver = new MutationObserver(scanSubtitles);
  }
  profanityObserver.disconnect();
  profanityObservedContainer = container;
  if (container) observeContainer(container);
  // Also with no container: a muted line whose container Netflix removed
  // would otherwise never be unmuted (scanSubtitles unmutes when it's gone)
  scanSubtitles();
}

/**
 * Off the /watch/ page (browse, billboard trailers, hover previews): touch
 * nothing, and undo anything left from the episode we just left.
 */
function leaveWatchPage() {
  if (profanityVideoId === null) return; // Already cleaned up
  if (profanityObserver) profanityObserver.disconnect();
  profanityObservedContainer = null;
  profanityVideoId = null;
  // Our silent track may still be the profile's choice: keep it hidden on
  // previews too (the marker re-adopts it on the next /watch/ page)
  if (profanityOwnedTrackKey === null) setSubtitlesHidden(false);
  profanityOwnedTrackKey = null;
  profanityOwnedTrackConfirmed = false;
  profanityPendingFrom = null;
  unmuteAfterLine();
  document.documentElement.classList.remove(PROFANITY_REVEAL_CLASS);
}

function profanityTick() {
  const videoId = getVideoIdFromUrl();
  if (!videoId) {
    leaveWatchPage();
    return;
  }
  claimOwnedTrackMarker();

  const player = getProfanityPlayer();
  if (!player) return;

  // New video: forget the old track (the marker re-adopts it if Netflix carried
  // our silent track over to the next episode). Subs stay hidden until we know
  // who owns the new track, so nothing flashes.
  if (videoId !== profanityVideoId) {
    profanityVideoId = videoId;
    profanityOwnedTrackKey = null;
    profanityOwnedTrackConfirmed = false;
    profanityNextTrackAttemptAt = 0;
    profanityTrackRetries = 0;
    profanityLineLang = null;
    profanityPendingFrom = null;
    profanityGaveUpTrack = null;
    profanityAudioRepickLang = null;
    unmuteAfterLine();
  }

  manageTextTrack(player);
  ensureSubtitleObserver();
}

// ----------------------------------------------------------------------------
// Lifecycle
// ----------------------------------------------------------------------------

function startProfanityMute() {
  if (profanityMuteEnabled) return;
  profanityMuteEnabled = true;
  injectProfanityStyles();
  startSubtitleMenuWatcher();
  profanityTick();
  profanityMuteInterval = setInterval(profanityTick, PROFANITY_CHECK_INTERVAL);
}

function stopProfanityMute() {
  const wasEnabled = profanityMuteEnabled;
  profanityMuteEnabled = false;

  if (profanityMuteInterval) {
    clearInterval(profanityMuteInterval);
    profanityMuteInterval = null;
  }
  if (profanityObserver) {
    profanityObserver.disconnect();
  }
  profanityObservedContainer = null;
  unmuteAfterLine();
  stopSubtitleMenuWatcher();
  document.documentElement.classList.remove(PROFANITY_REVEAL_CLASS);

  // Also runs on page load with the feature off, to clean up a silent track
  // left behind by a previous session (tab closed while it was on).
  if (wasEnabled || hasClaimableMarker()) {
    restoreOffTrackWhenReady(PROFANITY_RESTORE_ATTEMPTS);
  }
}

function restoreOffTrackWhenReady(attemptsLeft) {
  if (profanityMuteEnabled) return; // Re-enabled meanwhile - nothing to restore
  // Off /watch/ the player may be a trailer: wait (without using up attempts)
  // until the user opens a video. Ends once the marker expires.
  if (!getVideoIdFromUrl()) {
    if (hasClaimableMarker()) {
      setTimeout(() => restoreOffTrackWhenReady(attemptsLeft), 5000);
    }
    return;
  }
  claimOwnedTrackMarker();
  const player = getProfanityPlayer();
  if (player && restoreOffTrack(player)) return;
  if (attemptsLeft <= 0) {
    // Give up for now; the marker stays and the next load retries
    setSubtitlesHidden(false);
    return;
  }
  setTimeout(() => restoreOffTrackWhenReady(attemptsLeft - 1), 1000);
}

// ----------------------------------------------------------------------------
// Sign-in gate: muting runs only while signed in AND the setting is on
// ----------------------------------------------------------------------------
//
// The setting and the auth state reach the page in either order. Nothing
// happens until both are known: acting on one alone could start muting for a
// signed-out user, or restore "Off" and then turn the silent track straight
// back on. The first decision with muting inactive still runs the stop path,
// which cleans up a silent track left behind by a previous session.

function syncProfanityMuteActive() {
  if (profanityMuteSetting === null || profanityAuthKnown === null) return;
  const active = profanityMuteSetting && profanityAuthKnown;
  if (active === profanityActiveSynced) return;
  profanityActiveSynced = active;
  if (active) {
    startProfanityMute();
  } else {
    stopProfanityMute();
  }
}

/** The stored setting (and whether the tip was ever shown), from the content script. */
function setProfanityMuteSetting(enabled, tipSeen) {
  profanityMuteSetting = enabled === true;
  // Never goes back to false: the "shown" write may not have echoed back yet
  if (tipSeen === true) profanityTipSeen = true;
  else if (tipSeen === false && profanityTipSeen === null) profanityTipSeen = false;
  syncProfanityMuteActive();
  updateProfanityControls();
}

/** Auth state changed (signing out stops muting; the setting itself is kept). */
function setProfanityMuteAuth(authenticated) {
  profanityAuthKnown = authenticated === true;
  syncProfanityMuteActive();
  updateProfanityControls();
}

/** Turn the setting on/off from the page. The content script saves it. */
function requestProfanityMute(enabled) {
  profanityMuteSetting = enabled;
  syncProfanityMuteActive();
  updateProfanityControls();
  window.postMessage(
    { type: "SKIPIT_SET_PROFANITY_MUTE_REQUEST", data: { enabled } },
    "*"
  );
}

// ----------------------------------------------------------------------------
// On/off switch: a button in Netflix's control bar (left of Audio & Subtitles),
// or a small square beside the Skipit FAB when that can't be placed. Plus the
// first-time tip.
// ----------------------------------------------------------------------------
//
// Netflix's control bar is React-rendered and mounts/unmounts as the controls
// show and hide. We never move or modify Netflix's elements: we insert our own
// slot (fresh elements copying only Netflix's classNames, for size and
// spacing) before the Audio & Subtitles slot, and put it back whenever it goes
// missing. Every node we insert carries PM_UI_ATTR so duplicates can't build up.

// Netflix's markup. Kept as lists so a Netflix change only needs a selector here.
const PM_AUDIO_CONTROL_SELECTORS = ['button[data-uia="control-audio-subtitle"]'];
const PM_TIMELINE_SELECTORS = ['[data-uia="timeline"]'];
const PM_PLAYER_CONTAINER_SELECTORS = [".watch-video", '[data-uia="player"]', ".nf-player-container"];
const PM_ANY_CONTROL_SELECTOR = 'button[data-uia^="control-"]'; // Any Netflix bar button (finds the row)

const PM_UI_ATTR = "data-skipit-pm-ui";
const PROFANITY_CONTROL_ID = "skipit-pm-control";
const PROFANITY_CONTROL_SLOT_ID = "skipit-pm-control-slot";
const PM_ROW_SEARCH_DEPTH = 6;
const PM_UI_THROTTLE_MS = 100;
const PM_UI_TICK_MS = 1000;
const SVG_NS = "http://www.w3.org/2000/svg";

const PROFANITY_TIP_DELAY_MS = 1500; // Let the player settle before the tip
const PROFANITY_TIP_DURATION_MS = 10000;
const PROFANITY_TIP_WIDTH = 240;
const PROFANITY_UI_FONT = "Netflix Sans, Helvetica Neue, Segoe UI, Roboto, sans-serif";

let profanityUiObserver = null;
let profanityUiObserved = null; // Container the observer is attached to
let profanityUiLastRun = 0;
let profanityUiSyncCount = 0; // Diagnostics: full switch UI syncs
// Spacer element -> its computed flex-grow, so the spacer check doesn't call
// getComputedStyle on every DOM change
const profanitySpacerGrow = new WeakMap();
let profanityUiTimer = null;
let profanityUiMode = "none"; // "control-bar" | "fallback" | "none"
let profanityUiLastLog = null;
let profanityTimelineFound = false;
let profanityAudioControlFound = false;
let profanityIconSeq = 0; // Unique mask ids
let profanityTipAnchor = null; // "control-bar" | "fallback" while the tip is open
let profanityTipArmed = false; // Delay done: show as soon as a switch is on screen
let profanityTipScheduled = false;

// Locked look of the fallback square mirrors .skipit-fab.locked in player.css
const PROFANITY_CHIP_CSS = `
.skipit-fab-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}
.skipit-pm-chip {
  position: relative;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: rgba(26, 26, 26, 0.85);
  color: #ffffff;
  cursor: pointer;
  font-family: ${PROFANITY_UI_FONT};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.2s ease, opacity 0.2s ease;
}
.skipit-pm-chip.shown { display: flex; }
.skipit-pm-chip:hover { background: rgba(26, 26, 26, 0.95); }
.skipit-pm-chip:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; }
.skipit-pm-chip.style-netflix { background: rgba(255, 255, 255, 0.92); color: #141414; }
.skipit-pm-chip.style-netflix:hover { background: #ffffff; }
.skipit-pm-chip.style-netflix:focus-visible { outline-color: #141414; }
.skipit-pm-chip .skipit-pm-icon { width: 24px; height: 24px; }
/* Filled bubble is dark on the Netflix-style square: its asterisks go white */
.skipit-pm-chip.style-netflix .skipit-pm-icon-stars.on { stroke: #ffffff; }
.skipit-pm-chip-lock {
  display: none;
  position: absolute;
  top: 4px;
  left: 4px;
  width: 10px;
  height: 10px;
  align-items: center;
  justify-content: center;
}
.skipit-pm-chip-lock svg { width: 10px; height: 10px; }
/* Dim the square, not its hover label */
.skipit-pm-chip.locked { cursor: not-allowed; }
.skipit-pm-chip.locked > :not(.skipit-pm-label) { opacity: 0.6; }
.skipit-pm-chip.locked .skipit-pm-icon-bubble { opacity: 1; } /* One dim, like the FAB */
.skipit-pm-chip.locked { background: rgba(26, 26, 26, 0.5); }
.skipit-pm-chip.style-netflix.locked { background: rgba(255, 255, 255, 0.55); }
.skipit-pm-chip.locked:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); }
.skipit-pm-chip.locked .skipit-pm-chip-lock { display: flex; }

/* Button in Netflix's control bar: size and hover come from Netflix's classes */
.skipit-pm-control-slot { position: relative; }
.skipit-pm-control { cursor: pointer; }
.skipit-pm-control:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; border-radius: 4px; }
.skipit-pm-control .skipit-pm-icon { display: block; }
.skipit-pm-control.locked .skipit-pm-icon-bubble,
.skipit-pm-control.locked .skipit-pm-icon-stars { opacity: 0.5; }

.skipit-pm-icon { display: block; overflow: visible; }

/* Hover label, like Netflix's own */
.skipit-pm-label {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border-radius: 4px;
  background: #ffffff;
  color: #000000;
  font-family: ${PROFANITY_UI_FONT};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;
  z-index: 10;
}
.skipit-pm-label-arrows { display: block; width: 13px; height: 9px; flex: none; }
.skipit-pm-control-slot:hover > .skipit-pm-label,
.skipit-pm-control-slot:has(.skipit-pm-control:focus-visible) > .skipit-pm-label,
.skipit-pm-chip:hover > .skipit-pm-label,
.skipit-pm-chip:focus-visible > .skipit-pm-label { opacity: 1; }
/* The tip already explains it */
.skipit-fab-row:has(> .skipit-pm-tip) .skipit-pm-label { opacity: 0; }

/* Keep the buttons on screen while the tip is open on the fallback square */
#${WRAPPER_ID}.${PROFANITY_TIP_OPEN_CLASS} {
  opacity: 1 !important;
  pointer-events: auto !important;
}
.skipit-pm-tip {
  --skipit-pm-arrow-left: 14px; /* Arrow tip at the square's centre (20px) */
  position: absolute;
  bottom: calc(100% + 12px);
  left: 0;
  width: ${PROFANITY_TIP_WIDTH}px;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 10px;
  background: #ffffff;
  color: #141414;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  font-family: ${PROFANITY_UI_FONT};
  text-align: left;
  z-index: 10;
}
.skipit-pm-tip.anchor-control-bar { z-index: 2147483647; } /* Above the Skipit wrapper */
.skipit-pm-tip.no-anchor::after { display: none; }
.skipit-pm-tip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: var(--skipit-pm-arrow-left);
  border: 6px solid transparent;
  border-top-color: #ffffff;
}
.skipit-pm-tip-title { margin: 0 0 4px; font-size: 14px; font-weight: 700; }
.skipit-pm-tip-text { margin: 0 0 10px; font-size: 13px; line-height: 1.35; color: #333333; }
.skipit-pm-tip-actions { display: flex; justify-content: flex-end; gap: 8px; }
.skipit-pm-tip-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.skipit-pm-tip-on { background: #ff6f4f; color: #ffffff; }
.skipit-pm-tip-later { background: transparent; color: #141414; }
`;

/** Switch and tip styles. Separate from the muting styles: the switch exists even when muting is off. */
function injectProfanityChipStyles() {
  if (document.getElementById("skipit-pm-chip-styles")) return;
  const style = document.createElement("style");
  style.id = "skipit-pm-chip-styles";
  style.textContent = PROFANITY_CHIP_CSS;
  document.head.appendChild(style);
}

function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, String(value));
  return el;
}

// The user's icon design (560x480 artboard): speech bubble, three asterisks,
// and Skipit's logo arrow twice in coral, cut into the bubble's bottom right.
const PM_ICON_ARROW_PATH =
  "M690.122925,113.959564 C690.122925,99.003281 690.072632,84.083466 690.155273,69.164406 C690.178345,64.999840 691.417236,61.195747 695.577271,59.311436 C699.982483,57.316048 704.245422,57.411785 708.152649,60.775867 C709.900635,62.280853 712.007874,63.365635 713.775452,64.851234 C726.949036,75.923134 740.062439,87.066544 753.229492,98.146217 C758.167969,102.301781 763.087769,106.492668 768.212646,110.410393 C776.354675,116.634583 776.714600,124.662666 768.851440,131.250198 C748.868164,147.991684 728.842468,164.682571 708.865906,181.432007 C705.030151,184.648087 700.753906,185.336685 696.303528,183.455399 C691.873352,181.582687 690.050354,177.893738 690.082153,173.043015 C690.179138,158.259232 690.117310,143.474411 690.117310,127.989815 Z";
const PM_ICON_BUBBLE_PATH =
  "M100 15 H450 A90 90 0 0 1 540 105 V285 A90 90 0 0 1 450 375 H210 L118 458 Q80 488 80 445 V372.7 A90 90 0 0 1 10 285 V105 A90 90 0 0 1 100 15 Z";
const PM_ICON_ARROW_COLOR = "#FE7050";
const PM_ICON_STAR_X = [160, 282, 405];
// Line weights matched to Netflix's 24px icons, whose outlines are 2 units
// wide: 1 icon unit = 560 / 24 ≈ 23.3 artboard units
const PM_ICON_OUTLINE_WIDTH = 49; // 2 units after the bubble's 0.95 scale
const PM_ICON_STAR_WIDTH = 30; // ~1.3 units: 2 would blur three stars together
const PM_ICON_ARROW_GAP = 30;

/** One Skipit arrow pair, as in the logo (second copy 83.2 units to the left). */
function appendLogoArrows(parent, attrs = {}) {
  const g = svgEl("g", attrs);
  g.appendChild(svgEl("path", { d: PM_ICON_ARROW_PATH, transform: "translate(-83.2 0)" }));
  g.appendChild(svgEl("path", { d: PM_ICON_ARROW_PATH }));
  parent.appendChild(g);
  return g;
}

/**
 * Off: outlined bubble with white asterisks. On: filled bubble with dark
 * asterisks. The coral arrows are the same in both. White parts use
 * currentColor so the Netflix-style square (dark icon on white) still works.
 * `svgAttrs` lets the control-bar button copy Netflix's icon class and size.
 */
function createProfanityIcon(on, svgAttrs = {}) {
  const maskId = `skipit-pm-mask-${++profanityIconSeq}`;
  const svg = svgEl("svg", {
    // Square box around the 560x480 artboard, like Netflix's 24x24 icons
    viewBox: "0 -40 560 560",
    width: 24,
    height: 24,
    "aria-hidden": "true",
    focusable: "false",
    ...svgAttrs,
  });
  svg.setAttribute("class", `${svgAttrs.class ? svgAttrs.class + " " : ""}skipit-pm-icon`);
  // Arrows 20% bigger than the original artwork, grown from their bottom-right
  // corner (537.3, 459.9) and moved 30 units down. The gap stroke sits inside
  // this transform, so it grows with them.
  const arrowsTransform =
    "translate(0 30) translate(537.3 459.9) scale(1.2) translate(-537.3 -459.9) translate(-371.4 243.1) scale(1.17)";

  // Gap around the arrows, cut out of the bubble
  const mask = svgEl("mask", { id: maskId, maskUnits: "userSpaceOnUse", x: 0, y: -40, width: 560, height: 560 });
  mask.appendChild(svgEl("rect", { x: 0, y: -40, width: 560, height: 560, fill: "#fff" }));
  appendLogoArrows(mask, {
    transform: arrowsTransform,
    fill: "#000",
    stroke: "#000",
    "stroke-width": PM_ICON_ARROW_GAP,
    "stroke-linejoin": "round",
  });
  const defs = svgEl("defs", {});
  defs.appendChild(mask);
  svg.appendChild(defs);

  const bubble = svgEl("g", { class: "skipit-pm-icon-bubble", mask: `url(#${maskId})` });
  // Both states draw the same stroked outline, so their outer edges match
  // exactly; the "on" bubble is also filled in
  bubble.appendChild(
    svgEl("path", {
      d: PM_ICON_BUBBLE_PATH,
      transform: "translate(280 240) scale(0.95) translate(-280 -240)",
      fill: on ? "currentColor" : "none",
      stroke: "currentColor",
      "stroke-width": PM_ICON_OUTLINE_WIDTH,
      "stroke-linejoin": "round",
    })
  );
  svg.appendChild(bubble);

  const stars = svgEl("g", {
    class: `skipit-pm-icon-stars${on ? " on" : ""}`,
    stroke: on ? "#000000" : "currentColor",
    "stroke-width": PM_ICON_STAR_WIDTH,
    "stroke-linecap": "round",
    fill: "none",
  });
  for (const x of PM_ICON_STAR_X) {
    const star = svgEl("g", { transform: `translate(${x} 188)` });
    star.appendChild(svgEl("line", { x1: 0, y1: -44, x2: 0, y2: 44 }));
    star.appendChild(svgEl("line", { x1: -38, y1: -22, x2: 38, y2: 22 }));
    star.appendChild(svgEl("line", { x1: -38, y1: 22, x2: 38, y2: -22 }));
    stars.appendChild(star);
  }
  svg.appendChild(stars);

  appendLogoArrows(svg, { transform: arrowsTransform, fill: PM_ICON_ARROW_COLOR });
  return svg;
}

/** Hover label: "Skipit ⏩ Mute swearing: On", with the arrows drawn, not an emoji. */
function fillProfanityLabel(label, locked, on) {
  label.replaceChildren();
  if (locked) {
    label.textContent = "Sign in to Skipit to mute swearing";
    return;
  }
  const brand = document.createElement("span");
  brand.textContent = "Skipit";
  const arrows = svgEl("svg", { viewBox: "603 55 177 133", class: "skipit-pm-label-arrows", "aria-hidden": "true" });
  appendLogoArrows(arrows, { fill: PM_ICON_ARROW_COLOR });
  const state = document.createElement("span");
  state.textContent = `Mute swearing: ${on ? "On" : "Off"}`;
  label.append(brand, arrows, state);
}

function createProfanityLabel() {
  const label = document.createElement("span");
  label.className = "skipit-pm-label";
  label.setAttribute("aria-hidden", "true");
  return label;
}

function getProfanitySwitchState() {
  const locked = !isAuthenticated;
  return { locked, on: !locked && profanityMuteSetting === true };
}

/** Shared by both switches: accessibility attributes and classes. */
function applySwitchAria(button, locked, on) {
  button.classList.toggle("locked", locked);
  button.classList.toggle("on", on);
  button.classList.toggle("off", !on);
  if (locked) {
    button.removeAttribute("role");
    button.removeAttribute("aria-checked");
    button.setAttribute("aria-label", "Sign in to Skipit to mute swearing");
  } else {
    button.setAttribute("role", "switch");
    button.setAttribute("aria-checked", String(on));
    button.setAttribute("aria-label", "Skipit: Mute swearing");
  }
}

function handleProfanitySwitchClick(event) {
  // Keep the click from reaching Netflix (it would pause or seek)
  event.preventDefault();
  event.stopPropagation();
  // After a mouse click, give Space back to Netflix (play/pause)
  if (event.detail > 0) event.currentTarget.blur?.();
  dismissProfanityTip();

  if (!isAuthenticated) {
    window.postMessage({ type: "SKIPIT_OPEN_AUTH_POPUP" }, "*");
    return;
  }
  requestProfanityMute(profanityMuteSetting !== true);
}

/** Enter/Space activate our button; Netflix's shortcuts must not see them. */
function handleProfanitySwitchKey(event) {
  if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
    event.stopPropagation();
  }
}

function wireProfanitySwitch(button) {
  // Hover look comes from Netflix's classes: refresh them as the pointer moves
  button.addEventListener("mouseenter", () => syncProfanityControls());
  button.addEventListener("mouseleave", () => syncProfanityControls());
  button.addEventListener("click", handleProfanitySwitchClick);
  button.addEventListener("keydown", handleProfanitySwitchKey);
  button.addEventListener("keyup", handleProfanitySwitchKey);
}

// --- Fallback square beside the FAB -----------------------------------------

/**
 * The fallback square, built with its current state. Called by
 * injectSkipitButtons; the wrapper is rebuilt whenever Netflix drops it, so
 * everything is read from state here. Hidden unless the fallback is in use.
 */
function createProfanityChip() {
  injectProfanityChipStyles();
  const chip = document.createElement("button");
  chip.id = PROFANITY_CHIP_ID;
  chip.type = "button";
  chip.className = "skipit-pm-chip";

  const lock = document.createElement("span");
  lock.className = "skipit-pm-chip-lock";
  lock.appendChild(createLockIconSVG());
  chip.appendChild(lock);
  chip.appendChild(createProfanityLabel());

  wireProfanitySwitch(chip);
  applyProfanityChipState(chip);
  chip.classList.toggle("shown", profanityUiMode === "fallback");
  return chip;
}

function applyProfanityChipState(chip) {
  const { locked, on } = getProfanitySwitchState();
  applySwitchAria(chip, locked, on);
  chip.classList.toggle("style-netflix", currentFabStyle === "netflix");
  chip.querySelector(".skipit-pm-icon")?.remove();
  chip.insertBefore(createProfanityIcon(on), chip.firstChild);
  const label = chip.querySelector(".skipit-pm-label");
  if (label) fillProfanityLabel(label, locked, on);
}

// --- Button in Netflix's control bar -----------------------------------------

function queryFirst(selectors, root = document) {
  for (const selector of selectors) {
    const el = root.querySelector(selector);
    if (el) return el;
  }
  return null;
}

function findProfanityPlayerContainer() {
  const found = queryFirst(PM_PLAYER_CONTAINER_SELECTORS);
  if (found) return found;
  const video = document.querySelector("video");
  return video?.parentElement?.parentElement?.parentElement || null;
}

/**
 * Netflix's row of control slots and the slot holding the audio button: the
 * lowest ancestor that also holds another Netflix control button.
 */
function findControlRow(audioButton) {
  let child = audioButton;
  for (let depth = 0; depth < PM_ROW_SEARCH_DEPTH && child.parentElement; depth++) {
    const parent = child.parentElement;
    const hasOtherControl = [...parent.children].some(
      (el) =>
        el !== child &&
        !el.hasAttribute(PM_UI_ATTR) &&
        (el.matches(PM_ANY_CONTROL_SELECTOR) || el.querySelector(PM_ANY_CONTROL_SELECTOR))
    );
    if (hasOtherControl) return { row: parent, slot: child };
    child = parent;
  }
  return null;
}

/** The fixed-width spacer Netflix puts between controls (never a flexible one). */
function findControlSpacer(slot) {
  // Skip over our own slot and spacer copy, to Netflix's element before theirs
  let prev = slot.previousElementSibling;
  while (prev && prev.hasAttribute(PM_UI_ATTR)) prev = prev.previousElementSibling;
  if (!prev) return null;
  if (prev.children.length > 0 || prev.textContent.trim() !== "") return null;
  let grow = profanitySpacerGrow.get(prev);
  if (grow === undefined) {
    grow = getComputedStyle(prev).flexGrow;
    profanitySpacerGrow.set(prev, grow);
  }
  if (grow !== "0") return null;
  return prev;
}

/** Netflix's elements from their slot down to the audio button's parent. */
function getSlotChain(slot, audioButton) {
  const chain = [];
  for (let el = audioButton.parentElement; el && el !== slot.parentElement; el = el.parentElement) {
    chain.unshift(el);
  }
  return chain; // chain[0] === slot
}

function getNetflixIconAttrs(audioButton) {
  const theirs = audioButton.querySelector("svg");
  const attrs = {};
  const cls = theirs?.getAttribute("class");
  if (cls) attrs.class = cls;
  let width = theirs?.getAttribute("width");
  let height = theirs?.getAttribute("height");
  if ((!width || !height) && theirs) {
    const rect = theirs.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      width = Math.round(rect.width);
      height = Math.round(rect.height);
    }
  }
  attrs.width = width || 24;
  attrs.height = height || 24;
  return attrs;
}

function removeProfanityControl() {
  const removed = document.querySelectorAll(`[${PM_UI_ATTR}]`);
  removed.forEach((el) => el.remove());
  return removed.length > 0;
}

function applyProfanityControlState(button) {
  const { locked, on } = getProfanitySwitchState();
  applySwitchAria(button, locked, on);
  const audioButton = queryFirst(PM_AUDIO_CONTROL_SELECTORS);
  const prevWrap = button.querySelector(".skipit-pm-icon-wrap");
  const prevWrapClass = prevWrap?.className;
  prevWrap?.remove();
  button.querySelector(".skipit-pm-icon")?.remove();
  const icon = createProfanityIcon(on, audioButton ? getNetflixIconAttrs(audioButton) : {});
  // Netflix sizes its icons through a wrapper div inside the button
  // (".control-medium"): mirror it, or our icon renders at the raw 24px
  const theirWrap = audioButton?.firstElementChild;
  if (theirWrap && theirWrap.tagName !== "svg" && theirWrap.querySelector("svg")) {
    const wrap = document.createElement("div");
    // Keep the classes syncControlClasses chose (idle look), not theirs live
    wrap.className = prevWrapClass || `${theirWrap.className} skipit-pm-icon-wrap`;
    wrap.setAttribute("role", "presentation");
    wrap.appendChild(icon);
    button.appendChild(wrap);
  } else {
    button.appendChild(icon);
  }
  const label = document.getElementById(PROFANITY_CONTROL_SLOT_ID)?.querySelector(".skipit-pm-label");
  if (label) fillProfanityLabel(label, locked, on);
}

/** Copy Netflix's current classNames (they change with player size). */
function mostCommon(values) {
  const counts = new Map();
  let best = null;
  let bestCount = 0;
  for (const value of values) {
    if (typeof value !== "string") continue;
    const count = (counts.get(value) || 0) + 1;
    counts.set(value, count);
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

/** Classes of one Netflix control: its slot chain, the button and the icon wrapper. */
function readControlClasses(chain, button) {
  const wrap = button.firstElementChild;
  return {
    chain: chain.map((el) => el.className),
    button: button.className,
    wrap: wrap && wrap.tagName !== "svg" ? wrap.className : null,
  };
}

let profanityHoverClasses = null; // A hovered Netflix control's classes, learned live

/**
 * Netflix swaps a control's classes while it's hovered or its menu is open.
 * Copying the Audio & Subtitles button's live classes made our icon grow
 * whenever theirs did, so we copy what most of the bar's controls share (the
 * idle look). A hovered Netflix control teaches us the hover look, which we
 * apply only while our own button is hovered.
 */
function getControlClasses(row, theirChain, audioButton, ourButton) {
  const controls = [];
  for (const button of row.querySelectorAll(PM_ANY_CONTROL_SELECTOR)) {
    if (button.closest(`[${PM_UI_ATTR}]`)) continue;
    let slot = button;
    while (slot.parentElement && slot.parentElement !== row) slot = slot.parentElement;
    if (slot.parentElement !== row) continue;
    const chain = getSlotChain(slot, button);
    if (chain.length !== theirChain.length) continue;
    controls.push({ button, classes: readControlClasses(chain, button) });
  }
  const fallback = readControlClasses(theirChain, audioButton);
  const idle = {
    chain: theirChain.map(
      (_, i) => mostCommon(controls.map((c) => c.classes.chain[i])) ?? fallback.chain[i]
    ),
    button: mostCommon(controls.map((c) => c.classes.button)) ?? fallback.button,
    wrap: mostCommon(controls.map((c) => c.classes.wrap)) ?? fallback.wrap,
  };

  // Need at least three controls for "most common" to mean idle
  if (controls.length >= 3) {
    const hovered = controls.find((c) => c.button.matches(":hover"));
    if (hovered && hovered.classes.button !== idle.button) profanityHoverClasses = hovered.classes;
  }
  if (profanityHoverClasses && ourButton?.matches(":hover")) return profanityHoverClasses;
  return idle;
}

/**
 * Netflix changes classes on hover without a DOM change we observe, so learn
 * the hover look when the pointer enters one of its controls.
 */
function learnNetflixHoverClasses(event) {
  const button = event.target?.closest?.(PM_ANY_CONTROL_SELECTOR);
  if (!button || button.closest(`[${PM_UI_ATTR}]`)) return;
  setTimeout(() => {
    if (!button.isConnected || !button.matches(":hover")) return;
    const others = [...document.querySelectorAll(PM_ANY_CONTROL_SELECTOR)].filter(
      (b) => b !== button && !b.closest(`[${PM_UI_ATTR}]`)
    );
    if (others.length < 2) return;
    if (button.className === mostCommon(others.map((b) => b.className))) return; // No class swap
    const found = findControlRow(button);
    if (!found) return;
    profanityHoverClasses = readControlClasses(getSlotChain(found.slot, button), button);
  }, 60);
}
document.addEventListener("mouseover", learnNetflixHoverClasses, true);

/** Apply Netflix's classes (idle, or hover while ours is hovered) to our nodes. */
function syncControlClasses(ourChain, theirChain, button, audioButton) {
  const row = ourChain[0].parentElement || findControlRow(audioButton)?.row;
  const classes = row
    ? getControlClasses(row, theirChain, audioButton, button)
    : readControlClasses(theirChain, audioButton);
  ourChain.forEach((el, i) => {
    const want = (classes.chain[i] ?? theirChain[i].className) + (i === 0 ? " skipit-pm-control-slot" : "");
    if (el.className !== want) el.className = want;
  });
  const ourWrap = button.querySelector(".skipit-pm-icon-wrap");
  if (ourWrap && classes.wrap) {
    const wantWrap = `${classes.wrap} skipit-pm-icon-wrap`;
    if (ourWrap.className !== wantWrap) ourWrap.className = wantWrap;
  }
  const wantButton = `${classes.button} skipit-pm-control`;
  // Keep our state classes
  const state = ["locked", "on", "off"].filter((c) => button.classList.contains(c));
  const full = [wantButton, ...state].join(" ");
  if (button.className !== full) button.className = full;
}

/** Our slot's wrapper chain, from the slot down to the button's parent. */
function getOurChain(ourSlot, button) {
  const ourChain = [ourSlot];
  for (let el = ourSlot.firstElementChild; el && el !== button; el = el.firstElementChild) {
    if (el.classList.contains("skipit-pm-label")) break;
    ourChain.push(el);
  }
  return ourChain;
}

/**
 * Put our button just before the Audio & Subtitles slot. Returns our button,
 * or null if it can't be placed. Idempotent: run on every DOM change.
 */
function ensureProfanityControl(audioButton) {
  const found = findControlRow(audioButton);
  if (!found) return null;
  const { row, slot } = found;
  const theirChain = getSlotChain(slot, audioButton);
  // Their button sits straight in the row with no slot around it: we can't
  // mirror that safely, so the fallback square is used instead
  if (theirChain.length === 0) return null;

  const theirSpacer = findControlSpacer(slot);
  // Netflix sometimes leaves two spacers in a row before Audio & Subtitles (an
  // empty slot for a control this title doesn't have). Sit between them instead
  // of adding a third, so the gaps on both sides match the rest of the bar.
  const doubleGap = theirSpacer && findControlSpacer(theirSpacer) ? theirSpacer : null;
  const spacer = doubleGap ? null : theirSpacer;
  const insertRef = doubleGap || slot;

  // Already in place?
  const ourSlot = document.getElementById(PROFANITY_CONTROL_SLOT_ID);
  const button = document.getElementById(PROFANITY_CONTROL_ID);
  if (ourSlot && button && ourSlot.parentElement === row) {
    const next = ourSlot.nextElementSibling;
    const placed = doubleGap
      ? next === doubleGap && !document.querySelector(`[${PM_UI_ATTR}="spacer"]`)
      : spacer
        ? next?.hasAttribute(PM_UI_ATTR) && next.nextElementSibling === slot
        : next === slot;
    if (placed) {
      const ourChain = getOurChain(ourSlot, button);
      if (ourChain.length === theirChain.length) {
        syncControlClasses(ourChain, theirChain, button, audioButton);
        return button;
      }
    }
  }

  // Missing or out of place: start clean so there's never more than one
  removeProfanityControl();

  const ourChain = theirChain.map(() => document.createElement("div"));
  ourChain[0].id = PROFANITY_CONTROL_SLOT_ID;
  ourChain[0].setAttribute(PM_UI_ATTR, "slot");
  for (let i = 1; i < ourChain.length; i++) ourChain[i - 1].appendChild(ourChain[i]);

  const newButton = document.createElement("button");
  newButton.type = "button";
  newButton.id = PROFANITY_CONTROL_ID;
  ourChain[ourChain.length - 1].appendChild(newButton);
  ourChain[0].appendChild(createProfanityLabel());
  syncControlClasses(ourChain, theirChain, newButton, audioButton);
  wireProfanitySwitch(newButton);

  row.insertBefore(ourChain[0], insertRef);
  if (spacer) {
    const spacerCopy = spacer.cloneNode(false);
    spacerCopy.removeAttribute("id");
    spacerCopy.removeAttribute("data-uia");
    spacerCopy.setAttribute(PM_UI_ATTR, "spacer");
    row.insertBefore(spacerCopy, slot);
  }
  applyProfanityControlState(newButton);
  profanityLog(
    "Control-bar switch inserted:",
    `chain depth ${theirChain.length},`,
    doubleGap ? "between Netflix's two spacers" : spacer ? "spacer copied" : "no spacer",
    { row, slot }
  );
  return newButton;
}

// --- Keeping it in place -------------------------------------------------------

function isOnScreen(el) {
  if (!el || !el.isConnected) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/** On screen and not hidden or covered (Netflix may fade its bar instead of removing it). */
function isVisibleOnTop(el) {
  if (!isOnScreen(el)) return false;
  const rect = el.getBoundingClientRect();
  const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  if (!hit || !el.contains(hit)) return false;
  for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.visibility === "hidden" || Number(style.opacity) < 0.5) return false;
  }
  return true;
}

function syncProfanityControls() {
  profanityUiLastRun = Date.now();
  profanityUiSyncCount++;
  try {
    syncProfanityControlsNow();
  } catch (error) {
    // A Netflix markup change must never break muting or spam errors
    profanityLog("Switch UI sync failed:", error);
  }
}

function syncProfanityControlsNow() {
  if (!getVideoIdFromUrl()) {
    leaveProfanityUi();
    return;
  }
  injectProfanityChipStyles();

  const audioButton = queryFirst(PM_AUDIO_CONTROL_SELECTORS);
  profanityAudioControlFound = !!audioButton;
  profanityTimelineFound = !!queryFirst(PM_TIMELINE_SELECTORS);

  let control = null;
  if (audioButton) {
    control = ensureProfanityControl(audioButton);
  } else if (removeProfanityControl()) {
    profanityLog("Audio & Subtitles control gone: removed our leftover button");
  }
  if (!control && document.getElementById(PROFANITY_CONTROL_SLOT_ID)) removeProfanityControl();

  profanityUiMode = control ? "control-bar" : profanityTimelineFound ? "fallback" : "none";

  // While the tip points at it, the square stays even if the controls hide
  const chip = document.getElementById(PROFANITY_CHIP_ID);
  if (chip) {
    chip.classList.toggle("shown", profanityUiMode === "fallback" || profanityTipAnchor === "fallback");
  }

  const logKey = `${profanityUiMode}|audio:${profanityAudioControlFound}|timeline:${profanityTimelineFound}`;
  if (logKey !== profanityUiLastLog) {
    profanityUiLastLog = logKey;
    profanityLog(
      "Switch UI:", profanityUiMode,
      "| Audio & Subtitles control:", profanityAudioControlFound ? "found" : "not found",
      "| timeline:", profanityTimelineFound ? "found" : "not found",
      audioButton && !control ? "| couldn't find the control row" : ""
    );
  }

  repositionProfanityTip();
  // Settings may have arrived on /browse: arm the tip again on a watch page
  maybeShowProfanityTip();
  tryShowProfanityTip();
}

/**
 * Subtitle cues change inside the player container many times a second and
 * never affect the control bar: skip batches made only of those.
 */
function isTimedTextOnlyBatch(records) {
  if (!records || records.length === 0) return false;
  const selector = TIMEDTEXT_SELECTORS.join(",");
  return records.every((record) => record.target?.closest?.(selector));
}

function scheduleProfanityUiSync(records) {
  if (isTimedTextOnlyBatch(records)) return;
  const wait = PM_UI_THROTTLE_MS - (Date.now() - profanityUiLastRun);
  // Netflix just mounted its bar and we're not in it yet: insert now, so the
  // bar never paints without us and its buttons don't jump
  const barNeedsUs =
    !document.getElementById(PROFANITY_CONTROL_SLOT_ID) && !!queryFirst(PM_AUDIO_CONTROL_SELECTORS);
  if (wait <= 0 || barNeedsUs) {
    // Leading edge, inside the observer callback: inserted before the next paint
    syncProfanityControls();
  } else if (!profanityUiTimer) {
    profanityUiTimer = setTimeout(() => {
      profanityUiTimer = null;
      syncProfanityControls();
    }, wait);
  }
}

/** (Re)attach the observer to the current player container. */
function watchProfanityUi() {
  const container = findProfanityPlayerContainer();
  if (!container || container === profanityUiObserved) return;
  if (!profanityUiObserver) profanityUiObserver = new MutationObserver(scheduleProfanityUiSync);
  profanityUiObserver.disconnect();
  profanityUiObserver.observe(container, { childList: true, subtree: true });
  profanityUiObserved = container;
  profanityLog("Watching player container for the control bar:", container);
}

/** Off the /watch/ page: stop watching and take our button out. */
function leaveProfanityUi() {
  if (profanityUiObserver && profanityUiObserved) {
    profanityUiObserver.disconnect();
    profanityLog("Left the watch page: stopped watching the control bar");
  }
  profanityUiObserved = null;
  clearTimeout(profanityUiTimer);
  profanityUiTimer = null;
  removeProfanityControl();
  if (profanityTipAnchor) dismissProfanityTip();
  profanityUiMode = "none";
}

function profanityUiTick() {
  if (getVideoIdFromUrl()) {
    // The container itself can be replaced (new episode, Netflix re-render)
    if (profanityUiObserved && !profanityUiObserved.isConnected) profanityUiObserved = null;
    watchProfanityUi();
    syncProfanityControls();
  } else {
    leaveProfanityUi();
  }
}

setInterval(profanityUiTick, PM_UI_TICK_MS);

/** Refresh both switches after a setting, auth or style change. */
function updateProfanityControls() {
  const chip = document.getElementById(PROFANITY_CHIP_ID);
  if (chip) applyProfanityChipState(chip);
  const control = document.getElementById(PROFANITY_CONTROL_ID);
  if (control) applyProfanityControlState(control);
  if (document.getElementById(PROFANITY_TIP_ID)) {
    // An open tip only goes on sign-out or when mute is turned on elsewhere
    // (not on the "seen" echo, which arrives right after it's shown)
    if (!isAuthenticated || profanityMuteSetting === true) dismissProfanityTip();
    return;
  }
  maybeShowProfanityTip();
}

// --- First-time tip -------------------------------------------------------------

/** Every value must be known: showing while one is still unknown could show it twice. */
function shouldOfferProfanityTip() {
  return (
    profanityAuthKnown === true &&
    isAuthenticated &&
    profanityMuteSetting === false &&
    profanityTipSeen === false &&
    // A background tab (e.g. middle-clicked title) would use up the one showing unseen
    document.visibilityState === "visible" &&
    !!getVideoIdFromUrl()
  );
}

function maybeShowProfanityTip() {
  if (profanityTipScheduled || profanityTipArmed || !shouldOfferProfanityTip()) return;
  if (document.getElementById(PROFANITY_TIP_ID)) return;
  profanityTipScheduled = true;
  setTimeout(() => {
    profanityTipScheduled = false;
    profanityTipArmed = true;
    tryShowProfanityTip();
  }, PROFANITY_TIP_DELAY_MS);
}

// Offer the tip when a background tab comes to the front
document.addEventListener("visibilitychange", () => {
  maybeShowProfanityTip();
  tryShowProfanityTip();
});

/** The switch on screen right now, if any. */
function findProfanityTipAnchor() {
  const control = document.getElementById(PROFANITY_CONTROL_ID);
  if (isVisibleOnTop(control)) return { kind: "control-bar", el: control };
  const chip = document.getElementById(PROFANITY_CHIP_ID);
  const wrapper = document.getElementById(WRAPPER_ID);
  if (chip && wrapper?.contains(chip) && chip.classList.contains("shown") && chip.parentElement) {
    return { kind: "fallback", el: chip };
  }
  return null;
}

function buildProfanityTip() {
  const tip = document.createElement("div");
  tip.id = PROFANITY_TIP_ID;
  tip.className = "skipit-pm-tip";
  tip.setAttribute("role", "dialog");
  tip.setAttribute("aria-label", "New: mute swearing");
  // Clicks inside the tip must not reach Netflix (pause)
  tip.addEventListener("click", (event) => event.stopPropagation());

  const title = document.createElement("p");
  title.className = "skipit-pm-tip-title";
  title.textContent = "New: mute swearing";

  const text = document.createElement("p");
  text.className = "skipit-pm-tip-text";
  text.textContent = "Mutes lines with swearing and stars the word.";

  const actions = document.createElement("div");
  actions.className = "skipit-pm-tip-actions";

  const later = document.createElement("button");
  later.type = "button";
  later.className = "skipit-pm-tip-later";
  later.textContent = "Not now";
  later.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dismissProfanityTip();
  });

  const turnOn = document.createElement("button");
  turnOn.type = "button";
  turnOn.className = "skipit-pm-tip-on";
  turnOn.textContent = "Turn on";
  turnOn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dismissProfanityTip();
    requestProfanityMute(true);
  });

  actions.appendChild(later);
  actions.appendChild(turnOn);
  tip.appendChild(title);
  tip.appendChild(text);
  tip.appendChild(actions);
  return tip;
}

/**
 * Above the control-bar button, but in the player container (outside
 * Netflix's bar, so a React re-render can't take it away).
 */
function placeTipAboveControl(tip, control) {
  const container =
    document.getElementById(WRAPPER_ID)?.parentElement || findProfanityPlayerContainer();
  if (!container) return false;
  if (getComputedStyle(container).position === "static") container.style.position = "relative";

  const box = container.getBoundingClientRect();
  const btn = control.getBoundingClientRect();
  const centre = btn.left + btn.width / 2 - box.left - container.clientLeft;
  const margin = 8;
  const maxLeft = Math.max(margin, container.clientWidth - PROFANITY_TIP_WIDTH - margin);
  const left = Math.min(Math.max(centre - PROFANITY_TIP_WIDTH / 2, margin), maxLeft);
  const arrowLeft = Math.min(Math.max(centre - left - 6, 10), PROFANITY_TIP_WIDTH - 22);

  tip.classList.add("anchor-control-bar");
  tip.classList.remove("no-anchor");
  tip.style.left = `${Math.round(left)}px`;
  tip.style.bottom = `${Math.round(box.bottom - container.clientTop - btn.top + 12)}px`;
  tip.style.setProperty("--skipit-pm-arrow-left", `${Math.round(arrowLeft)}px`);
  if (tip.parentElement !== container) container.appendChild(tip);
  return true;
}

/**
 * Keep a control-bar tip pointing at the button (resize, fullscreen). When
 * Netflix hides its bar the tip stays, without an arrow pointing at nothing.
 */
function repositionProfanityTip() {
  if (profanityTipAnchor !== "control-bar") return;
  const tip = document.getElementById(PROFANITY_TIP_ID);
  if (!tip) return;
  const control = document.getElementById(PROFANITY_CONTROL_ID);
  if (isOnScreen(control)) placeTipAboveControl(tip, control);
  else tip.classList.add("no-anchor");
}

/** Shows the tip once the delay is done and a switch is on screen. */
function tryShowProfanityTip() {
  if (!profanityTipArmed) return;
  if (document.getElementById(PROFANITY_TIP_ID) || !shouldOfferProfanityTip()) return;
  // Neither switch on screen yet: stay armed, the next DOM change retries
  const anchor = findProfanityTipAnchor();
  if (!anchor) return;

  const tip = buildProfanityTip();
  if (anchor.kind === "control-bar") {
    if (!placeTipAboveControl(tip, anchor.el)) return;
  } else {
    anchor.el.parentElement.appendChild(tip);
    document.getElementById(WRAPPER_ID)?.classList.add(PROFANITY_TIP_OPEN_CLASS);
  }
  profanityTipArmed = false;
  profanityTipAnchor = anchor.kind;
  profanityLog("Tip shown, anchored to:", anchor.kind);

  // Marked seen the moment it's shown, so a reload or closed tab can never
  // bring it back
  profanityTipSeen = true;
  window.postMessage({ type: "SKIPIT_PROFANITY_TIP_SHOWN" }, "*");
  profanityTipTimeout = setTimeout(dismissProfanityTip, PROFANITY_TIP_DURATION_MS);
}

function dismissProfanityTip() {
  clearTimeout(profanityTipTimeout);
  profanityTipTimeout = null;
  profanityTipAnchor = null;
  document.getElementById(PROFANITY_TIP_ID)?.remove();
  // Looked up again: Netflix may have rebuilt the wrapper while the tip was open
  document.getElementById(WRAPPER_ID)?.classList.remove(PROFANITY_TIP_OPEN_CLASS);
  const chip = document.getElementById(PROFANITY_CHIP_ID);
  if (chip) chip.classList.toggle("shown", profanityUiMode === "fallback");
}

// Diagnostics: run skipitProfanityMute.status() in the Netflix console
window.skipitProfanityMute = {
  status() {
    const player = getProfanityPlayer();
    const current = callPlayer(player, "getTimedTextTrack");
    return {
      enabled: profanityMuteEnabled,
      setting: profanityMuteSetting,
      signedIn: profanityAuthKnown,
      currentTrack: textTrackKey(current),
      silentTrack: profanityOwnedTrackKey,
      silentTrackConfirmed: profanityOwnedTrackConfirmed,
      trackSetCount: profanityTrackSetCount,
      hidden: document.documentElement.classList.contains(PROFANITY_HIDE_CLASS),
      mutedByUs: profanityMutedByUs,
      userTookOver: profanityUserTookOver,
      netflixMuted: isMutedInNetflix(),
      volumeAtMute: profanityVolumeAtMute,
      volume: document.querySelector("video")?.volume ?? null,
      lineLang: profanityLineLang,
      trackRetries: profanityTrackRetries,
      // Which switch is in use: "control-bar" (Netflix's bar), "fallback" (square by the FAB) or "none"
      switchUi: profanityUiMode,
      audioSubtitleControlFound: profanityAudioControlFound,
      timelineFound: profanityTimelineFound,
      controlButtonPresent: !!document.getElementById(PROFANITY_CONTROL_ID),
      fallbackChipShown: !!document.getElementById(PROFANITY_CHIP_ID)?.classList.contains("shown"),
      tipAnchor: profanityTipAnchor,
      uiSyncCount: profanityUiSyncCount,
    };
  },
  test(text, bcp47 = "en") {
    const regex = getProfanityRegex(bcp47);
    if (!regex) return text;
    return censorText(text, regex, getProfanityExceptionRegex(bcp47)) ?? text;
  },
};

// Best effort: put "subtitles off" back if the tab is closed mid-session. The
// marker is kept and marked closed, so if this doesn't land, the next Netflix
// page (this tab reloaded, or a new tab within the hour) still recognises the
// silent track: hidden with the feature on, switched back to Off with it off.
window.addEventListener("pagehide", () => {
  if (profanityMuteEnabled && profanityOwnedTrackKey !== null) {
    refreshOwnedTrackMarker();
    const player = getProfanityPlayer();
    if (player) restoreOffTrack(player, { keepMarker: true });
  }
  setOwnedTrackMarkerClosed(true);
});
// Back from the back/forward cache: this page is live again
window.addEventListener("pageshow", (event) => {
  if (event.persisted) setOwnedTrackMarkerClosed(false);
});
// Frozen (background tab, may be discarded): treat like pagehide, so a
// discarded tab's marker can still be picked up
try {
  document.addEventListener("freeze", () => setOwnedTrackMarkerClosed(true));
  document.addEventListener("resume", () => setOwnedTrackMarkerClosed(false));
} catch (e) {
  // Page Lifecycle events not supported
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
      startSkipChecking(data.timestamps, data.announce === true);
    } else if (type === "SKIPIT_MARK_SAVED") {
      showMarkSavedNotification();
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
      setProfanityMuteAuth(authenticated);

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
      updateProfanityControls();
    } else if (type === "SKIPIT_SET_DISCREET_MODE") {
      // Toggle discreet mode (hide category names on ambient surfaces)
      const enabled = event.data.data?.enabled === true;
      if (enabled !== currentDiscreetMode) {
        currentDiscreetMode = enabled;
        applyDiscreetModeToExistingButtons(enabled);
        refreshSegmentLabels();
      }
    } else if (type === "SKIPIT_SET_PROFANITY_MUTE") {
      // Toggle muting + censoring of bad words in subtitle lines
      setProfanityMuteSetting(
        event.data.data?.enabled === true,
        event.data.data?.tipSeen
      );
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
        showThanksNotification();
      } else {
        // handleVote already hid the prompt and dropped the skip, so this is a fresh toast
        // with no "try again". The fallback covers a worker evicted mid-response.
        showNoticeNotification(
          resultData?.error || "Your vote did not go through."
        );
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
