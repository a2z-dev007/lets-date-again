/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["PlayfairDisplay_400Regular"],
        'playfair-italic': ["PlayfairDisplay_400Regular_Italic"],
        inter: ["Inter_400Regular"],
      },
      colors: {
        brand: {
          peach: "#FBEAF0",
          gold: "#FAC775",
          teal: "#085041",
          rose: "#ED93B1",
        }
      }
    },
  },
  plugins: [],
}
