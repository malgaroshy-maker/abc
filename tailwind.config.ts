import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        shift: {
          night: "#1e3a8a",
          morning: "#f59e0b",
          evening: "#7c3aed"
        }
      }
    }
  },
  plugins: []
};

export default config;
