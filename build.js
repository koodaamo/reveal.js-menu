#!/usr/bin/env bun

/**
 * Build script for reveal.js-menu
 * Replaces Gulp + Rollup + Babel + Terser with Bun's native bundler
 */

import { $ } from "bun";
import pkg from "./package.json";

const banner = `/*!
* reveal.js-menu ${pkg.version}
* ${pkg.homepage}
* MIT licensed
*
* Copyright (C) 2016 Greg Denehy
*/
`;

console.log("🔨 Building reveal.js-menu (ESM-only for modern browsers)...\n");

// Build ESM version (modern browsers only)
console.log("📦 Building ESM bundle (menu.js)...");
const result = await Bun.build({
  entrypoints: ["./plugin.js"],
  outdir: ".",
  naming: "menu.js",
  format: "esm",
  target: "browser",
  minify: true,
  sourcemap: "none",
  banner: banner,
  metafile: {
    markdown: "build-analysis.md",
  },
});

if (!result.success) {
  console.error("❌ Build failed:");
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

console.log("✅ ESM bundle created\n");

console.log("✨ Build complete!");
console.log(`   - menu.js (ESM format for modern browsers)`);
console.log(`   - build-analysis.md (Bundle analysis)\n`);
console.log('💡 Usage: <script type="module" src="menu.js"></script>');
