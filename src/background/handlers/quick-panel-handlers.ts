/**
 * Quick Panel handlers
 * Manages authentication, preferences, content matching, and quick skip activation
 */

import type {
  TimestampCounts,
  MatchContentResponse,
  CheckAuthResponse,
  QuickSkipActivateResponse,
  SearchResult,
} from "../../lib/types";
import {
  searchContent,
  getTimestamps,
  getUserPreferences,
  checkIsOnNetflix,
} from "../../lib/api";
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

function extractYear(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const year = parseInt(dateStr.substring(0, 4));
  return isNaN(year) ? null : year;
}

function pickBestByYear(candidates: SearchResult[], year?: number): SearchResult {
  if (!year || candidates.length <= 1) return candidates[0];

  return candidates.reduce((best, c) => {
    const bestYear = extractYear(best.release_date);
    const cYear = extractYear(c.release_date);
    if (!cYear) return best;
    if (!bestYear) return c;
    return Math.abs(cYear - year) < Math.abs(bestYear - year) ? c : best;
  });
}

/**
 * Match Netflix content title to TMDB and optionally get timestamp counts.
 * When multiple TMDB results match, checks Netflix availability to pick the correct one.
 */
export async function handleMatchContent(message: {
  title: string;
  contentType: "movie" | "episode";
  seasonNumber?: number;
  episodeNumber?: number;
  year?: number;
  includeCounts?: boolean;
}): Promise<MatchContentResponse> {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Search TMDB for the title using type-specific endpoint
    const tmdbType = message.contentType === "episode" ? "tv" : "movie";
    let searchResponse = await searchContent(message.title, token, tmdbType, message.year || undefined);

    // If no results, retry with cleaned title + year filter
    // Netflix often adds region tags like "(U.S.)", "(UK)" that TMDB doesn't recognize
    if ((!searchResponse.results || searchResponse.results.length === 0) && /\s*\(.*\)\s*$/.test(message.title)) {
      const cleanTitle = message.title.replace(/\s*\(.*\)\s*$/, "").trim();
      searchResponse = await searchContent(cleanTitle, token, tmdbType, message.year || undefined);
    }

    // Retry without year filter if year was used but returned no results
    if ((!searchResponse.results || searchResponse.results.length === 0) && message.year) {
      searchResponse = await searchContent(message.title, token, tmdbType);
    }

    if (!searchResponse.results || searchResponse.results.length === 0) {
      return { success: false, error: "Content not found in database" };
    }

    // Results already filtered to correct type from type-specific endpoint
    const candidates = searchResponse.results;

    // Check Netflix availability for typed candidates (up to 6)
    const top = candidates.slice(0, 6);
    const netflixChecks = await Promise.all(
      top.map((c) => checkIsOnNetflix(c.media_type, c.id, token))
    );
    const netflixCandidates = top.filter((_, i) => netflixChecks[i]);

    let match: SearchResult;

    if (netflixCandidates.length >= 1) {
      // Prefer Netflix-available results; use year to pick best one
      match = pickBestByYear(netflixCandidates, message.year);
    } else if (message.year) {
      // No Netflix match -> use year proximity as fallback
      match = pickBestByYear(candidates, message.year);
    } else {
      // Last resort: no Netflix info, no year
      match = candidates[0];
    }

    // Only fetch timestamp counts if requested (defaults to true for backwards compatibility)
    const shouldIncludeCounts = message.includeCounts !== false;
    let counts: TimestampCounts | undefined;

    if (shouldIncludeCounts) {
      counts = await getTimestampCounts(
        match.media_type === "tv" ? "episode" : "movie",
        match.id,
        token,
        message.seasonNumber,
        message.episodeNumber
      );
    }

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
    const { timestamps } = await getTimestamps(contentType, contentId, token, {
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
    const { timestamps } = await getTimestamps(
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

    // Reuse existing ACTIVATE_SKIP logic (pass preferences for refresh support)
    const result = await handleActivateSkip({
      type: "ACTIVATE_SKIP",
      contentType: message.contentType,
      contentId: message.tmdbId,
      contentTitle: message.contentTitle,
      timestamps,
      seasonNumber: message.seasonNumber,
      episodeNumber: message.episodeNumber,
      preferences: message.preferences,
    });

    return result as QuickSkipActivateResponse;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[Background] Quick skip error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
