// ============================================================================
// NETFLIX PLAYER API
// ============================================================================

/**
 * Check if Netflix player is available and ready
 */
function isNetflixPlayerReady() {
  try {
    const netflix = window.netflix;
    return !!(
      netflix &&
      netflix.appContext &&
      netflix.appContext.state &&
      netflix.appContext.state.playerApp
    );
  } catch (error) {
    return false;
  }
}

/**
 * Get current playback time in milliseconds
 */
function getCurrentTime() {
  try {
    if (!isNetflixPlayerReady()) {
      throw new Error("Netflix player not ready");
    }

    const netflix = window.netflix;
    const videoPlayer =
      netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];
    const player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);

    return player.getCurrentTime();
  } catch (error) {
    console.error("[Netflix Injected] Error getting current time:", error);
    return 0;
  }
}

/**
 * Seek to specific time in milliseconds
 * This is the official Netflix skip code from CLAUDE.md
 */
function seek(milliseconds) {
  try {
    if (!isNetflixPlayerReady()) {
      throw new Error("Netflix player not ready");
    }

    // Official Netflix skip code
    const netflix = window.netflix;
    const videoPlayer =
      netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];
    const player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);
    player.seek(milliseconds);
  } catch (error) {
    console.error("[Netflix Injected] Error seeking:", error);
    throw error;
  }
}

/**
 * Extract Netflix video ID from URL (e.g., /watch/81234567 -> 81234567)
 * This is 100% reliable - URLs change immediately on navigation
 */
function getVideoIdFromUrl() {
  const match = window.location.pathname.match(/\/watch\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Pause the video
 */
function pauseVideo() {
  const video = document.querySelector("video");
  if (video && !video.paused) {
    video.pause();
  }
}

/**
 * Exit fullscreen mode if active
 * Returns a promise that resolves when fullscreen is exited
 */
function exitFullscreenIfActive() {
  if (document.fullscreenElement) {
    return document.exitFullscreen().catch((err) => {
      console.warn("[Netflix Injected] Exit fullscreen error:", err);
    });
  }
  return Promise.resolve();
}

/**
 * Play the video
 */
function playVideo() {
  const video = document.querySelector("video");
  if (video && video.paused) {
    video
      .play()
      .catch((err) =>
        console.warn("[Netflix Injected] Could not play video:", err)
      );
  }
}

/**
 * Enter fullscreen mode
 */
function enterFullscreen() {
  const playerContainer =
    document.querySelector(".watch-video") ||
    document.querySelector('[data-uia="player"]') ||
    document.documentElement;

  if (!document.fullscreenElement && playerContainer) {
    playerContainer
      .requestFullscreen()
      .catch((err) =>
        console.warn("[Netflix Injected] Could not enter fullscreen:", err)
      );
  }
}

/**
 * Extract metadata from Netflix's internal API
 * Returns: { title, type, seasonNumber, episodeNumber, episodeTitle, netflixId }
 */
function extractNetflixMetadata() {
  try {
    if (!isNetflixPlayerReady()) return null;

    const state = window.netflix.appContext.state;
    const playerState = state.playerApp.getState();
    const videoMetadata = playerState.videoPlayer.videoMetadata;
    const sessionKey = Object.keys(videoMetadata)[0];

    if (!sessionKey) return null;

    const metadata = videoMetadata[sessionKey];

    // Netflix nests video data: metadata._video._video contains the actual data
    const videoWrapper = metadata._video;
    if (!videoWrapper) return null;

    const video = videoWrapper._video || videoWrapper;
    if (!video) return null;

    // Determine content type - Netflix uses "show" for TV series
    const isEpisode =
      video.type === "show" ||
      video.type === "episode" ||
      video.currentEpisode !== undefined ||
      video.seasons !== undefined;

    let seasonNumber = null;
    let episodeNumber = null;
    let episodeTitle = null;

    // For TV shows, find current episode in seasons array
    if (isEpisode && video.seasons && video.currentEpisode) {
      const currentEpisodeId = video.currentEpisode;

      // Search through seasons to find the current episode
      for (const season of video.seasons) {
        if (season.episodes) {
          for (const episode of season.episodes) {
            if (
              episode.episodeId === currentEpisodeId ||
              episode.id === currentEpisodeId
            ) {
              seasonNumber = season.seq || null;
              episodeNumber = episode.seq || null;
              episodeTitle = episode.title || null;
              break;
            }
          }
        }
        if (seasonNumber !== null) break;
      }
    }

    const result = {
      title: video.title,
      type: isEpisode ? "episode" : "movie",
      seasonNumber: seasonNumber,
      episodeNumber: episodeNumber,
      episodeTitle: episodeTitle,
      netflixId: sessionKey,
    };

    return result;
  } catch (error) {
    console.error("[Netflix Injected] Error extracting metadata:", error);
    return null;
  }
}

// Export Netflix player interface to window
window.skipitNetflixPlayer = {
  getCurrentTime: getCurrentTime,
  seek: seek,
  isReady: isNetflixPlayerReady,
};
