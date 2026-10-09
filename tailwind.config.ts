import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F7FA",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#173F5F",
          hover: "#113049",
        },
        secondary: {
          DEFAULT: "#20639B",
          hover: "#184e7a",
        },
        accent: {
          DEFAULT: "#F6A623",
          hover: "#d98d12",
        },
        success: {
          DEFAULT: "#2E8B57",
          light: "#E8F5E9",
        },
        warning: {
          DEFAULT: "#D9822B",
          light: "#FFF3E0",
        },
        danger: {
          DEFAULT: "#C0392B",
          light: "#FFEBEE",
        },
        "text-primary": "#17212B",
        "text-secondary": "#5A6B7B",
        border: "#DDE3EA",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Devanagari", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
