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
