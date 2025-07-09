/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'primary-color': '#5FA2AD',      // Azul MOTA
        'title-color': '#313E4B',        // Texto Iniciar Sesión
        'input-color': 'rgba(148,198,204,0.44)',  // Input fields
        'background-color': '#EDEDED',   // Fondo general
      },
      fontSize: {
        'heading-xl': '32px', // MOTA
        'heading-lg': '28px', // Iniciar Sesión
        'label': '18px',      // Texto de correo/contraseña
      },
      spacing: {
        'button-width': '250px',
      },
    },
  },
  plugins: [],
}
