export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(30px, -30px) scale(1.1)" },
          "50%": { transform: "translate(-30px, 30px) scale(0.9)" },
          "75%": { transform: "translate(-30px, -30px) scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
