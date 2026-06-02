import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useClerk } from "../../lib/clerk";
import { APP_URL } from "../../lib/config";
import type { AutoDetectedContent } from "../../lib/types";
import { FabStyleSelector } from "./FabStyleSelector";
import { SkipitLogo } from "./SkipitLogo";

const TUTORIAL_URL = "https://youtu.be/mE_iKMKwvpE";

const SignOutIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const PlayIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const Auth = () => {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [detectedContent, setDetectedContent] =
    useState<AutoDetectedContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      setDetectedContent(null);
      return;
    }

    const fetchDetectedContent = async () => {
      setIsLoadingContent(true);
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!tab?.id || !tab.url?.includes("netflix.com")) {
          setDetectedContent(null);
          setIsLoadingContent(false);
          return;
        }

        const isWatchPage = tab.url?.includes("netflix.com/watch") ?? false;

        if (!isWatchPage) {
          setDetectedContent(null);
          setIsLoadingContent(false);
          return;
        }

        chrome.tabs.sendMessage(
          tab.id,
          { type: "GET_DETECTED_CONTENT" },
          (response) => {
            if (chrome.runtime.lastError) {
              setDetectedContent(null);
            } else if (response?.success && response.content) {
              setDetectedContent(response.content);
            } else {
              setDetectedContent(null);
            }
            setIsLoadingContent(false);
          }
        );
      } catch (error) {
        console.error("[Popup] Error fetching detected content:", error);
        setDetectedContent(null);
        setIsLoadingContent(false);
      }
    };

    fetchDetectedContent();
  }, [isSignedIn]);

  const getSkipitUrl = (content: AutoDetectedContent): string => {
    if (content.mediaType === "movie") {
      return `${APP_URL}/movie/${content.tmdbId}`;
    }
    return `${APP_URL}/tvshow/${content.tmdbId}/${content.seasonNumber}/${content.episodeNumber}`;
  };

  const handleViewOnSkipit = () => {
    if (!detectedContent) return;
    chrome.tabs.create({ url: getSkipitUrl(detectedContent) });
  };

  const handleOpenSkipit = () => {
    chrome.tabs.create({ url: APP_URL });
  };

  const handleWatchTutorial = () => {
    chrome.tabs.create({ url: TUTORIAL_URL });
  };

  const handleSignIn = () => {
    chrome.windows.create({
      url: `${APP_URL}/extension-auth`,
      type: "popup",
      width: 650,
      height: 800,
      left: Math.round((screen.width - 450) / 2),
      top: Math.round((screen.height - 650) / 2),
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("[Popup] Sign out failed:", error);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="auth-screen">
        <SkipitLogo className="auth-logo" />
        <h1 className="auth-title">Welcome to Skipit</h1>
        <p className="auth-subtitle">
          Sign in to skip nudity, sex, and gore on Netflix automatically.
        </p>
        <button className="auth-button" onClick={handleSignIn}>
          Sign in to getskipit.com
          <ArrowRightIcon />
        </button>
        <p className="auth-hint">You'll be redirected to sign in on the web</p>
      </div>
    );
  }

  const episodeLabel =
    detectedContent && detectedContent.mediaType === "tv"
      ? `Season ${detectedContent.seasonNumber} · Episode ${detectedContent.episodeNumber}`
      : null;

  return (
    <div className="popup-shell">
      <header className="popup-header">
        <div className="popup-header-brand">
          <SkipitLogo className="popup-header-logo" />
        </div>
        <div className="popup-header-actions">
          <button
            type="button"
            className="popup-header-tutorial-btn"
            onClick={handleWatchTutorial}
            title="Watch tutorial"
          >
            <PlayIcon />
            Tutorial
          </button>
          <button
            type="button"
            className="popup-header-icon-btn"
            onClick={handleSignOut}
            aria-label="Sign out"
            title="Sign out"
          >
            <SignOutIcon />
          </button>
        </div>
      </header>

      <main className="popup-body">
        {/* Now Watching — white card */}
        <section className="popup-card popup-card--now">
          {isLoadingContent ? (
            <div className="detect-loading">
              <span className="loading-spinner" />
              Detecting content...
            </div>
          ) : detectedContent ? (
            <div className="detect-content">
              <span className="detect-label">
                <span className="detect-label-dot" />
                Now watching
              </span>
              <p className="detect-title" title={detectedContent.title}>
                {detectedContent.title}
              </p>
              {episodeLabel && <p className="detect-sub">{episodeLabel}</p>}
              <button
                type="button"
                className="btn-primary"
                onClick={handleViewOnSkipit}
              >
                View on Skipit
                <ExternalLinkIcon />
              </button>
            </div>
          ) : (
            <div className="detect-content">
              <p className="detect-empty">
                Open a Netflix movie or episode to see skip options.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={handleOpenSkipit}
              >
                Open getskipit.com
                <ExternalLinkIcon />
              </button>
            </div>
          )}
        </section>

        {/* Settings — white card */}
        <section className="popup-card popup-card--settings">
          <h3 className="card-title">Button style</h3>
          <FabStyleSelector />
        </section>
      </main>
    </div>
  );
};
