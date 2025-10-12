/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // 이 부분이 꼭 필요합니다!
  ],
  theme: {
    extend: {
      maxWidth: {
        container: '1400px',
      },
      fontFamily: {
        sans: ['GMarketSans', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#BABFFF',
          100: '#6B76FF',
        },
        secondary: {
          50: '#C7BEFF',
          100: '#806BFF',
        },
        black: {
          50: '#D9D9D9',
          100: '#A1A1A1',
          200: '#272643',
        },
        kakao: '#FEE500',
        error: '#FF0000',
      },
      spacing: {
        0.5: '0.125rem', // 2px
        1: '0.25rem', // 4px
        2: '0.5rem', // 8px
        3: '0.75rem', // 12px
        4: '1rem', // 16px
        5: '1.25rem', // 20px
        6: '1.5rem', // 24px
        7: '1.75rem', // 28px
        8: '2rem', // 32px
        10: '2.5rem', // 40px
        12: '3rem', // 48px
        14: '3.5rem', // 56px
        16: '4rem', // 64px
        18: '4.5rem', // 72px
        20: '5rem', // 80px
        24: '6rem', // 96px
        32: '8rem', // 128px
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        base: ['1rem', { lineHeight: '1.5rem' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        '5xl': ['3rem', { lineHeight: '3.5rem' }], // 48px
        '6xl': ['3.75rem', { lineHeight: '4rem' }], // 60px
        '7xl': ['4.5rem', { lineHeight: '5rem' }], // 72px
      },
      lineHeight: {
        tight: '1.2',
        snug: '1.35',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
    },
  },
};
