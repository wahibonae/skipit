// ============================================================================
// SKIP CHECKING
// ============================================================================

/**
 * Merge overlapping/adjacent timestamps into continuous ranges.
 * Prevents frame cuts when consecutive scenes of different types
 * (e.g., nudity then sex) are both being skipped.
 */
function mergeOverlappingTimestamps(timestamps) {
  if (timestamps.length <= 1) return timestamps;

  const sorted = [...timestamps].sort((a, b) => a[0] - b[0]);
  const merged = [[sorted[0][0], sorted[0][1], sorted[0][2]]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
      // Combine types (deduplicated)
      const types = new Set(last[2].split(",").concat(current[2].split(",")));
      last[2] = [...types].join(",");
    } else {
      merged.push([current[0], current[1], current[2]]);
    }
  }

  return merged;
}

/**
 * Start checking for timestamps to skip
 * This is the ONLY function that should activate skipping state
 */
function startSkipChecking(timestamps) {
  // Get current video ID from URL and metadata
  const videoIdFromUrl = getVideoIdFromUrl();
  const metadata = extractNetflixMetadata();

  if (!videoIdFromUrl) {
    console.warn(
      "[Netflix Injected] Cannot start skipping - not on a /watch/ page"
    );
    return;
  }

  // Extract unique skip types from timestamps being skipped
  const types = [...new Set(timestamps.map((t) => t[2] || "default"))];
  activeSkippingTypes = types; // Track what's actually being skipped

  // Store originals for timeline rendering, merge overlapping for skip logic
  originalTimestamps = timestamps;
  activeTimestamps = mergeOverlappingTimestamps(timestamps);
  skippingForVideoIdFromUrl = videoIdFromUrl; // URL-based video ID is the source of truth
  fabSkippingActive = true;
  if (metadata?.netflixId) {
    lastNetflixId = metadata.netflixId;
  }

  // Clear existing interval if any
  if (skipCheckInterval) {
    clearInterval(skipCheckInterval);
  }

  // Update FAB to show skipping is active (uses activeSkippingTypes internally)
  updateSkipitFAB(metadata, true);

  // Render timeline segments to visualize skip zones
  renderTimelineSegments(timestamps);

  // Check every 50ms for timestamps to skip
  skipCheckInterval = setInterval(() => {
    if (!isNetflixPlayerReady()) return;

    try {
      const currentTime = getCurrentTime();

      // Send current time to content script for monitoring
      window.postMessage(
        {
          type: "SKIPIT_CURRENT_TIME",
          currentTime: currentTime,
        },
        "*"
      );

      // Check if we should skip
      const now = Date.now();
      if (now - lastSkipTime < SKIP_COOLDOWN) {
        // Recently skipped, wait for cooldown
        return;
      }

      for (let i = 0; i < activeTimestamps.length; i++) {
        const timestamp = activeTimestamps[i];
        const start = timestamp[0];
        const end = timestamp[1];
        const skipType = timestamp[2] || "default"; // Single type string

        if (currentTime >= start && currentTime < end) {
          // Auto-skip the content
          seek(end);
          lastSkipTime = now;

          // Show notification
          showSkipNotification(skipType, start, end);

          break; // Only skip one timestamp at a time
        }
      }
    } catch (error) {
      console.error("[Netflix Injected] Error in skip check:", error);
    }
  }, 50); // Check every 50ms
}

// ============================================================================
// PENDING SKIP CHECKER (for verification voting)
// ============================================================================

/**
 * Start checking for pending skips to show vote prompts
 * Runs on a separate 100ms interval
 */
function startPendingSkipChecker() {
  if (pendingSkipCheckInterval) {
    clearInterval(pendingSkipCheckInterval);
  }

  pendingSkipCheckInterval = setInterval(() => {
    if (!isNetflixPlayerReady()) return;
    if (pendingSkips.length === 0) return;

    try {
      const currentTime = getCurrentTime();
      let shouldShowPrompt = false;

      for (let i = 0; i < pendingSkips.length; i++) {
        const skip = pendingSkips[i];

        // Skip if already dismissed this session
        if (dismissedPendingSkipIds.has(skip.id)) continue;

        const promptStart = skip.startTime - VOTE_PROMPT_LEAD_TIME;

        // Auto-dismiss if past endTime (don't permanently dismiss — user may seek back)
        if (activeVotePromptSkipId === skip.id && currentTime >= skip.endTime) {
          hideVotePrompt();
          shouldShowPrompt = false;
          break;
        }

        // If we have an active prompt for a different skip, ignore others
        if (activeVotePromptSkipId !== null && activeVotePromptSkipId !== skip.id) continue;

        // Show prompt when within [startTime - 3s, endTime)
        if (currentTime >= promptStart && currentTime < skip.endTime) {
          showVotePrompt(skip);
          shouldShowPrompt = true;
          break;
        }
      }

      // If no skip matched but a prompt is showing, user seeked out of range — dismiss it
      if (!shouldShowPrompt && activeVotePromptSkipId !== null) {
        hideVotePrompt();
      }
    } catch (error) {
      console.error("[Netflix Injected] Error in pending skip check:", error);
    }
  }, 100);
}

/**
 * Stop the pending skip checker
 */
function stopPendingSkipChecker() {
  if (pendingSkipCheckInterval) {
    clearInterval(pendingSkipCheckInterval);
    pendingSkipCheckInterval = null;
  }
  hideVotePrompt();
}

/**
 * Stop checking for timestamps
 * This is the ONLY function that should deactivate skipping state
 */
function stopSkipChecking() {
  // Clear interval
  if (skipCheckInterval) {
    clearInterval(skipCheckInterval);
    skipCheckInterval = null;
  }

  // Clear skipping state (but preserve availableSkipTypes - they're still in DB)
  activeTimestamps = [];
  originalTimestamps = [];
  skippingForVideoIdFromUrl = null;
  fabSkippingActive = false;
  activeSkippingTypes = []; // Clear what was being skipped
  // Note: Don't clear availableSkipTypes here - video change detection handles that

  // Remove timeline segments
  removeTimelineSegments();

  // Clean up notification
  cleanupNotification();

  // Update FAB to show skipping is NOT active (preserves available skip types)
  const metadata = extractNetflixMetadata();
  if (metadata) {
    updateSkipitFAB(metadata, false);
  }
}
