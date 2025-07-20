module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zinc: {
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#0a0a0a',
        },

        custom: {
          base: '#0A0A0A',
          surface: '#111111',
          border: '#1A1A1A',
          hover: '#242424',
          active: '#2A2A2A',
          text: '#606060',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'monospace',
        ],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.zinc.400'),
            a: {
              'color': theme('colors.lime.400'),
              '&:hover': {
                color: theme('colors.lime.300'),
              },
            },
            h1: {
              color: theme('colors.white'),
            },
            h2: {
              color: theme('colors.white'),
            },
            h3: {
              color: theme('colors.white'),
            },
            h4: {
              color: theme('colors.white'),
            },
            code: {
              color: theme('colors.lime.400'),
              backgroundColor: 'rgba(17, 17, 17, 0.5)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: 'rgba(17, 17, 17, 0.5)',
              border: '1px solid rgba(26, 26, 26, 0.8)',
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['active', 'group-hover'],
      textColor: ['active', 'group-hover'],
      borderColor: ['active', 'focus-visible'],
      ringColor: ['focus-visible'],
      ringOpacity: ['focus-visible'],
    },
  },
};
