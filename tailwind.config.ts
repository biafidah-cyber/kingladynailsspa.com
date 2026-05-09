import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#374151",
            a: { color: "#be185d", textDecoration: "underline" },
            h1: { color: "#111827" },
            h2: { color: "#111827", borderBottom: "2px solid #fce7f3", paddingBottom: "0.5rem" },
            h3: { color: "#1f2937" },
            "code::before": { content: '""' },
            "code::after":  { content: '""' },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
