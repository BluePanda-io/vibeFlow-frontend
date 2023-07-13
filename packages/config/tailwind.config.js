module.exports = {
  content: [
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        edenGreen: {
          100: "#F6F8F5",
          200: "#F0F4F2",
          300: "#B2C7BF",
          400: "#7FA294",
          500: "#19563F",
          600: "#00462C",
        },
        edenPink: {
          100: "#FEF9FB",
          200: "#FAE7F1",
          300: "#FCEEF5",
          400: "#F9E1ED",
          500: "#F5C7DE",
        },
        edenGray: {
          100: "#F2F2F2",
          500: "#9D9D9D",
          700: "#626262",
          900: "#393939",
        },
        baseBlack: "#051421",
        baseWhite: "#FFFFFF",
        bgColor: "#FEFEFC",
        // --- utility colors ---
        utilityGreen: "#68A78F",
        utilityYellow: "#F1BA2D",
        utilityOrange: "#FF9843",
        utilityRed: "#FF5E6A",
        utilityDarkBlue: "#3B4756",

        // ---- deprecated colors ----
        forestGreen: "#00462C",
        cottonPink: "#F9E1ED",
        digitalGreen: "#74FA6D",
        background: "#F5F5F5",
        accentColor: "#74FA6D",
        darkGreen: "#071B08",
        soilOrange: "#FF7E5C",
        soilPurple: "#9B67FF",
        soilTurquoise: "#78EECB",
        soilYellow: "#FFF268",
        soilBlue: "#88A9FF",
        soilGray: "#BCBCBC",
        ColorF1F2FF: "#F1F2FF",
        colorFFD02B: "#FFD02B",
        colorBFFF8C: "#BFFF8C",
        colorFFA9F1: "#FFA9F1",
        colorBAE6FF: "#BAE6FF",
        soilGreen: {
          50: "#FFFFFF",
          100: "#FFFFFF",
          200: "#FFFFFF",
          300: "#E5FEE3",
          400: "#BFFDBC",
          500: "#9AFB94",
          600: "#74FA6D",
          700: "#40F837",
          800: "#14EF08",
          900: "#0FB806",
        },
      },
      fontFamily: {
        Unica: ["neue-haas-unica", "sans-serif"],
        Moret: ["Moret", "Unica", "sans-serif"],
      },
      boxShadow: {
        headerShadow: "0px 1px 15px 0px rgba(0, 0, 0, 0.15)",
        cardShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.15)",
        focusShadow: "0px 0px 0px 2px #74FA6D",
      },
      fontSize: {
        "2xl": "1.5rem",
        xl: "1.25rem",
        lg: "1.125rem",
        md: "1rem",
        sm: "0.875rem",
        xs: "",
        "2xs": "",
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
