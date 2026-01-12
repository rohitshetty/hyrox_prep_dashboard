import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['Barlow', 'sans-serif'],
      },
      colors: {
        bg: {
          base: '#0a0a0b',
          surface: '#141416',
          elevated: '#1c1c1f',
        },
        accent: {
          DEFAULT: '#d4f505',
          dim: '#a8c404',
          glow: 'rgba(212, 245, 5, 0.15)',
        },
        phase: {
          base: '#3b82f6',
          build: '#22c55e',
          recovery: '#eab308',
          peak: '#f97316',
          taper: '#a855f7',
          race: '#ef4444',
        },
        type: {
          run: '#60a5fa',
          strength: '#4ade80',
          hyrox: '#fb923c',
        },
        border: {
          DEFAULT: '#262629',
          focus: '#404044',
        },
      },
      animation: {
        reveal: 'reveal 0.4s ease-out forwards',
      },
      keyframes: {
        reveal: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'sm': '2px',
      },
    },
  },
  plugins: [],
};

export default config;
