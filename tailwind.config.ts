import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pixdark: {
          DEFAULT: "#121212", // Fondo principal
          light: "#1e1e1e",   // Tarjetas, modales
          lighter: "#2a2a2a"  // Hover en componentes oscuros
        },
        pixorange: {
          DEFAULT: "#FF6600", // CTA principal
          hover: "#e55c00",   // Hover en botones
          light: "#ff8533"    // Acentos secundarios
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;