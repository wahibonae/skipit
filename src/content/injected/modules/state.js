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
