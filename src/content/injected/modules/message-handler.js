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
    } else if (type === "SKIPIT_SET_AVAILABLE_SKIP_TYPES") {
      // Set available skip types before skipping starts (from content script)
      const skipTypes = data?.skipTypes || [];
      const metadata =
        data?.metadata || lastMetadata || extractNetflixMetadata();
      availableSkipTypes = skipTypes;
      isLoadingSkipTypes = false; // Done loading, show actual state
      updateSkipitFAB(metadata, fabSkippingActive, skipTypes);
      console.log("[Netflix Injected] Set available skip types:", skipTypes);
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
      console.log(
        "[Netflix Injected] Modal closed, restoring state. wasFullscreen:",
        wasFullscreenBeforeModal
      );
      playVideo();
      if (wasFullscreenBeforeModal) {
        enterFullscreen();
        wasFullscreenBeforeModal = false;
      }
    } else if (type === "SKIPIT_AUTH_STATE_UPDATE") {
      // Update auth state from content script
      const authenticated = event.data.data?.isAuthenticated || false;
      updateButtonsAuthState(authenticated);

      // Stop skipping when user signs out
      if (!authenticated && fabSkippingActive) {
        console.log("[Netflix Injected] User signed out - stopping skip checking");
        stopSkipChecking();
      }
    }
  });
}
