import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

// Note: Dark mode is configured in globals.css using @variant for Tailwind v4
// See: @variant dark (&:where([data-theme="dark"] *))
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette - now using CSS variables for theme support
        coral: {
          DEFAULT: 'var(--color-coral)',
          light: 'var(--color-coral-light)',
          dark: 'var(--color-coral-dark)',
        },
        orange: {
          DEFAULT: 'var(--color-orange)',
          light: 'var(--color-orange-light)',
          dark: 'var(--color-orange-dark)',
        },
        cyan: {
          DEFAULT: 'var(--color-cyan)',
          light: 'var(--color-cyan-light)',
          dark: 'var(--color-cyan-dark)',
        },
        cream: {
          DEFAULT: 'var(--color-cream)',
          light: 'var(--color-cream-light)',
          dark: 'var(--color-cream-dark)',
        },
        purple: {
          DEFAULT: 'var(--color-purple)',
          light: 'var(--color-purple-light)',
          dark: 'var(--color-purple-dark)',
        },
        // Additional complementary colors
        navy: 'var(--color-navy)',
        teal: 'var(--color-teal)',
        pink: 'var(--color-pink)',
        yellow: 'var(--color-yellow)',
        // Semantic colors for easier usage
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
      },
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              backgroundColor: 'var(--color-prose-code-bg)',
              color: 'var(--color-prose-code)',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'blockquote': {
              borderLeftColor: 'var(--color-prose-blockquote-border)',
              color: 'var(--color-prose-blockquote-text)',
            },
            'a': {
              color: 'var(--color-prose-links)',
              '&:hover': {
                color: 'var(--color-prose-links-hover)',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
} satisfies Config;
