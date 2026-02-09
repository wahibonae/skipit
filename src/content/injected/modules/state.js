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
let loadingStatus = "detecting"; // "detecting" | "loading" | "ready"

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
