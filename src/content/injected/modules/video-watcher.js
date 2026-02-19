// ============================================================================
// VIDEO CHANGE WATCHER
// ============================================================================

/**
 * Watch for video changes and update FAB accordingly
 */
function startVideoChangeWatcher() {
  // Prevent duplicate watchers (memory leak prevention)
  if (videoChangeWatcherInitialized) {
    return;
  }
  videoChangeWatcherInitialized = true;

  setInterval(() => {
    const metadata = extractNetflixMetadata();
    if (!metadata) return;

    const currentNetflixId = metadata.netflixId;

    // Detect video change
    if (lastNetflixId !== null && currentNetflixId !== lastNetflixId) {
      // Video changed - stop any active skipping
      if (skippingForVideoIdFromUrl !== null) {
        stopSkipChecking();
      }

      // Clear pending skips for old video
      pendingSkips = [];
      removePendingTimelineSegments();
      stopPendingSkipChecker();
      dismissedPendingSkipIds = new Set();

      // Reset marking state for new video (prevents stale timestamps)
      if (markingState.isMarking) {
        resetMarkingState();
      }

      // Update tracking for new video
      lastNetflixId = currentNetflixId;
      lastMetadata = metadata;

      // Reset skip types state for new video
      availableSkipTypes = [];
      isContentClean = false;
      loadingStatus = "detecting";

      // Notify content script that metadata is ready for new video
      window.postMessage(
        {
          type: "SKIPIT_METADATA_READY",
          data: { metadata },
        },
        "*"
      );

      // Update FAB for new video
      updateSkipitFAB(metadata, false);
    } else if (lastNetflixId === null) {
      // First time seeing this video
      lastNetflixId = currentNetflixId;
      lastMetadata = metadata;

      isContentClean = false;
      loadingStatus = "detecting";

      window.postMessage(
        {
          type: "SKIPIT_METADATA_READY",
          data: { metadata },
        },
        "*"
      );

      updateSkipitFAB(metadata, fabSkippingActive);
    } else if (JSON.stringify(metadata) !== JSON.stringify(lastMetadata)) {
      // Same video but metadata changed (e.g., title loaded)
      lastMetadata = metadata;
      updateSkipitFAB(metadata, fabSkippingActive);
    }
  }, 2000);
}
