module.exports = {
  // update from 'purge' - specifies which files to include in build
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#a3e635',
          500: '#84cc16',
        },
        zinc: {
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          800: '#27272a',
          900: '#18181b',
          950: '#0a0a0e',
        },
        lime: {
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },

        custom: {
          dark: {
            base: '#0a0a0e',
            surface: '#1c1c24',
            border: '#2a2a35',
            hover: '#3a3a45',
          },
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
            color: theme('colors.zinc.300'),
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
            // inline code editor styling
            code: {
              color: theme('colors.lime.400'),
              backgroundColor: 'rgba(28, 28, 36, 0.5)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            // code block
            pre: {
              backgroundColor: 'rgba(28, 28, 36, 0.5)',
              border: '1px solid rgba(42, 42, 53, 0.8)',
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      // changes opacity when elements are disabled
      opacity: ['disabled'],
      // changes cursor when elements are disabled
      cursor: ['disabled'],
      // bg color changes on active state and group hover
      backgroundColor: ['active', 'group-hover'],
      // text color changes on active state and group hover
      textColor: ['active', 'group-hover'],
      borderColor: ['active', 'focus-visible'],
      ringColor: ['focus-visible'],
      ringOpacity: ['focus-visible'],
    },
  },
};
