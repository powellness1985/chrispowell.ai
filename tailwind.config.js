/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        cyan: {
          DEFAULT: '#00D4FF',
        },
        purple: {
          DEFAULT: '#7B61FF',
        },
        ink: '#E8E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 24px rgba(0, 212, 255, 0.25)',
        'cyan-glow-lg': '0 0 48px rgba(0, 212, 255, 0.35)',
        'purple-glow': '0 0 24px rgba(123, 97, 255, 0.25)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        'blink': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
        'blink': 'blink 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
