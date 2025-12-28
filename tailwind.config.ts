import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0052FF", // Base Blue
        "primary-content": "#FFFFFF",
        secondary: "#EAECEF",
        "background-light": "#F9FAFB",
        "background-dark": "#0f1523",
        surface: "#FFFFFF",
        "surface-dark": "#1E2330",
        success: "#16A34A",
        danger: "#DC2626",
        gold: "#EAB308",
        warning: "#D97706",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0,0,0,0.1)",
        glow: "0 0 15px rgba(0, 82, 255, 0.3)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      },
    },
  },
  plugins: [],
};
export default config;
