import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette
        coral: {
          DEFAULT: '#FE4A49',
          light: '#FF7674',
          dark: '#E6302E',
        },
        orange: {
          DEFAULT: '#F9A620',
          light: '#FFBE4D',
          dark: '#E08A00',
        },
        cyan: {
          DEFAULT: '#009FB7',
          light: '#2DC4DB',
          dark: '#007A8F',
        },
        cream: {
          DEFAULT: '#E6EFE9',
          light: '#F5FAF7',
          dark: '#D4E0D8',
        },
        purple: {
          DEFAULT: '#820263',
          light: '#A8348A',
          dark: '#5a0145',
        },
        // Additional complementary colors
        navy: '#1A1F3A',
        teal: '#0D7377',
        pink: '#FF6B9D',
        yellow: '#FFD93D',
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
              backgroundColor: '#E6EFE9',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'blockquote': {
              borderLeftColor: '#009FB7',
              color: '#820263',
            },
            'a': {
              color: '#009FB7',
              '&:hover': {
                color: '#FE4A49',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
