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
        background: "#05070A",
        pcb: {
          dark: "#080B10",
          base: "#0B0F17",
          border: "#182030",
          grid: "#121A27",
        },
        silicon: {
          surface: "#0D111A",
          die: "#151C28",
          heatspreader: "#222D3E",
          copper: "#C87D55",
          gold: "#D4AF37",
        },
        neon: {
          cyan: "#00F0FF",
          amber: "#FFB020",
          emerald: "#00FF9D",
          purple: "#A855F7",
          rose: "#FF3366",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        "cyan-glow": "0 0 25px -5px rgba(0, 240, 255, 0.3)",
        "amber-glow": "0 0 25px -5px rgba(255, 176, 32, 0.3)",
        "emerald-glow": "0 0 25px -5px rgba(0, 255, 157, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
