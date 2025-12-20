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
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      animation: {
        shake: 'shake 0.5s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '10%': { transform: 'translate(-3px, -2px) rotate(-5deg)' },
          '20%': { transform: 'translate(3px, 2px) rotate(5deg)' },
          '30%': { transform: 'translate(-3px, 2px) rotate(-4deg)' },
          '40%': { transform: 'translate(3px, -2px) rotate(4deg)' },
          '50%': { transform: 'translate(-2px, -3px) rotate(-3deg)' },
          '60%': { transform: 'translate(2px, 3px) rotate(3deg)' },
          '70%': { transform: 'translate(-2px, 1px) rotate(-2deg)' },
          '80%': { transform: 'translate(2px, -1px) rotate(2deg)' },
          '90%': { transform: 'translate(-1px, 0px) rotate(-1deg)' },
        },
      },
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
        // Navbar colors
        'navbar-bg': 'var(--navbar-bg)',
        'navbar-text': 'var(--navbar-text)',
        'navbar-active-bg': 'var(--navbar-active-bg)',
        'navbar-active-text': 'var(--navbar-active-text)',
        // shadcn/ui colors mapped to custom palette
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
