/**
 * Shared state for content script
 * Centralized state to avoid circular dependencies
 */

import type { NetflixMetadata } from "../../lib/types";
import { TimestampOverlay } from "../timestamp-overlay";
import { QuickPanel } from "../quick-panel";

export interface ContentState {
  netflixScriptInjected: boolean;
  isNetflixReady: boolean;
  isSkipping: boolean;
  currentNetflixVideoId: string | null;
  currentContentTitle: string | null;
  lastNetflixMetadata: NetflixMetadata | null;
  timestampOverlay: TimestampOverlay | null;
  quickPanel: QuickPanel | null;
  authCheckInterval: ReturnType<typeof setInterval> | null;
  lastKnownAuthState: boolean;
}

export const state: ContentState = {
  netflixScriptInjected: false,
  isNetflixReady: false,
  isSkipping: false,
  currentNetflixVideoId: null,
  currentContentTitle: null,
  lastNetflixMetadata: null,
  timestampOverlay: null,
  quickPanel: null,
  authCheckInterval: null,
  lastKnownAuthState: false,
};
