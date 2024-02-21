import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('tailfly')({
      palette: {
        Modes: ['light', 'dark'],
        py: ["#fff", "#000"],
        sy: ["#e2eaff"],
        bd: ["#235fe6"],
        cl: ["#000c26", "#f7f7f7"],
      }
    })
  ],
};
export default config;
