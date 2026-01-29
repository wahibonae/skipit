// Clerk configuration
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Set to true for local development, false for production
const IS_DEVELOPMENT = import.meta.env.VITE_IS_DEVELOPMENT === "true";

// Sync host for Clerk authentication (syncs session from web app)
export const SYNC_HOST = IS_DEVELOPMENT
  ? "http://localhost:3000"
  : "https://getskipit.com";

// API configuration
export const API_BASE_URL = IS_DEVELOPMENT
  ? "http://localhost:3000/api"
  : "https://getskipit.com/api";
