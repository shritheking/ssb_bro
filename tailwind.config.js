/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0B1422',
          bgSecondary: '#111E30',
          card: '#17263A',
          cardHover: '#1D304A',
          cardMuted: '#142134',
          gold: '#C8A96B',
          goldLight: '#DFCA95',
          goldMuted: 'rgba(200, 169, 107, 0.15)',
          steel: '#6F91B8',
          steelLight: '#8FAECE',
          steelMuted: 'rgba(111, 145, 184, 0.15)',
          text: '#F4F3EF',
          textMuted: '#A7B3C2',
          border: 'rgba(255, 255, 255, 0.10)',
          borderGold: 'rgba(200, 169, 107, 0.35)',
          lightBg: '#F3F1EB',
          lightText: '#172033',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at top center, rgba(111, 145, 184, 0.12) 0%, rgba(11, 20, 34, 0) 70%)',
        'gold-glow': 'radial-gradient(circle at center, rgba(200, 169, 107, 0.12) 0%, rgba(11, 20, 34, 0) 70%)',
        'subtle-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
      },
      boxShadow: {
        'card': '0 8px 30px rgba(0, 0, 0, 0.35)',
        'gold-subtle': '0 0 25px -5px rgba(200, 169, 107, 0.25)',
        'steel-subtle': '0 0 25px -5px rgba(111, 145, 184, 0.25)',
      }
    },
  },
  plugins: [],
}
