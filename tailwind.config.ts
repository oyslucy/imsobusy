import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "-apple-system",
          "system-ui",
          "sans-serif",
        ],
        serif: ["Georgia", "serif"],
      },
      colors: {
        cream: "#faf6ea",
        ink: "#1c1c1c",
        yellow: {
          DEFAULT: "#f6c445",
          dark: "#e6b02e",
        },
        lavender: {
          DEFAULT: "#c9c2f0",
          dark: "#a89bdf",
        },
        coral: "#ef8a72",
        mint: "#7fd1b9",
        panel: "#efeaf9",
      },
      borderRadius: {
        card: "20px",
      },
    },
  },
  plugins: [],
} satisfies Config;
