import { notFound } from './errors.js';

export function notFoundHandler(req, res, next) {
  next(notFound('RUTA_NO_ENCONTRADA', 'Recurso no encontrado.'));
}
