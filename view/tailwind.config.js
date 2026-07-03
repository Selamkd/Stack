module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      colors: {
        custom: {
          base: '#131312',
          surface: '#191917',
          raised: '#201f1d',
          border: '#2a2927',
          hover: '#343330',
          active: '#403e3a',
          text: '#8a8781',
          secondary: '#161615',
        },
        clay: '#d9967e',
        sand: '#cfb489',
        haze: '#97aec4',
        dusk: '#c79aa4',
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
              'color': theme('colors.clay'),
              '&:hover': {
                color: theme('colors.zinc.100'),
              },
            },
            h1: {
              color: theme('colors.zinc.100'),
            },
            h2: {
              color: theme('colors.zinc.100'),
            },
            h3: {
              color: theme('colors.zinc.100'),
            },
            h4: {
              color: theme('colors.zinc.100'),
            },
            code: {
              color: theme('colors.clay'),
              backgroundColor: 'rgba(32, 31, 29, 0.8)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: 'rgba(19, 19, 18, 0.8)',
              border: '1px solid rgba(42, 41, 39, 0.9)',
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
