// API Response Types

export interface SearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  media_type: "movie" | "tv";
  timestamp_count: number;
}

export interface SearchResponse {
  results: SearchResult[];
}

export type SkipCategory = "Nudity" | "Sex" | "Gore";

export interface Timestamp {
  id?: number; // skip group ID for voting
  start_time: number; // in seconds
  end_time: number; // in seconds
  type: SkipCategory;
  confidence?: number; // 0.0 to 1.0
  status?: "pending" | "verified" | "disputed" | "rejected"; // skip group status
  userContributed?: boolean; // true if current user submitted a timestamp in this group
  userVoted?: boolean; // true if current user already voted on this group
}

export interface UserPreferences {
  skip_nudity: boolean;
  skip_sex: boolean;
  skip_gore: boolean;
}

export interface Episode {
  id: number;
  episodeNumber: number;
  title: string;
  duration: number;
}

export interface Season {
  seasonNumber: number;
  episodeCount: number;
  episodes: Episode[];
}

export interface TVShowEpisodesResponse {
  tvId: number;
  numberOfSeasons: number;
  seasons: Season[];
  source: "database" | "tmdb";
}

// Extension Message Types

export interface SkipMessage {
  type: "ACTIVATE_SKIP";
  contentType: "movie" | "episode";
  contentId: number;
  contentTitle: string;
  timestamps: Timestamp[];
  seasonNumber?: number;
  episodeNumber?: number;
}

export interface StopSkipMessage {
  type: "STOP_SKIP";
  tabId?: number; // Optional: stop specific tab, otherwise stop current tab
}

export interface SkipStatusMessage {
  type: "GET_SKIP_STATUS";
  tabId?: number; // Optional: get status for specific tab
}

export interface SkipStatusResponse {
  isActive: boolean;
  contentTitle?: string;
  contentType?: "movie" | "episode";
  netflixVideoId?: string;
}

// Content script -> Background messages
export interface ContentReadyMessage {
  type: "CONTENT_READY";
  netflixVideoId: string;
  url: string;
}

export interface ContentPingMessage {
  type: "CONTENT_PING";
}

export interface ContentPingResponse {
  isSkipping: boolean;
  netflixVideoId: string | null;
}

export type ExtensionMessage =
  | SkipMessage
  | StopSkipMessage
  | SkipStatusMessage
  | ContentReadyMessage
  | ContentPingMessage;

// Per-Tab Skip State (stored in background script memory)
export interface TabSkipState {
  tabId: number;
  netflixVideoId: string; // Extracted from /watch/{id}
  isActive: boolean;
  contentType: "movie" | "episode";
  contentId: number;
  contentTitle: string;
  timestamps: Timestamp[];
  seasonNumber?: number;
  episodeNumber?: number;
  activatedAt: number;
}

// Legacy SkipState for backwards compatibility during migration
export interface SkipState {
  isActive: boolean;
  contentType?: "movie" | "episode";
  contentId?: number;
  contentTitle?: string;
  timestamps?: Timestamp[];
  seasonNumber?: number;
  episodeNumber?: number;
  activatedAt?: number;
}

// Netflix Metadata extracted from Netflix internal API
export interface NetflixMetadata {
  title: string;
  type: "movie" | "episode";
  seasonNumber: number | null;
  episodeNumber: number | null;
  episodeTitle: string | null;
  netflixId: string;
}

// Auto-detected content for Mark Scene overlay
export interface AutoDetectedContent {
  tmdbId: number;
  title: string;
  mediaType: "movie" | "tv";
  seasonNumber: number | null;
  episodeNumber: number | null;
}

// Timestamp counts by type for quick panel
export interface TimestampCounts {
  nudity: number;
  sex: number;
  gore: number;
  total: number;
}

// Quick Panel Message Types

export interface CheckAuthMessage {
  type: "CHECK_AUTH_STATUS";
}

export interface CheckAuthResponse {
  isAuthenticated: boolean;
  userId?: string;
  error?: string;
}

export interface MatchContentMessage {
  type: "MATCH_CONTENT";
  title: string;
  contentType: "movie" | "episode";
  seasonNumber?: number;
  episodeNumber?: number;
}

export interface MatchContentResponse {
  success: boolean;
  tmdbId?: number;
  contentTitle?: string;
  mediaType?: "movie" | "tv";
  counts?: TimestampCounts;
  error?: string;
}

export interface QuickSkipActivateMessage {
  type: "QUICK_SKIP_ACTIVATE";
  contentType: "movie" | "episode";
  tmdbId: number;
  contentTitle: string;
  preferences: {
    skipNudity: boolean;
    skipSex: boolean;
    skipGore: boolean;
  };
  seasonNumber?: number;
  episodeNumber?: number;
}

export interface QuickSkipActivateResponse {
  success: boolean;
  error?: string;
}

// Update ExtensionMessage union type
export type QuickPanelMessage =
  | CheckAuthMessage
  | MatchContentMessage
  | QuickSkipActivateMessage;

// Popup Auto-Detection Message Types

export interface GetDetectedContentMessage {
  type: "GET_DETECTED_CONTENT";
  tabId?: number;
}

export interface GetDetectedContentResponse {
  success: boolean;
  content?: AutoDetectedContent;
  metadata?: NetflixMetadata;
  error?: string;
}

// ============================================================================
// AUTH STATE MESSAGE TYPES (for FAB and Mark Scene button auth)
// ============================================================================

// Auth state update for FAB/Mark buttons (content -> injected via postMessage)
export interface AuthStateUpdateMessage {
  type: "SKIPIT_AUTH_STATE_UPDATE";
  data: {
    isAuthenticated: boolean;
  };
}

// Request to open auth popup (injected -> content via postMessage)
export interface OpenAuthPopupRequest {
  type: "SKIPIT_OPEN_AUTH_POPUP";
}

// Request auth check (injected -> content via postMessage)
export interface RequestAuthCheckMessage {
  type: "SKIPIT_REQUEST_AUTH_CHECK";
}

// Background message to open popup
export interface OpenAuthPopupMessage {
  type: "OPEN_AUTH_POPUP";
}

export interface OpenAuthPopupResponse {
  success: boolean;
  error?: string;
}

// ============================================================================
// SKIP VOTING MESSAGE TYPES
// ============================================================================

// Vote on a skip group (injected -> content -> background)
export interface SkipVoteMessage {
  type: "VOTE_SKIP";
  skipGroupId: number;
  voteType: 1 | -1; // 1 = upvote, -1 = downvote
}

export interface SkipVoteResponse {
  success: boolean;
  newConfidence?: number;
  newStatus?: string;
  error?: string;
}
