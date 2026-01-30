/**
 * Skip controller
 * Manages starting and stopping skip sessions
 */

import type { Timestamp } from "../../lib/types";
import { state } from "../utils/state";
import {
  extractNetflixVideoId,
  injectNetflixScript,
  waitForNetflixReady,
} from "../utils/netflix-detector";

/**
 * Start skipping with timestamps
 */
export async function startSkipping(
  timestamps: Timestamp[],
  contentTitle: string,
  netflixVideoId: string
) {
  try {
    // Verify we're on the correct video
    const currentVideoId = extractNetflixVideoId(window.location.href);
    if (currentVideoId !== netflixVideoId) {
      console.warn(
        "[Content] Video ID mismatch:",
        currentVideoId,
        "!=",
        netflixVideoId
      );
      throw new Error("Video ID mismatch - wrong video");
    }

    // Set state
    state.isSkipping = true;
    state.currentNetflixVideoId = netflixVideoId;
    state.currentContentTitle = contentTitle;

    // Inject Netflix script if not already done
    if (!state.netflixScriptInjected) {
      await injectNetflixScript();
    }

    // Wait for Netflix player to be ready
    await waitForNetflixReady();

    // Format timestamps for injected script (API now returns milliseconds directly)
    // Format: [start_ms, end_ms, type, skipGroupId, confidence, userContributed, userVoted]
    // type is lowercase for CSS class matching
    const timestampsMs = timestamps.map((t) => [
      t.start_time, // [0] start in milliseconds
      t.end_time, // [1] end in milliseconds
      t.type.toLowerCase(), // [2] 'nudity', 'sex', or 'gore'
      t.id || null, // [3] skip group ID for voting
      t.confidence ?? 0.5, // [4] confidence score
      t.userContributed ?? false, // [5] user submitted timestamp in this group
      t.userVoted ?? false, // [6] user already voted on this group
    ]);

    // Send timestamps to injected script
    window.postMessage(
      {
        type: "SKIPIT_START_SKIP_CHECKING",
        data: {
          timestamps: timestampsMs,
        },
      },
      "*"
    );

    // Update FAB button state to show skipping is active
    window.postMessage(
      {
        type: "SKIPIT_UPDATE_FAB_STATE",
        data: { isSkipping: true },
      },
      "*"
    );

  } catch (error) {
    console.error("[Content] Error starting skipping:", error);
    state.isSkipping = false;
    state.currentNetflixVideoId = null;
    state.currentContentTitle = null;
    throw error;
  }
}

/**
 * Stop skipping
 */
export function stopSkipping() {
  state.isSkipping = false;
  state.currentContentTitle = null;
  // Keep currentNetflixVideoId - might be useful for state tracking

  // Send stop message to injected script
  if (state.netflixScriptInjected) {
    window.postMessage(
      {
        type: "SKIPIT_STOP_SKIP_CHECKING",
      },
      "*"
    );

    // Update FAB button state to show skipping is NOT active
    window.postMessage(
      {
        type: "SKIPIT_UPDATE_FAB_STATE",
        data: { isSkipping: false },
      },
      "*"
    );
  }
}
