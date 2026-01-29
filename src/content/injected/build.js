/**
 * Build script for netflix-injected.js
 * Concatenates modules in defined order with CSS embedded
 *
 * Run: node src/content/injected/build.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Explicit concatenation order - reorder by changing this array
const MODULE_ORDER = [
  'state.js',
  'utils.js',
  'player-api.js',
  'fab-button.js',
  'mark-button.js',
  'button-visibility.js',
  'timeline-segments.js',
  'skip-checker.js',
  'notifications.js',
  'video-watcher.js',
  'message-handler.js',
];

const modulesDir = join(__dirname, 'modules');
const stylesPath = join(__dirname, 'styles/player.css');
const indexPath = join(__dirname, 'index.js');
const outputPath = join(__dirname, '../netflix-injected.js');

function build() {
  console.log('Building netflix-injected.js...');

  // Read CSS and escape backticks for template literal
  const css = readFileSync(stylesPath, 'utf-8')
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  const stylesJs = `const BUTTON_STYLES = \`\n${css}\n\`;`;

  // Read modules in defined order
  const modules = MODULE_ORDER.map(file => {
    const filePath = join(modulesDir, file);
    console.log(`  Reading: ${file}`);
    return readFileSync(filePath, 'utf-8');
  });

  // Read entry point
  const index = readFileSync(indexPath, 'utf-8');
  console.log('  Reading: index.js');

  // Concatenate: IIFE wrapper + styles + modules + index
  const output = `// Auto-generated - DO NOT EDIT DIRECTLY
// Edit files in src/content/injected/ and run: node src/content/injected/build.js
// This script runs in the MAIN world to access Netflix's global objects

// Check if script already loaded (prevent duplicate injection)
if (!window.skipitNetflixInjected) {
  window.skipitNetflixInjected = true;

  console.log("[Netflix Injected] Script loaded");

${stylesJs}

${modules.join('\n\n')}

${index}

  console.log("[Netflix Injected] Initialized successfully");
}
`;

  writeFileSync(outputPath, output);
  console.log(`\nBuilt: ${outputPath}`);
  console.log(`Total modules: ${MODULE_ORDER.length}`);
}

// Run build
build();
