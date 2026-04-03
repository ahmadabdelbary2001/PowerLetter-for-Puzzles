// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',              // toggle with <html class="dark">
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tw-animate-css'),     // your animate plugin
  ],
  // register your custom variant so that `.dark *` works:
  variants: {
    extend: {
      backgroundColor: ['dark-all'],
      textColor: ['dark-all'],
      // …add more utilities if you want them under `dark-all`
    }
  },
}
