/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF9',
        surface: '#FFFFFF',
        line: '#E7E5E4',
        lineStrong: '#D6D3D1',
        dark: {
          bg: '#0A0B0F',
          surface: '#12131A',
          card: '#161722',
          cardHover: '#1D1E2C',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
          text: '#F4F4F6',
          muted: '#9496A1',
          faint: '#5C5E6B',
        },
        ink: {
          DEFAULT: '#18181B',
          soft: '#3F3F46',
          muted: '#71717A',
          faint: '#A1A1AA',
        },
        accent: {
          DEFAULT: '#FF5E62',
          coral: '#FF6B6B',
          pink: '#FF416C',
          magenta: '#EC4899',
          purple: '#8B5CF6',
          indigo: '#6366F1',
          blue: '#3B82F6',
          cyan: '#06B6D4',
        },
      },
      fontFamily: {
        sans: [
          '"SF Pro Display"',
          '"SF Pro Text"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        rounded: [
          '"SF Pro Rounded"',
          '"SF Pro Display"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        compact: [
          '"SF Compact Display"',
          '"SF Compact Text"',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          'SFMono-Regular',
          'ui-monospace',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(24,24,27,0.04), 0 4px 16px rgba(24,24,27,0.05)',
        lift: '0 10px 40px rgba(24,24,27,0.09)',
        composer: '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        composerDark: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        glowPink: '0 0 50px rgba(236,72,153,0.3)',
        glowBlue: '0 0 50px rgba(59,130,246,0.3)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%,100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
        auroraPulse: {
          '0%, 100%': { transform: 'scale(1) translate(0px, 0px)', opacity: '0.8' },
          '50%': { transform: 'scale(1.1) translate(20px, -20px)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        breathe: 'breathe 2.6s ease-in-out infinite',
        aurora: 'auroraPulse 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
