/**
 * Authentication management for background service worker
 * Uses Clerk's createClerkClient for token management
 */

import { createClerkClient } from "@clerk/chrome-extension/background";
import { CLERK_PUBLISHABLE_KEY, CLERK_SYNC_HOST } from "../../lib/config";

/**
 * Get a fresh Clerk token using createClerkClient
 * This automatically refreshes the token if needed
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const clerk = await createClerkClient({
      publishableKey: CLERK_PUBLISHABLE_KEY,
      syncHost: CLERK_SYNC_HOST,
    });

    if (!clerk.session) {
      return null;
    }

    const token = await clerk.session.getToken();

    return token;
  } catch (error) {
    console.error("[Background] Error getting auth token:", error);
    return null;
  }
}
