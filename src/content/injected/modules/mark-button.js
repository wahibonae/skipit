// ============================================================================
// MARK SCENE BUTTON
// ============================================================================

/**
 * Create the mark button element
 */
function createMarkButton() {
  const button = document.createElement("button");
  button.id = BUTTON_ID;
  button.className = "skipit-mark-btn" + (isAuthenticated ? "" : " locked");
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

    // Track fullscreen state before exiting, pause video and exit fullscreen
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
