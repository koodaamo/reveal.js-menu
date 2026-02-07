# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

- improve sizing and positioning of the hamburger icon
- modernize plugin.js a bit
- remove the b0rked revealjs font family matching that was forcing Times (yay)

## [3.1.0] - 2026-02-4

- remove traces of theme and transition selectors; focus on core menu functionality

## [3.0.0] - 2026-01-31

### 🚨 BREAKING CHANGES

- **Requires ES module support** - Plugin now ships as ESM-only. Use `<script type="module">` to load.
- **No IE support** - Removed all legacy browser compatibility code.
- **No UMD bundle** - Removed `menu.esm.js`, single `menu.js` (ESM) remains.
- **Font Awesome removed** - No longer bundled. Unicode icons used by default.
- **Modern browsers only** - Targets ES2020+ environments.

### ✨ Added

- Unicode icons as defaults (≡ 🎨 ↔ ✓ ▶ ○)
- Custom icon API - support for HTML strings, SVG, CSS classes
- Bundle analysis via Bun v1.3.8 metafile-md feature
- Smoke tests to verify functionality
- Modern ES2020+ JavaScript (Array.from, native methods)

### 🗑️ Removed

- Font Awesome library (~800KB removed from package)
- IE version detection and compatibility code
- String.prototype polyfills (startsWith, endsWith)
- Array.prototype polyfills
- UMD bundle format
- `loadIcons` config option (no longer needed)
- Bower support
- Gulp build system

### 🔧 Changed

- Build system: Gulp → Bun (10-20x faster builds)
- Bundle size: 18.56 KB → 17.23 KB (-7.2%)
- Icon defaults: Font Awesome classes → Unicode characters
- Icon elements: `<i class="fas">` → `<span class="slide-menu-icon">`
- Package type: CommonJS → ES module (`"type": "module"`)
- Build time: ~5-10 seconds → ~100ms

### 📦 Migration Guide

**From v2.x to v3.0.0:**

#### 1. Update script tag to use ES modules:

```diff
- <script src="menu.js"></script>
+ <script type="module">
+   import RevealMenu from './menu.js';
+   Reveal.initialize({ plugins: [RevealMenu] });
+ </script>
```

#### 2. Remove `loadIcons` option (no longer exists):

```diff
  Reveal.initialize({
    menu: {
-     loadIcons: true,
      // ... other options
    }
  });
```

#### 3. Customize icons if needed:

```javascript
Reveal.initialize({
  menu: {
    icons: {
      contents: '≡',           // Unicode (default)
      themes: '<i class="my-icon"></i>',  // Custom HTML
      close: '<svg>...</svg>'  // Inline SVG
    }
  }
});
```

#### 4. Browser requirements:

- Chrome/Edge 63+
- Firefox 60+
- Safari 11.1+
- No IE support

### 🐛 Fixed

- Various legacy compatibility issues by removing outdated code
- Cleaner DOM structure without Font Awesome dependencies

---

## [2.2.0] and earlier

See Git history for previous versions.

[3.0.0]: https://github.com/denehyg/reveal.js-menu/compare/v2.2.0...v3.0.0
