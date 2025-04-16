module.exports = {
  // update to 'purge' - specifies which files to include in build
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#818cf8',
          500: '#6366f1',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        sky: {
          400: '#38bdf8',
        },
        fuchsia: {
          400: '#e879f9',
          500: '#d946ef',
        },
        amber: {
          400: '#fbbf24',
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
            color: theme('colors.gray.300'), // sets default text color for prose content (markdown)
            a: {
              'color': theme('colors.indigo.400'),
              '&:hover': {
                color: theme('colors.indigo.300'),
              },
            },
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.100'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },

            // inline code editor styling
            code: {
              color: theme('colors.fuchsia.400'),
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            // code block
            pre: {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
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
