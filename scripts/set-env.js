// Genera src/environments/environment.ts en el build de producción.
// En Vercel se define la variable API_URL con la URL pública del backend
// (por ejemplo https://ayala-backend.onrender.com). Sin API_URL, usa el local.
const fs = require('fs');
const path = require('path');

const base = (process.env.API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
const contenido = `export const environment = {
  env: 'DEFAULT',
  production: true,
  apiUrl: '${base}/api',
  serverUrl: '${base}/api',
  imgUrl: '${base}/',
};
`;
fs.writeFileSync(path.join(__dirname, '..', 'src', 'environments', 'environment.ts'), contenido);
console.log(`environment.ts -> ${base}/api`);
