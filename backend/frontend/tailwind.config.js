/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        secondary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        success: {
          500: "#22c55e",
          600: "#16a34a",
        },
        warning: {
          500: "#f59e0b",
          600: "#d97706",
        },
        error: {
          500: "#ef4444",
          600: "#dc2626",
        },
        info: {
          500: "#3b82f6",
          600: "#2563eb",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 20px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
