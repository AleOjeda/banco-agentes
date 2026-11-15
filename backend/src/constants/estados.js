// Estados válidos de una transferencia y transiciones permitidas entre ellos.
// El backend es la única autoridad de estas reglas: el frontend nunca decide
// ni fuerza un estado.
export const ESTADOS = Object.freeze({
  NUEVA: 'NUEVA',
  APROBADA: 'APROBADA',
  PAGADA: 'PAGADA'
});

export const ESTADOS_VALIDOS = Object.freeze(Object.values(ESTADOS));

// Mapa de transición permitida: estado actual -> único estado siguiente posible.
// No se permiten retrocesos ni saltos (ej. NUEVA -> PAGADA).
export const TRANSICIONES_PERMITIDAS = Object.freeze({
  [ESTADOS.NUEVA]: ESTADOS.APROBADA,
  [ESTADOS.APROBADA]: ESTADOS.PAGADA
});
