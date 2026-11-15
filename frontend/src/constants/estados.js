// Estados válidos de una transferencia (deben coincidir con el backend, que es
// la autoridad real). Se usan aquí solo para labels y estilos de UI.
export const ESTADOS = Object.freeze({
  NUEVA: 'NUEVA',
  APROBADA: 'APROBADA',
  PAGADA: 'PAGADA'
});

export const ESTADOS_VALIDOS = Object.freeze(Object.values(ESTADOS));

export const ESTADO_LABELS = Object.freeze({
  [ESTADOS.NUEVA]: 'Nueva',
  [ESTADOS.APROBADA]: 'Aprobada',
  [ESTADOS.PAGADA]: 'Pagada'
});

// Color de chip por estado, según especificación funcional:
// NUEVA -> neutral, APROBADA -> informativo, PAGADA -> éxito.
export const ESTADO_CHIP_COLOR = Object.freeze({
  [ESTADOS.NUEVA]: 'default',
  [ESTADOS.APROBADA]: 'info',
  [ESTADOS.PAGADA]: 'success'
});
