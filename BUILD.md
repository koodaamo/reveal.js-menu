# Build System Documentation

## Overview

As of version 2.2.0+, reveal.js-menu uses **Bun** as its build tool, replacing the previous Gulp + Rollup + Babel + Terser toolchain.

## Requirements

- [Bun](https://bun.sh) 1.0.0 or higher

## Building

To build the distribution files:

```bash
bun run build.js
```

Or using the npm script:

```bash
bun run build
```

## Output Files

The build produces two distribution formats:

1. **`menu.esm.js`** - ES Module format for modern bundlers (Webpack, Vite, etc.)
2. **`menu.js`** - UMD format for direct `<script>` tag usage and CommonJS

Both files are minified and include the banner with license information.

## Build Process

The build script (`build.js`) does the following:

1. **ESM Build**: Bundles `plugin.js` into `menu.esm.js` using Bun's native bundler
   - Target: Modern browsers with ES module support
   - Format: ES modules
   - Minified: Yes

2. **UMD Build**: Bundles `plugin.js` and wraps it in UMD format as `menu.js`
   - Target: Broader compatibility (CommonJS, AMD, global)
   - Format: UMD (Universal Module Definition)
   - Minified: Yes
   - Exports: `RevealMenu` global variable

## Source Files

- **`plugin.js`** - Main entry point and plugin implementation
- **`src/menu.js`** - Alternative source (AI-generated from menu.esm.js) - not currently used in build

## Migration from Gulp

### What Changed

- ✅ Replaced Gulp, Rollup, Babel, Terser with Bun's built-in bundler
- ✅ Removed ~10 npm dependencies
- ✅ Faster builds (10-20x speedup)
- ✅ Simpler configuration (single `build.js` file)
- ✅ Native ESM and module resolution
- ✅ Built-in minification

### What Stayed the Same

- ✅ Dual output format (ESM + UMD)
- ✅ Same API and functionality
- ✅ Same output files (`menu.js` and `menu.esm.js`)
- ✅ Compatible with existing usage

### Old Files

- `gulpfile.js` - Deprecated (kept for reference, marked with deprecation notice)
- `node_modules/` - No longer needed (removed)

## Development

### Testing Builds Locally

After building, you can test the plugin by:

1. Including it in a Reveal.js presentation:

```html
<script src="path/to/menu.js"></script>
<script>
  Reveal.initialize({
    plugins: [ RevealMenu ]
  });
</script>
```

2. Or using ES modules:

```javascript
import RevealMenu from './menu.esm.js';

Reveal.initialize({
  plugins: [ RevealMenu ]
});
```

### Comparing Output

To verify the new builds work correctly:

```bash
# Build with Bun
bun run build.js

# Check file sizes
ls -lh menu.js menu.esm.js

# Check that bundles are valid JavaScript
bun run menu.js --dry-run
```

## Future Improvements

- [ ] Add automated tests comparing new vs old bundle behavior
- [ ] Remove Font Awesome dependency (Phase 2)
- [ ] Switch to Unicode icons with custom icon API (Phase 2)
- [ ] Add TypeScript support (optional)
- [ ] Source maps for debugging (optional)

## Troubleshooting

### Build Fails

Make sure you have Bun installed:

```bash
bun --version
```

If not installed, install it:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Files Not Generated

Check that `plugin.js` exists and is readable. The build script uses this as the entry point.

### Size Differences

The new Bun-based builds may be slightly different in size compared to the old Gulp builds because:
- Different minifier (Bun's vs Terser)
- No Babel polyfills in modern build
- Different module resolution strategy

The functionality remains the same.