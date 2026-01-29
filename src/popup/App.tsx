import { ClerkProvider } from "../lib/clerk";
import { CLERK_PUBLISHABLE_KEY, SYNC_HOST } from "../lib/config";
import { useAuth } from "./hooks/useAuth";
import { Auth } from "./components/Auth";

function AppContent() {
  const { isLoaded } = useAuth();

  // Loading state
  if (!isLoaded) {
    return (
      <div className="app">
        <div className="loading-screen">
          <img
            src="/public/icons/icon128.png"
            alt="Skipit"
            className="loading-logo"
          />
          <span className="loading-text">Loading...</span>
        </div>
      </div>
    );
  }

  // Auth handles both signed-in and signed-out states
  return (
    <div className="app">
      <Auth />
    </div>
  );
}

function App() {
  const EXTENSION_URL = chrome.runtime.getURL(".");
  const redirectUrl = `${EXTENSION_URL}src/popup/index.html`;

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      syncHost={SYNC_HOST}
      afterSignOutUrl={redirectUrl}
      signInFallbackRedirectUrl={redirectUrl}
      signUpFallbackRedirectUrl={redirectUrl}
    >
      <AppContent />
    </ClerkProvider>
  );
}

export default App;
