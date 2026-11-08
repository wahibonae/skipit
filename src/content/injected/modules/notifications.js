// ============================================================================
// TOASTS
// Every message Skipit puts on the player is this one component: a mark, a
// line of text and an entrance. See the TOAST block in styles/player.css.
// ============================================================================

const ICON_CHECK = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";
const ICON_BOOKMARK = "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z";
const ICON_WARNING = "M12 2 1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V8h2v5z";
// Spaced 3 units apart so the 1.8 stroke doesn't weld the two triangles together
const ICON_FORWARD = "M5 5.8 10.6 12 5 18.2Z M13.6 5.8 19.2 12 13.6 18.2Z";

// A notice has to be read, not just noticed, so it stays up longer
const NOTICE_DURATION = 8000;
// Display guard only: stops a pathologically long message from covering the video
const NOTICE_MAX_LENGTH = 400;
// How long the wordmark holds alone before the message takes over (inside the duration)
const HANDOFF_HOLD = 850;
// How long the activation toast keeps the shared element to itself
const ANNOUNCE_HOLD = 2000;

/**
 * Get or create the shared toast element.
 */
function getOrCreateToast() {
  let toast = document.getElementById(NOTIFICATION_ID);
  if (toast) return toast;

  const playerContainer = getPlayerContainer();
  if (!playerContainer) return null;

  toast = document.createElement("div");
  toast.id = NOTIFICATION_ID;
  playerContainer.appendChild(toast);
  return toast;
}

/**
 * Build the head of a toast: the wordmark, a scene's timeline colour, or a glyph.
 */
function createToastMark(mark) {
  const wrap = document.createElement("span");

  if (mark.kind === "scene") {
    // Tinted with the scene's timeline colour so toast and segment read as one thing
    wrap.className =
      "skipit-toast-mark skipit-toast-mark--scene" +
      ` skipit-toast-mark--${mark.type || "default"}`;
    wrap.appendChild(createIconSVG(ICON_FORWARD, 1.8));
    return wrap;
  }

  wrap.className = `skipit-toast-mark skipit-toast-mark--${mark.kind}`;
  wrap.appendChild(
    mark.kind === "brand"
      ? createSkipitLogoSVG()
      : createIconSVG(mark.path, mark.stroke)
  );
  return wrap;
}

function createToastSpan(className, text) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  return span;
}

/**
 * Render one toast into the shared element.
 *
 * @param {object} spec
 * @param {object} spec.mark      - {kind: "brand"|"scene"|"action"|"warn", type?, path?, stroke?}
 * @param {string} [spec.primary] - the message, one line
 * @param {string} [spec.secondary] - a muted detail after it
 * @param {string} [spec.message] - a sentence that is allowed to wrap
 * @param {string} [spec.entrance] - "rise" (default) | "open" | "stamp" | "handoff"
 * @param {number} [spec.duration]
 * @param {boolean} [spec.skipEvent] - about skipping itself, so cleared on stop
 *
 * The element is shared, so every toast reuses the one dismissal timer; a
 * second timer would strip `visible` from whatever is showing when it fires.
 */
function renderToast(spec) {
  const toast = getOrCreateToast();
  if (!toast) return;

  // This element no longer shows the last skipped segment, so drop its cooldown
  lastNotifiedSegment = null;

  // A message about the user's own action is newer than a held-back skip toast,
  // so it wins (as on main) and ends the hold.
  if (!spec.skipEvent) {
    cancelDeferredSkipToast();
    announceHoldUntil = 0;
  }

  if (notificationTimeout) clearTimeout(notificationTimeout);
  if (notificationSwapTimeout) clearTimeout(notificationSwapTimeout);
  if (notificationFrame) cancelAnimationFrame(notificationFrame);

  const entrance = spec.entrance || "rise";
  const block = Boolean(spec.message);

  toast.className =
    "skipit-toast" +
    ` skipit-toast--${entrance}` +
    (block ? " skipit-toast--block" : "");
  toast.textContent = "";
  // Only skip toasts are cleared when skipping stops; see cleanupNotification
  toast.dataset.skipEvent = spec.skipEvent ? "true" : "";

  if (entrance === "stamp") {
    const ring = document.createElement("span");
    ring.className = "skipit-toast-ring";
    toast.appendChild(ring);
  }

  // Handoff: the wordmark shows alone, then collapses as the message unrolls
  if (entrance === "handoff") {
    const swap = document.createElement("span");
    swap.className = "skipit-toast-swap";
    const swapInner = document.createElement("span");
    swapInner.appendChild(createToastMark({ kind: "brand" }));
    swap.appendChild(swapInner);
    toast.appendChild(swap);
  } else {
    toast.appendChild(createToastMark(spec.mark));
  }

  // The message either unrolls out of the mark, or simply follows it
  let body = toast;
  if (entrance === "open" || entrance === "handoff") {
    const reveal = document.createElement("span");
    reveal.className = "skipit-toast-reveal";
    body = document.createElement("span");
    reveal.appendChild(body);
    toast.appendChild(reveal);
  }

  if (entrance === "handoff") {
    body.appendChild(createToastMark(spec.mark));
  }

  // A rule after the wordmark; other marks just get a gap
  body.appendChild(
    createToastSpan(spec.mark.kind === "brand" ? "skipit-toast-div" : "skipit-toast-gap", "")
  );

  if (spec.message) {
    body.appendChild(createToastSpan("skipit-toast-message", spec.message));
  } else {
    body.appendChild(createToastSpan("skipit-toast-primary", spec.primary));
    if (spec.secondary) {
      body.appendChild(createToastSpan("skipit-toast-gap", ""));
      body.appendChild(createToastSpan("skipit-toast-secondary", spec.secondary));
    }
  }

  // Tracked so hide can cancel it: rAF pauses in a hidden tab while the dismiss
  // timer still fires, which would re-show the toast with no timer left.
  notificationFrame = requestAnimationFrame(() => {
    notificationFrame = null;
    toast.classList.add("visible");
    if (entrance === "open") {
      // A second frame, so the capsule has a closed state to open from
      notificationFrame = requestAnimationFrame(() => {
        notificationFrame = null;
        toast.classList.add("opened");
      });
    } else if (entrance === "handoff") {
      notificationSwapTimeout = setTimeout(() => {
        notificationSwapTimeout = null;
        toast.classList.add("opened");
      }, HANDOFF_HOLD);
    }
  });

  notificationTimeout = setTimeout(hideSkipNotification, spec.duration || NOTIFICATION_DURATION);
}

/**
 * A scene was skipped.
 * @param {string} skipType - Type, or a comma list for merged overlapping scenes
 * @param {number} startMs
 * @param {number} endMs
 */
function showSkipNotification(skipType, startMs, endMs) {
  const now = Date.now();
  if (
    lastNotifiedSegment &&
    lastNotifiedSegment.start === startMs &&
    lastNotifiedSegment.end === endMs &&
    now - lastNotifiedSegment.timestamp < SEGMENT_COOLDOWN
  ) {
    return;
  }

  // The activation toast still owns the element: show this one once it's done
  // (e.g. Start pressed just before or inside a scene). Latest skip wins.
  if (now < announceHoldUntil) {
    lastNotifiedSegment = { start: startMs, end: endMs, timestamp: now };
    cancelDeferredSkipToast();
    deferredSkipToastTimeout = setTimeout(() => {
      deferredSkipToastTimeout = null;
      renderSkipToast(skipType, startMs, endMs);
    }, announceHoldUntil - now);
    return;
  }

  renderSkipToast(skipType, startMs, endMs);
}

function cancelDeferredSkipToast() {
  if (deferredSkipToastTimeout) {
    clearTimeout(deferredSkipToastTimeout);
    deferredSkipToastTimeout = null;
  }
}

/** Render the "Skipped … scene" toast and start that segment's cooldown. */
function renderSkipToast(skipType, startMs, endMs) {
  // Overlapping scenes arrive merged as a comma list: the mark takes the first
  // type, the words take all of them.
  const types = skipType ? String(skipType).split(",") : [];
  const formatted = formatSkipTypes(types);

  renderToast({
    mark: { kind: "scene", type: types[0] || "default" },
    primary: currentDiscreetMode
      ? "Scene skipped"
      : `Skipped ${formatted || "content"} scene`,
    secondary: `(${formatDurationMs(endMs - startMs)})`,
    entrance: "rise",
    skipEvent: true,
  });

  // renderToast clears the cooldown; restore it for this segment
  lastNotifiedSegment = { start: startMs, end: endMs, timestamp: Date.now() };
}

/** Skipping just started. Same wording as the FAB underneath it. */
function showSkippingActiveNotification(types) {
  cancelDeferredSkipToast();
  announceHoldUntil = Date.now() + ANNOUNCE_HOLD;

  const typeText = formatSkipTypes(types);
  renderToast({
    mark: { kind: "scene", type: "accent" },
    primary: currentDiscreetMode
      ? "Skipping on"
      : typeText
        ? types.length >= 2
          ? `Skipping ${typeText}`
          : `Skipping ${typeText} scenes`
        : "Skipping on",
    entrance: "handoff",
    skipEvent: true,
  });
}

/** A marked scene was accepted. */
function showMarkSavedNotification() {
  renderToast({
    mark: { kind: "action", path: ICON_BOOKMARK },
    primary: "Scene marked",
    entrance: "stamp",
  });
}

/** A vote was recorded. */
function showThanksNotification() {
  renderToast({
    // Material's check is drawn thin, so a light stroke matches the other glyphs' weight
    mark: { kind: "action", path: ICON_CHECK, stroke: 1.1 },
    primary: "Thanks for helping!",
    entrance: "open",
  });
}

/** A refusal or warning the user needs to actually read. */
function showNoticeNotification(message) {
  renderToast({
    mark: { kind: "warn", path: ICON_WARNING },
    message:
      typeof message === "string" &&
      message.trim() &&
      message.length <= NOTICE_MAX_LENGTH
        ? message
        : "Something went wrong. Please try again.",
    entrance: "rise",
    duration: NOTICE_DURATION,
  });
}

/**
 * Hide whatever is on screen.
 */
function hideSkipNotification() {
  const toast = document.getElementById(NOTIFICATION_ID);
  if (toast) {
    toast.classList.remove("visible", "opened");
  }

  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
  if (notificationSwapTimeout) {
    clearTimeout(notificationSwapTimeout);
    notificationSwapTimeout = null;
  }
  if (notificationFrame) {
    cancelAnimationFrame(notificationFrame);
    notificationFrame = null;
  }
}

// ============================================================================
// VOTE PROMPT
// Same component with buttons. It owns its own element so a skip toast that
// fires mid-decision can't replace the question.
// ============================================================================

const VOTE_PROMPT_ID = "skipit-vote-prompt";

const ICON_THUMB_UP =
  "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z";
const ICON_THUMB_DOWN =
  "M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z";

function createVoteButton(modifier, iconPath, label, onClick) {
  const button = document.createElement("button");
  button.className = `skipit-vote-btn skipit-vote-btn--${modifier}`;
  button.appendChild(createIconSVG(iconPath));
  button.appendChild(createToastSpan("", label));
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick();
  });
  return button;
}

/**
 * Ask whether a pending scene is right. Keeps exact timestamps (not a rounded
 * duration) because the user is judging a specific span.
 */
function showVotePrompt(skip) {
  // Don't re-show for the same skip while its element is still in the DOM.
  // Netflix's own UI updates can remove foreign elements underneath us.
  if (activeVotePromptSkipId === skip.id && document.getElementById(VOTE_PROMPT_ID)) return;

  hideVotePrompt();
  activeVotePromptSkipId = skip.id;

  const playerContainer = getPlayerContainer();
  if (!playerContainer) return;

  const typeLabel = formatSkipType(skip.type) || "default";

  const prompt = document.createElement("div");
  prompt.id = VOTE_PROMPT_ID;
  prompt.className = "skipit-toast skipit-toast--block skipit-toast--rise skipit-vote-prompt";

  const header = document.createElement("span");
  header.className = "skipit-vote-header";
  // In discreet mode the colour must not give the category away
  header.appendChild(
    createToastMark({ kind: "scene", type: currentDiscreetMode ? "accent" : typeLabel })
  );
  header.appendChild(createToastSpan("skipit-toast-gap", ""));
  header.appendChild(
    createToastSpan(
      "skipit-toast-primary",
      // The prompt fires before the skip, so discreet wording stays forward-looking
      currentDiscreetMode
        ? "Skip this scene?"
        : `${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)} scene?`
    )
  );
  header.appendChild(createToastSpan("skipit-toast-div", ""));
  header.appendChild(
    createToastSpan(
      "skipit-toast-secondary",
      `${formatTimeMs(skip.startTime)} → ${formatTimeMs(skip.endTime)}`
    )
  );
  prompt.appendChild(header);

  const actions = document.createElement("span");
  actions.className = "skipit-vote-actions";
  actions.appendChild(
    createVoteButton("upvote", ICON_THUMB_UP, "Yes, skip it", () =>
      handleVote(skip.id, 1, skip.endTime)
    )
  );
  actions.appendChild(
    createVoteButton(
      "downvote",
      ICON_THUMB_DOWN,
      // "No, it's not" means "not a <category> scene", meaningless once the category is hidden
      currentDiscreetMode ? "No, it's fine" : "No, it's not",
      () => handleVote(skip.id, -1, null)
    )
  );
  prompt.appendChild(actions);

  playerContainer.appendChild(prompt);

  votePromptFrame = requestAnimationFrame(() => {
    votePromptFrame = null;
    prompt.classList.add("visible");
  });
}

/**
 * Hide the vote prompt
 */
function hideVotePrompt() {
  if (votePromptFrame !== null) {
    cancelAnimationFrame(votePromptFrame);
    votePromptFrame = null;
  }

  const prompt = document.getElementById(VOTE_PROMPT_ID);
  if (prompt) {
    // Give up the id before the fade, so a re-show within 250ms doesn't create a
    // second element under the same id that the next hide can't find.
    prompt.id = "";
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
  lastNotifiedSegment = null;
  announceHoldUntil = 0;
  cancelDeferredSkipToast();

  // A message about the user's own action (marked, voted, a notice) outlives a
  // stop and dismisses itself on its own timer.
  const toast = document.getElementById(NOTIFICATION_ID);
  if (toast && !toast.dataset.skipEvent && notificationTimeout) return;

  hideSkipNotification();
  if (toast) toast.remove();
}
