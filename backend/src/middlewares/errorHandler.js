import { ApiError } from './errors.js';

// Middleware centralizado de manejo de errores.
// No expone detalles internos (por ejemplo, errores de MySQL) al cliente.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message }
    });
  }

  // Error no controlado (ej. fallo de conexión, error interno de Sequelize/MySQL):
  // se registra en el log del servidor pero nunca se expone su detalle al cliente.
  console.error(err);

  res.status(500).json({
    error: { code: 'ERROR_INTERNO', message: 'Error interno del servidor' }
  });
}
