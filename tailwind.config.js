/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{tsx,ts,js,md}'],
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      letterStrong: 'var(--color-letter-strong)',
      letter: 'var(--color-letter)',
      bg: 'var(--color-bg)',
      grayStronger: 'var(--color-gray-stronger)',
      grayStrong: 'var(--color-gray-strong)',
      gray: 'var(--color-gray)',
      grayWeaker: 'var(--color-gray-weaker)',
      grayWeakest: 'var(--color-gray-weakest)',
      glass: 'var(--color-glass)',
      clickable: 'var(--color-clickable)',
      // common
      green: 'var(--color-green)',
      grayDarkest: 'var(--color-gray-darkest)',
      grayLight: 'var(--color-gray-light)',
    },
    fontSize: {
      '2xl': 'var(--font-huge)',
      xl: 'var(--font-big)',
      lg: 'var(--font-large)',
      md: 'var(--font-medium)',
      base: 'var(--font-regular)',
      sm: 'var(--font-small)',
      xs: 'var(--font-tiny)',
      '2xs': 'var(--font-micro)',
    },
    lineHeight: {
      140: 1.4,
      160: 1.6,
    },
    screens: {
      sm: '566px',
      md: '768px',
    },
    boxShadow: {
      sm: '0 0 2px',
      header: '0 1px 2px rgba(0, 0, 0, 0.075)',
      none: 'none',
    },
    extend: {
      spacing: {
        1.5: '6px',
        30: '120px',
        headerHeight: 'var(--header-height)',
        pageWidth: 'var(--page-width)',
        pageMargin: 'var(--page-margin)',
      },
      maxWidth: {
        pageWidth: 'var(--page-width)',
        '8/10': '80%',
      },
      aspectRatio: {
        '16/9': '16/9',
      },
      contrast: {
        90: 0.9,
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
