/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css}"
  ],
  theme: {
    extend: {
      fontFamily: {
        subtitle: ['var(--font-subtitle)'],
        body: ['var(--font-body)'],
        title: ['var(--font-title)'],
      },
      colors: {
        midnight: 'var(--midnight)',
        darknight: 'var(--darknight)',
        amber: 'var(--amber)',
        lunar: 'var(--lunar)',
        careful: 'var(--careful)',
        lightdark: 'var(--lightdark)',

      },      
      backgroundImage: {
       
        'night': 'var(--gradient-night)',
        'gold': 'var(--gradient-gold)',
        'careful-gradient': 'var(--gradient-careful)',
      }
    },
  },
  plugins: [],
};