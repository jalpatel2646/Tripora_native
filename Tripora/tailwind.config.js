/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED", // Deep purple
        secondary: "#10B981", // Emerald green
        background: "#F9FAFB",
        surface: "#FFFFFF",
        text: {
          dark: "#1F2937",
          light: "#6B7280"
        }
      }
    },
  },
  plugins: [],
}
