#!/usr/bin/env node
// Prints the CHANGELOG.md section for one version, word for word, so the
// GitHub Release says exactly what was reviewed in the changelog.
//
// Usage: node scripts/release-notes.mjs 1.4.0
// Exits non-zero when the version has no section, which stops a release from
// going out with empty or placeholder notes.

import { readFileSync } from "fs";

const version = process.argv[2]?.replace(/^v/, "");
if (!version) {
  console.error("usage: release-notes.mjs <version>");
  process.exit(1);
}

const lines = readFileSync(new URL("../CHANGELOG.md", import.meta.url), "utf8").split("\n");
const start = lines.findIndex((l) => l.startsWith(`## [${version}]`));
if (start === -1) {
  console.error(`CHANGELOG.md has no "## [${version}]" section. Write the notes before tagging.`);
  process.exit(1);
}

// The section runs until the next version heading or the link references.
let end = lines.findIndex((l, i) => i > start && (l.startsWith("## [") || /^\[[^\]]+\]: /.test(l)));
if (end === -1) end = lines.length;

const body = lines.slice(start + 1, end).join("\n").trim();
if (!body) {
  console.error(`The ${version} section in CHANGELOG.md is empty.`);
  process.exit(1);
}

console.log(`${body}\n\nChangelog: [CHANGELOG.md](https://github.com/wahibonae/skipit/blob/main/CHANGELOG.md) · [What's new on getskipit.com](https://getskipit.com/whats-new)`);
