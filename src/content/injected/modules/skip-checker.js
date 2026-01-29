// ============================================================================
// SKIP CHECKING
// ============================================================================

/**
 * Start checking for timestamps to skip
 * This is the ONLY function that should activate skipping state
 */
function startSkipChecking(timestamps) {
  console.log(
    "[Netflix Injected] Starting skip checking with timestamps:",
    timestamps
  );

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

  // Set all state atomically
  activeTimestamps = timestamps;
  skippingForVideoIdFromUrl = videoIdFromUrl; // URL-based video ID is the source of truth
  fabSkippingActive = true;
  if (metadata?.netflixId) {
    lastNetflixId = metadata.netflixId;
  }

  // Clear existing interval if any
  if (skipCheckInterval) {
    clearInterval(skipCheckInterval);
  }

  // Update FAB to show skipping is active with skip types
  updateSkipitFAB(metadata, true, types);

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
        const skipGroupId = timestamp[3] || null; // Skip group ID for voting
        const confidence = timestamp[4] ?? 0.5; // Confidence score
        const userContributed = timestamp[5] ?? false; // User submitted timestamp in this group
        const userVoted = timestamp[6] ?? false; // User already voted on this group

        if (currentTime >= start && currentTime < end) {
          // Auto-skip the content
          console.log(
            `[Netflix Injected] Skipping from ${start}ms to ${end}ms (current: ${currentTime}ms)`
          );
          seek(end);
          lastSkipTime = now;

          // Show notification with voting if skipGroupId is available and user hasn't contributed/voted
          showSkipNotification(skipType, start, end, skipGroupId, confidence, userContributed, userVoted);

          break; // Only skip one timestamp at a time
        }
      }
    } catch (error) {
      console.error("[Netflix Injected] Error in skip check:", error);
    }
  }, 50); // Check every 50ms

  console.log("[Netflix Injected] Skip checking started");
}

/**
 * Stop checking for timestamps
 * This is the ONLY function that should deactivate skipping state
 */
function stopSkipChecking() {
  console.log("[Netflix Injected] Stopping skip checking");

  // Clear interval
  if (skipCheckInterval) {
    clearInterval(skipCheckInterval);
    skipCheckInterval = null;
  }

  // Clear skipping state (but preserve availableSkipTypes - they're still in DB)
  activeTimestamps = [];
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
