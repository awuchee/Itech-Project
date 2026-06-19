/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#6366f1", // indigo-500
          foreground: "#ffffff",
        },
        accent: {
          light: "#ec4899", // pink-500
          DEFAULT: "#f43f5e", // rose-500
          dark: "#be123c", // rose-700
        }
      },
    },
  },
  plugins: [],
};
