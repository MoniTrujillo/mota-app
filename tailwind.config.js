/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'primary-color': '#5FA2AD',      // Azul MOTA
        'title-color': '#313E4B',        // Texto Iniciar Sesión
        'input-color': '#94C6CC',  // Input fields
        'background-color': '#EDEDED',  // Fondo general
      },
      fontSize: {
        'heading-xl': '32px', // MOTA
        'heading-lg': '28px', // Iniciar Sesión
        'label': '18px',      // Texto de correo/contraseña
      },
      spacing: {
        'button-width': '160px',
      },
    },
  },
  plugins: [],
}
