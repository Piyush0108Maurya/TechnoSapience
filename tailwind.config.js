module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    // Add commonly used classes that might be dynamically generated
    'bg-bright-red',
    'text-bright-red',
    'border-bright-red',
    'shadow-bright-red',
    'from-bright-red',
    'to-bright-red',
    'via-bright-red',
    'bg-deep-dark',
    'text-deep-dark',
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Audiowide', 'sans-serif'],      // For headings
        'body': ['Exo 2', 'sans-serif'],             // For body text
        'condensed': ['Share Tech Mono', 'monospace'], // For UI elements
      },
      // 1. CUSTOM COLORS (You have these, but ensure they match the JSX usage)
      colors: {
        'bright-red': '#ff1a1a', // A bright, glowing red for accents
        'cyan-400': '#22d3ee',    // A bright cyan for the new button
        'dark-red': '#b30000',   // A deeper red for hover states or secondary elements
        'deep-dark': '#000000',    // A pure black background
      },
      
      // 2. CUSTOM BOX SHADOWS (For button glows)
      boxShadow: {
        'neon-cyan': '0 0 10px #22d3ee, 0 0 20px #22d3ee',
        'neon-red': '0 0 10px #ff1a1a, 0 0 20px #ff1a1a',
        'neon-dark-red': '0 0 10px rgba(179, 0, 0, 0.6), 0 0 20px rgba(179, 0, 0, 0.4)',
      },

      // 3. CUSTOM BACKGROUND IMAGE (For the central radial glow)
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at center, rgba(255, 26, 26, 0.1) 0%, rgba(0, 0, 0, 1) 70%)',
      },

      // 4. KEYFRAMES & ANIMATION (For the floating button)
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'noise': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(7%, -20%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 25px rgba(255, 26, 26, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 40px rgba(255, 26, 26, 0.8))' },
        },
        'grid-scroll': {
          '0%': { 'background-position': '0 0' },
          '100%': { 'background-position': '-40px -40px' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        noise: 'noise 2s linear infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'grid-scroll': 'grid-scroll 2s linear infinite',
      },

      textShadow: {
        'red-soft': '0 0 4px rgba(255, 26, 26, 0.4), 0 0 8px rgba(255, 26, 26, 0.3)',
        'red-medium': '0 0 5px rgba(255, 26, 26, 0.7), 0 0 15px rgba(255, 26, 26, 0.5)',
        'red-intense': '0 0 5px #ff1a1a, 0 0 15px #ff1a1a, 0 0 30px #ff1a1a',
      },
      
    }, // end of extend
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
};