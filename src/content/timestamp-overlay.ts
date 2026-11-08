// Timestamp marking overlay UI
// This runs in the ISOLATED world and is injected by the content script

import type { AutoDetectedContent } from "../lib/types";
import { injectStylesheet } from "./utils/style-injector";
import { ICON_BOOKMARK, iconMarkup } from "./utils/icons";

// Longest span a single skip may cover; shared by the display and save gates
const MAX_SKIP_DURATION_MS = 300000; // 5 minutes

const BOOKMARK_SVG = iconMarkup(ICON_BOOKMARK);

// ============================================================================
// TYPES
// ============================================================================

interface OverlayState {
  startTime: number;
  endTime: number;
  selectedType: "Nudity" | "Sex" | "Gore" | null;
  autoDetectedContent: AutoDetectedContent | null;
  isSaving: boolean;
  error: string | null;
  isLoadingContent: boolean;
}

type SaveCallback = (data: {
  startTime: number;
  endTime: number;
  type: "Nudity" | "Sex" | "Gore";
  contentType: "movie" | "episode";
  contentId: number;
  contentTitle: string;
  seasonNumber?: number;
  episodeNumber?: number;
}) => Promise<void>;

type CancelCallback = () => void;

// ============================================================================
// OVERLAY CLASS
// ============================================================================

export class TimestampOverlay {
  private backdrop: HTMLDivElement | null = null;
  private state: OverlayState;
  private onSave: SaveCallback;
  private onCancel: CancelCallback;

  constructor(onSave: SaveCallback, onCancel: CancelCallback) {
    this.onSave = onSave;
    this.onCancel = onCancel;
    this.state = this.getInitialState();
  }

  private getInitialState(): OverlayState {
    return {
      startTime: 0,
      endTime: 0,
      selectedType: null,
      autoDetectedContent: null,
      isSaving: false,
      error: null,
      isLoadingContent: false,
    };
  }

  show(
    startTime: number,
    endTime: number,
    autoDetected: AutoDetectedContent | null,
    isLoading: boolean = false
  ) {
    this.state = this.getInitialState();
    this.state.startTime = startTime;
    this.state.endTime = endTime;
    this.state.isLoadingContent = isLoading;
    this.state.autoDetectedContent = autoDetected;

    if (autoDetected) {
      this.state.isLoadingContent = false;
    }

    this.injectStyles();
    this.render();

    // Remove first: show() can be called on an overlay that is already up
    document.removeEventListener("keydown", this.handleEscape);
    document.addEventListener("keydown", this.handleEscape);
  }

  setAutoDetectedContent(autoDetected: AutoDetectedContent | null) {
    this.state.isLoadingContent = false;
    this.state.autoDetectedContent = autoDetected;

    if (!autoDetected) {
      this.state.error = "Could not detect content. Please try again.";
    }

    this.render();
  }

  /**
   * Hide and destroy the overlay
   */
  hide() {
    this.removeDom();
    document.removeEventListener("keydown", this.handleEscape);
  }

  /**
   * Remove the rendered DOM only (render() calls this on every re-render).
   */
  private removeDom() {
    if (this.backdrop) {
      this.backdrop.remove();
      this.backdrop = null;
    }
  }

  /**
   * Bound once so show() adds and hide() removes the same listener. Adding it
   * per render() leaked one listener per type click.
   */
  private handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.handleCancel();
    }
  };

  /**
   * Inject overlay styles
   */
  private injectStyles() {
    injectStylesheet(
      "skipit-overlay-styles",
      "src/content/styles/timestamp-overlay.css"
    );
  }

  /**
   * Format time in MM:SS or HH:MM:SS (input is milliseconds)
   */
  private formatTime(milliseconds: number): string {
    const totalSeconds = milliseconds / 1000;
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Render the overlay
   */
  private render() {
    // DOM only: hide() would also drop the Escape listener
    this.removeDom();

    // Create backdrop
    this.backdrop = document.createElement("div");
    this.backdrop.className = "skipit-overlay-backdrop";
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) {
        this.handleCancel();
      }
    });

    // Create overlay content
    const overlay = document.createElement("div");
    overlay.className = "skipit-overlay";
    overlay.innerHTML = this.getOverlayHTML();

    this.backdrop.appendChild(overlay);
    document.body.appendChild(this.backdrop);

    // Attach event listeners
    this.attachEventListeners(overlay);
  }

  /**
   * Escape text interpolated into the innerHTML template (titles, API error messages).
   */
  private escapeHtml(value: string): string {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
  }

  private getOverlayHTML(): string {
    const { startTime, endTime, selectedType, error, isSaving, isLoadingContent } = this.state;

    const scene = this.getSceneName();
    const exceedsMaxDuration = endTime - startTime > MAX_SKIP_DURATION_MS;

    return `
      <div class="skipit-overlay-header">
        <h3 class="skipit-overlay-title">Mark scene</h3>
        <button class="skipit-overlay-close" data-action="close">&times;</button>
      </div>

      ${error ? `<div class="skipit-error">${this.escapeHtml(error)}</div>` : ""}

      ${isLoadingContent ? `
        <div class="skipit-content-loading">
          <span class="skipit-spinner"></span>
          <span>Detecting content...</span>
        </div>
      ` : `
        <div class="skipit-scene-info${exceedsMaxDuration ? " over" : ""}">
          <span class="skipit-scene-mark">
            ${BOOKMARK_SVG}
            <span class="skipit-scene-length">${this.formatDuration(endTime - startTime)}</span>
          </span>
          <span class="skipit-scene-rule"></span>
          <span class="skipit-scene-facts">
            ${scene ? `<span class="skipit-scene-name">${this.escapeHtml(scene.name)}${scene.episode ? ` <em>\u00B7 ${this.escapeHtml(scene.episode)}</em>` : ""}</span>` : ""}
            <span class="skipit-scene-times">${this.formatTime(startTime)}<s>\u2192</s>${this.formatTime(endTime)}</span>
          </span>
        </div>

        ${exceedsMaxDuration ? `<div class="skipit-warning">Max skip duration: ${Math.round(MAX_SKIP_DURATION_MS / 60000)} minutes</div>` : ""}

        <span class="skipit-overlay-label">What type of scene is this?</span>
        <div class="skipit-type-buttons">
          ${this.getTypeButtonHTML("Nudity", selectedType, exceedsMaxDuration)}
          ${this.getTypeButtonHTML("Sex", selectedType, exceedsMaxDuration)}
          ${this.getTypeButtonHTML("Gore", selectedType, exceedsMaxDuration)}
        </div>

        <button class="skipit-btn-save" data-action="save" ${!this.canSave() || isSaving ? "disabled" : ""}>
          ${isSaving ? "Marking..." : `${BOOKMARK_SVG} Mark scene`}
        </button>
      `}
    `;
  }

  /**
   * One scene type, as a button carrying its timeline key.
   */
  private getTypeButtonHTML(
    type: "Nudity" | "Sex" | "Gore",
    selectedType: "Nudity" | "Sex" | "Gore" | null,
    disabled: boolean
  ): string {
    return `
      <button class="skipit-type-btn${selectedType === type ? " selected" : ""}" data-type="${type}" ${disabled ? "disabled" : ""}>
        <span class="skipit-type-key ${type.toLowerCase()}"></span>
        ${type}
      </button>
    `;
  }

  /**
   * How long the marked span runs, for the line under the bookmark.
   */
  private formatDuration(milliseconds: number): string {
    const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));

    if (totalSeconds < 60) return `${totalSeconds}s`;

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return secs === 0 ? `${mins}m` : `${mins}m ${secs}s`;
  }

  /**
   * The detected title and episode, or null while detecting or after it failed.
   */
  private getSceneName(): { name: string; episode: string } | null {
    const { autoDetectedContent, isLoadingContent } = this.state;

    if (isLoadingContent || !autoDetectedContent) return null;

    const { title, mediaType, seasonNumber, episodeNumber } = autoDetectedContent;
    const episode =
      mediaType === "tv" && seasonNumber && episodeNumber
        ? `S${seasonNumber} E${episodeNumber}`
        : "";

    return { name: title, episode };
  }

  private canSave(): boolean {
    const { selectedType, autoDetectedContent, startTime, endTime } = this.state;

    if (endTime - startTime > MAX_SKIP_DURATION_MS) return false;

    if (selectedType === null || !autoDetectedContent) return false;

    if (autoDetectedContent.mediaType === "tv") {
      if (!autoDetectedContent.seasonNumber || !autoDetectedContent.episodeNumber) return false;
    }

    return true;
  }

  private attachEventListeners(overlay: HTMLElement) {
    overlay.querySelector('[data-action="close"]')?.addEventListener("click", () => {
      this.handleCancel();
    });

    overlay.querySelector('[data-action="save"]')?.addEventListener("click", () => {
      this.handleSave();
    });

    overlay.querySelectorAll("[data-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-type") as "Nudity" | "Sex" | "Gore";
        this.state.selectedType = this.state.selectedType === type ? null : type;
        this.render();
      });
    });
  }

  private handleCancel() {
    this.hide();
    this.onCancel();
    window.postMessage({ type: "SKIPIT_MODAL_CLOSED", source: "mark-scene" }, "*");
  }

  private async handleSave() {
    if (!this.canSave()) return;

    const { startTime, endTime, selectedType, autoDetectedContent } = this.state;

    if (selectedType === null || !autoDetectedContent) return;

    this.state.isSaving = true;
    this.state.error = null;
    this.render();

    try {
      const contentType = autoDetectedContent.mediaType === "tv" ? "episode" : "movie";

      await this.onSave({
        startTime,
        endTime,
        type: selectedType,
        contentType,
        contentId: autoDetectedContent.tmdbId,
        contentTitle: autoDetectedContent.title,
        seasonNumber: autoDetectedContent.seasonNumber ?? undefined,
        episodeNumber: autoDetectedContent.episodeNumber ?? undefined,
      });

      this.hide();
      window.postMessage({ type: "SKIPIT_MODAL_CLOSED", source: "mark-scene" }, "*");
    } catch (error) {
      console.error("[Overlay] Save error:", error);
      this.state.error = error instanceof Error ? error.message : "Failed to save. Please try again.";
      this.state.isSaving = false;
      this.render();
    }
  }
}
