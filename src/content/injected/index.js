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
