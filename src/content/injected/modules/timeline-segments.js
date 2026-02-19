// ============================================================================
// TIMELINE SEGMENTS
// ============================================================================

/**
 * Get the timeline bar element and its duration
 * Returns: { timelineBar, duration } or null if not found
 */
function getTimelineInfo() {
  const timeline = document.querySelector('[data-uia="timeline"]');
  if (!timeline) return null;

  const timelineBar = document.querySelector('[data-uia="timeline-bar"]');
  if (!timelineBar) return null;

  const duration = parseInt(timeline.getAttribute("max"), 10);
  if (!duration || isNaN(duration)) return null;

  return { timeline, timelineBar, duration };
}

/**
 * Render timeline segments for active timestamps
 * @param {Array} timestamps - Array of [start_ms, end_ms, type?] or {start, end, type?}
 */
function renderTimelineSegments(timestamps) {
  // GUARD: Don't render if skipping is not active
  // This prevents stale segments from setTimeout retries after stopSkipChecking()
  if (!fabSkippingActive || skippingForVideoIdFromUrl === null) {
    return;
  }

  if (!timestamps || timestamps.length === 0) {
    removeTimelineSegments();
    return;
  }

  const info = getTimelineInfo();
  if (!info) {
    // Retry after a short delay (Netflix may still be loading)
    setTimeout(() => renderTimelineSegments(timestamps), 500);
    return;
  }

  const { timelineBar, duration } = info;
  const barWidth = timelineBar.offsetWidth;

  if (barWidth === 0) {
    // Bar not visible yet, retry
    setTimeout(() => renderTimelineSegments(timestamps), 500);
    return;
  }

  // Remove existing segments container
  removeTimelineSegments();

  // Create segments container
  const container = document.createElement("div");
  container.id = SEGMENTS_CONTAINER_ID;
  container.className = "skipit-timeline-segments";

  // Create segments for each timestamp
  timestamps.forEach((timestamp, index) => {
    // Handle both array format [start, end, type?] and object format
    let startMs, endMs, skipType;

    if (Array.isArray(timestamp)) {
      startMs = timestamp[0];
      endMs = timestamp[1];
      skipType = timestamp[2] || "default";
    } else {
      startMs = timestamp.start || timestamp.start_time * 1000;
      endMs = timestamp.end || timestamp.end_time * 1000;
      skipType = timestamp.type || timestamp.skipType || "default";
    }

    // Calculate position and width as percentages
    const leftPercent = (startMs / duration) * 100;
    const widthPercent = ((endMs - startMs) / duration) * 100;

    // Create human-readable label for tooltip
    const typeLabels = {
      nudity: "Nudity",
      sex: "Sex",
      gore: "Gore",
      default: "Skip",
    };
    const label = typeLabels[skipType] || "Skip";

    // Create segment element
    const segment = document.createElement("div");
    segment.className = `skipit-segment skipit-segment--${skipType || "default"}`;
    segment.style.left = `${leftPercent}%`;
    segment.style.width = `${widthPercent}%`;
    segment.dataset.index = index;
    segment.dataset.start = startMs;
    segment.dataset.end = endMs;
    segment.dataset.type = skipType || "default";
    segment.dataset.label = label;

    container.appendChild(segment);
  });

  // Insert container into the timeline-bar element
  // The container is positioned with bottom: 100% so it appears above the bar
  timelineBar.style.position = "relative";
  timelineBar.appendChild(container);

  // Set up resize observer to update segments when bar size changes
  setupSegmentsResizeObserver(timelineBar);

  // Set up observer for timeline recreation
  setupTimelineObserver(timestamps);
}

/**
 * Remove timeline segments from the DOM
 */
function removeTimelineSegments() {
  const container = document.getElementById(SEGMENTS_CONTAINER_ID);
  if (container) {
    container.remove();
  }

  // Clean up observers
  if (segmentsResizeObserver) {
    segmentsResizeObserver.disconnect();
    segmentsResizeObserver = null;
  }

  if (segmentsTimelineObserver) {
    segmentsTimelineObserver.disconnect();
    segmentsTimelineObserver = null;
  }
}

/**
 * Set up ResizeObserver to update segment positions when timeline resizes
 */
function setupSegmentsResizeObserver(timelineBar) {
  if (segmentsResizeObserver) {
    segmentsResizeObserver.disconnect();
  }

  segmentsResizeObserver = new ResizeObserver(() => {
    // Segments use percentage positioning, so they auto-resize
  });

  segmentsResizeObserver.observe(timelineBar);
}

/**
 * Render pending timeline segments for verification
 * @param {Array} pendingSkipsData - Array of { id, startTime, endTime, type }
 */
function renderPendingTimelineSegments(pendingSkipsData) {
  if (!pendingSkipsData || pendingSkipsData.length === 0) {
    removePendingTimelineSegments();
    return;
  }

  const info = getTimelineInfo();
  if (!info) {
    setTimeout(() => renderPendingTimelineSegments(pendingSkipsData), 500);
    return;
  }

  const { timelineBar, duration } = info;
  const barWidth = timelineBar.offsetWidth;

  if (barWidth === 0) {
    setTimeout(() => renderPendingTimelineSegments(pendingSkipsData), 500);
    return;
  }

  // Remove existing pending segments
  removePendingTimelineSegments();

  const container = document.createElement("div");
  container.id = PENDING_SEGMENTS_CONTAINER_ID;
  container.className = "skipit-timeline-segments skipit-timeline-segments--pending-container";

  pendingSkipsData.forEach((skip, index) => {
    const startMs = skip.startTime;
    const endMs = skip.endTime;
    const skipType = skip.type || "pending";

    const leftPercent = (startMs / duration) * 100;
    const widthPercent = ((endMs - startMs) / duration) * 100;

    const typeLabels = {
      Nudity: "Nudity (unverified)",
      nudity: "Nudity (unverified)",
      Sex: "Sex (unverified)",
      sex: "Sex (unverified)",
      Gore: "Gore (unverified)",
      gore: "Gore (unverified)",
    };
    const label = typeLabels[skipType] || "Unverified skip";

    const segment = document.createElement("div");
    segment.className = "skipit-segment skipit-segment--pending";
    segment.style.left = `${leftPercent}%`;
    segment.style.width = `${widthPercent}%`;
    segment.dataset.index = index;
    segment.dataset.start = startMs;
    segment.dataset.end = endMs;
    segment.dataset.type = skipType;
    segment.dataset.label = label;
    segment.dataset.skipId = skip.id;

    // Click handler: seek to 3s before segment start
    segment.addEventListener("click", (e) => {
      e.stopPropagation();
      const seekTo = Math.max(0, startMs - VOTE_PROMPT_LEAD_TIME);
      seek(seekTo);
    });

    container.appendChild(segment);
  });

  timelineBar.style.position = "relative";
  timelineBar.appendChild(container);

  // Set up observer for timeline recreation (same pattern as active segments)
  setupPendingTimelineObserver(pendingSkipsData);
}

/**
 * Remove pending timeline segments
 */
function removePendingTimelineSegments() {
  const container = document.getElementById(PENDING_SEGMENTS_CONTAINER_ID);
  if (container) {
    container.remove();
  }
  pendingSegmentsRendered = false;

  if (pendingSegmentsTimelineObserver) {
    pendingSegmentsTimelineObserver.disconnect();
    pendingSegmentsTimelineObserver = null;
  }
}

/**
 * Set up MutationObserver to re-render pending segments if timeline is recreated
 */
function setupPendingTimelineObserver(pendingSkipsData) {
  if (pendingSegmentsTimelineObserver) {
    pendingSegmentsTimelineObserver.disconnect();
  }

  pendingSegmentsTimelineObserver = new MutationObserver(() => {
    if (!document.getElementById(PENDING_SEGMENTS_CONTAINER_ID)) {
      // Only re-render if we still have pending skips
      if (pendingSkips.length > 0) {
        renderPendingTimelineSegments(pendingSkips);
      }
    }
  });

  pendingSegmentsTimelineObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Set up MutationObserver to re-render segments if timeline is recreated
 */
function setupTimelineObserver(timestamps) {
  if (segmentsTimelineObserver) {
    segmentsTimelineObserver.disconnect();
  }

  segmentsTimelineObserver = new MutationObserver(() => {
    // Check if our segments container was removed
    if (!document.getElementById(SEGMENTS_CONTAINER_ID)) {
      // Only re-render if we're still on the same video (by URL video ID)
      const currentVideoId = getVideoIdFromUrl();

      if (skippingForVideoIdFromUrl === null) {
        // No active skipping, nothing to do
        return;
      }

      if (currentVideoId !== skippingForVideoIdFromUrl) {
        // Video changed - user navigated away. Stop skipping immediately.
        stopSkipChecking();
        return;
      }

      // Same video, safe to re-render using original unmerged timestamps for per-type colors
      if (originalTimestamps.length > 0) {
        renderTimelineSegments(originalTimestamps);
      }
    }
  });

  // Observe the body for major DOM changes
  segmentsTimelineObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
