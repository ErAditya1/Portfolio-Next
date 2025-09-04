// tailwind.config.js (only the extend part shown)
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#06b6d4',      // cyan
        accent2: '#7c3aed',     // purple
        accent3: '#FF6B6B',     // coral warm CTA
        neon: '#12f7ff',
        midnight: '#0b0710',
        surface: 'rgba(255,255,255,0.04)',
      },
      boxShadow: {
        'neon-lg': '0 8px 40px rgba(18,247,255,0.08), inset 0 1px 0 rgba(255,255,255,0.02)',
        'glow-accent': '0 8px 30px rgba(124,58,237,0.12)',
      },
      keyframes: {
        floaty: { '0%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' }, '100%': { transform: 'translateY(0)' } },
      },
      animation: { floaty: 'floaty 4s ease-in-out infinite' },
    },
  },
  plugins: [],
}
