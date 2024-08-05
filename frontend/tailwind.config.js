// tailwind.config.js
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "neon-violet":
          "0 0 5px rgba(139, 92, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.5)",
        "teardrop-shadow": "0 67px 0 0 #313338",
        "neon-white":
          "0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.5)",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(100%)", opacity: "1" },
          "100%": { transform: "translateX(0%)", opacity: "1" },
        },
        slideOut: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "1" },
        },
        
      },
      animation: {
        "popup-enter": "slideIn 0.4s ease-out forwards",
        "popup-exit": "slideOut 0.4s ease-in forwards",
       
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".text-shadow-glow-white": {
          color: "white",
          textShadow:
            "0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.7), 0 0 15px rgba(255, 255, 255, 0.7)",
        },
        ".text-shadow-glow-violet": {
          color: "white",
          textShadow:
            "0 0 5px rgba(139, 92, 246, 0.7), 0 0 10px rgba(139, 92, 246, 0.7), 0 0 15px rgba(139, 92, 246, 0.7)",
        },
      });
    }),
  ],
};
