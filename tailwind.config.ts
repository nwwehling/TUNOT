import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      colors: {
        ink: "#111111",
        paper: "#ffffff",
        rule: "#d4d4d4",
        muted: "#6b6b6b",
        fill: "#f4f4f0",
        tu: {
          green: "#b1bd00",
          greenDark: "#8a9300",
          greenSoft: "#e8ebc0",
          greenFaint: "#f4f6d9",
          black: "#000000",
        },
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
