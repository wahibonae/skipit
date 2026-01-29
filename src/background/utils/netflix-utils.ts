/**
 * Netflix-specific utility functions
 */

/**
 * Extract Netflix video ID from URL
 * Netflix URLs look like: https://www.netflix.com/watch/81234567
 * Returns null if not a valid Netflix watch URL
 */
export function extractNetflixVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("netflix.com")) return null;

    const match = urlObj.pathname.match(/\/watch\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
