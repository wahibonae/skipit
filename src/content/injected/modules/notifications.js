// ============================================================================
// SKIP NOTIFICATIONS
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
 * Build notification content using safe DOM methods
 */
function buildNotificationContent(notification, skipType, startMs, endMs) {
  // Clear existing content
  notification.textContent = "";

  const formattedType = skipType && skipType.includes(",")
    ? formatSkipTypes(skipType.split(","))
    : (formatSkipType(skipType) || "content");

  // Create header container
  const headerDiv = document.createElement("div");
  headerDiv.className = "skipit-notification-header";

  // Create icon container - use first type for styling when multiple types are merged
  const iconType = skipType && skipType.includes(",") ? skipType.split(",")[0] : (skipType || "default");
  const iconDiv = document.createElement("div");
  iconDiv.className = `skipit-notification-icon skipit-notification-icon--${iconType}`;

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
}

/**
 * Show skip notification
 * @param {string} skipType - Single type string like 'nudity', 'sex', or 'gore'
 * @param {number} startMs - Start time in milliseconds
 * @param {number} endMs - End time in milliseconds
 */
function showSkipNotification(skipType, startMs, endMs) {
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

  // Update last notified segment
  lastNotifiedSegment = { start: startMs, end: endMs, timestamp: now };

  const notification = getOrCreateNotification();
  if (!notification) return;

  // Clear existing timeout
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  // Build notification content
  buildNotificationContent(notification, skipType, startMs, endMs);

  // Show notification
  requestAnimationFrame(() => {
    notification.classList.add("visible");
  });

  // Auto-dismiss
  notificationTimeout = setTimeout(() => {
    hideSkipNotification();
  }, NOTIFICATION_DURATION);
}

/**
 * Hide skip notification
 */
function hideSkipNotification() {
  const notification = document.getElementById(NOTIFICATION_ID);
  if (notification) {
    notification.classList.remove("visible");
  }

  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
}

// ============================================================================
// VOTE PROMPT FOR PENDING SKIPS
// ============================================================================

const VOTE_PROMPT_ID = "skipit-vote-prompt";

/**
 * Show vote prompt for a pending skip
 */
function showVotePrompt(skip) {
  // Don't show if already showing for this skip AND element still exists in DOM
  // (Netflix UI updates during seeking can remove foreign DOM elements)
  if (activeVotePromptSkipId === skip.id && document.getElementById(VOTE_PROMPT_ID)) return;

  // Remove any existing prompt
  hideVotePrompt();

  activeVotePromptSkipId = skip.id;

  // Find player container
  const video = document.querySelector("video");
  if (!video) return;

  let playerContainer =
    video.closest(".watch-video--player-view") ||
    video.closest('[data-uia="video-canvas"]')?.parentElement ||
    document.querySelector(".watch-video") ||
    video.parentElement?.parentElement?.parentElement;

  if (!playerContainer) return;

  // Create prompt element (mirrors .skipit-notification structure)
  const prompt = document.createElement("div");
  prompt.id = VOTE_PROMPT_ID;
  prompt.className = "skipit-vote-prompt";

  // Row 1: [icon circle] [title + time] — same as active skip notification
  const headerDiv = document.createElement("div");
  headerDiv.className = "skipit-vote-header";

  const typeLabel = formatSkipType(skip.type) || "default";
  const iconDiv = document.createElement("div");
  iconDiv.className = `skipit-notification-icon skipit-notification-icon--${typeLabel}`;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z");
  svg.appendChild(path);
  iconDiv.appendChild(svg);

  const textDiv = document.createElement("div");
  textDiv.className = "skipit-notification-text";

  const titleSpan = document.createElement("span");
  titleSpan.className = "skipit-notification-title";
  const formattedType = typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);
  titleSpan.textContent = `${formattedType} scene?`;

  const timeSpan = document.createElement("span");
  timeSpan.className = "skipit-notification-time";
  timeSpan.textContent = `${formatTimeMs(skip.startTime)} \u2192 ${formatTimeMs(skip.endTime)}`;

  textDiv.appendChild(titleSpan);
  textDiv.appendChild(timeSpan);

  headerDiv.appendChild(iconDiv);
  headerDiv.appendChild(textDiv);

  // Row 2: centered buttons
  const buttons = document.createElement("div");
  buttons.className = "skipit-vote-buttons";

  const upvoteBtn = document.createElement("button");
  upvoteBtn.className = "skipit-vote-btn skipit-vote-btn--upvote";
  // Thumbs up icon
  const upIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  upIcon.setAttribute("viewBox", "0 0 24 24");
  upIcon.setAttribute("fill", "currentColor");
  const upPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  upPath.setAttribute("d", "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z");
  upIcon.appendChild(upPath);
  upvoteBtn.appendChild(upIcon);
  const upLabel = document.createElement("span");
  upLabel.textContent = "Yes, skip it";
  upvoteBtn.appendChild(upLabel);
  upvoteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    handleVote(skip.id, 1, skip.endTime);
  });

  const downvoteBtn = document.createElement("button");
  downvoteBtn.className = "skipit-vote-btn skipit-vote-btn--downvote";
  // Thumbs down icon
  const downIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  downIcon.setAttribute("viewBox", "0 0 24 24");
  downIcon.setAttribute("fill", "currentColor");
  const downPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  downPath.setAttribute("d", "M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z");
  downIcon.appendChild(downPath);
  downvoteBtn.appendChild(downIcon);
  const downLabel = document.createElement("span");
  downLabel.textContent = "No, it's not";
  downvoteBtn.appendChild(downLabel);
  downvoteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    handleVote(skip.id, -1, null);
  });

  buttons.appendChild(upvoteBtn);
  buttons.appendChild(downvoteBtn);

  prompt.appendChild(headerDiv);
  prompt.appendChild(buttons);

  playerContainer.appendChild(prompt);

  // Fade in
  requestAnimationFrame(() => {
    prompt.classList.add("visible");
  });
}

/**
 * Hide the vote prompt
 */
function hideVotePrompt() {
  const prompt = document.getElementById(VOTE_PROMPT_ID);
  if (prompt) {
    prompt.classList.remove("visible");
    setTimeout(() => prompt.remove(), 250);
  }
  activeVotePromptSkipId = null;

  if (votePromptTimeout) {
    clearTimeout(votePromptTimeout);
    votePromptTimeout = null;
  }
}

/**
 * Handle a vote action
 */
function handleVote(skipGroupId, voteType, seekToMs) {
  hideVotePrompt();

  // If upvote, seek to end time immediately
  if (voteType === 1 && seekToMs !== null) {
    seek(seekToMs);
  }

  // Send vote to content script (which bridges to background)
  window.postMessage(
    {
      type: "SKIPIT_VOTE_ON_SKIP",
      skipGroupId: skipGroupId,
      voteType: voteType,
      endTime: seekToMs,
    },
    "*"
  );

  // Remove from local pending skips
  pendingSkips = pendingSkips.filter((s) => s.id !== skipGroupId);

  // Re-render pending timeline segments
  renderPendingTimelineSegments(pendingSkips);
}

/**
 * Clean up notification on stop
 */
function cleanupNotification() {
  hideSkipNotification();
  lastNotifiedSegment = null;

  const notification = document.getElementById(NOTIFICATION_ID);
  if (notification) {
    notification.remove();
  }
}
