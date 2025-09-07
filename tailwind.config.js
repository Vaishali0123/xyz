// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // For App Router (Next 13+)
  ],
  theme: {
    screens: {
      pn: "0px",
      vs: "200px",
      ss: "360px",
      pp: "500px",
      sm: "821px",
      md: "1180px",
      lg: "1440px",
      xl: "1536px",
      xxl: "1900px",
    },
    extend: {},
  },
  plugins: [],
};
