/**
 * Voting handlers for skip verification
 * Manages fetching pending skips, voting, and saving preferences
 */

import { fetchPendingSkips, voteOnSkip } from "../../lib/api";
import { getAuthToken } from "./auth";

/**
 * Fetch pending skip groups for a piece of content
 */
export async function handleFetchPendingSkips(message: {
  contentType: "movie" | "episode";
  tmdbId: number;
  seasonNumber?: number;
  episodeNumber?: number;
}): Promise<{ success: boolean; pendingSkips?: any[]; error?: string }> {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const result = await fetchPendingSkips(
      message.contentType,
      message.tmdbId,
      token,
      {
        seasonNumber: message.seasonNumber,
        episodeNumber: message.episodeNumber,
      }
    );
    return { success: true, pendingSkips: result.pendingSkips };
  } catch (error) {
    console.error("[Background] Error fetching pending skips:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch pending skips",
    };
  }
}

/**
 * Vote on a skip group
 */
export async function handleVoteOnSkip(message: {
  skipGroupId: number;
  voteType: 1 | -1;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const result = await voteOnSkip(message.skipGroupId, message.voteType, token);
    return { success: true, data: result };
  } catch (error) {
    console.error("[Background] Error voting on skip:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to vote",
    };
  }
}

