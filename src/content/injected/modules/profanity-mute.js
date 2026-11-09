// ============================================================================
// PROFANITY MUTE
// ============================================================================
//
// Mutes the audio for any subtitle line that contains a bad word, and stars the
// word out on screen (e.g. "f***").
//
// Source of truth is ONLY what Netflix renders into the page as the video plays
// (the timed-text DOM). We never fetch or read subtitle files ahead of time.
//
// - Subtitles ON (user's choice): we read the visible line and censor it in place.
// - Subtitles OFF: "silent subtitles" - we turn on a text track in the audio's
//   language and hide it, then read it the same way. Turning the feature off
//   restores "Off". If the user picks a subtitle track themselves, it's theirs:
//   we stop hiding and just read it.
//
// Granularity is the whole line: we mute from the moment the line appears until
// it goes away. When subtitles are silent, that line is shown (starred) while
// it's muted, so the user still gets the context of what was said.

// Word lists, keyed by BCP-47 primary language. "word*" matches the word plus
// any trailing letters (fuck* -> fucking, fucker). Matching is whole-word,
// case-insensitive and Unicode-aware, so "ass" never matches "assassin".
// Each match mutes a whole line, so a word with a common innocent meaning is
// left out: missing a word is better than muting ordinary dialogue.
//
// Adding a language: add a key named after its primary language code ("ar",
// "nl", ...); nothing else needs changing. The list applies whenever the
// subtitles being read are in that language. Have a native speaker review it
// first, and put phrases that must never mute in PROFANITY_EXCEPTIONS below.
// Check it in the Netflix console with
// window.skipitProfanityMute.test("some line", "ar").
const PROFANITY_WORDS = {
  en: [
    "fuck*", "motherfuck*", "fck*", "shit*", "bullshit*", "horseshit*",
    "bitch*", "bastard*", "asshole*", "ass", "arse", "arsehole*", "dumbass*",
    "jackass*", "dick", "dicks", "dickhead*", "cock", "cocks", "cocksuck*",
    "cunt*", "pussy", "pussies", "twat*", "wank*", "whore*", "slut*", "damn",
    "damned", "damnit", "dammit", "goddamn*", "god damn*", "bollocks", "piss",
    "pissed", "cum", "fag", "fags", "faggot*", "nigga*", "nigger*", "retard",
    "retarded", "hell", "crap", "prick", "pricks", "douche*", "tits",
    "blowjob*", "handjob*", "jizz*", "bugger*", "spic", "spics", "kike", "kikes", "wetback*", "tranny", "trannies",
  ],
  // The lists below are conservative and not reviewed by native speakers.
  es: [
    "puta*", "puto*", "mierda*", "joder", "jodido*", "jodida*", "jódete",
    "jodete", "coño", "cabrón", "cabron", "cabrones", "cabrona*", "pendej*",
    "gilipoll*", "chinga*", "verga*", "culero*", "hijueputa*", "carajo",
    "cojones", "cojón", "cojon", "culo", "culos", "follar", "follando",
    "follado", "follada", "cagar", "cago", "cagada", "cagado", "pinche",
    "pinches", "mamada", "mamadas", "pelotudo*", "pelotuda*", "maricón",
    "maricon", "maricones", "marica", "maricas", "joto", "jotos", "sudaca",
    "sudacas", "negrata*",
  ],
  fr: [
    "putain*", "merde*", "merdique*", "emmerd*", "connard*", "connasse*",
    "connerie*", "salope*", "salaud", "salauds", "enculé*", "encule*", "pute*",
    "niquer", "nique", "niqué", "niquée", "ta gueule", "bordel", "chier",
    "chiant", "chiante", "chiants", "chiantes", "foutre", "foutu", "foutue",
    "foutus", "foutues", "bite", "bites", "couille", "couilles", "couillon*",
    "trou du cul", "trou de cul", "enfoiré*", "enfoire*", "bâtard*", "batard*",
    "pétasse*", "petasse*", "pouffiasse*", "branleur*", "branlette*", "branler",
    "pédé", "pédés", "pede", "pedes", "gouine", "gouines", "tarlouze*",
    "négro", "négros", "negro", "negros", "bougnoule*", "bicot*", "youpin*",
  ],
  de: [
    "scheiße*", "scheisse*", "scheiß*", "scheiss*", "fick*", "verfickt*",
    "arsch*", "ärsche", "arschloch*", "hurensohn*", "hure", "huren", "fotze*",
    "wichser*", "wichsen", "schlampe*", "verdammt*", "gottverdammt*", "kacke",
    "kacken", "mistkerl*", "miststück*", "drecksau", "dreckskerl*",
    "drecksack*", "titten", "möse", "moese", "pimmel", "missgeburt*",
    "schwuchtel*", "kanake", "kanaken", "neger", "spast", "spasti", "spasten",
    "itaker", "polacke", "polacken", "tunte", "tunten",
  ],
  pt: [
    "porra*", "caralho*", "merda*", "foda*", "fodase", "fodasse", "foder",
    "fodido*", "fodida*", "fodendo", "puta*", "cacete", "buceta*", "piroca*",
    "xoxota*", "cu", "cuzão", "cuzao", "cabrão", "cabrao", "cabrões", "vadia",
    "vadias", "viado*", "sapatão", "sapatao", "paneleiro*",
  ],
  it: [
    "cazzo*", "cazzat*", "cazzon*", "incazzat*", "sticazzi", "merda*",
    "stronz*", "vaffanculo*", "fanculo*", "puttana*", "mignotta*", "zoccola*",
    "minchia*", "coglion*", "rompicoglion*", "bastard*", "fott*", "cagata",
    "cagate", "frocio", "froci", "ricchion*", "negro", "terrone",
    "terroni",
  ],
};

// Spans that look like a match but are not swearing (titles, names, phrases).
// A match inside one of these is left alone. Same rules as the lists above,
// except "." is literal and every space matches any whitespace.
const PROFANITY_EXCEPTIONS = {
  en: [
    "cum laude", "Moby Dick", "Moby-Dick", "Hell's Kitchen", "Hell’s Kitchen", "spic and span", "Philip K. Dick", "Philip K Dick", "Dick Tracy",
    "Dick Van Dyke",
  ],
};

// Netflix's rendered subtitle container. Kept as a list so a Netflix markup
// change only needs a selector added here.
const TIMEDTEXT_SELECTORS = [".player-timedtext"];

const PROFANITY_CHECK_INTERVAL = 500;

// How the silent track is hidden. opacity (not display:none) so Netflix keeps
// rendering cues into the DOM. Kept as one rule so it's easy to swap.
const PROFANITY_HIDE_CSS = "opacity: 0 !important;";
const PROFANITY_TRACK_RETRY_MS = 5000;
const PROFANITY_REVEAL_CLASS = "skipit-pm-reveal-line"; // Show a muted line while subs are silent
const PROFANITY_RESTORE_ATTEMPTS = 15; // ~15s for Netflix to load tracks on page load
const PROFANITY_TRACK_MAX_RETRIES = 2; // Re-sets per video if the silent track never shows up
// A marker older than this is ignored: by then the track may be one the user
// chose themselves (e.g. on another device), which we must never hide
const PROFANITY_MARKER_MAX_AGE_MS = 60 * 60 * 1000;
// After giving up on the silent track, it still counts as ours if Netflix
// turns it on this late (unless the user picks a track in the menu first)
const PROFANITY_LATE_TRACK_MS = 2 * 60 * 1000;

const profanityRegexCache = {};
const profanityExceptionCache = {};

function profanityLangKey(bcp47) {
  return (bcp47 || "").toLowerCase().split("-")[0];
}

/** One whole-word, case-insensitive regex for a list of words and phrases. */
function compileWordList(words) {
  const alternatives = [...words]
    // Longest first so "motherfuck*" wins over "fuck*" inside the alternation
    .sort((a, b) => b.length - a.length)
    .map((word) =>
      word
        .replace(/[.*+?^${}()|[\]\\]/g, (c) => (c === "*" ? "*" : "\\" + c))
        .replace(/\*$/, "[\\p{L}\\p{M}]*")
        .replace(/ /g, "\\s+")
    );
  return new RegExp(
    `(?<![\\p{L}\\p{M}\\p{N}])(?:${alternatives.join("|")})(?![\\p{L}\\p{M}\\p{N}])`,
    "giu"
  );
}

/**
 * Build (and cache) the matcher for a subtitle language. Returns null for a
 * language without a list: combining every list would star ordinary words
 * ("fick*" matches "fickle").
 */
function getProfanityRegex(bcp47) {
  const key = profanityLangKey(bcp47);
  if (!PROFANITY_WORDS[key]) return null;
  if (!profanityRegexCache[key]) {
    profanityRegexCache[key] = compileWordList(PROFANITY_WORDS[key]);
  }
  return profanityRegexCache[key];
}

/** The exceptions matcher for a language, or null if it has none. */
function getProfanityExceptionRegex(bcp47) {
  const key = profanityLangKey(bcp47);
  if (!PROFANITY_EXCEPTIONS[key]) return null;
  if (!profanityExceptionCache[key]) {
    profanityExceptionCache[key] = compileWordList(PROFANITY_EXCEPTIONS[key]);
  }
  return profanityExceptionCache[key];
}

/**
 * Star every bad word in a piece of text, skipping matches inside an
 * exception span. Returns the new text, or null if nothing was starred.
 */
function censorText(text, regex, exceptionRegex) {
  regex.lastIndex = 0;
  if (!regex.test(text)) return null;

  const spans = [];
  if (exceptionRegex) {
    for (const m of text.matchAll(exceptionRegex)) {
      spans.push([m.index, m.index + m[0].length]);
    }
  }

  let changed = false;
  regex.lastIndex = 0;
  const result = text.replace(regex, (match, offset) => {
    const end = offset + match.length;
    if (spans.some(([s, e]) => offset < e && end > s)) return match;
    changed = true;
    return censorWord(match);
  });
  return changed ? result : null;
}

/**
 * Keep the first letter, star the rest: "fucking" -> "f******"
 */
function censorWord(word) {
  let seenFirst = false;
  return word.replace(/[\p{L}\p{M}]/gu, (c) => {
    if (!seenFirst) {
      seenFirst = true;
      return c;
    }
    return "*";
  });
}

function profanityLog(...args) {
  try {
    if (localStorage.getItem("skipit_pm_debug") === "1") {
      console.log("[Skipit Mute]", ...args);
    }
  } catch (e) {
    // localStorage can throw in some privacy modes - logging is optional
  }
}

// ----------------------------------------------------------------------------
// Netflix player access
// ----------------------------------------------------------------------------

function getProfanityPlayer() {
  try {
    if (!isNetflixPlayerReady()) return null;
    const videoPlayer =
      window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const sessionId = videoPlayer.getAllPlayerSessionIds()[0];
    return sessionId ? videoPlayer.getVideoPlayerBySessionId(sessionId) : null;
  } catch (error) {
    return null;
  }
}

function callPlayer(player, method, ...args) {
  try {
    if (player && typeof player[method] === "function") {
      return player[method](...args);
    }
  } catch (error) {
    profanityLog(`player.${method} failed:`, error);
  }
  return undefined;
}

/**
 * Identify a track by language + name rather than trackId: the getter may
 * return a different object (or id field) than the one we passed to the setter.
 */
function textTrackKey(track) {
  return track ? `${track.bcp47 || ""}|${track.displayName || ""}` : null;
}

function isOffTextTrack(track) {
  return (
    !track ||
    track.isNoneTrack === true ||
    track.trackId === "none" ||
    /^(off|none)$/i.test(track.displayName || "")
  );
}

function isImageTextTrack(track) {
  return (
    track.isImageBased === true ||
    /image/i.test(String(track.rawTrackType || track.trackType || ""))
  );
}

function isForcedTextTrack(track) {
  return track.isForcedNarrative === true || track.isForced === true;
}

/**
 * Pick a readable text track in the audio's language (exact match first, then
 * same primary language). Returns null if none - a mismatched language
 * wouldn't line up with what's being said.
 */
function pickSilentTextTrack(player) {
  const tracks = callPlayer(player, "getTimedTextTrackList") || [];
  const audioLang = (callPlayer(player, "getAudioTrack")?.bcp47 || "").toLowerCase();
  // No word list for this language: a hidden track would do nothing
  if (!audioLang || !getProfanityRegex(audioLang)) return null;

  const readable = tracks.filter(
    (t) => !isOffTextTrack(t) && !isImageTextTrack(t) && !isForcedTextTrack(t)
  );
  const primary = audioLang.split("-")[0];
  const sameLang = readable.filter(
    (t) => (t.bcp47 || "").toLowerCase().split("-")[0] === primary
  );
  const exact = sameLang.filter((t) => (t.bcp47 || "").toLowerCase() === audioLang);
  // Closed captions are closer to verbatim than subtitles, which condense
  // speech and sometimes drop swear words
  const isCC = (t) =>
    /closed|sdh/i.test(String(t.rawTrackType || "")) ||
    /\b(CC|SDH)\b/.test(t.displayName || "");
  return (
    exact.find(isCC) || exact[0] || sameLang.find(isCC) || sameLang[0] || null
  );
}

/**
 * The only place we change the user's subtitle track. Always logged (it should
 * happen about once per video) so a reset loop is easy to spot.
 */
function setTextTrack(player, track, reason) {
  profanityTrackSetCount++;
  console.log(
    `[Skipit Mute] setTimedTextTrack #${profanityTrackSetCount} -> ` +
      `${track.displayName || track.bcp47} (${reason})`
  );
  callPlayer(player, "setTimedTextTrack", track);
}

// The marker is per tab: localStorage is shared by every Netflix tab, and
// another tab's marker could match a track the user chose here. The tab id
// lives in sessionStorage, which survives this tab's reloads. Chrome copies
// sessionStorage into duplicated tabs, so each marker also records the page
// (document) that wrote it: a live marker under our tab id from another page
// means we're a copy, and we take a new id (unless this page is a reload or a
// discarded tab coming back: then it's our own crashed page). On pagehide or
// freeze the marker is marked closed; a closed, fresh marker is picked up by
// the next /watch/ page (this tab reloaded, or a new tab), so a silent track
// left on is still recognised.
const profanityDocId = Math.random().toString(36).slice(2, 10);
let profanityTabId = null;

function newProfanityTabId() {
  profanityTabId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  try {
    sessionStorage.setItem(PROFANITY_TAB_ID_KEY, profanityTabId);
  } catch (e) {
    // No sessionStorage: the marker only lasts this page
  }
  return profanityTabId;
}

function getProfanityTabId() {
  if (profanityTabId) return profanityTabId;
  try {
    profanityTabId = sessionStorage.getItem(PROFANITY_TAB_ID_KEY);
  } catch (e) {
    // Falls through to a fresh id
  }
  return profanityTabId || newProfanityTabId();
}

function ownedTrackMarkerStorageKey() {
  return `${PROFANITY_OWNED_TRACK_KEY}:${getProfanityTabId()}`;
}

/** A stored marker, or null if missing, unreadable or too old to trust. */
function readMarkerAt(name) {
  try {
    const marker = JSON.parse(localStorage.getItem(name) || "null");
    if (!marker?.key || !(Date.now() - marker.at < PROFANITY_MARKER_MAX_AGE_MS)) return null;
    return marker;
  } catch (e) {
    return null;
  }
}

// How this page was opened, read once at load. A reload (including after a
// crash) or a discarded tab coming back is still this tab.
const profanitySameTabReload = (() => {
  try {
    if (document.wasDiscarded === true) return true;
    return performance.getEntriesByType("navigation")[0]?.type === "reload";
  } catch (e) {
    return false;
  }
})();

/**
 * Another open page (a duplicated tab) holds our tab id: take a new one. A
 * live marker from another page after a reload or discard is our own (the
 * page crashed or was discarded without pagehide), so it is kept.
 */
function ensureOwnTabId({ claiming = false } = {}) {
  const marker = readMarkerAt(ownedTrackMarkerStorageKey());
  if (!marker || marker.closed || marker.doc === profanityDocId) return;
  // Only when claiming at load: on later writes, another page's live marker
  // under our id always means a second tab, never our own crashed page
  if (claiming && profanitySameTabReload) return;
  newProfanityTabId();
}

function listMarkerNames() {
  const prefix = `${PROFANITY_OWNED_TRACK_KEY}:`;
  const names = [];
  for (let i = 0; i < localStorage.length; i++) {
    const name = localStorage.key(i);
    if (name === PROFANITY_OWNED_TRACK_KEY || name?.startsWith(prefix)) names.push(name);
  }
  return names;
}

/**
 * The marker this page would claim: our tab's own, or else the newest closed
 * one another page left (the legacy shared marker counts as closed). Other
 * tabs' live markers are left alone. Read-only.
 */
function findClaimableMarker(names, ownName) {
  let best = null;
  for (const name of names) {
    const marker = readMarkerAt(name);
    if (!marker) continue;
    const closed = marker.closed || name === PROFANITY_OWNED_TRACK_KEY;
    if (name === ownName) return { name, marker };
    if (closed && !(best && best.marker.at >= marker.at)) best = { name, marker };
  }
  return best;
}

/** True if this page has a marker, or could claim one on a /watch/ page. */
function hasClaimableMarker() {
  if (readOwnedTrackMarker()) return true;
  try {
    return !!findClaimableMarker(listMarkerNames(), ownedTrackMarkerStorageKey());
  } catch (e) {
    return false;
  }
}

/**
 * Once per page, on the first /watch/ tick (a /browse page never claims, so
 * the marker waits for the tab that plays the video). Expired markers are
 * dropped.
 */
let profanityMarkerClaimed = false;
function claimOwnedTrackMarker() {
  if (profanityMarkerClaimed) return;
  profanityMarkerClaimed = true;
  try {
    ensureOwnTabId({ claiming: true });
    const ownName = ownedTrackMarkerStorageKey();
    const names = listMarkerNames();
    const live = names.filter((name) => {
      if (readMarkerAt(name)) return true;
      localStorage.removeItem(name);
      return false;
    });
    const best = findClaimableMarker(live, ownName);
    if (best) {
      localStorage.removeItem(best.name);
      localStorage.setItem(
        ownName,
        JSON.stringify({ key: best.marker.key, at: best.marker.at, doc: profanityDocId })
      );
    }
  } catch (e) {
    // Best-effort
  }
}

/** This page's marker, or null if missing or too old to trust. */
function readOwnedTrackMarker() {
  const marker = readMarkerAt(ownedTrackMarkerStorageKey());
  return marker?.doc === profanityDocId ? marker : null;
}

function writeOwnedTrackMarker(key) {
  try {
    ensureOwnTabId();
    if (key) {
      localStorage.setItem(
        ownedTrackMarkerStorageKey(),
        JSON.stringify({ key, at: Date.now(), doc: profanityDocId })
      );
    } else if (readOwnedTrackMarker()) {
      localStorage.removeItem(ownedTrackMarkerStorageKey());
    }
  } catch (e) {
    // Marker is best-effort (used only to recognise our track after a reload)
  }
}

/** pagehide: let the next page (reload or new tab) pick up our marker. */
function setOwnedTrackMarkerClosed(closed) {
  const marker = readOwnedTrackMarker();
  if (!marker || !!marker.closed === closed) return;
  try {
    localStorage.setItem(ownedTrackMarkerStorageKey(), JSON.stringify({ ...marker, closed }));
  } catch (e) {
    // Best-effort
  }
}

/**
 * Keep the marker's age current while the track is ours, so a long session
 * (next episode, reload) still recognises it. Throttled: called every tick.
 */
function refreshOwnedTrackMarker() {
  if (profanityOwnedTrackKey === null) return;
  const marker = readOwnedTrackMarker();
  if (marker?.key === profanityOwnedTrackKey && Date.now() - marker.at < 5 * 60 * 1000) {
    return;
  }
  writeOwnedTrackMarker(profanityOwnedTrackKey);
}

function setSubtitlesHidden(hidden) {
  const root = document.documentElement;
  if (root.classList.contains(PROFANITY_HIDE_CLASS) !== hidden) {
    root.classList.toggle(PROFANITY_HIDE_CLASS, hidden);
  }
}

function injectProfanityStyles() {
  if (document.getElementById("skipit-pm-styles")) return;
  const style = document.createElement("style");
  style.id = "skipit-pm-styles";
  style.textContent =
    TIMEDTEXT_SELECTORS.map(
      (selector) =>
        `.${PROFANITY_HIDE_CLASS} ${selector} { ${PROFANITY_HIDE_CSS} }\n` +
        `.${PROFANITY_HIDE_CLASS}.${PROFANITY_REVEAL_CLASS} ${selector} { opacity: 1 !important; }`
    ).join("\n") + PROFANITY_MENU_CSS;
  document.head.appendChild(style);
}

// ----------------------------------------------------------------------------
// Silent subtitles (subtitles off -> hidden track)
// ----------------------------------------------------------------------------

// True once the getter has reported our track since we set it. Until then we
// never re-set it: the getter can lag behind the setter, and re-setting makes
// Netflix reload the track (a likely cause of late lines).
let profanityOwnedTrackConfirmed = false;

function enableSilentTrack(player, reason) {
  const track = pickSilentTextTrack(player);
  if (!track) {
    profanityNextTrackAttemptAt = Date.now() + PROFANITY_TRACK_RETRY_MS;
    profanityLog("No readable text track in the audio language");
    return;
  }

  // Hide first so the track never flashes on screen
  setSubtitlesHidden(true);
  setTextTrack(player, track, reason);
  profanityOwnedTrackKey = textTrackKey(track);
  profanityOwnedTrackConfirmed = false;
  profanityTrackSetAt = Date.now();
  writeOwnedTrackMarker(profanityOwnedTrackKey);
}

/**
 * Put the user's "subtitles off" choice back if the current track is ours.
 * Returns false if Netflix hasn't loaded its tracks yet (caller retries).
 */
function restoreOffTrack(player, { keepMarker = false } = {}) {
  const marker = readOwnedTrackMarker();
  // A silent track we gave up on counts too: Netflix may have applied it late
  const ownedKey =
    profanityOwnedTrackKey || marker?.key || getLateTrackKey() || null;
  const current = callPlayer(player, "getTimedTextTrack");
  if (!current && ownedKey) return false;
  const currentKey = textTrackKey(current);

  // Our set hasn't landed yet (getter lags): wait for it, or Netflix turns the
  // track on after we've let go and it shows up as the user's (caller retries)
  if (
    profanityOwnedTrackKey !== null &&
    !profanityOwnedTrackConfirmed &&
    currentKey !== profanityOwnedTrackKey &&
    Date.now() - profanityTrackSetAt < PROFANITY_TRACK_RETRY_MS
  ) {
    return false;
  }

  // The track we were switching away from (new audio language) is ours too
  const isOurs =
    currentKey === ownedKey ||
    currentKey === getLateTrackKey() ||
    (profanityPendingFrom !== null && currentKey === profanityPendingFrom.key);
  if (current && !isOffTextTrack(current) && isOurs) {
    const offTrack = (callPlayer(player, "getTimedTextTrackList") || []).find(
      isOffTextTrack
    );
    // No Off entry (yet): retry rather than reveal the silent track
    if (!offTrack) return false;
    setTextTrack(player, offTrack, "restore Off");
  }

  profanityOwnedTrackKey = null;
  profanityOwnedTrackConfirmed = false;
  profanityGaveUpTrack = null;
  profanityPendingFrom = null;
  if (!keepMarker) writeOwnedTrackMarker(null);
  setSubtitlesHidden(false);
  syncSubtitleMenu();
  return true;
}

/** Key of the silent track we gave up on for this video, while it may still turn up. */
function getLateTrackKey() {
  const record = profanityGaveUpTrack;
  if (!record || record.videoId !== profanityVideoId) return null;
  if (!(Date.now() - record.at < PROFANITY_LATE_TRACK_MS)) return null;
  return record.key;
}

/** Treat the current track as our silent one: hide it and keep "Off" ticked. */
function adoptOwnedTrack(key, reason) {
  profanityOwnedTrackKey = key;
  profanityOwnedTrackConfirmed = true;
  profanityGaveUpTrack = null;
  writeOwnedTrackMarker(key);
  setSubtitlesHidden(true);
  syncSubtitleMenu();
  profanityLog("Silent track adopted:", reason);
}

/**
 * The audio language changed (e.g. a dub) while our silent track is on: pick
 * one in the new language, or put "Off" back if there is none. Only for our
 * own track, and once per language per video so a lagging getter can't loop.
 */
function followAudioLanguage(player, current) {
  const audioLang = profanityLangKey(callPlayer(player, "getAudioTrack")?.bcp47);
  if (!audioLang || audioLang === profanityLangKey(current.bcp47)) return;
  if (audioLang === profanityAudioRepickLang) return;

  const fromKey = profanityOwnedTrackKey;
  if (pickSilentTextTrack(player)) {
    profanityAudioRepickLang = audioLang;
    profanityPendingFrom = { key: fromKey, at: Date.now() };
    enableSilentTrack(player, "audio language changed");
  } else if (restoreOffTrack(player)) {
    // No word list or no track for the new language
    profanityAudioRepickLang = audioLang;
    profanityPendingFrom = { key: fromKey, at: Date.now() };
    setSubtitlesHidden(true); // Until Netflix has really switched it off
  }
}

/**
 * Decide who owns the current subtitle track and keep silent subtitles alive.
 * When the user has their own track on, this never hides or changes anything.
 */
function manageTextTrack(player) {
  const current = callPlayer(player, "getTimedTextTrack");
  // undefined: API not available. null: Netflix still loading tracks - don't
  // guess, or we could override a choice the user made.
  if (!current) return;
  const currentKey = textTrackKey(current);

  // We just asked Netflix to switch away from our track (new audio language)
  // and the getter still reports it: wait, hidden. If it never changes,
  // Netflix ignored the set and the track is still ours.
  if (profanityPendingFrom) {
    if (currentKey === profanityPendingFrom.key) {
      if (Date.now() - profanityPendingFrom.at < PROFANITY_TRACK_RETRY_MS) {
        setSubtitlesHidden(true);
        return;
      }
      profanityPendingFrom = null;
      const repickedKey = profanityOwnedTrackKey;
      adoptOwnedTrack(currentKey, "Netflix kept the previous track");
      // Netflix may still apply the re-pick late: then it's ours, not the user's
      if (repickedKey && repickedKey !== currentKey) {
        profanityGaveUpTrack = { videoId: profanityVideoId, key: repickedKey, at: Date.now() };
      }
      return;
    }
    profanityPendingFrom = null;
  }

  if (profanityOwnedTrackKey !== null) {
    if (currentKey === profanityOwnedTrackKey) {
      profanityOwnedTrackConfirmed = true;
      refreshOwnedTrackMarker();
      followAudioLanguage(player, current);
      return;
    }
    if (isOffTextTrack(current)) {
      // Off after we saw our track = the user picked "Off" from the menu:
      // keep muting with a fresh silent track. Off before we ever saw it =
      // the getter is lagging behind our set: wait, don't re-set - unless
      // it's been long enough that Netflix most likely ignored the set.
      if (profanityOwnedTrackConfirmed) {
        enableSilentTrack(player, "user picked Off");
      } else if (Date.now() - profanityTrackSetAt >= PROFANITY_TRACK_RETRY_MS) {
        if (profanityTrackRetries < PROFANITY_TRACK_MAX_RETRIES) {
          profanityTrackRetries++;
          enableSilentTrack(player, "silent track never confirmed");
        } else {
          // Give up for this video. Stay hidden: the user had subtitles off, so
          // if the track did turn on after all, they still shouldn't see it.
          profanityLog("Silent track never confirmed - giving up for this video");
          // Netflix may still apply it late: then it's ours, not the user's
          profanityGaveUpTrack = {
            videoId: profanityVideoId,
            key: profanityOwnedTrackKey,
            at: Date.now(),
          };
          profanityOwnedTrackKey = null;
          writeOwnedTrackMarker(null);
          syncSubtitleMenu();
          profanityNextTrackAttemptAt = Infinity;
        }
      }
      return;
    }
    // A re-pick we gave up on, applied late by Netflix: still ours
    if (currentKey === getLateTrackKey()) {
      adoptOwnedTrack(currentKey, "re-picked track turned on late");
      return;
    }
    // A different real track: the user picked a language. It's theirs - show it.
    releaseSilentTrack("user selected another language");
    return;
  }

  if (isOffTextTrack(current)) {
    if (Date.now() >= profanityNextTrackAttemptAt) enableSilentTrack(player, "subtitles off");
    return;
  }

  // A track is on and we don't own it. After a reload or episode change it may
  // still be the one we turned on earlier: recognise it by the marker.
  const marker = readOwnedTrackMarker();
  if (marker && textTrackKey(current) === marker.key) {
    profanityOwnedTrackKey = marker.key;
    profanityOwnedTrackConfirmed = true;
    setSubtitlesHidden(true);
    return;
  }

  // The silent track we gave up on, applied late by Netflix: still ours
  if (currentKey === getLateTrackKey()) {
    adoptOwnedTrack(currentKey, "silent track turned on late");
    return;
  }

  // User's own visible subtitles
  setSubtitlesHidden(false);
}

// ----------------------------------------------------------------------------
// Subtitle menu: keep "Off" ticked while subtitles are silent
// ----------------------------------------------------------------------------
//
// Netflix's menu ticks the track that's really on (our silent one). While we
// own it, we make "Off" look selected instead, without restructuring Netflix's
// (React) DOM: we only swap the two labels' classes and draw the tick with CSS.
// Clicks behave as if "Off" were really selected: clicking "Off" does nothing,
// clicking the silent track's language shows those subtitles. A small
// "Skipit muting" badge next to "Off" tells the user why muting still works.

const SUBTITLE_MENU_SELECTOR = '[data-uia="selector-audio-subtitle"]';
const SUBTITLE_ITEM_SELECTOR = 'li[data-uia^="subtitle-item-"]';
const SUBTITLE_SELECTED_PREFIX = "subtitle-item-selected-";
const PM_MENU_ATTR = "data-skipit-pm"; // "off" (shown ticked) | "real" (shown unticked) | "silent" (Off not found, left as is)
const PM_CLASS_ATTR = "data-skipit-pm-class"; // label's original class, for undo
const CHECK_ICON_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="m21.3 4.3 1.4 1.4-14 14a1 1 0 0 1-1.4 0l-7-7 1.4-1.4L8 17.58z"/></svg>'
  );

const PM_CHECK_STYLE_ID = "skipit-pm-check-style";
// Layout properties copied from Netflix's real tick so ours sits in exactly
// the same spot (Netflix positions it out of the text flow).
const CHECK_LAYOUT_PROPS = [
  "position", "top", "right", "bottom", "left", "transform", "float",
  "display", "vertical-align", "width", "height", "margin",
];

let profanityMenuObserver = null;

const PROFANITY_MENU_CSS = `
li[${PM_MENU_ATTR}="real"] svg { display: none !important; }
li[${PM_MENU_ATTR}="off"] > div::before {
  content: "";
  width: 24px;
  height: 24px;
  background-color: currentColor;
  -webkit-mask: url("${CHECK_ICON_SVG}") center / contain no-repeat;
  mask: url("${CHECK_ICON_SVG}") center / contain no-repeat;
}
li[${PM_MENU_ATTR}="off"] > div > div::after {
  content: "Skipit muting";
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  vertical-align: middle;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.92);
}`;

/**
 * Copy the real tick's computed layout into our pseudo-element's rule. Only
 * read while Netflix's tick is visible (before we hide it).
 */
function captureCheckLayout(check) {
  const cs = getComputedStyle(check);
  const rules = CHECK_LAYOUT_PROPS.map(
    (prop) => `${prop}: ${cs.getPropertyValue(prop)};`
  ).join(" ");
  let style = document.getElementById(PM_CHECK_STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = PM_CHECK_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `li[${PM_MENU_ATTR}="off"] > div::before { ${rules} }`;
}

/** The label element inside a menu item (the div holding its text). */
function getMenuItemLabel(li) {
  const wrapper = li.firstElementChild;
  if (!wrapper) return null;
  return [...wrapper.children].find((el) => el.tagName !== "svg") || null;
}

function findOffMenuItem(items) {
  const offName = (
    (callPlayer(getProfanityPlayer(), "getTimedTextTrackList") || []).find(isOffTextTrack)
      ?.displayName || "Off"
  ).trim();
  return (
    items.find((li) => li.textContent.trim() === offName) ||
    items.find((li) => li.getAttribute("data-uia") === "subtitle-item-Off") ||
    null
  );
}

/**
 * Make the open menu show "Off" as selected. Idempotent: React may re-render
 * the menu and reset classes, so this re-runs on every DOM change.
 */
function patchSubtitleMenu() {
  const menu = document.querySelector(SUBTITLE_MENU_SELECTOR);
  if (!menu) return;
  const items = [...menu.querySelectorAll(SUBTITLE_ITEM_SELECTOR)];
  const real = items.find((li) =>
    (li.getAttribute("data-uia") || "").startsWith(SUBTITLE_SELECTED_PREFIX)
  );
  if (!real) return;
  const firstPatch = real.getAttribute(PM_MENU_ATTR) !== "real";
  // Marked before looking for "Off": even if Off can't be found (other UI
  // languages), clicking the silent track's language still reveals it. Its
  // tick stays visible until "Off" is found and can take it.
  if (firstPatch) real.setAttribute(PM_MENU_ATTR, "silent");
  const off = findOffMenuItem(items);
  if (!off || real === off) return;

  const realLabel = getMenuItemLabel(real);
  const offLabel = getMenuItemLabel(off);
  if (!realLabel || !offLabel) return;

  // Already patched and React hasn't reset it
  if (
    real.getAttribute(PM_MENU_ATTR) === "real" &&
    off.getAttribute(PM_MENU_ATTR) === "off" &&
    offLabel.className === realLabel.getAttribute(PM_CLASS_ATTR)
  ) {
    return;
  }

  const selectedClass = realLabel.getAttribute(PM_CLASS_ATTR) || realLabel.className;
  const normalClass = offLabel.getAttribute(PM_CLASS_ATTR) || offLabel.className;

  // Draw our tick exactly where Netflix draws its own
  const check = real.querySelector("svg");
  if (check && firstPatch) captureCheckLayout(check);

  realLabel.setAttribute(PM_CLASS_ATTR, selectedClass);
  offLabel.setAttribute(PM_CLASS_ATTR, normalClass);
  realLabel.className = normalClass;
  offLabel.className = selectedClass;
  real.setAttribute(PM_MENU_ATTR, "real");
  off.setAttribute(PM_MENU_ATTR, "off");
}

/** Undo the patch (we no longer own the track, or the feature is off). */
function unpatchSubtitleMenu() {
  document.querySelectorAll(`li[${PM_MENU_ATTR}]`).forEach((li) => {
    const label = getMenuItemLabel(li);
    if (label && label.hasAttribute(PM_CLASS_ATTR)) {
      label.className = label.getAttribute(PM_CLASS_ATTR);
      label.removeAttribute(PM_CLASS_ATTR);
    }
    li.removeAttribute(PM_MENU_ATTR);
  });
}

function syncSubtitleMenu() {
  if (profanityMuteEnabled && profanityOwnedTrackKey !== null) {
    patchSubtitleMenu();
  } else if (document.querySelector(`li[${PM_MENU_ATTR}]`)) {
    unpatchSubtitleMenu();
  }
}

/**
 * Clicks (and Enter/Space) on the patched items, handled before Netflix sees them.
 */
function handleSubtitleMenuActivate(event) {
  if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
  const li = event.target?.closest?.(`li[${PM_MENU_ATTR}]`);
  if (!li) {
    // The user picked a track in the menu: whatever turns on now is theirs,
    // even if it's the silent track we gave up on or are switching away from
    if (event.target?.closest?.(SUBTITLE_ITEM_SELECTOR)) {
      profanityGaveUpTrack = null;
      profanityPendingFrom = null;
    }
    return;
  }

  if (li.getAttribute(PM_MENU_ATTR) === "off") {
    // "Off" looks selected: selecting it again is a no-op, like Netflix's own
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  profanityGaveUpTrack = null;
  profanityPendingFrom = null;

  // The silent track's language: the user wants to see these subtitles.
  // Netflix treats it as already selected, so we just stop hiding it.
  releaseSilentTrack("user selected the silent track's language");
}

/**
 * The user took over the current track: stop hiding it and forget it's ours.
 */
function releaseSilentTrack(reason) {
  profanityOwnedTrackKey = null;
  profanityOwnedTrackConfirmed = false;
  writeOwnedTrackMarker(null);
  setSubtitlesHidden(false);
  syncSubtitleMenu();
  profanityLog("Released silent track:", reason);
}

function startSubtitleMenuWatcher() {
  if (!profanityMenuObserver) {
    // Runs before paint, so the real tick never flashes when the menu opens
    profanityMenuObserver = new MutationObserver(syncSubtitleMenu);
  }
  profanityMenuObserver.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", handleSubtitleMenuActivate, true);
  document.addEventListener("keydown", handleSubtitleMenuActivate, true);
}

function stopSubtitleMenuWatcher() {
  if (profanityMenuObserver) profanityMenuObserver.disconnect();
  document.removeEventListener("click", handleSubtitleMenuActivate, true);
  document.removeEventListener("keydown", handleSubtitleMenuActivate, true);
  unpatchSubtitleMenu();
}

// ----------------------------------------------------------------------------
// Reading lines, censoring and muting
// ----------------------------------------------------------------------------

function findTimedTextContainer() {
  for (const selector of TIMEDTEXT_SELECTORS) {
    const el = document.querySelector(selector);
    if (el) return el;
  }
  return null;
}

/**
 * Star out bad words in the rendered line. Marks each edited element with the
 * text we wrote so we can tell when Netflix replaces the line.
 * Returns true if the current line contains (or contained) a bad word.
 */
function censorContainer(container, regex, exceptionRegex) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const edited = new Set();
  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue;
    if (!text) continue;
    const censored = censorText(text, regex, exceptionRegex);
    if (censored === null) continue;
    node.nodeValue = censored;
    if (node.parentElement) edited.add(node.parentElement);
  }
  edited.forEach((el) => {
    el.setAttribute("data-skipit-censored", el.textContent);
  });

  // Is a line we censored still on screen? (Netflix may reuse the element and
  // swap its text, so compare against what we wrote.)
  let lineActive = false;
  container.querySelectorAll("[data-skipit-censored]").forEach((el) => {
    if (el.textContent === el.getAttribute("data-skipit-censored")) {
      lineActive = true;
    } else {
      el.removeAttribute("data-skipit-censored");
    }
  });
  return lineActive;
}

/**
 * The user unmuted or touched the volume during a muted line: they want to
 * hear it, like in any player. Play the rest of this line (hands off until it
 * ends). Our own mute's event is ignored: still muted, same volume (with a
 * small tolerance in case the player re-applies its volume with rounding).
 */
function handleVolumeChangeDuringLine(event) {
  if (!profanityMutedByUs) return;
  const video = event.target;
  const sameVolume = Math.abs(video.volume - profanityVolumeAtMute) < 0.01;
  if (video.muted === true && sameVolume) return;
  profanityUserTookOver = true;
  if (video.muted) video.muted = false;
}

/**
 * Netflix's own mute state, for diagnostics only (status()). Not used to
 * decide anything: it can lag the <video> element or read another player
 * session, so trusting it could leave the sound off.
 */
function isMutedInNetflix() {
  const player = getProfanityPlayer();
  const muted = callPlayer(player, "isMuted") ?? callPlayer(player, "getMuted");
  return typeof muted === "boolean" ? muted : undefined;
}

function muteForLine() {
  if (profanityMutedByUs || profanityUserTookOver) return;
  const video = document.querySelector("video");
  // Never touch a video the user already muted
  if (!video || video.muted) return;
  profanityVolumeAtMute = video.volume; // Read before muting
  video.muted = true;
  video.addEventListener("volumechange", handleVolumeChangeDuringLine);
  profanityMutedByUs = true;
  profanityMutedVideo = video;
}

/** The line is over: unmute (unless the user took over) and reset for the next one. */
function unmuteAfterLine() {
  if (profanityMutedVideo) {
    profanityMutedVideo.removeEventListener("volumechange", handleVolumeChangeDuringLine);
  }
  // Only what we muted. A detached element is unmuted too: harmless, and
  // Netflix may re-attach the same element.
  if (profanityMutedByUs && !profanityUserTookOver && profanityMutedVideo) {
    profanityMutedVideo.muted = false;
  }
  profanityMutedByUs = false;
  profanityMutedVideo = null;
  profanityUserTookOver = false;
}

function scanSubtitles() {
  if (!profanityMuteEnabled) return;
  const container = profanityObservedContainer || findTimedTextContainer();
  if (!container) {
    unmuteAfterLine();
    return;
  }

  // The getter can briefly return nothing: keep using this video's last
  // known language rather than guessing
  const track = callPlayer(getProfanityPlayer(), "getTimedTextTrack");
  if (track?.bcp47) profanityLineLang = track.bcp47;
  const regex = getProfanityRegex(profanityLineLang);
  if (!regex) {
    document.documentElement.classList.remove(PROFANITY_REVEAL_CLASS);
    unmuteAfterLine();
    return;
  }

  // Disconnect while editing so our own text changes don't re-trigger us
  if (profanityObserver) profanityObserver.disconnect();
  const lineActive = censorContainer(
    container,
    regex,
    getProfanityExceptionRegex(profanityLineLang)
  );
  if (profanityObserver && profanityObservedContainer) {
    observeContainer(profanityObservedContainer);
  }

  // Silent subtitles: show the starred line so the user keeps the context
  document.documentElement.classList.toggle(
    PROFANITY_REVEAL_CLASS,
    lineActive && profanityOwnedTrackKey !== null
  );

  if (lineActive) {
    muteForLine();
  } else {
    unmuteAfterLine();
  }
}

function observeContainer(container) {
  profanityObserver.observe(container, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

/**
 * Attach the observer to Netflix's current subtitle container. Netflix can
 * recreate the player DOM (episode change, SPA navigation), so this is
 * re-checked on every tick.
 */
function ensureSubtitleObserver() {
  const container = findTimedTextContainer();
  if (container === profanityObservedContainer) return;

  if (!profanityObserver) {
    // MutationObserver callbacks run before the next paint, so the uncensored
    // word is never drawn and the mute lands on the frame the line appears.
    profanityObserver = new MutationObserver(scanSubtitles);
  }
  profanityObserver.disconnect();
  profanityObservedContainer = container;
  if (container) observeContainer(container);
  // Also with no container: a muted line whose container Netflix removed
  // would otherwise never be unmuted (scanSubtitles unmutes when it's gone)
  scanSubtitles();
}

/**
 * Off the /watch/ page (browse, billboard trailers, hover previews): touch
 * nothing, and undo anything left from the episode we just left.
 */
function leaveWatchPage() {
  if (profanityVideoId === null) return; // Already cleaned up
  if (profanityObserver) profanityObserver.disconnect();
  profanityObservedContainer = null;
  profanityVideoId = null;
  // Our silent track may still be the profile's choice: keep it hidden on
  // previews too (the marker re-adopts it on the next /watch/ page)
  if (profanityOwnedTrackKey === null) setSubtitlesHidden(false);
  profanityOwnedTrackKey = null;
  profanityOwnedTrackConfirmed = false;
  profanityPendingFrom = null;
  unmuteAfterLine();
  document.documentElement.classList.remove(PROFANITY_REVEAL_CLASS);
}

function profanityTick() {
  const videoId = getVideoIdFromUrl();
  if (!videoId) {
    leaveWatchPage();
    return;
  }
  claimOwnedTrackMarker();

  const player = getProfanityPlayer();
  if (!player) return;

  // New video: forget the old track (the marker re-adopts it if Netflix carried
  // our silent track over to the next episode). Subs stay hidden until we know
  // who owns the new track, so nothing flashes.
  if (videoId !== profanityVideoId) {
    profanityVideoId = videoId;
    profanityOwnedTrackKey = null;
    profanityOwnedTrackConfirmed = false;
    profanityNextTrackAttemptAt = 0;
    profanityTrackRetries = 0;
    profanityLineLang = null;
    profanityPendingFrom = null;
    profanityGaveUpTrack = null;
    profanityAudioRepickLang = null;
    unmuteAfterLine();
  }

  manageTextTrack(player);
  ensureSubtitleObserver();
}

// ----------------------------------------------------------------------------
// Lifecycle
// ----------------------------------------------------------------------------

function startProfanityMute() {
  if (profanityMuteEnabled) return;
  profanityMuteEnabled = true;
  injectProfanityStyles();
  startSubtitleMenuWatcher();
  profanityTick();
  profanityMuteInterval = setInterval(profanityTick, PROFANITY_CHECK_INTERVAL);
}

function stopProfanityMute() {
  const wasEnabled = profanityMuteEnabled;
  profanityMuteEnabled = false;

  if (profanityMuteInterval) {
    clearInterval(profanityMuteInterval);
    profanityMuteInterval = null;
  }
  if (profanityObserver) {
    profanityObserver.disconnect();
  }
  profanityObservedContainer = null;
  unmuteAfterLine();
  stopSubtitleMenuWatcher();
  document.documentElement.classList.remove(PROFANITY_REVEAL_CLASS);

  // Also runs on page load with the feature off, to clean up a silent track
  // left behind by a previous session (tab closed while it was on).
  if (wasEnabled || hasClaimableMarker()) {
    restoreOffTrackWhenReady(PROFANITY_RESTORE_ATTEMPTS);
  }
}

function restoreOffTrackWhenReady(attemptsLeft) {
  if (profanityMuteEnabled) return; // Re-enabled meanwhile - nothing to restore
  // Off /watch/ the player may be a trailer: wait (without using up attempts)
  // until the user opens a video. Ends once the marker expires.
  if (!getVideoIdFromUrl()) {
    if (hasClaimableMarker()) {
      setTimeout(() => restoreOffTrackWhenReady(attemptsLeft), 5000);
    }
    return;
  }
  claimOwnedTrackMarker();
  const player = getProfanityPlayer();
  if (player && restoreOffTrack(player)) return;
  if (attemptsLeft <= 0) {
    // Give up for now; the marker stays and the next load retries
    setSubtitlesHidden(false);
    return;
  }
  setTimeout(() => restoreOffTrackWhenReady(attemptsLeft - 1), 1000);
}

// ----------------------------------------------------------------------------
// Sign-in gate: muting runs only while signed in AND the setting is on
// ----------------------------------------------------------------------------
//
// The setting and the auth state reach the page in either order. Nothing
// happens until both are known: acting on one alone could start muting for a
// signed-out user, or restore "Off" and then turn the silent track straight
// back on. The first decision with muting inactive still runs the stop path,
// which cleans up a silent track left behind by a previous session.

function syncProfanityMuteActive() {
  if (profanityMuteSetting === null || profanityAuthKnown === null) return;
  const active = profanityMuteSetting && profanityAuthKnown;
  if (active === profanityActiveSynced) return;
  profanityActiveSynced = active;
  if (active) {
    startProfanityMute();
  } else {
    stopProfanityMute();
  }
}

/** The stored setting (and whether the tip was ever shown), from the content script. */
function setProfanityMuteSetting(enabled, tipSeen) {
  profanityMuteSetting = enabled === true;
  // Never goes back to false: the "shown" write may not have echoed back yet
  if (tipSeen === true) profanityTipSeen = true;
  else if (tipSeen === false && profanityTipSeen === null) profanityTipSeen = false;
  syncProfanityMuteActive();
  updateProfanityControls();
}

/** Auth state changed (signing out stops muting; the setting itself is kept). */
function setProfanityMuteAuth(authenticated) {
  profanityAuthKnown = authenticated === true;
  syncProfanityMuteActive();
  updateProfanityControls();
}

/** Turn the setting on/off from the page. The content script saves it. */
function requestProfanityMute(enabled) {
  profanityMuteSetting = enabled;
  syncProfanityMuteActive();
  updateProfanityControls();
  window.postMessage(
    { type: "SKIPIT_SET_PROFANITY_MUTE_REQUEST", data: { enabled } },
    "*"
  );
}

// ----------------------------------------------------------------------------
// On/off switch: a button in Netflix's control bar (left of Audio & Subtitles),
// or a small square beside the Skipit FAB when that can't be placed. Plus the
// first-time tip.
// ----------------------------------------------------------------------------
//
// Netflix's control bar is React-rendered and mounts/unmounts as the controls
// show and hide. We never move or modify Netflix's elements: we insert our own
// slot (fresh elements copying only Netflix's classNames, for size and
// spacing) before the Audio & Subtitles slot, and put it back whenever it goes
// missing. Every node we insert carries PM_UI_ATTR so duplicates can't build up.

// Netflix's markup. Kept as lists so a Netflix change only needs a selector here.
const PM_AUDIO_CONTROL_SELECTORS = ['button[data-uia="control-audio-subtitle"]'];
const PM_TIMELINE_SELECTORS = ['[data-uia="timeline"]'];
const PM_PLAYER_CONTAINER_SELECTORS = [".watch-video", '[data-uia="player"]', ".nf-player-container"];
const PM_ANY_CONTROL_SELECTOR = 'button[data-uia^="control-"]'; // Any Netflix bar button (finds the row)

const PM_UI_ATTR = "data-skipit-pm-ui";
const PROFANITY_CONTROL_ID = "skipit-pm-control";
const PROFANITY_CONTROL_SLOT_ID = "skipit-pm-control-slot";
const PM_ROW_SEARCH_DEPTH = 6;
const PM_UI_THROTTLE_MS = 100;
const PM_UI_TICK_MS = 1000;
const SVG_NS = "http://www.w3.org/2000/svg";

const PROFANITY_TIP_DELAY_MS = 1500; // Let the player settle before the tip
const PROFANITY_TIP_DURATION_MS = 10000;
const PROFANITY_TIP_WIDTH = 240;
const PROFANITY_UI_FONT = "Netflix Sans, Helvetica Neue, Segoe UI, Roboto, sans-serif";

let profanityUiObserver = null;
let profanityUiObserved = null; // Container the observer is attached to
let profanityUiLastRun = 0;
let profanityUiSyncCount = 0; // Diagnostics: full switch UI syncs
// Spacer element -> its computed flex-grow, so the spacer check doesn't call
// getComputedStyle on every DOM change
const profanitySpacerGrow = new WeakMap();
let profanityUiTimer = null;
let profanityUiMode = "none"; // "control-bar" | "fallback" | "none"
let profanityUiLastLog = null;
let profanityTimelineFound = false;
let profanityAudioControlFound = false;
let profanityIconSeq = 0; // Unique mask ids
let profanityTipAnchor = null; // "control-bar" | "fallback" while the tip is open
let profanityTipArmed = false; // Delay done: show as soon as a switch is on screen
let profanityTipScheduled = false;

// Locked look of the fallback square mirrors .skipit-fab.locked in player.css
const PROFANITY_CHIP_CSS = `
.skipit-fab-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}
.skipit-pm-chip {
  position: relative;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: rgba(26, 26, 26, 0.85);
  color: #ffffff;
  cursor: pointer;
  font-family: ${PROFANITY_UI_FONT};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.2s ease, opacity 0.2s ease;
}
.skipit-pm-chip.shown { display: flex; }
.skipit-pm-chip:hover { background: rgba(26, 26, 26, 0.95); }
.skipit-pm-chip:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; }
.skipit-pm-chip.style-netflix { background: rgba(255, 255, 255, 0.92); color: #141414; }
.skipit-pm-chip.style-netflix:hover { background: #ffffff; }
.skipit-pm-chip.style-netflix:focus-visible { outline-color: #141414; }
.skipit-pm-chip .skipit-pm-icon { width: 24px; height: 24px; }
/* Filled bubble is dark on the Netflix-style square: its asterisks go white */
.skipit-pm-chip.style-netflix .skipit-pm-icon-stars.on { stroke: #ffffff; }
.skipit-pm-chip-lock {
  display: none;
  position: absolute;
  top: 4px;
  left: 4px;
  width: 10px;
  height: 10px;
  align-items: center;
  justify-content: center;
}
.skipit-pm-chip-lock svg { width: 10px; height: 10px; }
/* Dim the square, not its hover label */
.skipit-pm-chip.locked { cursor: not-allowed; }
.skipit-pm-chip.locked > :not(.skipit-pm-label) { opacity: 0.6; }
.skipit-pm-chip.locked .skipit-pm-icon-bubble { opacity: 1; } /* One dim, like the FAB */
.skipit-pm-chip.locked { background: rgba(26, 26, 26, 0.5); }
.skipit-pm-chip.style-netflix.locked { background: rgba(255, 255, 255, 0.55); }
.skipit-pm-chip.locked:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); }
.skipit-pm-chip.locked .skipit-pm-chip-lock { display: flex; }

/* Button in Netflix's control bar: size and hover come from Netflix's classes */
.skipit-pm-control-slot { position: relative; }
.skipit-pm-control { cursor: pointer; }
.skipit-pm-control:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; border-radius: 4px; }
.skipit-pm-control .skipit-pm-icon { display: block; }
.skipit-pm-control.locked .skipit-pm-icon-bubble,
.skipit-pm-control.locked .skipit-pm-icon-stars { opacity: 0.5; }

.skipit-pm-icon { display: block; overflow: visible; }

/* Hover label, like Netflix's own */
.skipit-pm-label {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border-radius: 4px;
  background: #ffffff;
  color: #000000;
  font-family: ${PROFANITY_UI_FONT};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;
  z-index: 10;
}
.skipit-pm-label-arrows { display: block; width: 13px; height: 9px; flex: none; }
.skipit-pm-control-slot:hover > .skipit-pm-label,
.skipit-pm-control-slot:has(.skipit-pm-control:focus-visible) > .skipit-pm-label,
.skipit-pm-chip:hover > .skipit-pm-label,
.skipit-pm-chip:focus-visible > .skipit-pm-label { opacity: 1; }
/* The tip already explains it */
.skipit-fab-row:has(> .skipit-pm-tip) .skipit-pm-label { opacity: 0; }

/* Keep the buttons on screen while the tip is open on the fallback square */
#${WRAPPER_ID}.${PROFANITY_TIP_OPEN_CLASS} {
  opacity: 1 !important;
  pointer-events: auto !important;
}
.skipit-pm-tip {
  --skipit-pm-arrow-left: 14px; /* Arrow tip at the square's centre (20px) */
  position: absolute;
  bottom: calc(100% + 12px);
  left: 0;
  width: ${PROFANITY_TIP_WIDTH}px;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 10px;
  background: #ffffff;
  color: #141414;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  font-family: ${PROFANITY_UI_FONT};
  text-align: left;
  z-index: 10;
}
.skipit-pm-tip.anchor-control-bar { z-index: 2147483647; } /* Above the Skipit wrapper */
.skipit-pm-tip.no-anchor::after { display: none; }
.skipit-pm-tip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: var(--skipit-pm-arrow-left);
  border: 6px solid transparent;
  border-top-color: #ffffff;
}
.skipit-pm-tip-title { margin: 0 0 4px; font-size: 14px; font-weight: 700; }
.skipit-pm-tip-text { margin: 0 0 10px; font-size: 13px; line-height: 1.35; color: #333333; }
.skipit-pm-tip-actions { display: flex; justify-content: flex-end; gap: 8px; }
.skipit-pm-tip-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.skipit-pm-tip-on { background: #ff6f4f; color: #ffffff; }
.skipit-pm-tip-later { background: transparent; color: #141414; }
`;

/** Switch and tip styles. Separate from the muting styles: the switch exists even when muting is off. */
function injectProfanityChipStyles() {
  if (document.getElementById("skipit-pm-chip-styles")) return;
  const style = document.createElement("style");
  style.id = "skipit-pm-chip-styles";
  style.textContent = PROFANITY_CHIP_CSS;
  document.head.appendChild(style);
}

function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, String(value));
  return el;
}

// The user's icon design (560x480 artboard): speech bubble, three asterisks,
// and Skipit's logo arrow twice in coral, cut into the bubble's bottom right.
const PM_ICON_ARROW_PATH =
  "M690.122925,113.959564 C690.122925,99.003281 690.072632,84.083466 690.155273,69.164406 C690.178345,64.999840 691.417236,61.195747 695.577271,59.311436 C699.982483,57.316048 704.245422,57.411785 708.152649,60.775867 C709.900635,62.280853 712.007874,63.365635 713.775452,64.851234 C726.949036,75.923134 740.062439,87.066544 753.229492,98.146217 C758.167969,102.301781 763.087769,106.492668 768.212646,110.410393 C776.354675,116.634583 776.714600,124.662666 768.851440,131.250198 C748.868164,147.991684 728.842468,164.682571 708.865906,181.432007 C705.030151,184.648087 700.753906,185.336685 696.303528,183.455399 C691.873352,181.582687 690.050354,177.893738 690.082153,173.043015 C690.179138,158.259232 690.117310,143.474411 690.117310,127.989815 Z";
const PM_ICON_BUBBLE_PATH =
  "M100 15 H450 A90 90 0 0 1 540 105 V285 A90 90 0 0 1 450 375 H210 L118 458 Q80 488 80 445 V372.7 A90 90 0 0 1 10 285 V105 A90 90 0 0 1 100 15 Z";
const PM_ICON_ARROW_COLOR = "#FE7050";
const PM_ICON_STAR_X = [160, 282, 405];
// Line weights matched to Netflix's 24px icons, whose outlines are 2 units
// wide: 1 icon unit = 560 / 24 ≈ 23.3 artboard units
const PM_ICON_OUTLINE_WIDTH = 49; // 2 units after the bubble's 0.95 scale
const PM_ICON_STAR_WIDTH = 30; // ~1.3 units: 2 would blur three stars together
const PM_ICON_ARROW_GAP = 30;

/** One Skipit arrow pair, as in the logo (second copy 83.2 units to the left). */
function appendLogoArrows(parent, attrs = {}) {
  const g = svgEl("g", attrs);
  g.appendChild(svgEl("path", { d: PM_ICON_ARROW_PATH, transform: "translate(-83.2 0)" }));
  g.appendChild(svgEl("path", { d: PM_ICON_ARROW_PATH }));
  parent.appendChild(g);
  return g;
}

/**
 * Off: outlined bubble with white asterisks. On: filled bubble with dark
 * asterisks. The coral arrows are the same in both. White parts use
 * currentColor so the Netflix-style square (dark icon on white) still works.
 * `svgAttrs` lets the control-bar button copy Netflix's icon class and size.
 */
function createProfanityIcon(on, svgAttrs = {}) {
  const maskId = `skipit-pm-mask-${++profanityIconSeq}`;
  const svg = svgEl("svg", {
    // Square box around the 560x480 artboard, like Netflix's 24x24 icons
    viewBox: "0 -40 560 560",
    width: 24,
    height: 24,
    "aria-hidden": "true",
    focusable: "false",
    ...svgAttrs,
  });
  svg.setAttribute("class", `${svgAttrs.class ? svgAttrs.class + " " : ""}skipit-pm-icon`);
  // Arrows 20% bigger than the original artwork, grown from their bottom-right
  // corner (537.3, 459.9) and moved 30 units down. The gap stroke sits inside
  // this transform, so it grows with them.
  const arrowsTransform =
    "translate(0 30) translate(537.3 459.9) scale(1.2) translate(-537.3 -459.9) translate(-371.4 243.1) scale(1.17)";

  // Gap around the arrows, cut out of the bubble
  const mask = svgEl("mask", { id: maskId, maskUnits: "userSpaceOnUse", x: 0, y: -40, width: 560, height: 560 });
  mask.appendChild(svgEl("rect", { x: 0, y: -40, width: 560, height: 560, fill: "#fff" }));
  appendLogoArrows(mask, {
    transform: arrowsTransform,
    fill: "#000",
    stroke: "#000",
    "stroke-width": PM_ICON_ARROW_GAP,
    "stroke-linejoin": "round",
  });
  const defs = svgEl("defs", {});
  defs.appendChild(mask);
  svg.appendChild(defs);

  const bubble = svgEl("g", { class: "skipit-pm-icon-bubble", mask: `url(#${maskId})` });
  // Both states draw the same stroked outline, so their outer edges match
  // exactly; the "on" bubble is also filled in
  bubble.appendChild(
    svgEl("path", {
      d: PM_ICON_BUBBLE_PATH,
      transform: "translate(280 240) scale(0.95) translate(-280 -240)",
      fill: on ? "currentColor" : "none",
      stroke: "currentColor",
      "stroke-width": PM_ICON_OUTLINE_WIDTH,
      "stroke-linejoin": "round",
    })
  );
  svg.appendChild(bubble);

  const stars = svgEl("g", {
    class: `skipit-pm-icon-stars${on ? " on" : ""}`,
    stroke: on ? "#000000" : "currentColor",
    "stroke-width": PM_ICON_STAR_WIDTH,
    "stroke-linecap": "round",
    fill: "none",
  });
  for (const x of PM_ICON_STAR_X) {
    const star = svgEl("g", { transform: `translate(${x} 188)` });
    star.appendChild(svgEl("line", { x1: 0, y1: -44, x2: 0, y2: 44 }));
    star.appendChild(svgEl("line", { x1: -38, y1: -22, x2: 38, y2: 22 }));
    star.appendChild(svgEl("line", { x1: -38, y1: 22, x2: 38, y2: -22 }));
    stars.appendChild(star);
  }
  svg.appendChild(stars);

  appendLogoArrows(svg, { transform: arrowsTransform, fill: PM_ICON_ARROW_COLOR });
  return svg;
}

/** Hover label: "Skipit ⏩ Mute swearing: On", with the arrows drawn, not an emoji. */
function fillProfanityLabel(label, locked, on) {
  label.replaceChildren();
  if (locked) {
    label.textContent = "Sign in to Skipit to mute swearing";
    return;
  }
  const brand = document.createElement("span");
  brand.textContent = "Skipit";
  const arrows = svgEl("svg", { viewBox: "603 55 177 133", class: "skipit-pm-label-arrows", "aria-hidden": "true" });
  appendLogoArrows(arrows, { fill: PM_ICON_ARROW_COLOR });
  const state = document.createElement("span");
  state.textContent = `Mute swearing: ${on ? "On" : "Off"}`;
  label.append(brand, arrows, state);
}

function createProfanityLabel() {
  const label = document.createElement("span");
  label.className = "skipit-pm-label";
  label.setAttribute("aria-hidden", "true");
  return label;
}

function getProfanitySwitchState() {
  const locked = !isAuthenticated;
  return { locked, on: !locked && profanityMuteSetting === true };
}

/** Shared by both switches: accessibility attributes and classes. */
function applySwitchAria(button, locked, on) {
  button.classList.toggle("locked", locked);
  button.classList.toggle("on", on);
  button.classList.toggle("off", !on);
  if (locked) {
    button.removeAttribute("role");
    button.removeAttribute("aria-checked");
    button.setAttribute("aria-label", "Sign in to Skipit to mute swearing");
  } else {
    button.setAttribute("role", "switch");
    button.setAttribute("aria-checked", String(on));
    button.setAttribute("aria-label", "Skipit: Mute swearing");
  }
}

function handleProfanitySwitchClick(event) {
  // Keep the click from reaching Netflix (it would pause or seek)
  event.preventDefault();
  event.stopPropagation();
  // After a mouse click, give Space back to Netflix (play/pause)
  if (event.detail > 0) event.currentTarget.blur?.();
  dismissProfanityTip();

  if (!isAuthenticated) {
    window.postMessage({ type: "SKIPIT_OPEN_AUTH_POPUP" }, "*");
    return;
  }
  requestProfanityMute(profanityMuteSetting !== true);
}

/** Enter/Space activate our button; Netflix's shortcuts must not see them. */
function handleProfanitySwitchKey(event) {
  if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
    event.stopPropagation();
  }
}

function wireProfanitySwitch(button) {
  // Hover look comes from Netflix's classes: refresh them as the pointer moves
  button.addEventListener("mouseenter", () => syncProfanityControls());
  button.addEventListener("mouseleave", () => syncProfanityControls());
  button.addEventListener("click", handleProfanitySwitchClick);
  button.addEventListener("keydown", handleProfanitySwitchKey);
  button.addEventListener("keyup", handleProfanitySwitchKey);
}

// --- Fallback square beside the FAB -----------------------------------------

/**
 * The fallback square, built with its current state. Called by
 * injectSkipitButtons; the wrapper is rebuilt whenever Netflix drops it, so
 * everything is read from state here. Hidden unless the fallback is in use.
 */
function createProfanityChip() {
  injectProfanityChipStyles();
  const chip = document.createElement("button");
  chip.id = PROFANITY_CHIP_ID;
  chip.type = "button";
  chip.className = "skipit-pm-chip";

  const lock = document.createElement("span");
  lock.className = "skipit-pm-chip-lock";
  lock.appendChild(createLockIconSVG());
  chip.appendChild(lock);
  chip.appendChild(createProfanityLabel());

  wireProfanitySwitch(chip);
  applyProfanityChipState(chip);
  chip.classList.toggle("shown", profanityUiMode === "fallback");
  return chip;
}

function applyProfanityChipState(chip) {
  const { locked, on } = getProfanitySwitchState();
  applySwitchAria(chip, locked, on);
  chip.classList.toggle("style-netflix", currentFabStyle === "netflix");
  chip.querySelector(".skipit-pm-icon")?.remove();
  chip.insertBefore(createProfanityIcon(on), chip.firstChild);
  const label = chip.querySelector(".skipit-pm-label");
  if (label) fillProfanityLabel(label, locked, on);
}

// --- Button in Netflix's control bar -----------------------------------------

function queryFirst(selectors, root = document) {
  for (const selector of selectors) {
    const el = root.querySelector(selector);
    if (el) return el;
  }
  return null;
}

function findProfanityPlayerContainer() {
  const found = queryFirst(PM_PLAYER_CONTAINER_SELECTORS);
  if (found) return found;
  const video = document.querySelector("video");
  return video?.parentElement?.parentElement?.parentElement || null;
}

/**
 * Netflix's row of control slots and the slot holding the audio button: the
 * lowest ancestor that also holds another Netflix control button.
 */
function findControlRow(audioButton) {
  let child = audioButton;
  for (let depth = 0; depth < PM_ROW_SEARCH_DEPTH && child.parentElement; depth++) {
    const parent = child.parentElement;
    const hasOtherControl = [...parent.children].some(
      (el) =>
        el !== child &&
        !el.hasAttribute(PM_UI_ATTR) &&
        (el.matches(PM_ANY_CONTROL_SELECTOR) || el.querySelector(PM_ANY_CONTROL_SELECTOR))
    );
    if (hasOtherControl) return { row: parent, slot: child };
    child = parent;
  }
  return null;
}

/** The fixed-width spacer Netflix puts between controls (never a flexible one). */
function findControlSpacer(slot) {
  // Skip over our own slot and spacer copy, to Netflix's element before theirs
  let prev = slot.previousElementSibling;
  while (prev && prev.hasAttribute(PM_UI_ATTR)) prev = prev.previousElementSibling;
  if (!prev) return null;
  if (prev.children.length > 0 || prev.textContent.trim() !== "") return null;
  let grow = profanitySpacerGrow.get(prev);
  if (grow === undefined) {
    grow = getComputedStyle(prev).flexGrow;
    profanitySpacerGrow.set(prev, grow);
  }
  if (grow !== "0") return null;
  return prev;
}

/** Netflix's elements from their slot down to the audio button's parent. */
function getSlotChain(slot, audioButton) {
  const chain = [];
  for (let el = audioButton.parentElement; el && el !== slot.parentElement; el = el.parentElement) {
    chain.unshift(el);
  }
  return chain; // chain[0] === slot
}

function getNetflixIconAttrs(audioButton) {
  const theirs = audioButton.querySelector("svg");
  const attrs = {};
  const cls = theirs?.getAttribute("class");
  if (cls) attrs.class = cls;
  let width = theirs?.getAttribute("width");
  let height = theirs?.getAttribute("height");
  if ((!width || !height) && theirs) {
    const rect = theirs.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      width = Math.round(rect.width);
      height = Math.round(rect.height);
    }
  }
  attrs.width = width || 24;
  attrs.height = height || 24;
  return attrs;
}

function removeProfanityControl() {
  const removed = document.querySelectorAll(`[${PM_UI_ATTR}]`);
  removed.forEach((el) => el.remove());
  return removed.length > 0;
}

function applyProfanityControlState(button) {
  const { locked, on } = getProfanitySwitchState();
  applySwitchAria(button, locked, on);
  const audioButton = queryFirst(PM_AUDIO_CONTROL_SELECTORS);
  const prevWrap = button.querySelector(".skipit-pm-icon-wrap");
  const prevWrapClass = prevWrap?.className;
  prevWrap?.remove();
  button.querySelector(".skipit-pm-icon")?.remove();
  const icon = createProfanityIcon(on, audioButton ? getNetflixIconAttrs(audioButton) : {});
  // Netflix sizes its icons through a wrapper div inside the button
  // (".control-medium"): mirror it, or our icon renders at the raw 24px
  const theirWrap = audioButton?.firstElementChild;
  if (theirWrap && theirWrap.tagName !== "svg" && theirWrap.querySelector("svg")) {
    const wrap = document.createElement("div");
    // Keep the classes syncControlClasses chose (idle look), not theirs live
    wrap.className = prevWrapClass || `${theirWrap.className} skipit-pm-icon-wrap`;
    wrap.setAttribute("role", "presentation");
    wrap.appendChild(icon);
    button.appendChild(wrap);
  } else {
    button.appendChild(icon);
  }
  const label = document.getElementById(PROFANITY_CONTROL_SLOT_ID)?.querySelector(".skipit-pm-label");
  if (label) fillProfanityLabel(label, locked, on);
}

/** Copy Netflix's current classNames (they change with player size). */
function mostCommon(values) {
  const counts = new Map();
  let best = null;
  let bestCount = 0;
  for (const value of values) {
    if (typeof value !== "string") continue;
    const count = (counts.get(value) || 0) + 1;
    counts.set(value, count);
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

/** Classes of one Netflix control: its slot chain, the button and the icon wrapper. */
function readControlClasses(chain, button) {
  const wrap = button.firstElementChild;
  return {
    chain: chain.map((el) => el.className),
    button: button.className,
    wrap: wrap && wrap.tagName !== "svg" ? wrap.className : null,
  };
}

let profanityHoverClasses = null; // A hovered Netflix control's classes, learned live

/**
 * Netflix swaps a control's classes while it's hovered or its menu is open.
 * Copying the Audio & Subtitles button's live classes made our icon grow
 * whenever theirs did, so we copy what most of the bar's controls share (the
 * idle look). A hovered Netflix control teaches us the hover look, which we
 * apply only while our own button is hovered.
 */
function getControlClasses(row, theirChain, audioButton, ourButton) {
  const controls = [];
  for (const button of row.querySelectorAll(PM_ANY_CONTROL_SELECTOR)) {
    if (button.closest(`[${PM_UI_ATTR}]`)) continue;
    let slot = button;
    while (slot.parentElement && slot.parentElement !== row) slot = slot.parentElement;
    if (slot.parentElement !== row) continue;
    const chain = getSlotChain(slot, button);
    if (chain.length !== theirChain.length) continue;
    controls.push({ button, classes: readControlClasses(chain, button) });
  }
  const fallback = readControlClasses(theirChain, audioButton);
  const idle = {
    chain: theirChain.map(
      (_, i) => mostCommon(controls.map((c) => c.classes.chain[i])) ?? fallback.chain[i]
    ),
    button: mostCommon(controls.map((c) => c.classes.button)) ?? fallback.button,
    wrap: mostCommon(controls.map((c) => c.classes.wrap)) ?? fallback.wrap,
  };

  // Need at least three controls for "most common" to mean idle
  if (controls.length >= 3) {
    const hovered = controls.find((c) => c.button.matches(":hover"));
    if (hovered && hovered.classes.button !== idle.button) profanityHoverClasses = hovered.classes;
  }
  if (profanityHoverClasses && ourButton?.matches(":hover")) return profanityHoverClasses;
  return idle;
}

/**
 * Netflix changes classes on hover without a DOM change we observe, so learn
 * the hover look when the pointer enters one of its controls.
 */
function learnNetflixHoverClasses(event) {
  const button = event.target?.closest?.(PM_ANY_CONTROL_SELECTOR);
  if (!button || button.closest(`[${PM_UI_ATTR}]`)) return;
  setTimeout(() => {
    if (!button.isConnected || !button.matches(":hover")) return;
    const others = [...document.querySelectorAll(PM_ANY_CONTROL_SELECTOR)].filter(
      (b) => b !== button && !b.closest(`[${PM_UI_ATTR}]`)
    );
    if (others.length < 2) return;
    if (button.className === mostCommon(others.map((b) => b.className))) return; // No class swap
    const found = findControlRow(button);
    if (!found) return;
    profanityHoverClasses = readControlClasses(getSlotChain(found.slot, button), button);
  }, 60);
}
document.addEventListener("mouseover", learnNetflixHoverClasses, true);

/** Apply Netflix's classes (idle, or hover while ours is hovered) to our nodes. */
function syncControlClasses(ourChain, theirChain, button, audioButton) {
  const row = ourChain[0].parentElement || findControlRow(audioButton)?.row;
  const classes = row
    ? getControlClasses(row, theirChain, audioButton, button)
    : readControlClasses(theirChain, audioButton);
  ourChain.forEach((el, i) => {
    const want = (classes.chain[i] ?? theirChain[i].className) + (i === 0 ? " skipit-pm-control-slot" : "");
    if (el.className !== want) el.className = want;
  });
  const ourWrap = button.querySelector(".skipit-pm-icon-wrap");
  if (ourWrap && classes.wrap) {
    const wantWrap = `${classes.wrap} skipit-pm-icon-wrap`;
    if (ourWrap.className !== wantWrap) ourWrap.className = wantWrap;
  }
  const wantButton = `${classes.button} skipit-pm-control`;
  // Keep our state classes
  const state = ["locked", "on", "off"].filter((c) => button.classList.contains(c));
  const full = [wantButton, ...state].join(" ");
  if (button.className !== full) button.className = full;
}

/** Our slot's wrapper chain, from the slot down to the button's parent. */
function getOurChain(ourSlot, button) {
  const ourChain = [ourSlot];
  for (let el = ourSlot.firstElementChild; el && el !== button; el = el.firstElementChild) {
    if (el.classList.contains("skipit-pm-label")) break;
    ourChain.push(el);
  }
  return ourChain;
}

/**
 * Put our button just before the Audio & Subtitles slot. Returns our button,
 * or null if it can't be placed. Idempotent: run on every DOM change.
 */
function ensureProfanityControl(audioButton) {
  const found = findControlRow(audioButton);
  if (!found) return null;
  const { row, slot } = found;
  const theirChain = getSlotChain(slot, audioButton);
  // Their button sits straight in the row with no slot around it: we can't
  // mirror that safely, so the fallback square is used instead
  if (theirChain.length === 0) return null;

  const theirSpacer = findControlSpacer(slot);
  // Netflix sometimes leaves two spacers in a row before Audio & Subtitles (an
  // empty slot for a control this title doesn't have). Sit between them instead
  // of adding a third, so the gaps on both sides match the rest of the bar.
  const doubleGap = theirSpacer && findControlSpacer(theirSpacer) ? theirSpacer : null;
  const spacer = doubleGap ? null : theirSpacer;
  const insertRef = doubleGap || slot;

  // Already in place?
  const ourSlot = document.getElementById(PROFANITY_CONTROL_SLOT_ID);
  const button = document.getElementById(PROFANITY_CONTROL_ID);
  if (ourSlot && button && ourSlot.parentElement === row) {
    const next = ourSlot.nextElementSibling;
    const placed = doubleGap
      ? next === doubleGap && !document.querySelector(`[${PM_UI_ATTR}="spacer"]`)
      : spacer
        ? next?.hasAttribute(PM_UI_ATTR) && next.nextElementSibling === slot
        : next === slot;
    if (placed) {
      const ourChain = getOurChain(ourSlot, button);
      if (ourChain.length === theirChain.length) {
        syncControlClasses(ourChain, theirChain, button, audioButton);
        return button;
      }
    }
  }

  // Missing or out of place: start clean so there's never more than one
  removeProfanityControl();

  const ourChain = theirChain.map(() => document.createElement("div"));
  ourChain[0].id = PROFANITY_CONTROL_SLOT_ID;
  ourChain[0].setAttribute(PM_UI_ATTR, "slot");
  for (let i = 1; i < ourChain.length; i++) ourChain[i - 1].appendChild(ourChain[i]);

  const newButton = document.createElement("button");
  newButton.type = "button";
  newButton.id = PROFANITY_CONTROL_ID;
  ourChain[ourChain.length - 1].appendChild(newButton);
  ourChain[0].appendChild(createProfanityLabel());
  syncControlClasses(ourChain, theirChain, newButton, audioButton);
  wireProfanitySwitch(newButton);

  row.insertBefore(ourChain[0], insertRef);
  if (spacer) {
    const spacerCopy = spacer.cloneNode(false);
    spacerCopy.removeAttribute("id");
    spacerCopy.removeAttribute("data-uia");
    spacerCopy.setAttribute(PM_UI_ATTR, "spacer");
    row.insertBefore(spacerCopy, slot);
  }
  applyProfanityControlState(newButton);
  profanityLog(
    "Control-bar switch inserted:",
    `chain depth ${theirChain.length},`,
    doubleGap ? "between Netflix's two spacers" : spacer ? "spacer copied" : "no spacer",
    { row, slot }
  );
  return newButton;
}

// --- Keeping it in place -------------------------------------------------------

function isOnScreen(el) {
  if (!el || !el.isConnected) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/** On screen and not hidden or covered (Netflix may fade its bar instead of removing it). */
function isVisibleOnTop(el) {
  if (!isOnScreen(el)) return false;
  const rect = el.getBoundingClientRect();
  const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  if (!hit || !el.contains(hit)) return false;
  for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.visibility === "hidden" || Number(style.opacity) < 0.5) return false;
  }
  return true;
}

function syncProfanityControls() {
  profanityUiLastRun = Date.now();
  profanityUiSyncCount++;
  try {
    syncProfanityControlsNow();
  } catch (error) {
    // A Netflix markup change must never break muting or spam errors
    profanityLog("Switch UI sync failed:", error);
  }
}

function syncProfanityControlsNow() {
  if (!getVideoIdFromUrl()) {
    leaveProfanityUi();
    return;
  }
  injectProfanityChipStyles();

  const audioButton = queryFirst(PM_AUDIO_CONTROL_SELECTORS);
  profanityAudioControlFound = !!audioButton;
  profanityTimelineFound = !!queryFirst(PM_TIMELINE_SELECTORS);

  let control = null;
  if (audioButton) {
    control = ensureProfanityControl(audioButton);
  } else if (removeProfanityControl()) {
    profanityLog("Audio & Subtitles control gone: removed our leftover button");
  }
  if (!control && document.getElementById(PROFANITY_CONTROL_SLOT_ID)) removeProfanityControl();

  profanityUiMode = control ? "control-bar" : profanityTimelineFound ? "fallback" : "none";

  // While the tip points at it, the square stays even if the controls hide
  const chip = document.getElementById(PROFANITY_CHIP_ID);
  if (chip) {
    chip.classList.toggle("shown", profanityUiMode === "fallback" || profanityTipAnchor === "fallback");
  }

  const logKey = `${profanityUiMode}|audio:${profanityAudioControlFound}|timeline:${profanityTimelineFound}`;
  if (logKey !== profanityUiLastLog) {
    profanityUiLastLog = logKey;
    profanityLog(
      "Switch UI:", profanityUiMode,
      "| Audio & Subtitles control:", profanityAudioControlFound ? "found" : "not found",
      "| timeline:", profanityTimelineFound ? "found" : "not found",
      audioButton && !control ? "| couldn't find the control row" : ""
    );
  }

  repositionProfanityTip();
  // Settings may have arrived on /browse: arm the tip again on a watch page
  maybeShowProfanityTip();
  tryShowProfanityTip();
}

/**
 * Subtitle cues change inside the player container many times a second and
 * never affect the control bar: skip batches made only of those.
 */
function isTimedTextOnlyBatch(records) {
  if (!records || records.length === 0) return false;
  const selector = TIMEDTEXT_SELECTORS.join(",");
  return records.every((record) => record.target?.closest?.(selector));
}

function scheduleProfanityUiSync(records) {
  if (isTimedTextOnlyBatch(records)) return;
  const wait = PM_UI_THROTTLE_MS - (Date.now() - profanityUiLastRun);
  // Netflix just mounted its bar and we're not in it yet: insert now, so the
  // bar never paints without us and its buttons don't jump
  const barNeedsUs =
    !document.getElementById(PROFANITY_CONTROL_SLOT_ID) && !!queryFirst(PM_AUDIO_CONTROL_SELECTORS);
  if (wait <= 0 || barNeedsUs) {
    // Leading edge, inside the observer callback: inserted before the next paint
    syncProfanityControls();
  } else if (!profanityUiTimer) {
    profanityUiTimer = setTimeout(() => {
      profanityUiTimer = null;
      syncProfanityControls();
    }, wait);
  }
}

/** (Re)attach the observer to the current player container. */
function watchProfanityUi() {
  const container = findProfanityPlayerContainer();
  if (!container || container === profanityUiObserved) return;
  if (!profanityUiObserver) profanityUiObserver = new MutationObserver(scheduleProfanityUiSync);
  profanityUiObserver.disconnect();
  profanityUiObserver.observe(container, { childList: true, subtree: true });
  profanityUiObserved = container;
  profanityLog("Watching player container for the control bar:", container);
}

/** Off the /watch/ page: stop watching and take our button out. */
function leaveProfanityUi() {
  if (profanityUiObserver && profanityUiObserved) {
    profanityUiObserver.disconnect();
    profanityLog("Left the watch page: stopped watching the control bar");
  }
  profanityUiObserved = null;
  clearTimeout(profanityUiTimer);
  profanityUiTimer = null;
  removeProfanityControl();
  if (profanityTipAnchor) dismissProfanityTip();
  profanityUiMode = "none";
}

function profanityUiTick() {
  if (getVideoIdFromUrl()) {
    // The container itself can be replaced (new episode, Netflix re-render)
    if (profanityUiObserved && !profanityUiObserved.isConnected) profanityUiObserved = null;
    watchProfanityUi();
    syncProfanityControls();
  } else {
    leaveProfanityUi();
  }
}

setInterval(profanityUiTick, PM_UI_TICK_MS);

/** Refresh both switches after a setting, auth or style change. */
function updateProfanityControls() {
  const chip = document.getElementById(PROFANITY_CHIP_ID);
  if (chip) applyProfanityChipState(chip);
  const control = document.getElementById(PROFANITY_CONTROL_ID);
  if (control) applyProfanityControlState(control);
  if (document.getElementById(PROFANITY_TIP_ID)) {
    // An open tip only goes on sign-out or when mute is turned on elsewhere
    // (not on the "seen" echo, which arrives right after it's shown)
    if (!isAuthenticated || profanityMuteSetting === true) dismissProfanityTip();
    return;
  }
  maybeShowProfanityTip();
}

// --- First-time tip -------------------------------------------------------------

/** Every value must be known: showing while one is still unknown could show it twice. */
function shouldOfferProfanityTip() {
  return (
    profanityAuthKnown === true &&
    isAuthenticated &&
    profanityMuteSetting === false &&
    profanityTipSeen === false &&
    // A background tab (e.g. middle-clicked title) would use up the one showing unseen
    document.visibilityState === "visible" &&
    !!getVideoIdFromUrl()
  );
}

function maybeShowProfanityTip() {
  if (profanityTipScheduled || profanityTipArmed || !shouldOfferProfanityTip()) return;
  if (document.getElementById(PROFANITY_TIP_ID)) return;
  profanityTipScheduled = true;
  setTimeout(() => {
    profanityTipScheduled = false;
    profanityTipArmed = true;
    tryShowProfanityTip();
  }, PROFANITY_TIP_DELAY_MS);
}

// Offer the tip when a background tab comes to the front
document.addEventListener("visibilitychange", () => {
  maybeShowProfanityTip();
  tryShowProfanityTip();
});

/** The switch on screen right now, if any. */
function findProfanityTipAnchor() {
  const control = document.getElementById(PROFANITY_CONTROL_ID);
  if (isVisibleOnTop(control)) return { kind: "control-bar", el: control };
  const chip = document.getElementById(PROFANITY_CHIP_ID);
  const wrapper = document.getElementById(WRAPPER_ID);
  if (chip && wrapper?.contains(chip) && chip.classList.contains("shown") && chip.parentElement) {
    return { kind: "fallback", el: chip };
  }
  return null;
}

function buildProfanityTip() {
  const tip = document.createElement("div");
  tip.id = PROFANITY_TIP_ID;
  tip.className = "skipit-pm-tip";
  tip.setAttribute("role", "dialog");
  tip.setAttribute("aria-label", "New: mute swearing");
  // Clicks inside the tip must not reach Netflix (pause)
  tip.addEventListener("click", (event) => event.stopPropagation());

  const title = document.createElement("p");
  title.className = "skipit-pm-tip-title";
  title.textContent = "New: mute swearing";

  const text = document.createElement("p");
  text.className = "skipit-pm-tip-text";
  text.textContent = "Mutes lines with swearing and stars the word.";

  const actions = document.createElement("div");
  actions.className = "skipit-pm-tip-actions";

  const later = document.createElement("button");
  later.type = "button";
  later.className = "skipit-pm-tip-later";
  later.textContent = "Not now";
  later.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dismissProfanityTip();
  });

  const turnOn = document.createElement("button");
  turnOn.type = "button";
  turnOn.className = "skipit-pm-tip-on";
  turnOn.textContent = "Turn on";
  turnOn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dismissProfanityTip();
    requestProfanityMute(true);
  });

  actions.appendChild(later);
  actions.appendChild(turnOn);
  tip.appendChild(title);
  tip.appendChild(text);
  tip.appendChild(actions);
  return tip;
}

/**
 * Above the control-bar button, but in the player container (outside
 * Netflix's bar, so a React re-render can't take it away).
 */
function placeTipAboveControl(tip, control) {
  const container =
    document.getElementById(WRAPPER_ID)?.parentElement || findProfanityPlayerContainer();
  if (!container) return false;
  if (getComputedStyle(container).position === "static") container.style.position = "relative";

  const box = container.getBoundingClientRect();
  const btn = control.getBoundingClientRect();
  const centre = btn.left + btn.width / 2 - box.left - container.clientLeft;
  const margin = 8;
  const maxLeft = Math.max(margin, container.clientWidth - PROFANITY_TIP_WIDTH - margin);
  const left = Math.min(Math.max(centre - PROFANITY_TIP_WIDTH / 2, margin), maxLeft);
  const arrowLeft = Math.min(Math.max(centre - left - 6, 10), PROFANITY_TIP_WIDTH - 22);

  tip.classList.add("anchor-control-bar");
  tip.classList.remove("no-anchor");
  tip.style.left = `${Math.round(left)}px`;
  tip.style.bottom = `${Math.round(box.bottom - container.clientTop - btn.top + 12)}px`;
  tip.style.setProperty("--skipit-pm-arrow-left", `${Math.round(arrowLeft)}px`);
  if (tip.parentElement !== container) container.appendChild(tip);
  return true;
}

/**
 * Keep a control-bar tip pointing at the button (resize, fullscreen). When
 * Netflix hides its bar the tip stays, without an arrow pointing at nothing.
 */
function repositionProfanityTip() {
  if (profanityTipAnchor !== "control-bar") return;
  const tip = document.getElementById(PROFANITY_TIP_ID);
  if (!tip) return;
  const control = document.getElementById(PROFANITY_CONTROL_ID);
  if (isOnScreen(control)) placeTipAboveControl(tip, control);
  else tip.classList.add("no-anchor");
}

/** Shows the tip once the delay is done and a switch is on screen. */
function tryShowProfanityTip() {
  if (!profanityTipArmed) return;
  if (document.getElementById(PROFANITY_TIP_ID) || !shouldOfferProfanityTip()) return;
  // Neither switch on screen yet: stay armed, the next DOM change retries
  const anchor = findProfanityTipAnchor();
  if (!anchor) return;

  const tip = buildProfanityTip();
  if (anchor.kind === "control-bar") {
    if (!placeTipAboveControl(tip, anchor.el)) return;
  } else {
    anchor.el.parentElement.appendChild(tip);
    document.getElementById(WRAPPER_ID)?.classList.add(PROFANITY_TIP_OPEN_CLASS);
  }
  profanityTipArmed = false;
  profanityTipAnchor = anchor.kind;
  profanityLog("Tip shown, anchored to:", anchor.kind);

  // Marked seen the moment it's shown, so a reload or closed tab can never
  // bring it back
  profanityTipSeen = true;
  window.postMessage({ type: "SKIPIT_PROFANITY_TIP_SHOWN" }, "*");
  profanityTipTimeout = setTimeout(dismissProfanityTip, PROFANITY_TIP_DURATION_MS);
}

function dismissProfanityTip() {
  clearTimeout(profanityTipTimeout);
  profanityTipTimeout = null;
  profanityTipAnchor = null;
  document.getElementById(PROFANITY_TIP_ID)?.remove();
  // Looked up again: Netflix may have rebuilt the wrapper while the tip was open
  document.getElementById(WRAPPER_ID)?.classList.remove(PROFANITY_TIP_OPEN_CLASS);
  const chip = document.getElementById(PROFANITY_CHIP_ID);
  if (chip) chip.classList.toggle("shown", profanityUiMode === "fallback");
}

// Diagnostics: run skipitProfanityMute.status() in the Netflix console
window.skipitProfanityMute = {
  status() {
    const player = getProfanityPlayer();
    const current = callPlayer(player, "getTimedTextTrack");
    return {
      enabled: profanityMuteEnabled,
      setting: profanityMuteSetting,
      signedIn: profanityAuthKnown,
      currentTrack: textTrackKey(current),
      silentTrack: profanityOwnedTrackKey,
      silentTrackConfirmed: profanityOwnedTrackConfirmed,
      trackSetCount: profanityTrackSetCount,
      hidden: document.documentElement.classList.contains(PROFANITY_HIDE_CLASS),
      mutedByUs: profanityMutedByUs,
      userTookOver: profanityUserTookOver,
      netflixMuted: isMutedInNetflix(),
      volumeAtMute: profanityVolumeAtMute,
      volume: document.querySelector("video")?.volume ?? null,
      lineLang: profanityLineLang,
      trackRetries: profanityTrackRetries,
      // Which switch is in use: "control-bar" (Netflix's bar), "fallback" (square by the FAB) or "none"
      switchUi: profanityUiMode,
      audioSubtitleControlFound: profanityAudioControlFound,
      timelineFound: profanityTimelineFound,
      controlButtonPresent: !!document.getElementById(PROFANITY_CONTROL_ID),
      fallbackChipShown: !!document.getElementById(PROFANITY_CHIP_ID)?.classList.contains("shown"),
      tipAnchor: profanityTipAnchor,
      uiSyncCount: profanityUiSyncCount,
    };
  },
  test(text, bcp47 = "en") {
    const regex = getProfanityRegex(bcp47);
    if (!regex) return text;
    return censorText(text, regex, getProfanityExceptionRegex(bcp47)) ?? text;
  },
};

// Best effort: put "subtitles off" back if the tab is closed mid-session. The
// marker is kept and marked closed, so if this doesn't land, the next Netflix
// page (this tab reloaded, or a new tab within the hour) still recognises the
// silent track: hidden with the feature on, switched back to Off with it off.
window.addEventListener("pagehide", () => {
  if (profanityMuteEnabled && profanityOwnedTrackKey !== null) {
    refreshOwnedTrackMarker();
    const player = getProfanityPlayer();
    if (player) restoreOffTrack(player, { keepMarker: true });
  }
  setOwnedTrackMarkerClosed(true);
});
// Back from the back/forward cache: this page is live again
window.addEventListener("pageshow", (event) => {
  if (event.persisted) setOwnedTrackMarkerClosed(false);
});
// Frozen (background tab, may be discarded): treat like pagehide, so a
// discarded tab's marker can still be picked up
try {
  document.addEventListener("freeze", () => setOwnedTrackMarkerClosed(true));
  document.addEventListener("resume", () => setOwnedTrackMarkerClosed(false));
} catch (e) {
  // Page Lifecycle events not supported
}
