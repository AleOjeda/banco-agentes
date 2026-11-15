import { Sequelize } from 'sequelize';
import './env.js';

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_NAME_TEST,
  DB_USER,
  DB_PASSWORD,
  NODE_ENV
} = process.env;

// En entorno de pruebas se usa una base de datos separada para no
// interferir con los datos de desarrollo.
const databaseName = NODE_ENV === 'test' ? DB_NAME_TEST || `${DB_NAME}_test` : DB_NAME;

const sequelize = new Sequelize(databaseName, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : undefined,
  dialect: 'mysql',
  logging: false
});

export default sequelize;
