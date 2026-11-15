import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// El archivo .env vive en la raíz del repositorio (junto a docker-compose.yml),
// compartido entre docker-compose y el backend.
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env'), quiet: true });
