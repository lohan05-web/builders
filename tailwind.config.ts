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
        navy: {
          DEFAULT: "#0B1F3A",
          light: "#14305A",
        },
        orange: {
          DEFAULT: "#F26B21",
          hover: "#D95A14",
        },
        warm: {
          white: "#F8F6F2",
        },
        text: {
          dark: "#1A1A1A",
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
