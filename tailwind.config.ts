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
        ink: "#1a1a1a",
        paper: "#f8f8f6",
        card: "#ffffff",
        rule: "#e8e8e5",
        muted: "#7a7a72",
        fill: "#f0f0ec",
        tu: {
          green: "#b1bd00",
          greenDark: "#7e8800",
          greenSoft: "#e2e8a0",
          greenFaint: "#f2f5d4",
          black: "#000000",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)",
        "card-hover": "0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)",
        subtle: "0 1px 2px 0 rgba(0,0,0,0.05)",
      },
      borderRadius: {
        card: "6px",
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
