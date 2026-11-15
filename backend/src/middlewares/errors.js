// Error de negocio/validación con código y estado HTTP explícitos.
// El errorHandler traduce estas instancias a { error: { code, message } }
// sin exponer nunca detalles internos (ej. mensajes crudos de Sequelize/MySQL).
export class ApiError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function badRequest(code, message) {
  return new ApiError(400, code, message);
}

export function notFound(code, message) {
  return new ApiError(404, code, message);
}

export function conflict(code, message) {
  return new ApiError(409, code, message);
}
