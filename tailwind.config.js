/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        linen: {
          50: '#FBF8F1',
          100: '#F4EEDF',
          200: '#EAE0C7',
          300: '#DCCFA9',
        },
        ink: {
          DEFAULT: '#2B2420',
          soft: '#5B5145',
        },
        thread: {
          red: '#A6352C',
          redDeep: '#82271F',
          blue: '#2E5C7A',
          green: '#3E6B4E',
        },
      },
      fontFamily: {
        serif: ['"Shippori Mincho"', 'serif'],
        sans: ['"Zen Kaku Gothic New"', '"Hiragino Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        tag: '0 1px 0 rgba(43,36,32,0.06), 0 2px 6px rgba(43,36,32,0.08)',
        tagHover: '0 2px 0 rgba(43,36,32,0.08), 0 6px 14px rgba(43,36,32,0.14)',
      },
    },
  },
  plugins: [],
}
