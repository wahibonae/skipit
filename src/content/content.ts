/**
 * Content Script - Entry Point
 * Runs in ISOLATED world on Netflix pages
 * Manages injection of Netflix script and communication between background and injected script
 */

import { setupChromeMessageHandlers } from "./handlers/chrome-messages";
import { setupWindowMessageHandlers } from "./handlers/window-messages";
import { initializeContentScript } from "./handlers/initialization";

console.log("[Content] Script loaded on:", window.location.hostname);

// Set up message handlers
setupChromeMessageHandlers();
setupWindowMessageHandlers();

// Initialize on Netflix pages
initializeContentScript();

console.log("[Content] Initialized successfully");
