import { API_BASE_URL } from "./config";
import type {
  SearchResponse,
  SearchResult,
  Timestamp,
  UserPreferences,
  TVShowEpisodesResponse,
  PendingSkip,
  VoteResponse,
} from "./types";

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  if (!token) {
    throw new Error("Not authenticated. Please sign in.");
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Authentication expired. Please sign in again.");
    }
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Search for movies and TV shows via TMDB
 */
export async function searchContent(
  query: string,
  token: string
): Promise<SearchResponse> {
  if (!query.trim()) {
    return { results: [] };
  }

  // Use TMDB multiSearch via the proxy endpoint
  const tmdbResponse = await apiCall<{
    results: Array<{
      id: number;
      media_type: "movie" | "tv" | "person";
      title?: string;
      name?: string;
      poster_path: string | null;
      release_date?: string;
      first_air_date?: string;
      overview?: string;
    }>;
  }>("/tmdb", token, {
    method: "POST",
    body: JSON.stringify({
      endpoint: "/search/multi",
      params: { query },
    }),
  });

  // Filter and transform results (exclude people, only movies and TV shows)
  const results: SearchResult[] = tmdbResponse.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => ({
      id: item.id,
      media_type: item.media_type as "movie" | "tv",
      title: item.title || item.name || "Unknown",
      poster_path: item.poster_path,
      release_date: item.release_date || item.first_air_date || null,
      timestamp_count: 0, // TMDB doesn't have this, we can fetch separately if needed
    }));

  return { results };
}

/**
 * Get timestamps for a movie or TV episode
 */
export async function getTimestamps(
  contentType: "movie" | "episode",
  contentId: number,
  token: string,
  options?: {
    skipNudity?: boolean;
    skipSex?: boolean;
    skipGore?: boolean;
    seasonNumber?: number;
    episodeNumber?: number;
  }
): Promise<{ timestamps: Timestamp[]; isClean: boolean }> {
  const params = new URLSearchParams({
    source: "extension",
  });

  if (options?.skipNudity !== undefined) {
    params.append("skip_nudity", String(options.skipNudity));
  }
  if (options?.skipSex !== undefined) {
    params.append("skip_sex", String(options.skipSex));
  }
  if (options?.skipGore !== undefined) {
    params.append("skip_gore", String(options.skipGore));
  }
  if (options?.seasonNumber !== undefined) {
    params.append("seasonNumber", String(options.seasonNumber));
  }
  if (options?.episodeNumber !== undefined) {
    params.append("episodeNumber", String(options.episodeNumber));
  }

  return apiCall<{ timestamps: Timestamp[]; isClean: boolean }>(
    `/timestamps/${contentType}/${contentId}?${params.toString()}`,
    token
  );
}

/**
 * Get user's skip preferences
 */
export async function getUserPreferences(
  token: string
): Promise<UserPreferences> {
  return apiCall<UserPreferences>("/user/preferences", token);
}

/**
 * Get episodes for a TV show
 * @param source - 'tmdb' to get all episodes from TMDB, undefined for database episodes only
 */
export async function getTVShowEpisodes(
  tvShowId: number,
  token: string,
  source?: "tmdb"
): Promise<TVShowEpisodesResponse> {
  const params = source ? `?source=${source}` : "";
  return apiCall<TVShowEpisodesResponse>(`/tv/${tvShowId}/episodes${params}`, token);
}

/**
 * Check if a TMDB content ID is available on Netflix (any region)
 * Uses TMDB watch/providers endpoint, checks for provider_id 8 (Netflix)
 */
export async function checkIsOnNetflix(
  mediaType: "movie" | "tv",
  tmdbId: number,
  token: string
): Promise<boolean> {
  try {
    const data = await apiCall<{
      results: Record<
        string,
        { flatrate?: { provider_id: number }[] }
      >;
    }>("/tmdb", token, {
      method: "POST",
      body: JSON.stringify({
        endpoint: `/${mediaType}/${tmdbId}/watch/providers`,
        params: {},
      }),
    });

    const regions = data.results;
    if (!regions) return false;
    return Object.values(regions).some((region) =>
      region.flatrate?.some((p) => p.provider_id === 8)
    );
  } catch {
    return false;
  }
}

/**
 * Fetch pending skip groups for verification
 */
export async function fetchPendingSkips(
  contentType: "movie" | "episode",
  contentId: number,
  token: string,
  options?: {
    seasonNumber?: number;
    episodeNumber?: number;
  }
): Promise<{ pendingSkips: PendingSkip[] }> {
  const params = new URLSearchParams();
  if (options?.seasonNumber !== undefined) {
    params.append("seasonNumber", String(options.seasonNumber));
  }
  if (options?.episodeNumber !== undefined) {
    params.append("episodeNumber", String(options.episodeNumber));
  }

  const queryString = params.toString();
  const url = `/skips/pending/${contentType}/${contentId}${queryString ? `?${queryString}` : ""}`;
  return apiCall<{ pendingSkips: PendingSkip[] }>(url, token);
}

/**
 * Vote on a skip group
 */
export async function voteOnSkip(
  skipGroupId: number,
  voteType: 1 | -1,
  token: string
): Promise<VoteResponse> {
  return apiCall<VoteResponse>("/skips/vote", token, {
    method: "POST",
    body: JSON.stringify({ skipGroupId, voteType, source: "extension" }),
  });
}

/**
 * Save user preferences
 */
export async function saveUserPreferences(
  preferences: Record<string, boolean>,
  token: string
): Promise<UserPreferences> {
  return apiCall<UserPreferences>("/user/preferences", token, {
    method: "POST",
    body: JSON.stringify(preferences),
  });
}

/**
 * Save a new timestamp
 */
export async function saveTimestamp(
  contentType: "movie" | "episode",
  contentId: number,
  data: {
    start: number;
    finish: number;
    type: "Nudity" | "Sex" | "Gore";
    season_number?: number;
    episode_number?: number;
  },
  token: string
): Promise<any> {
  return apiCall(`/timestamps/${contentType}/${contentId}`, token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

