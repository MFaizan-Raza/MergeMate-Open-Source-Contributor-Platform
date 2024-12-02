/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "scale-up": "scaleUp 0.3s ease-out",
        "typewriter": "typing 3s steps(30, end), blink 0.75s step-end infinite",
        swipeRight: "swipeRight 0.5s ease-out",
        swipeLeft: "swipeLeft 0.5s ease-out",
        rewrite: 'rewrite 4s steps(50) infinite',
        'char-appear': 'charAppear 0.1s forwards',
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
          "100%": { borderColor: "currentColor" },
        },
        swipeRight: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        swipeLeft: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        },
        rewrite: {
          '0%': { width: '0%', overflow: 'hidden' },  // Start with no width
          '100%': { width: '100%', overflow: 'hidden' },  // Expand to full width
        },
        'charAppear': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
