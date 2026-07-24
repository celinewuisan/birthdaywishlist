import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF8F5",
        ink: "#1A1625",
        plum: {
          950: "#14121C",
          900: "#1D1A29",
          800: "#272238",
        },
        indigo: {
          DEFAULT: "#5B4FE8",
          50: "#EFEDFD",
          100: "#DFDBFB",
          400: "#8A80EF",
          500: "#5B4FE8",
          600: "#4738D6",
          700: "#372AA8",
        },
        citrus: {
          DEFAULT: "#FFB800",
          400: "#FFC933",
          500: "#FFB800",
          600: "#E6A400",
        },
        mint: {
          DEFAULT: "#2FBF71",
          100: "#DDF6E8",
          500: "#2FBF71",
          600: "#249B5B",
        },
        coral: {
          DEFAULT: "#FF6B5E",
          100: "#FFE4E1",
          500: "#FF6B5E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(27, 22, 45, 0.08)",
        softDark: "0 4px 24px -4px rgba(0, 0, 0, 0.4)",
        tag: "2px 3px 0 0 rgba(27, 22, 45, 0.9)",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.94)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
      },
      animation: {
        pop: "pop 0.18s ease-out",
        wiggle: "wiggle 0.6s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
