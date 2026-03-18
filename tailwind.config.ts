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
        "bg-page": "#0a0a0a",
        "bg-input": "#2a2a2a",
        "bg-surface": "#1a1a1a",
        "border-primary": "#111111",
        "text-primary": "#ffffff",
        "text-secondary": "#6b7280",
        "text-tertiary": "#71717a",
        "accent-green": "#10b981",
        "accent-red": "#ef4444",
        "accent-amber": "#f59e0b",
      },
    },
  },
  plugins: [],
};

export default config;
