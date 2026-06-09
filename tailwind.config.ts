import type { Config } from 'tailwindcss'

const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ab: {
          'primary-teal': '#0D3133',
          'primary-orange': '#E69F50',
          'neutral-border': '#E2E0DC',
          'secondary-sage': '#73847B',
          'background': '#F8F8F7',
          'card-background': '#FFFFFF',
          'foreground': '#1a1a1a',
          'text-secondary': '#6B6B6B',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
