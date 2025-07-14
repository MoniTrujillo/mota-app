const fs = require('fs');
const path = require('path');

// Las rutas deben apuntar a la raíz del proyecto, no a la carpeta scripts
const envExamplePath = path.join(__dirname, '..', '.env.example');
const envPath = path.join(__dirname, '..', '.env');

// Verificar si .env.example existe
if (!fs.existsSync(envExamplePath)) {
  console.log('❌ .env.example no encontrado');
  process.exit(1);
}

// Verificar si .env ya existe
if (fs.existsSync(envPath)) {
  console.log('✅ El archivo .env ya existe, no se sobrescribirá');
  process.exit(0);
}

try {
  // Copiar .env.example a .env
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Archivo .env creado exitosamente desde .env.example');
  console.log('📝 Recuerda configurar las variables de entorno en el archivo .env');
} catch (error) {
  console.error('❌ Error al crear el archivo .env:', error.message);
  process.exit(1);
}
