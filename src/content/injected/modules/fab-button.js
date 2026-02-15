// ============================================================================
// SKIPIT FAB BUTTON (Quick Skip Access)
// ============================================================================

/**
 * Create the Skipit FAB button element
 * New 3-line structure: label, types, content
 */
function createSkipitFAB() {
  const button = document.createElement("button");
  button.id = FAB_BUTTON_ID;
  button.className =
    "skipit-fab" + (isAuthenticated ? " disabled" : " locked");
  button.setAttribute(
    "aria-label",
    isAuthenticated ? "Skip content with Skipit" : "Sign in to skip content"
  );

  // Create lock icon (hidden when authenticated)
  const lockIcon = document.createElement("span");
  lockIcon.className = "skipit-locked-icon";
  lockIcon.style.display = isAuthenticated ? "none" : "flex";
  lockIcon.appendChild(createLockIconSVG());

  // "Skipit" branding label (top line)
  const label = document.createElement("span");
  label.className = "skipit-fab-label";
  label.textContent = "Skipit \u23E9\uFE0E";

  // Skip types line (subtitle - bottom line)
  const typesLine = document.createElement("span");
  typesLine.className = "skipit-fab-types";
  typesLine.textContent = isAuthenticated ? "Detecting content..." : "Sign in to skip";

  button.appendChild(lockIcon);
  button.appendChild(label);
  button.appendChild(typesLine);
  button.addEventListener("click", handleSkipitFABClick);

  return button;
}

/**
 * Handle Skipit FAB button click
 */
function handleSkipitFABClick(event) {
  event.preventDefault();
  event.stopPropagation();

  // Check authentication first (but allow stopping if already skipping)
  if (!isAuthenticated && !fabSkippingActive) {
    window.postMessage({ type: "SKIPIT_OPEN_AUTH_POPUP" }, "*");
    return;
  }

  // If no skips available and not currently skipping, don't proceed (disabled state)
  if (availableSkipTypes.length === 0 && !fabSkippingActive) {
    return;
  }

  const metadata = extractNetflixMetadata();
  lastMetadata = metadata;

  if (fabSkippingActive) {
    // Currently skipping - stop it (toggle behavior)
    window.postMessage(
      {
        type: "SKIPIT_STOP_REQUEST",
      },
      "*"
    );
  } else {
    // Not skipping - check if we can auto-start or need to show quick panel
    if (availableSkipTypes.length === 1) {
      // Single category available - auto-start skipping immediately (no quick panel)
      const singleType = availableSkipTypes[0];
      window.postMessage(
        {
          type: "SKIPIT_AUTO_START_SKIPPING",
          metadata: metadata,
          skipType: singleType,
        },
        "*"
      );
    } else {
      // Multiple categories - open the quick panel for user selection
      // Track fullscreen state, pause video, exit fullscreen first
      wasFullscreenBeforeModal = !!document.fullscreenElement;
      pauseVideo();
      exitFullscreenIfActive().then(() => {
        window.postMessage(
          {
            type: "SKIPIT_FAB_CLICKED",
            metadata: metadata,
          },
          "*"
        );
      });
    }
  }
}

/**
 * Update FAB button display based on metadata, skip state, and available types
 * @param {Object} metadata - Netflix content metadata
 * @param {boolean} isSkipping - Whether skipping is currently active
 * @param {Array} skipTypes - Array of available skip types (optional)
 */
function updateSkipitFAB(metadata, isSkipping, skipTypes = null) {
  const button = document.getElementById(FAB_BUTTON_ID);
  if (!button) return;

  const typesLine = button.querySelector(".skipit-fab-types");

  if (!typesLine) return;

  fabSkippingActive = isSkipping;

  // Update available skip types if provided
  if (skipTypes !== null) {
    availableSkipTypes = skipTypes;
  }

  if (isSkipping) {
    // Active skipping state - red background
    // Use activeSkippingTypes (what's actually being skipped), not availableSkipTypes
    button.classList.add("active");
    button.classList.remove("disabled");
    const typeText = formatSkipTypes(activeSkippingTypes);
    typesLine.textContent = typeText
      ? activeSkippingTypes.length >= 3
        ? `Skipping ${typeText}`
        : `Skipping ${typeText} scenes`
      : "Skipping";
  } else if (availableSkipTypes && availableSkipTypes.length > 0) {
    // Has skips available - show skip types
    button.classList.remove("active", "disabled");
    const typeText = formatSkipTypes(availableSkipTypes);
    typesLine.textContent = availableSkipTypes.length >= 3
      ? `Skip ${typeText}`
      : `Skip ${typeText} scenes`;
  } else if (loadingStatus === "not_recognized") {
    // Content couldn't be matched
    button.classList.remove("active");
    button.classList.add("disabled");
    typesLine.textContent = "Content not recognized";
  } else if (loadingStatus !== "ready") {
    // Still loading - show specific loading status
    button.classList.remove("active", "disabled");
    const statusText = {
      "detecting": "Detecting content...",
      "loading": "Loading skips..."
    };
    typesLine.textContent = statusText[loadingStatus] || "Loading...";
  } else if (isContentClean) {
    // Content marked as clean by admin
    button.classList.remove("active");
    button.classList.add("disabled");
    typesLine.textContent = "No skips (clean)";
  } else {
    // No skips available - disabled state
    button.classList.remove("active");
    button.classList.add("disabled");
    typesLine.textContent = "No skips yet";
  }
}

/**
 * Update both FAB and Mark button visual states based on auth
 * Called when auth state changes
 */
function updateButtonsAuthState(authenticated) {
  isAuthenticated = authenticated;

  // Update Mark Scene button
  const markButton = document.getElementById(BUTTON_ID);
  if (markButton) {
    if (authenticated) {
      markButton.classList.remove("locked");
      markButton.setAttribute("aria-label", "Mark scene");
      const lockIcon = markButton.querySelector(".skipit-locked-icon");
      if (lockIcon) lockIcon.style.display = "none";
      const label = markButton.querySelector(".skipit-mark-label");
      if (label && !markingState.isMarking) label.textContent = "Mark scene";
    } else {
      markButton.classList.add("locked");
      markButton.setAttribute("aria-label", "Sign in to contribute");
      const lockIcon = markButton.querySelector(".skipit-locked-icon");
      if (lockIcon) lockIcon.style.display = "flex";
      const label = markButton.querySelector(".skipit-mark-label");
      if (label && !markingState.isMarking) label.textContent = "Sign in";
    }
  }

  // Update FAB button
  const fabButton = document.getElementById(FAB_BUTTON_ID);
  if (fabButton) {
    if (authenticated) {
      fabButton.classList.remove("locked");
      fabButton.setAttribute("aria-label", "Skip content with Skipit");
      const lockIcon = fabButton.querySelector(".skipit-locked-icon");
      if (lockIcon) lockIcon.style.display = "none";

      // Re-fetch skip types since initial fetch may have failed due to no auth
      const metadata = extractNetflixMetadata();
      if (metadata) {
        // Reset to loading state and trigger fresh fetch
        availableSkipTypes = [];
        isContentClean = false;
        loadingStatus = "detecting";
        updateSkipitFAB(metadata, fabSkippingActive);

        // Notify content script to re-fetch skip types
        window.postMessage(
          {
            type: "SKIPIT_METADATA_READY",
            data: { metadata },
          },
          "*"
        );
      } else {
        updateSkipitFAB(null, fabSkippingActive);
      }
    } else {
      fabButton.classList.add("locked");
      fabButton.setAttribute("aria-label", "Sign in to skip content");
      const lockIcon = fabButton.querySelector(".skipit-locked-icon");
      if (lockIcon) lockIcon.style.display = "flex";
      // Update FAB for locked state
      const typesLine = fabButton.querySelector(".skipit-fab-types");
      if (typesLine) typesLine.textContent = "Sign in to skip";
    }
  }
}
