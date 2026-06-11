import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pixdark: {
          DEFAULT: "#121212",
          light: "#1e1e1e",
          lighter: "#2a2a2a"
        },
        pixorange: {
          DEFAULT: "#FF6600",
          hover: "#e55c00",
          light: "#ff8533"
        }
      }
    },
  },
  plugins: [],
};

export default config;