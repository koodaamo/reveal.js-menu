# reveal.js-menu v3.0.0 Release Notes

**Released:** January 31, 2026  
**Type:** Major breaking release  
**Target:** Modern browsers (ES2020+)

## Summary

Complete modernization of reveal.js-menu for 2026:
- ESM-only (no legacy formats)
- Unicode icons (no Font Awesome)
- Modern JavaScript (no polyfills)
- Bun build system (10-20x faster)
- 800KB+ smaller package

## Breaking Changes

### 1. ES Modules Required

**Before (v2.x):**
```html
<script src="menu.js"></script>
<script>
  Reveal.initialize({ plugins: [RevealMenu] });
</script>
```

**After (v3.0):**
```html
<script type="module">
  import RevealMenu from './menu.js';
  Reveal.initialize({ plugins: [RevealMenu] });
</script>
```

### 2. No Font Awesome

- Font Awesome library removed from package
- Unicode icons used by default: ≡ 🎨 ↔ ✓ ▶ ○
- Custom icon API available for HTML/SVG/CSS classes

### 3. Modern Browsers Only

- No IE support (IE11 or earlier)
- Requires ES2020+ features
- Chrome 63+, Firefox 60+, Safari 11.1+

### 4. Single Bundle

- `menu.esm.js` removed
- Only `menu.js` (ESM format) ships
- Simpler package structure

## What's New

### Unicode Icons

Built-in Unicode icons with full customization:

```javascript
menu: {
  icons: {
    contents: '≡',                    // Default Unicode
    themes: '<i class="my-icon"></i>', // Custom HTML
    close: '<svg>...</svg>'            // Inline SVG
  }
}
```

### Faster Builds

- Build system: Gulp → Bun
- Build time: 5-10 seconds → 100ms
- No build dependencies needed (except jsdom for tests)

### Smaller Bundle

- v2.2.0: 18.56 KB + 800KB Font Awesome
- v3.0.0: 17.23 KB (no dependencies)
- **Total savings: ~800KB + 7.2% smaller bundle**

### Cleaner Code

- Removed IE detection code
- Removed polyfills (String/Array methods)
- Modern ES2020+ syntax throughout
- Array.from() instead of Array.prototype hacks

## Migration Guide

### Step 1: Update Loading

Change from regular script to ES module:

```diff
- <script src="menu.js"></script>
+ <script type="module">
+   import RevealMenu from './menu.js';
```

### Step 2: Remove loadIcons Option

```diff
  menu: {
-   loadIcons: true,  // No longer exists
    // other options...
  }
```

### Step 3: Customize Icons (Optional)

If you want custom icons:

```javascript
menu: {
  icons: {
    contents: '<i class="fa fa-bars"></i>',  // If you have Font Awesome
    // or use any icon system you prefer
  }
}
```

### Step 4: Update Package

```bash
npm install reveal.js-menu@3.0.0
```

## Testing

All functionality verified with 9 smoke tests:
- ✅ Plugin API structure
- ✅ Unicode icon rendering
- ✅ Custom icon support
- ✅ DOM structure validation
- ✅ Menu initialization
- ✅ Backward compatibility (custom icons)

Run tests:
```bash
bun test
```

## Build from Source

```bash
# Install dependencies
bun install

# Build
bun run build

# Test
bun test
```

## Package Contents

- `menu.js` - ESM bundle (17KB minified)
- `menu.css` - Styles (8KB)
- `plugin.js` - Source code (37KB)
- `README.md` - Documentation
- `CHANGELOG.md` - Migration guide

## Questions?

- **Q: Can I still use Font Awesome?**  
  A: Yes! Provide custom icon HTML via the `icons` config.

- **Q: What about older browsers?**  
  A: Use v2.2.0 for legacy browser support.

- **Q: How do I test before upgrading?**  
  A: Install `reveal.js-menu@3.0.0` in a test branch.

## Credits

- Original author: Greg Denehy
- v3.0.0 modernization: 2026

## License

MIT License - Copyright (C) 2020 Greg Denehy

---

**Full changelog:** See CHANGELOG.md
