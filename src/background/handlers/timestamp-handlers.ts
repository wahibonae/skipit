/**
 * Timestamp marking and content search handlers
 * Handles saving timestamps and searching for content
 */

import { searchContent, saveTimestamp, getTVShowEpisodes } from "../../lib/api";
import { getAuthToken } from "./auth";

/**
 * Save a timestamp marked by the user
 */
export async function handleSaveTimestamp(message: {
  startTime: number;
  endTime: number;
  timestampType: "Nudity" | "Sex" | "Gore";
  contentType: "movie" | "episode";
  contentId: number;
  contentTitle: string;
  seasonNumber?: number;
  episodeNumber?: number;
}) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Please sign in via the Skipit popup first.");
  }

  const data = {
    start: message.startTime,
    finish: message.endTime,
    type: message.timestampType,
    season_number: message.seasonNumber,
    episode_number: message.episodeNumber,
  };

  await saveTimestamp(message.contentType, message.contentId, data, token);

  return { success: true };
}

/**
 * Search for content (movies/TV shows)
 */
export async function handleSearchContent(query: string) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Please sign in via the Skipit popup first.");
  }

  try {
    const response = await searchContent(query, token);
    return { success: true, results: response.results };
  } catch (error) {
    console.error("[Background] Search API error:", error);
    throw error;
  }
}

/**
 * Get episodes for a TV show (from TMDB - for Mark Scene modal)
 */
export async function handleGetEpisodes(tvShowId: number) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Please sign in via the Skipit popup first.");
  }

  // Use 'tmdb' source to get ALL episodes (for contributing new timestamps)
  const response = await getTVShowEpisodes(tvShowId, token, "tmdb");

  return { success: true, seasons: response.seasons };
}
