import { ESTADOS } from '../constants/estados.js';

// Devuelve la fecha relevante al estado actual de la transferencia:
// NUEVA -> createdAt, APROBADA -> fechaAprobacion, PAGADA -> fechaPago.
export function fechaRelevante(transferencia) {
  if (!transferencia) return null;

  switch (transferencia.estado) {
    case ESTADOS.PAGADA:
      return transferencia.fechaPago ?? transferencia.createdAt;
    case ESTADOS.APROBADA:
      return transferencia.fechaAprobacion ?? transferencia.createdAt;
    default:
      return transferencia.createdAt;
  }
}
