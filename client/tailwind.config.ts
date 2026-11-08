import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: "#FAF9F5",
          dark: "#050505",
        },
        card: {
          light: "#FFFFFF",
          dark: "#0C0C0C",
        },
        border: {
          light: "#E6E4DD",
          dark: "#1F1F1F",
        },
        vermilion: {
          DEFAULT: "#E53E00",
          hover: "#CC3500",
          muted: "rgba(229, 62, 0, 0.08)",
          subtle: "rgba(229, 62, 0, 0.15)",
        },
        ink: {
          DEFAULT: "#111111",
          muted: "#57534E",
          faint: "#A8A29E",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.035em",
      },
    },
  },
  plugins: [],
};
export default config;
