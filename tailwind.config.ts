import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16141F",
        paper: "#FBFAF7",
        violet: { DEFAULT: "#6C4CF1", dark: "#5436D6", soft: "#EEEAFE" },
        lime: { DEFAULT: "#B6F23E", dark: "#7CB518" },
        coral: "#FF6B5E",
      },
      fontFamily: {
        display: ["Unbounded", "system-ui", "sans-serif"],
        body: ["Rubik", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        pop: "4px 4px 0 0 #16141F",
        popSm: "2px 2px 0 0 #16141F",
      },
    },
  },
  plugins: [],
};
export default config;
