/**
 * Style injection utilities for content scripts
 * Dynamically loads CSS files from the extension as web-accessible resources
 */

/**
 * Inject a stylesheet from the extension's web-accessible resources
 * @param id - Unique ID for the style element (prevents duplicate injection)
 * @param cssPath - Path to the CSS file relative to the extension root (e.g., "src/content/styles/quick-panel.css")
 */
export function injectStylesheet(id: string, cssPath: string): void {
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL(cssPath);
  document.head.appendChild(link);
}

/**
 * Inject inline styles directly into the document
 * Use this as a fallback if web-accessible resources aren't available
 * @param id - Unique ID for the style element (prevents duplicate injection)
 * @param css - CSS string to inject
 */
export function injectInlineStyles(id: string, css: string): void {
  if (document.getElementById(id)) return;

  const style = document.createElement("style");
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * Remove an injected stylesheet by ID
 * @param id - The ID of the style element to remove
 */
export function removeStylesheet(id: string): void {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}
