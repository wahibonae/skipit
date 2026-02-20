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
        }
        clearPendingSkips();
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
