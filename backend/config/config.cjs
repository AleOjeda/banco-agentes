const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env'), quiet: true });

const common = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql'
};

module.exports = {
  development: { ...common },
  test: {
    ...common,
    database: process.env.DB_NAME_TEST || `${process.env.DB_NAME}_test`
  },
  production: { ...common }
};
