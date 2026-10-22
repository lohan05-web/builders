import type { Config } from "tailwindcss";

/**
 * Tailwind configuration for the LM Builders site.
 *
 * Brand palette:
 *  - `charcoal` : deep near-black background (#111111)
 *  - `gold`     : primary accent colour (#C9A24B)
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#111111",
          900: "#0A0A0A",
          800: "#171717",
          700: "#1F1F1F",
          600: "#292929",
          500: "#3A3A3A",
        },
        gold: {
          DEFAULT: "#C9A24B",
          light: "#DCBC72",
          dark: "#A8853A",
        },
      },
      fontFamily: {
        // Wired up in app/layout.tsx via next/font CSS variables.
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
      },
      transitionTimingFunction: {
        // Slightly heavier ease for a "premium" feel.
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #DCBC72 0%, #C9A24B 45%, #A8853A 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
