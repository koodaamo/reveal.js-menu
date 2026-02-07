# Styling the Menu

The reveal.js-menu plugin has its own built-in styles defined in `menu.css` that are largely independent of your Reveal.js presentation theme. However, there are ways to customize the menu appearance to match your presentation.

## What Gets Inherited from Reveal.js Theme

The menu does not inherit Reveal.js theme styles automatically. The default font family is set in `menu.css`:

- `.slide-menu-wrapper` uses `"Source Sans Pro", Verdana, Helvetica, sans-serif`

If you want the menu to use your presentation font, override it in your own CSS.

## Default Menu Styles

The menu comes with these hardcoded styles in `menu.css`:

- **Background color**: `#333` (dark gray)
- **Text colors**:
  - Default items: `#bbb`
  - Active items: `#eee`
  - Selected items: `white`
  - Panel text: `#aaa`
  - Headings in panels: `#fff`
  - Panel links: `#ccc` (hover `white`)
- **Background for selected items**: `#222`
- **Border colors**: `#555`, `#666`
- **Base font size**: `16px`
- **Menu width**: `300px` (wide: `500px`, third: `33%`, half: `50%`, full: `95%`)
- **Menu button color**: `#000` (black)

## Customizing Menu Appearance

### Option 1: CSS Overrides

The recommended approach is to add custom CSS to your presentation that overrides the menu styles. Add this after the menu plugin is loaded:

```html
<style>
  /* Menu background */
  .slide-menu-wrapper .slide-menu {
    background-color: #your-color !important;
  }
  
  /* Menu items */
  .slide-menu-wrapper .slide-menu-item,
  .slide-menu-wrapper .slide-menu-item-vertical {
    color: #your-text-color !important;
  }
  
  /* Active/current slide */
  .slide-menu-wrapper .active-menu-panel li.active {
    color: #your-active-color !important;
  }
  
  /* Selected item (keyboard navigation) */
  .slide-menu-wrapper .active-menu-panel li.selected {
    background-color: #your-selection-bg !important;
    color: #your-selection-text !important;
  }
  
  /* Borders */
  .slide-menu-wrapper .slide-menu-item {
    border-top-color: #your-border-color !important;
  }
  
  .slide-menu-wrapper .slide-menu-toolbar {
    border-bottom-color: #your-border-color !important;
  }
  
  /* Toolbar buttons */
  .slide-menu-wrapper .slide-menu-toolbar > li {
    color: #your-toolbar-color !important;
  }
  
  .slide-menu-wrapper .slide-menu-toolbar > li.active-toolbar-button {
    color: #your-toolbar-active-color !important;
  }
  
  /* Menu button (in corner of presentation) */
  .reveal .slide-menu-button,
  .reveal .slide-menu-button .slide-menu-icon {
    color: #your-button-color !important;
  }
  
  /* Panel content headings */
  .slide-menu-wrapper .slide-menu-panel h1,
  .slide-menu-wrapper .slide-menu-panel h2,
  .slide-menu-wrapper .slide-menu-panel h3 {
    color: #your-heading-color !important;
  }
  
  /* Panel links */
  .slide-menu-wrapper .slide-menu-panel a {
    color: #your-link-color !important;
  }
  
  /* Overlay (darkens presentation when menu is open) */
  .slide-menu-wrapper .slide-menu-overlay.active {
    background-color: #your-overlay-color !important;
    opacity: 0.7 !important;
  }
</style>
```

### Option 2: Modify menu.css Directly

If you prefer, you can directly edit the `menu.css` file in the plugin directory to change the default colors and styles. This is useful if you want permanent changes and don't want to maintain override CSS.

### Option 3: Use CSS Custom Properties (Variables)

For easier theming, you could modify `menu.css` to use CSS custom properties:

```css
:root {
  --menu-bg: #333;
  --menu-text: #aaa;
  --menu-active: #eee;
  --menu-selected-bg: #222;
  --menu-selected-text: white;
  --menu-border: #555;
}

.slide-menu-wrapper .slide-menu {
  background-color: var(--menu-bg);
}

.slide-menu-wrapper .slide-menu-item {
  color: var(--menu-text);
}

/* etc. */
```

Then override these variables in your presentation:

```html
<style>
  :root {
    --menu-bg: #2c3e50;
    --menu-text: #ecf0f1;
    --menu-active: #3498db;
    --menu-selected-bg: #34495e;
    --menu-selected-text: #ecf0f1;
    --menu-border: #34495e;
  }
</style>
```

## Common Styling Scenarios

### Light Theme Menu

```css
.slide-menu-wrapper .slide-menu {
  background-color: #f8f9fa !important;
}

.slide-menu-wrapper .slide-menu-item,
.slide-menu-wrapper .slide-menu-item-vertical {
  color: #333 !important;
  border-top-color: #dee2e6 !important;
}

.slide-menu-wrapper .active-menu-panel li.active {
  color: #007bff !important;
}

.slide-menu-wrapper .active-menu-panel li.selected {
  background-color: #e9ecef !important;
  color: #212529 !important;
}
```

### Match Presentation Theme Colors

```css
/* Assuming your theme uses CSS variables */
.slide-menu-wrapper .slide-menu {
  background-color: var(--r-background-color) !important;
}

.slide-menu-wrapper .slide-menu-item,
.slide-menu-wrapper .slide-menu-item-vertical {
  color: var(--r-main-color) !important;
}

.slide-menu-wrapper .active-menu-panel li.active {
  color: var(--r-link-color) !important;
}
```

## Important Notes

- Use `!important` in your overrides to ensure they take precedence over the plugin's default styles
- The menu button color should contrast with your presentation background
- Test your custom colors for accessibility (sufficient contrast)
- The menu uses a fixed positioning system, so layout changes may require careful CSS adjustments