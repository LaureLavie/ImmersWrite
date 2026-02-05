/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['var(--font-title)', 'sans-serif'],    // Sego
        subtitle: ['var(--font-subtitle)', 'serif'], // Crimson Pro
        body: ['var(--font-body)', 'sans-serif'],    // Inter
        label: ['var(--font-label)', 'serif'],// Pour H2 et Labels
      },
      colors: {
        midnight: 'var(--midnight)',
        darknight: 'var(--darknight)',
        darklight: 'var(--darklight)',
        amber: 'var(--amber)',
        lunar: 'var(--lunar)',
        careful: 'var(--careful)',
      },
      backgroundImage: {
        'night': 'var(--gradient-night)',
        'gold': 'var(--gradient-gold)',
        'careful-gradient': 'var(--gradient-careful)',
      },
      borderRadius: {  
        'button': '50px',
        'card': '50px',
        'input': '50px',
      },
    },
  },
  plugins: [],
};