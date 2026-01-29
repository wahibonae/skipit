/**
 * Authentication management for background service worker
 * Uses Clerk's createClerkClient for token management
 */

import { createClerkClient } from "@clerk/chrome-extension/background";
import { CLERK_PUBLISHABLE_KEY, SYNC_HOST } from "../../lib/config";

/**
 * Get a fresh Clerk token using createClerkClient
 * This automatically refreshes the token if needed
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    console.log("[Background] Getting fresh token via createClerkClient");

    const clerk = await createClerkClient({
      publishableKey: CLERK_PUBLISHABLE_KEY,
      syncHost: SYNC_HOST,
    });

    if (!clerk.session) {
      console.log("[Background] No active session");
      return null;
    }

    const token = await clerk.session.getToken();
    console.log("[Background] Got fresh token:", token ? "yes" : "no");

    return token;
  } catch (error) {
    console.error("[Background] Error getting auth token:", error);
    return null;
  }
}
