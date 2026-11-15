const PREFIJO = 'TRF';

/**
 * Genera una referencia legible y con muy baja probabilidad de colisión:
 * prefijo + timestamp en base36 + sufijo aleatorio alfanumérico.
 * Longitud típica: ~19-21 caracteres, muy por debajo del límite de 30.
 */
export function generarReferencia() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const sufijo = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `${PREFIJO}-${timestamp}-${sufijo}`;
}
