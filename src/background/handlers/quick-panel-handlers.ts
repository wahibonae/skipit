/**
 * Quick Panel handlers
 * Manages authentication, preferences, content matching, and quick skip activation
 */

import type {
  TimestampCounts,
  MatchContentResponse,
  CheckAuthResponse,
  QuickSkipActivateResponse,
} from "../../lib/types";
import { searchContent, getTimestamps, getUserPreferences } from "../../lib/api";
import { getAuthToken } from "./auth";
import { handleActivateSkip } from "./skip-handlers";

/**
 * Check if user is authenticated
 */
export async function handleCheckAuthStatus(): Promise<CheckAuthResponse> {
  const token = await getAuthToken();
  return {
    isAuthenticated: !!token,
    userId: token ? "authenticated" : undefined,
  };
}

/**
 * Get user's skip preferences
 */
export async function handleGetUserPreferences(): Promise<{
  success: boolean;
  preferences?: {
    skip_nudity: boolean;
    skip_sex: boolean;
    skip_gore: boolean;
  };
  error?: string;
}> {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const preferences = await getUserPreferences(token);
    return { success: true, preferences };
  } catch (error) {
    console.error("[Background] Error fetching preferences:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get preferences",
    };
  }
}

/**
 * Match Netflix content title to TMDB and get timestamp counts
 */
export async function handleMatchContent(message: {
  title: string;
  contentType: "movie" | "episode";
  seasonNumber?: number;
  episodeNumber?: number;
}): Promise<MatchContentResponse> {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Search TMDB for the title
    const searchResponse = await searchContent(message.title, token);

    if (!searchResponse.results || searchResponse.results.length === 0) {
      return { success: false, error: "Content not found in database" };
    }

    // Find best match (prioritize exact type match)
    const expectedType = message.contentType === "episode" ? "tv" : "movie";
    const match =
      searchResponse.results.find((r) => r.media_type === expectedType) ||
      searchResponse.results[0];

    // Get timestamp counts for this content
    const counts = await getTimestampCounts(
      match.media_type === "tv" ? "episode" : "movie",
      match.id,
      token,
      message.seasonNumber,
      message.episodeNumber
    );

    return {
      success: true,
      tmdbId: match.id,
      contentTitle: match.title,
      mediaType: match.media_type,
      counts,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[Background] Match content error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Get timestamp counts by type for a piece of content
 */
async function getTimestampCounts(
  contentType: "movie" | "episode",
  contentId: number,
  token: string,
  seasonNumber?: number,
  episodeNumber?: number
): Promise<TimestampCounts> {
  try {
    // Fetch all timestamps (with all skip types enabled to get everything)
    const timestamps = await getTimestamps(contentType, contentId, token, {
      skipNudity: true,
      skipSex: true,
      skipGore: true,
      seasonNumber,
      episodeNumber,
    });

    // Count by type
    const counts: TimestampCounts = {
      nudity: 0,
      sex: 0,
      gore: 0,
      total: 0,
    };

    for (const ts of timestamps) {
      counts.total++;
      switch (ts.type) {
        case "Nudity":
          counts.nudity++;
          break;
        case "Sex":
          counts.sex++;
          break;
        case "Gore":
          counts.gore++;
          break;
      }
    }

    return counts;
  } catch (error) {
    console.warn("[Background] Error getting timestamp counts:", error);
    return { nudity: 0, sex: 0, gore: 0, total: 0 };
  }
}

/**
 * Quick skip activation from in-page panel
 */
export async function handleQuickSkipActivate(message: {
  contentType: "movie" | "episode";
  tmdbId: number;
  contentTitle: string;
  preferences: {
    skipNudity: boolean;
    skipSex: boolean;
    skipGore: boolean;
  };
  seasonNumber?: number;
  episodeNumber?: number;
}): Promise<QuickSkipActivateResponse> {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Fetch timestamps with user's preferences
    const timestamps = await getTimestamps(
      message.contentType,
      message.tmdbId,
      token,
      {
        skipNudity: message.preferences.skipNudity,
        skipSex: message.preferences.skipSex,
        skipGore: message.preferences.skipGore,
        seasonNumber: message.seasonNumber,
        episodeNumber: message.episodeNumber,
      }
    );

    if (timestamps.length === 0) {
      return {
        success: false,
        error: "No timestamps found for selected types",
      };
    }

    // Reuse existing ACTIVATE_SKIP logic
    const result = await handleActivateSkip({
      type: "ACTIVATE_SKIP",
      contentType: message.contentType,
      contentId: message.tmdbId,
      contentTitle: message.contentTitle,
      timestamps,
      seasonNumber: message.seasonNumber,
      episodeNumber: message.episodeNumber,
    });

    return result as QuickSkipActivateResponse;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[Background] Quick skip error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
