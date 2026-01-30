// ============================================================================
// SKIP NOTIFICATIONS WITH VOTING
// ============================================================================

/**
 * Get or create the notification element
 */
function getOrCreateNotification() {
  let notification = document.getElementById(NOTIFICATION_ID);
  if (notification) return notification;

  // Find player container
  const video = document.querySelector("video");
  if (!video) return null;

  let playerContainer =
    video.closest(".watch-video--player-view") ||
    video.closest('[data-uia="video-canvas"]')?.parentElement ||
    document.querySelector(".watch-video") ||
    video.parentElement?.parentElement?.parentElement;

  if (!playerContainer) return null;

  // Create notification element
  notification = document.createElement("div");
  notification.id = NOTIFICATION_ID;
  notification.className = "skipit-notification";

  playerContainer.appendChild(notification);
  return notification;
}

/**
 * Check if we should show voting prompt
 */
function shouldShowVotingPrompt(skipGroupId, confidence) {
  // Already voted this session
  if (votedSkipGroups.has(skipGroupId)) {
    return false;
  }

  // High confidence, well-validated - don't need votes
  if (confidence >= 0.9) {
    return false;
  }

  // Low confidence - always ask
  if (confidence < 0.5) {
    return true;
  }

  // First 5 skips of session - always ask
  if (sessionSkipCount <= 5) {
    return true;
  }

  // Otherwise, every 3rd skip
  return sessionSkipCount % 3 === 0;
}

/**
 * Build notification content using safe DOM methods
 */
function buildNotificationContent(notification, skipType, startMs, endMs, showVoting = false) {
  // Clear existing content
  notification.textContent = "";
  notification.classList.remove("voting");

  const formattedType = formatSkipType(skipType) || "content";

  // Create header container
  const headerDiv = document.createElement("div");
  headerDiv.className = "skipit-notification-header";

  // Create icon container
  const iconDiv = document.createElement("div");
  iconDiv.className = `skipit-notification-icon skipit-notification-icon--${
    skipType || "default"
  }`;

  // Create SVG icon
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z");
  svg.appendChild(path);
  iconDiv.appendChild(svg);

  // Create text container
  const textDiv = document.createElement("div");
  textDiv.className = "skipit-notification-text";

  // Create title with type
  const titleSpan = document.createElement("span");
  titleSpan.className = "skipit-notification-title";
  titleSpan.textContent = `Skipped ${formattedType} scene`;

  // Create time range
  const timeSpan = document.createElement("span");
  timeSpan.className = "skipit-notification-time";
  timeSpan.textContent = `${formatTimeMs(startMs)} \u2192 ${formatTimeMs(endMs)}`;

  textDiv.appendChild(titleSpan);
  textDiv.appendChild(timeSpan);

  headerDiv.appendChild(iconDiv);
  headerDiv.appendChild(textDiv);
  notification.appendChild(headerDiv);

  // Add voting buttons if enabled
  if (showVoting) {
    notification.classList.add("voting");

    // Create vote buttons container
    const voteButtonsDiv = document.createElement("div");
    voteButtonsDiv.className = "skipit-vote-buttons";

    // Upvote button
    const upvoteBtn = document.createElement("button");
    upvoteBtn.className = "skipit-vote-btn upvote";
    upvoteBtn.textContent = "\uD83D\uDC4D";
    upvoteBtn.title = "Correct skip (Y)";
    upvoteBtn.onclick = () => handleVote(1, skipType);

    // Downvote button
    const downvoteBtn = document.createElement("button");
    downvoteBtn.className = "skipit-vote-btn downvote";
    downvoteBtn.textContent = "\uD83D\uDC4E";
    downvoteBtn.title = "Wrong skip (N)";
    downvoteBtn.onclick = () => handleVote(-1, skipType);

    // Wrong type button
    const wrongTypeBtn = document.createElement("button");
    wrongTypeBtn.className = "skipit-vote-btn wrong-type";
    wrongTypeBtn.textContent = "\uD83C\uDFF7\uFE0F";
    wrongTypeBtn.title = "Wrong type (T)";
    wrongTypeBtn.onclick = () => showTypeSelector(notification, skipType);

    voteButtonsDiv.appendChild(upvoteBtn);
    voteButtonsDiv.appendChild(downvoteBtn);
    voteButtonsDiv.appendChild(wrongTypeBtn);
    notification.appendChild(voteButtonsDiv);

    // Add countdown bar
    const countdownDiv = document.createElement("div");
    countdownDiv.className = "skipit-countdown";

    const countdownBar = document.createElement("div");
    countdownBar.className = "skipit-countdown-bar";

    const countdownProgress = document.createElement("div");
    countdownProgress.className = "skipit-countdown-progress";
    countdownProgress.id = "skipit-countdown-progress";
    countdownProgress.style.width = "100%";

    countdownBar.appendChild(countdownProgress);
    countdownDiv.appendChild(countdownBar);
    notification.appendChild(countdownDiv);

    // Add hover handlers to pause timer
    notification.onmouseenter = () => {
      isNotificationHovered = true;
    };
    notification.onmouseleave = () => {
      isNotificationHovered = false;
    };

    // Add keyboard shortcuts
    document.addEventListener("keydown", handleVoteKeyboard);
  }
}

/**
 * Handle keyboard shortcuts for voting
 */
function handleVoteKeyboard(e) {
  if (!currentSkipGroupId) return;

  const key = e.key.toLowerCase();
  if (key === "y") {
    handleVote(1, null);
  } else if (key === "n") {
    handleVote(-1, null);
  } else if (key === "t") {
    const notification = document.getElementById(NOTIFICATION_ID);
    if (notification) {
      showTypeSelector(notification, null);
    }
  }
}

/**
 * Show type selector for wrong type voting
 */
function showTypeSelector(notification, currentType) {
  // Find vote buttons container
  let voteButtonsDiv = notification.querySelector(".skipit-vote-buttons");
  if (!voteButtonsDiv) return;

  // Clear and convert to type selector
  while (voteButtonsDiv.firstChild) {
    voteButtonsDiv.removeChild(voteButtonsDiv.firstChild);
  }
  voteButtonsDiv.className = "skipit-type-selector";

  const types = ["Nudity", "Sex", "Gore"];
  types.forEach(type => {
    if (type.toLowerCase() !== (currentType || "").toLowerCase()) {
      const typeBtn = document.createElement("button");
      typeBtn.className = `skipit-type-option skipit-type-option--${type.toLowerCase()}`;
      typeBtn.textContent = type;
      typeBtn.onclick = () => handleVote(-1, currentType, type);
      voteButtonsDiv.appendChild(typeBtn);
    }
  });

  // Add cancel button
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "skipit-type-option skipit-type-option--cancel";
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = () => {
    hideSkipNotification();
  };
  voteButtonsDiv.appendChild(cancelBtn);
}

/**
 * Handle vote action
 */
function handleVote(voteType, currentType, suggestedType = null) {
  if (!currentSkipGroupId) {
    console.warn("[Netflix Injected] No skip group ID for voting");
    return;
  }

  // Mark as voted
  votedSkipGroups.add(currentSkipGroupId);

  // Remove keyboard listener
  document.removeEventListener("keydown", handleVoteKeyboard);

  // Send vote to content script
  window.postMessage({
    type: "SKIPIT_SKIP_VOTE",
    skipGroupId: currentSkipGroupId,
    voteType: voteType,
    suggestedType: suggestedType,
  }, "*");

  // Show confirmation
  showVoteConfirmation();
}

/**
 * Show vote confirmation
 */
function showVoteConfirmation() {
  const notification = document.getElementById(NOTIFICATION_ID);
  if (!notification) return;

  // Clear timers
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  // Show confirmation using safe DOM methods
  notification.textContent = "";
  notification.classList.remove("voting");

  const confirmDiv = document.createElement("div");
  confirmDiv.className = "skipit-vote-confirmation";
  confirmDiv.textContent = "\u2713 Thanks for voting!";
  notification.appendChild(confirmDiv);

  // Dismiss after short delay
  notificationTimeout = setTimeout(() => {
    hideSkipNotification();
  }, VOTE_CONFIRMATION_DURATION);
}

/**
 * Show skip notification with optional voting
 * @param {string} skipType - Single type string like 'nudity', 'sex', or 'gore'
 * @param {number} startMs - Start time in milliseconds
 * @param {number} endMs - End time in milliseconds
 * @param {number} skipGroupId - Skip group ID for voting (optional)
 * @param {number} confidence - Confidence score 0-1 (optional)
 * @param {boolean} userContributed - User submitted a timestamp in this group (optional)
 * @param {boolean} userVoted - User already voted on this group (optional)
 */
function showSkipNotification(skipType, startMs, endMs, skipGroupId = null, confidence = 0.5, userContributed = false, userVoted = false) {
  // Check cooldown for this specific segment
  const now = Date.now();
  if (
    lastNotifiedSegment &&
    lastNotifiedSegment.start === startMs &&
    lastNotifiedSegment.end === endMs &&
    now - lastNotifiedSegment.timestamp < SEGMENT_COOLDOWN
  ) {
    return;
  }

  // Track session skip count
  sessionSkipCount++;

  // Update last notified segment
  lastNotifiedSegment = { start: startMs, end: endMs, timestamp: now };

  // Store current skip group ID for voting
  currentSkipGroupId = skipGroupId;

  const notification = getOrCreateNotification();
  if (!notification) return;

  // Clear existing timeouts and intervals
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  // Remove any existing keyboard listener
  document.removeEventListener("keydown", handleVoteKeyboard);

  // Determine if we should show voting buttons
  // Don't show voting if user contributed to this skip group or already voted
  const showVoting = skipGroupId && !userContributed && !userVoted && shouldShowVotingPrompt(skipGroupId, confidence);

  // Build notification content
  buildNotificationContent(notification, skipType, startMs, endMs, showVoting);

  // Show notification
  requestAnimationFrame(() => {
    notification.classList.add("visible");
  });

  // Start countdown animation if voting is shown
  if (showVoting) {
    let timeRemaining = NOTIFICATION_DURATION;
    const updateInterval = 100; // Update every 100ms

    countdownInterval = setInterval(() => {
      if (!isNotificationHovered) {
        timeRemaining -= updateInterval;
      }

      const progress = (timeRemaining / NOTIFICATION_DURATION) * 100;
      const progressBar = document.getElementById("skipit-countdown-progress");
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        hideSkipNotification();
      }
    }, updateInterval);
  } else {
    // Simple auto-dismiss for non-voting notification
    notificationTimeout = setTimeout(() => {
      hideSkipNotification();
    }, NOTIFICATION_DURATION);
  }
}

/**
 * Hide skip notification
 */
function hideSkipNotification() {
  const notification = document.getElementById(NOTIFICATION_ID);
  if (notification) {
    notification.classList.remove("visible", "voting");
  }

  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }

  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  // Remove keyboard listener
  document.removeEventListener("keydown", handleVoteKeyboard);

  // Clear current skip group ID
  currentSkipGroupId = null;
  isNotificationHovered = false;
}

/**
 * Clean up notification on stop
 */
function cleanupNotification() {
  hideSkipNotification();
  lastNotifiedSegment = null;
  sessionSkipCount = 0; // Reset session skip count

  const notification = document.getElementById(NOTIFICATION_ID);
  if (notification) {
    notification.remove();
  }
}
