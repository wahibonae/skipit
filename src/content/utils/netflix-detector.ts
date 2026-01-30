/**
 * Netflix detection and script injection utilities
 */

import type { NetflixMetadata } from "../../lib/types";
import { state } from "./state";

/**
 * Extract Netflix video ID from URL
 * Netflix URLs look like: https://www.netflix.com/watch/81234567
 */
export function extractNetflixVideoId(url: string): string | null {
  try {
    const match = url.match(/\/watch\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Inject the Netflix script into the MAIN world
 */
export function injectNetflixScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (state.netflixScriptInjected) {
      resolve();
      return;
    }

    try {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL("src/content/netflix-injected.js");
      script.onload = () => {
        state.netflixScriptInjected = true;
        resolve();
      };
      script.onerror = (error) => {
        console.error("[Content] Failed to inject Netflix script:", error);
        reject(new Error("Failed to inject Netflix script"));
      };

      (document.head || document.documentElement).appendChild(script);
    } catch (error) {
      console.error("[Content] Error injecting Netflix script:", error);
      reject(error);
    }
  });
}

/**
 * Wait for Netflix player to be ready
 */
export function waitForNetflixReady(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (state.isNetflixReady) {
      resolve();
      return;
    }

    const startTime = Date.now();

    const checkReady = () => {
      if (state.isNetflixReady) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error("Netflix player ready timeout"));
      } else {
        setTimeout(checkReady, 100);
      }
    };

    checkReady();
  });
}

/**
 * Request fresh Netflix metadata from the injected script
 */
export function requestNetflixMetadata(): Promise<NetflixMetadata | null> {
  return new Promise((resolve) => {
    // Set a timeout in case the injected script doesn't respond
    const timeout = setTimeout(() => {
      window.removeEventListener("message", handler);
      resolve(state.lastNetflixMetadata);
    }, 2000);

    const handler = (event: MessageEvent) => {
      if (event.source !== window) return;
      if (event.data.type === "SKIPIT_NETFLIX_METADATA") {
        clearTimeout(timeout);
        window.removeEventListener("message", handler);
        state.lastNetflixMetadata = event.data.metadata;
        resolve(event.data.metadata);
      }
    };

    window.addEventListener("message", handler);
    window.postMessage({ type: "SKIPIT_GET_NETFLIX_METADATA" }, "*");
  });
}
