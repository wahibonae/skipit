/**
 * Icons shared by the content-script UIs (quick panel, mark scene overlay).
 * The injected script keeps its own copy, since the MAIN world can't import this.
 */

export const ICON_CHECK = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";

// Spaced for a 1.8 stroke so the two triangles don't weld together
export const ICON_FORWARD = "M5 5.8 10.6 12 5 18.2Z M13.6 5.8 19.2 12 13.6 18.2Z";

export const ICON_BOOKMARK =
  "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z";

interface IconOptions {
  /**
   * Strokes the filled shape's own edge to round its corners. Not an outline:
   * the fill stays.
   */
  strokeWidth?: number;
}

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Build a single-path icon element. Decorative (aria-hidden): these glyphs sit
 * beside text that already names the action.
 */
export function createIcon(
  path: string,
  { strokeWidth }: IconOptions = {}
): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");

  if (strokeWidth) {
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", String(strokeWidth));
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
  }

  const shape = document.createElementNS(SVG_NS, "path");
  shape.setAttribute("d", path);
  svg.appendChild(shape);

  return svg;
}

/** The same icon as markup, for innerHTML templates. */
export function iconMarkup(path: string, options: IconOptions = {}): string {
  return createIcon(path, options).outerHTML;
}
