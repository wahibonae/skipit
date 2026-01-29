/**
 * Quick Panel - In-page UI for quick skip activation
 * Shows when user clicks the Skipit FAB button on Netflix
 */

import { SYNC_HOST } from "../lib/config";
import type {
  NetflixMetadata,
  TimestampCounts,
  MatchContentResponse,
  CheckAuthResponse,
} from "../lib/types";
import { injectStylesheet } from "./utils/style-injector";

interface QuickPanelState {
  isOpen: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  metadata: NetflixMetadata | null;
  matchedContent: {
    tmdbId: number;
    title: string;
    mediaType: "movie" | "tv";
    counts: TimestampCounts;
  } | null;
  preferences: {
    nudity: boolean;
    sex: boolean;
    gore: boolean;
  };
  error: string | null;
}

type StartCallback = (
  tmdbId: number,
  contentType: "movie" | "episode",
  contentTitle: string,
  preferences: { nudity: boolean; sex: boolean; gore: boolean },
  seasonNumber?: number,
  episodeNumber?: number
) => Promise<void>;

type CloseCallback = () => void;

export class QuickPanel {
  private state: QuickPanelState;
  private backdrop: HTMLDivElement | null = null;
  private panel: HTMLDivElement | null = null;
  private onStart: StartCallback;
  private onClose: CloseCallback;

  constructor(onStart: StartCallback, onClose: CloseCallback) {
    this.onStart = onStart;
    this.onClose = onClose;
    this.state = {
      isOpen: false,
      isLoading: false,
      isAuthenticated: false,
      metadata: null,
      matchedContent: null,
      preferences: {
        nudity: true,
        sex: true,
        gore: false,
      },
      error: null,
    };

    this.injectStyles();
  }

  private injectStyles() {
    injectStylesheet(
      "skipit-quick-panel-styles",
      "src/content/styles/quick-panel.css"
    );
  }

  async show(metadata: NetflixMetadata | null) {
    this.state.metadata = metadata;
    this.state.isLoading = true;
    this.state.error = null;
    this.state.matchedContent = null;
    this.state.isOpen = true;

    this.createPanel();
    this.render();

    // Animate in
    requestAnimationFrame(() => {
      this.backdrop?.classList.add("visible");
      this.panel?.classList.add("visible");
    });

    // Check authentication first
    try {
      const authResponse = await this.checkAuth();
      this.state.isAuthenticated = authResponse.isAuthenticated;

      if (!authResponse.isAuthenticated) {
        this.state.isLoading = false;
        this.render();
        return;
      }

      // Fetch user preferences and match content in parallel
      const [prefsResponse] = await Promise.all([
        this.fetchUserPreferences(),
        metadata?.title ? this.matchContent(metadata) : Promise.resolve(),
      ]);

      // Apply user preferences if fetched successfully
      if (prefsResponse?.success && prefsResponse.preferences) {
        this.state.preferences = {
          nudity: prefsResponse.preferences.skip_nudity,
          sex: prefsResponse.preferences.skip_sex,
          gore: prefsResponse.preferences.skip_gore,
        };
      }

      if (!metadata?.title) {
        this.state.error = "Could not detect content. Try using the extension popup.";
      }
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : "An error occurred";
    }

    this.state.isLoading = false;
    this.render();
  }

  hide() {
    this.state.isOpen = false;

    this.backdrop?.classList.remove("visible");
    this.panel?.classList.remove("visible");

    setTimeout(() => {
      this.backdrop?.remove();
      this.panel?.remove();
      this.backdrop = null;
      this.panel = null;
    }, 200);

    this.onClose();

    // Notify injected script to restore playback and fullscreen
    window.postMessage({ type: "SKIPIT_MODAL_CLOSED" }, "*");
  }

  private createPanel() {
    // Remove existing if any
    this.backdrop?.remove();
    this.panel?.remove();

    // Create backdrop
    this.backdrop = document.createElement("div");
    this.backdrop.className = "skipit-quick-backdrop";
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) {
        this.hide();
      }
    });

    // Create panel
    this.panel = document.createElement("div");
    this.panel.className = "skipit-quick-panel";

    document.body.appendChild(this.backdrop);
    document.body.appendChild(this.panel);

    // Handle escape key
    document.addEventListener("keydown", this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.state.isOpen) {
      this.hide();
    }
  };

  private render() {
    if (!this.panel) return;

    this.panel.textContent = "";

    const { isLoading, isAuthenticated, matchedContent, error } = this.state;
    const { title, subtitle } = this.getDisplayTitleAndSubtitle();

    if (!isLoading && !isAuthenticated) {
      this.renderAuthState();
      return;
    }

    if (isLoading) {
      this.renderLoadingState(title, subtitle);
      return;
    }

    if (error) {
      this.renderErrorState(title, subtitle, error);
      return;
    }

    const counts = matchedContent?.counts || { nudity: 0, sex: 0, gore: 0, total: 0 };
    if (counts.total === 0) {
      this.renderNoTimestampsState(title, subtitle);
      return;
    }

    this.renderMainState(title, subtitle);
  }

  private renderAuthState() {
    if (!this.panel) return;

    // Header
    const header = this.createHeader("Skipit", "Sign in to start skipping");
    this.panel.appendChild(header);

    // Auth container
    const authDiv = document.createElement("div");
    authDiv.className = "skipit-quick-auth";

    const authText = document.createElement("p");
    authText.textContent = "Sign in on getskipit.com to skip unwanted scenes";
    authDiv.appendChild(authText);

    const signInLink = document.createElement("a");
    signInLink.href = `${SYNC_HOST}/extension-auth`;
    signInLink.target = "_blank";
    signInLink.className = "skipit-quick-signin";
    signInLink.textContent = "Sign in on getskipit.com";
    authDiv.appendChild(signInLink);

    this.panel.appendChild(authDiv);
  }

  private renderLoadingState(title: string, subtitle?: string) {
    if (!this.panel) return;

    this.panel.appendChild(this.createHeader(title, subtitle));

    const loadingDiv = document.createElement("div");
    loadingDiv.className = "skipit-quick-loading";

    const spinner = document.createElement("div");
    spinner.className = "skipit-quick-spinner";
    loadingDiv.appendChild(spinner);

    const loadingText = document.createElement("p");
    loadingText.textContent = "Finding skip data...";
    loadingDiv.appendChild(loadingText);

    this.panel.appendChild(loadingDiv);
  }

  private renderErrorState(title: string, subtitle: string | undefined, errorMessage: string) {
    if (!this.panel) return;

    this.panel.appendChild(this.createHeader(title, subtitle));

    const errorDiv = document.createElement("div");
    errorDiv.className = "skipit-quick-error";

    const errorText = document.createElement("p");
    errorText.textContent = errorMessage;
    errorDiv.appendChild(errorText);

    const retryBtn = document.createElement("button");
    retryBtn.className = "skipit-quick-retry";
    retryBtn.textContent = "Try Again";
    retryBtn.addEventListener("click", () => {
      if (this.state.metadata) {
        this.show(this.state.metadata);
      }
    });
    errorDiv.appendChild(retryBtn);

    this.panel.appendChild(errorDiv);
  }

  private renderNoTimestampsState(title: string, subtitle?: string) {
    if (!this.panel) return;

    this.panel.appendChild(this.createHeader(title, subtitle));

    const noTimestampsDiv = document.createElement("div");
    noTimestampsDiv.className = "skipit-quick-no-timestamps";

    const mainText = document.createElement("p");
    mainText.textContent = "No skip timestamps available yet";
    noTimestampsDiv.appendChild(mainText);

    const hintText = document.createElement("p");
    hintText.className = "hint";
    hintText.textContent = 'Use the "Mark scene" button to add skips while watching';
    noTimestampsDiv.appendChild(hintText);

    this.panel.appendChild(noTimestampsDiv);
  }

  private renderMainState(title: string, subtitle?: string) {
    if (!this.panel) return;

    const { matchedContent, preferences } = this.state;
    const counts = matchedContent?.counts || { nudity: 0, sex: 0, gore: 0 };

    this.panel.appendChild(this.createHeader(title, subtitle));

    const prefsDiv = document.createElement("div");
    prefsDiv.className = "skipit-quick-prefs";

    prefsDiv.appendChild(
      this.createPrefItem("nudity", "Nudity", counts.nudity, preferences.nudity)
    );
    prefsDiv.appendChild(
      this.createPrefItem("sex", "Sex", counts.sex, preferences.sex)
    );
    prefsDiv.appendChild(
      this.createPrefItem("gore", "Gore", counts.gore, preferences.gore)
    );

    this.panel.appendChild(prefsDiv);

    const selectedCount = this.getSelectedCount();
    const startBtn = document.createElement("button");
    startBtn.className = "skipit-quick-start";
    startBtn.disabled = selectedCount === 0;
    startBtn.textContent = selectedCount > 0
      ? `Start Skipping (${selectedCount} scenes)`
      : "Start Skipping";
    startBtn.addEventListener("click", () => this.handleStart());

    this.panel.appendChild(startBtn);
  }

  private createHeader(title: string, subtitle?: string): HTMLDivElement {
    const header = document.createElement("div");
    header.className = "skipit-quick-header";

    const titleContainer = document.createElement("div");

    const titleEl = document.createElement("h3");
    titleEl.className = "skipit-quick-title";
    titleEl.textContent = title;
    titleContainer.appendChild(titleEl);

    if (subtitle) {
      const subtitleEl = document.createElement("div");
      subtitleEl.className = "skipit-quick-subtitle";
      subtitleEl.textContent = subtitle;
      titleContainer.appendChild(subtitleEl);
    }

    header.appendChild(titleContainer);

    const closeBtn = document.createElement("button");
    closeBtn.className = "skipit-quick-close";
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => this.hide());
    header.appendChild(closeBtn);

    return header;
  }

  private createPrefItem(
    key: "nudity" | "sex" | "gore",
    label: string,
    count: number,
    checked: boolean
  ): HTMLLabelElement {
    const item = document.createElement("label");
    item.className = `skipit-pref-item${count === 0 ? " disabled" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    checkbox.disabled = count === 0;
    checkbox.addEventListener("change", () => {
      this.state.preferences[key] = checkbox.checked;
      this.render();
    });
    item.appendChild(checkbox);

    const labelSpan = document.createElement("span");
    labelSpan.className = "skipit-pref-label";
    labelSpan.textContent = label;
    item.appendChild(labelSpan);

    const countSpan = document.createElement("span");
    countSpan.className = "skipit-pref-count";
    countSpan.textContent = String(count);
    item.appendChild(countSpan);

    return item;
  }

  private async handleStart() {
    const { matchedContent, preferences, metadata } = this.state;
    if (!matchedContent) return;

    const startBtn = this.panel?.querySelector(".skipit-quick-start") as HTMLButtonElement;
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.textContent = "Starting...";
    }

    try {
      const contentType = matchedContent.mediaType === "tv" ? "episode" : "movie";

      await this.onStart(
        matchedContent.tmdbId,
        contentType,
        matchedContent.title,
        preferences,
        metadata?.seasonNumber || undefined,
        metadata?.episodeNumber || undefined
      );

      // Update FAB state to show skipping is active
      window.postMessage({
        type: "SKIPIT_UPDATE_FAB_STATE",
        data: { isSkipping: true, metadata },
      }, "*");

      this.hide();
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : "Failed to start skipping";
      this.render();
    }
  }

  private getSelectedCount(): number {
    const { preferences, matchedContent } = this.state;
    const counts = matchedContent?.counts || { nudity: 0, sex: 0, gore: 0 };

    let total = 0;
    if (preferences.nudity && counts.nudity > 0) total += counts.nudity;
    if (preferences.sex && counts.sex > 0) total += counts.sex;
    if (preferences.gore && counts.gore > 0) total += counts.gore;

    return total;
  }

  private getDisplayTitleAndSubtitle(): { title: string; subtitle?: string } {
    const { metadata, matchedContent } = this.state;

    const title = matchedContent?.title || metadata?.title || "Skipit";

    let subtitle: string | undefined;
    if (metadata?.type === "episode" && metadata.seasonNumber && metadata.episodeNumber) {
      subtitle = `Season ${metadata.seasonNumber}, Episode ${metadata.episodeNumber}`;
    }

    return { title, subtitle };
  }

  private async checkAuth(): Promise<CheckAuthResponse> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "CHECK_AUTH_STATUS" }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(response);
      });
    });
  }

  private async fetchUserPreferences(): Promise<{
    success: boolean;
    preferences?: {
      skip_nudity: boolean;
      skip_sex: boolean;
      skip_gore: boolean;
    };
    error?: string;
  }> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "GET_USER_PREFERENCES" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("[QuickPanel] Error fetching preferences:", chrome.runtime.lastError);
          resolve({ success: false, error: chrome.runtime.lastError.message });
          return;
        }
        resolve(response);
      });
    });
  }

  private async matchContent(metadata: NetflixMetadata): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: "MATCH_CONTENT",
          title: metadata.title,
          contentType: metadata.type,
          seasonNumber: metadata.seasonNumber,
          episodeNumber: metadata.episodeNumber,
        },
        (response: MatchContentResponse) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }

          if (response.success && response.tmdbId) {
            this.state.matchedContent = {
              tmdbId: response.tmdbId,
              title: response.contentTitle || metadata.title,
              mediaType: response.mediaType || "movie",
              counts: response.counts || { nudity: 0, sex: 0, gore: 0, total: 0 },
            };
            resolve();
          } else {
            reject(new Error(response.error || "Content not found"));
          }
        }
      );
    });
  }

  destroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.backdrop?.remove();
    this.panel?.remove();
  }
}
