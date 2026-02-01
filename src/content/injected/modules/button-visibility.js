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
