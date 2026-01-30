// Clerk configuration
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Set to true for local development, false for production
const IS_DEVELOPMENT = import.meta.env.VITE_IS_DEVELOPMENT === "true";

// Clerk sync host (FAPI domain for cookie-based session sync)
// In production, Clerk sets cookies on clerk.yourdomain.com, not yourdomain.com
export const CLERK_SYNC_HOST = IS_DEVELOPMENT
  ? "http://localhost:3000"
  : "https://clerk.getskipit.com";

// Web app URL for navigation (extension-auth, movie pages, etc.)
export const APP_URL = IS_DEVELOPMENT
  ? "http://localhost:3000"
  : "https://www.getskipit.com";

// API configuration
export const API_BASE_URL = IS_DEVELOPMENT
  ? "http://localhost:3000/api"
  : "https://www.getskipit.com/api";
