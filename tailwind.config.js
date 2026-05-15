/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#875A7B",
        secondary: "#00A09D",
        accent: "#F0B662",
        background: "#F8F9FA",
        surface: "#FFFFFF",
        error: "#FF5B5B",
        success: "#28A745",
        text: {
          DEFAULT: "#212529",
          muted: "#6C757D",
          light: "#ADB5BD"
        }
      },
    },
  },
  plugins: [],
}
