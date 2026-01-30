// Timestamp marking overlay UI
// This runs in the ISOLATED world and is injected by the content script

import type { AutoDetectedContent } from "../lib/types";
import { injectStylesheet } from "./utils/style-injector";

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
    if (this.backdrop) {
      this.backdrop.remove();
      this.backdrop = null;
    }
  }

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
    // Remove existing overlay
    this.hide();

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

  private getOverlayHTML(): string {
    const { startTime, endTime, selectedType, error, isSaving, isLoadingContent } = this.state;

    const contentSubtitle = this.getContentSubtitle();
    // Max duration: 5 minutes = 300,000 milliseconds
    const exceedsMaxDuration = endTime - startTime > 300000;

    return `
      <div class="skipit-overlay-header">
        <div>
          <h3 class="skipit-overlay-title">Mark Scene</h3>
          ${contentSubtitle ? `<div class="skipit-overlay-subtitle">${contentSubtitle}</div>` : ""}
        </div>
        <button class="skipit-overlay-close" data-action="close">&times;</button>
      </div>

      ${error ? `<div class="skipit-error">${error}</div>` : ""}

      ${isLoadingContent ? `
        <div class="skipit-content-loading">
          <span class="skipit-spinner"></span>
          <span>Detecting content...</span>
        </div>
      ` : `
        <div class="skipit-time-display">
          <span class="skipit-time-icon">⏱️</span>
          <span class="skipit-time-range">${this.formatTime(startTime)} → ${this.formatTime(endTime)}</span>
        </div>

        ${exceedsMaxDuration ? '<div class="skipit-warning">Max skip duration: 5 minutes</div>' : ""}

        <div class="skipit-section">
          <label class="skipit-section-label">What type of scene is this?</label>
          <div class="skipit-type-buttons">
            <button class="skipit-type-btn nudity ${selectedType === "Nudity" ? "selected" : ""}" data-type="Nudity" ${exceedsMaxDuration ? "disabled" : ""}>
              Nudity
            </button>
            <button class="skipit-type-btn sex ${selectedType === "Sex" ? "selected" : ""}" data-type="Sex" ${exceedsMaxDuration ? "disabled" : ""}>
              Sex
            </button>
            <button class="skipit-type-btn gore ${selectedType === "Gore" ? "selected" : ""}" data-type="Gore" ${exceedsMaxDuration ? "disabled" : ""}>
              Gore
            </button>
          </div>
        </div>

        <div class="skipit-actions">
          <button class="skipit-btn skipit-btn-save" data-action="save" ${!this.canSave() || isSaving ? "disabled" : ""}>
            ${isSaving ? "Marking..." : "Mark Scene"}
          </button>
        </div>
      `}
    `;
  }

  private getContentSubtitle(): string {
    const { autoDetectedContent, isLoadingContent } = this.state;

    if (isLoadingContent) {
      return "";
    }

    if (!autoDetectedContent) {
      return "";
    }

    const { title, mediaType, seasonNumber, episodeNumber } = autoDetectedContent;

    if (mediaType === "tv" && seasonNumber && episodeNumber) {
      return `${title} · S${seasonNumber}E${episodeNumber}`;
    }

    return title;
  }

  private canSave(): boolean {
    const { selectedType, autoDetectedContent, startTime, endTime } = this.state;

    // Max duration: 5 minutes = 300,000 milliseconds
    const MAX_SKIP_DURATION_MS = 300000;
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

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        this.handleCancel();
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);
  }

  private handleCancel() {
    this.hide();
    this.onCancel();
    window.postMessage({ type: "SKIPIT_MODAL_CLOSED" }, "*");
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
      window.postMessage({ type: "SKIPIT_MODAL_CLOSED" }, "*");
    } catch (error) {
      console.error("[Overlay] Save error:", error);
      this.state.error = error instanceof Error ? error.message : "Failed to save. Please try again.";
      this.state.isSaving = false;
      this.render();
    }
  }
}
