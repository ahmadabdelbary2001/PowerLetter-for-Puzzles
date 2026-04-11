#!/usr/bin/env node
/**
 * set-version.mjs
 * Updates all package/config version fields to the given version.
 *
 * Usage:
 *   node scripts/set-version.mjs 1.2.3
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = resolve(__dir, '..');

const raw = process.argv[2];
if (!raw) {
  console.error('Usage: node scripts/set-version.mjs <version>');
  process.exit(1);
}
const version = raw.replace(/^v/, '');
console.log(`Setting version → ${version}`);

function updateJson(relPath) {
  try {
    const abs  = resolve(root, relPath);
    const json = JSON.parse(readFileSync(abs, 'utf8'));
    json.version = version;
    writeFileSync(abs, JSON.stringify(json, null, 2) + '\n');
    console.log(`  ✓  ${relPath}`);
  } catch (e) {
    console.error(`  ✗  Failed to update ${relPath}: ${e.message}`);
  }
}

function updateToml(relPath) {
  try {
    const abs     = resolve(root, relPath);
    const content = readFileSync(abs, 'utf8');
    const updated = content.replace(/^version\s*=\s*"[^"]*"/m, `version = "${version}"`);
    writeFileSync(abs, updated);
    console.log(`  ✓  ${relPath}`);
  } catch (e) {
    console.error(`  ✗  Failed to update ${relPath}: ${e.message}`);
  }
}

// ── JSON files ───────────────────────────────────────────────────────────────
updateJson('package.json');
updateJson('apps/desktop-mobile/package.json');
updateJson('apps/desktop-mobile/src-tauri/tauri.conf.json');
updateJson('apps/web/package.json');
updateJson('packages/core/package.json');
updateJson('packages/ui/package.json');

// ── TOML files ───────────────────────────────────────────────────────────────
updateToml('apps/desktop-mobile/src-tauri/Cargo.toml');
updateToml('crates/power-engine/Cargo.toml');

console.log('\nDone.');
