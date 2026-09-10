import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      colors: {
        ink: "#F4F7FA",
        mist: "#A7B3C2",
        haze: "#5D6A7A",
        glass: "rgba(255, 255, 255, 0.05)",
        edge: "rgba(255, 255, 255, 0.12)",
        beam: "#8FE3F0",
      },
    },
  },
  plugins: [],
};

export default config;
