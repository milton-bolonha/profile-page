/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        display: ['Cal Sans', 'Inter Variable', 'sans-serif'],
      },
      colors: {
        black: '#000000',  // FORCE PURE BLACK!
        white: '#ffffff',
        background: '#000000',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#f0f0f0',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#111111',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#333333',
          foreground: '#888888',
        },
        accent: {
          DEFAULT: '#333333',
          foreground: '#ffffff',
        },
        border: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
