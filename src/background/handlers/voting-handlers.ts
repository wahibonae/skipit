/**
 * Voting and skip availability handlers
 * Manages skip group voting and checking available skip types
 */

import { getTimestamps, voteOnSkip } from "../../lib/api";
import { getAuthToken } from "./auth";

/**
 * Check what skip types are available for a video
 * Returns unique skip types (e.g., ['nudity', 'sex', 'gore']) without starting skipping
 */
export async function handleCheckAvailableSkips(message: {
  contentType: "movie" | "episode";
  tmdbId: number;
  seasonNumber?: number;
  episodeNumber?: number;
}): Promise<{ success: boolean; skipTypes: string[] }> {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, skipTypes: [] };
  }

  try {
    // Fetch ALL timestamps (all types enabled) to see what's available
    const timestamps = await getTimestamps(
      message.contentType,
      message.tmdbId,
      token,
      {
        skipNudity: true,
        skipSex: true,
        skipGore: true,
        seasonNumber: message.seasonNumber,
        episodeNumber: message.episodeNumber,
      }
    );

    // Extract unique skip types from all timestamps
    const skipTypes = [...new Set(timestamps.map((t) => t.type.toLowerCase()))];

    return { success: true, skipTypes };
  } catch (error) {
    console.error("[Background] Error checking available skips:", error);
    return { success: false, skipTypes: [] };
  }
}

/**
 * Vote on a skip group
 */
export async function handleVoteSkip(message: {
  skipGroupId: number;
  voteType: 1 | -1;
}): Promise<{
  success: boolean;
  newConfidence?: number;
  newStatus?: string;
  error?: string;
}> {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const result = await voteOnSkip(
      message.skipGroupId,
      message.voteType,
      token
    );

    return {
      success: true,
      newConfidence: result.newConfidence,
      newStatus: result.newStatus,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[Background] Vote error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
