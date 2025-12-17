# Theming System Documentation

Your blog now has a flexible theming system that makes it easy to create and switch between different visual themes.

## Available Themes

1. **Light** (Default) - Your original colorful theme with cream background
2. **Dark** - Dark mode with vibrant accent colors
3. **Obsidian** - Inspired by Obsidian's aesthetic with muted, professional colors
4. **Minimal** - Clean monochrome theme for minimalist look

## How to Add Theme Switcher

### Option 1: Add to Navbar

In `src/components/Navbar.tsx`, import and add the ThemeSwitcher:

```tsx
import ThemeSwitcher from './ThemeSwitcher';

// In your navigation links div:
<div className="flex gap-3 items-center">
  <Link href="/code" className={linkClass('/code')}>
    // ... your code link
  </Link>
  <Link href="/thoughts" className={linkClass('/thoughts')}>
    // ... your thoughts link
  </Link>
  <Link href="/me" className={linkClass('/me')}>
    // ... your me link
  </Link>
  <ThemeSwitcher /> {/* Add this */}
</div>
```

## Creating a New Theme

To create a new theme, edit `src/styles/themes.css`:

```css
[data-theme="your-theme-name"] {
  /* Color Palette */
  --color-coral: #YourColor;
  --color-orange: #YourColor;
  --color-cyan: #YourColor;
  /* ... add all other variables */

  /* Semantic colors */
  --color-background: #YourBackground;
  --color-surface: #YourSurface;
  --color-text-primary: #YourTextColor;
  /* ... etc */
}
```

Then add it to the ThemeSwitcher component in `src/components/ThemeSwitcher.tsx`:

```tsx
const themes = [
  // ... existing themes
  { id: 'your-theme-name', name: 'Your Theme', icon: YourIcon },
];
```

## CSS Variables Reference

All theme variables are defined in `src/styles/themes.css`. Key variables:

### Color Palette
- `--color-coral`, `--color-coral-light`, `--color-coral-dark`
- `--color-orange`, `--color-orange-light`, `--color-orange-dark`
- `--color-cyan`, `--color-cyan-light`, `--color-cyan-dark`
- `--color-cream`, `--color-cream-light`, `--color-cream-dark`
- `--color-purple`, `--color-purple-light`, `--color-purple-dark`
- `--color-navy`, `--color-teal`, `--color-pink`, `--color-yellow`

### Semantic Colors (Use these in your components)
- `--color-background` - Main background color
- `--color-surface` - Card/surface backgrounds
- `--color-text-primary` - Main text color
- `--color-text-secondary` - Secondary text color
- `--color-border` - Border colors
- `--color-accent` - Primary accent color (links, buttons)
- `--color-accent-hover` - Accent color on hover

### Component-Specific
- `--color-navbar-bg` - Navbar background
- `--color-navbar-text` - Navbar text
- `--color-navbar-active-bg` - Active nav item background
- `--color-navbar-active-text` - Active nav item text
- `--color-card-bg` - Card backgrounds
- `--color-card-border` - Card borders
- `--color-code-bg` - Inline code background
- `--color-code-text` - Inline code text
- `--color-code-block-bg` - Code block background

### Markdown/Prose
- `--color-prose-headings`
- `--color-prose-links`
- `--color-prose-links-hover`
- `--color-prose-code`
- `--color-prose-code-bg`
- `--color-prose-blockquote-border`
- `--color-prose-blockquote-text`

## Using Variables in Components

Instead of hardcoded colors, use CSS variables:

### In CSS/Tailwind
```css
.my-element {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border-color: var(--color-border);
}
```

### In Inline Styles
```tsx
<div style={{ backgroundColor: 'var(--color-surface)' }}>
  Content
</div>
```

## Programmatic Theme Switching

Use the `useTheme` hook from `next-themes`:

```tsx
import { useTheme } from 'next-themes';

function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme('dark')}>
      Switch to Dark Mode
    </button>
  );
}
```

## Tips for Theme Design

1. **Maintain Contrast**: Ensure text is readable against backgrounds
2. **Consistent Accent**: Use accent colors consistently across the theme
3. **Test in Both Modes**: Check how your content looks in all themes
4. **Use Semantic Variables**: Prefer `--color-text-primary` over specific colors

## Obsidian-Style Markdown

The markdown styling has been enhanced with Obsidian-inspired features:
- Better spacing between elements
- Styled blockquotes with background colors
- Improved table styling
- Task list support
- Smooth transitions between themes

Apply the `.markdown-body` class to content for enhanced styling.
