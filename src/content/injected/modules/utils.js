// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format time in seconds to MM:SS or HH:MM:SS
 */
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format milliseconds to MM:SS or HH:MM:SS
 */
function formatTimeMs(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format skip type for display (e.g., "nudity")
 */
function formatSkipType(type) {
  if (!type) return "";
  const typeNames = {
    Nudity: "nudity",
    nudity: "nudity",
    Sex: "sex",
    sex: "sex",
    Gore: "gore",
    gore: "gore",
  };
  return typeNames[type] || type.toLowerCase();
}

/**
 * Format skip types for display (e.g., "nudity/sex")
 * Handles both single type string and array of types
 */
function formatSkipTypes(types) {
  if (!types || types.length === 0) return "";
  // Normalize to array - handle both string and array inputs
  const typesArray = Array.isArray(types) ? types : [types];
  const formatted = typesArray.map((t) => formatSkipType(t)).filter(Boolean);
  const unique = [...new Set(formatted)];
  return unique.join("/");
}

/**
 * Create lock icon SVG using safe DOM methods
 */
function createLockIconSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
  );
  svg.appendChild(path);
  return svg;
}

/**
 * Inject styles for the buttons
 */
function injectStyles() {
  if (document.getElementById("skipit-mark-styles")) return;

  const style = document.createElement("style");
  style.id = "skipit-mark-styles";
  style.textContent = BUTTON_STYLES;
  document.head.appendChild(style);
}
