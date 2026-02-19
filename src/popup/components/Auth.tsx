import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useClerk } from "../../lib/clerk";
import { APP_URL } from "../../lib/config";
import type { AutoDetectedContent } from "../../lib/types";

export const Auth = () => {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [detectedContent, setDetectedContent] =
    useState<AutoDetectedContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [helpVerify, setHelpVerify] = useState(false);
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(true);

  // Fetch user preferences when authenticated
  useEffect(() => {
    if (!isSignedIn) {
      setIsLoadingPrefs(false);
      return;
    }

    chrome.runtime.sendMessage(
      { type: "GET_USER_PREFERENCES" },
      (response) => {
        if (chrome.runtime.lastError) {
          setIsLoadingPrefs(false);
          return;
        }
        if (response?.success && response.preferences) {
          setHelpVerify(response.preferences.help_verify_skips ?? false);
        }
        setIsLoadingPrefs(false);
      }
    );
  }, [isSignedIn]);

  // Fetch detected content when authenticated
  useEffect(() => {
    if (!isSignedIn) {
      setDetectedContent(null);
      return;
    }

    const fetchDetectedContent = async () => {
      setIsLoadingContent(true);
      try {
        // Get the current active tab
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!tab?.id || !tab.url?.includes("netflix.com")) {
          setDetectedContent(null);
          setIsLoadingContent(false);
          return;
        }

        // Only consider it a streaming page if on /watch/
        const isWatchPage = tab.url?.includes("netflix.com/watch") ?? false;

        if (!isWatchPage) {
          setDetectedContent(null);
          setIsLoadingContent(false);
          return;
        }

        // Send message to content script to get detected content
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

  // Build the URL for the Skipit web app
  const getSkipitUrl = (content: AutoDetectedContent): string => {
    if (content.mediaType === "movie") {
      return `${APP_URL}/movie/${content.tmdbId}`;
    } else {
      // TV show episode
      return `${APP_URL}/tvshow/${content.tmdbId}/${content.seasonNumber}/${content.episodeNumber}`;
    }
  };

  const handleViewOnSkipit = () => {
    if (!detectedContent) return;
    const url = getSkipitUrl(detectedContent);
    chrome.tabs.create({ url });
  };

  const handleToggleHelpVerify = () => {
    const newValue = !helpVerify;
    setHelpVerify(newValue);
    chrome.runtime.sendMessage(
      {
        type: "SAVE_USER_PREFERENCES",
        preferences: { help_verify_skips: newValue },
      },
      (response) => {
        if (chrome.runtime.lastError || !response?.success) {
          // Revert on failure
          setHelpVerify(!newValue);
        }
      }
    );
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
      console.error("Failed to sign out:", error);
    }
  };

  // Full-page sign-in screen when not authenticated
  if (!isSignedIn) {
    return (
      <div className="auth-screen">
        <img
          src="/public/icons/icon128.png"
          alt="Skipit"
          className="auth-logo"
        />
        <h1 className="auth-title">Welcome to Skipit</h1>
        <p className="auth-subtitle">
          Skip unwanted content on Netflix and other streaming platforms
          automatically
        </p>
        <button className="auth-button" onClick={handleSignIn}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Sign in to getskipit.com
        </button>
        <p className="auth-hint">You'll be redirected to sign in on the web</p>
      </div>
    );
  }

  // Simple welcome screen when authenticated
  const handleWatchTutorial = () => {
    chrome.tabs.create({ url: "https://getskipit.com/extension-auth" });
  };

  return (
    <div className="welcome-screen">
      <img
        src="/public/icons/icon128.png"
        alt="Skipit"
        className="welcome-logo"
      />

      <h1 className="welcome-title">You're all set!</h1>
      <p className="welcome-subtitle">
        Use the <strong>Skipit</strong> button to skip scenes, or{" "}
        <strong>Mark</strong> to contribute.
      </p>

      {/* Show "View on Skipit" button when content is detected */}
      {isLoadingContent && (
        <div className="detected-content-loading">
          <span className="loading-spinner" />
          Detecting content...
        </div>
      )}

      {!isLoadingContent && detectedContent && (
        <button className="action-button" onClick={handleViewOnSkipit}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View on Skipit
        </button>
      )}

      {!isLoadingContent && !detectedContent && (
        <button
          className="action-button"
          onClick={() => chrome.tabs.create({ url: APP_URL })}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Open getskipit.com
        </button>
      )}

      <button className="action-button" onClick={handleWatchTutorial}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        Watch tutorial
      </button>

      {!isLoadingPrefs && (
        <div className="verify-toggle">
          <div className="verify-toggle-text">
            <span className="verify-toggle-label">Help verify skips</span>
            <span className="verify-toggle-desc">
              Vote on unverified skip timestamps while watching
            </span>
          </div>
          <button
            className={`toggle-switch${helpVerify ? " active" : ""}`}
            onClick={handleToggleHelpVerify}
            role="switch"
            aria-checked={helpVerify}
          >
            <span className="toggle-switch-knob" />
          </button>
        </div>
      )}

      <button className="welcome-signout" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};
