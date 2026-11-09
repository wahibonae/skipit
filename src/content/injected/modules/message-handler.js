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
