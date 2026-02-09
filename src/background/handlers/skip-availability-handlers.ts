/**
 * Skip availability handlers
 * Checks what skip types are available for a video
 */

import { getTimestamps } from "../../lib/api";
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
}): Promise<{ success: boolean; skipTypes: string[]; counts?: { nudity: number; sex: number; gore: number; total: number } }> {
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

    // Extract unique skip types and count by category
    const skipTypes = [...new Set(timestamps.map((t) => t.type.toLowerCase()))];
    const counts = { nudity: 0, sex: 0, gore: 0, total: 0 };
    for (const ts of timestamps) {
      counts.total++;
      switch (ts.type) {
        case "Nudity": counts.nudity++; break;
        case "Sex": counts.sex++; break;
        case "Gore": counts.gore++; break;
      }
    }

    return { success: true, skipTypes, counts };
  } catch (error) {
    console.error("[Background] Error checking available skips:", error);
    return { success: false, skipTypes: [] };
  }
}
