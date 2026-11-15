import { ESTADOS_VALIDOS } from '../constants/estados.js';
import { MONEDAS_VALIDAS } from '../constants/monedas.js';
import { badRequest } from '../middlewares/errors.js';

const MAX_CUENTA = 100;
const MAX_TITULAR = 150;
const MAX_DESCRIPCION = 255;
const MAX_BUSQUEDA = 150;
// Acorde a la columna DECIMAL(14,2): 12 dígitos enteros + 2 decimales.
const MONTO_MAXIMO = 999999999999.99;

function esTextoValido(valor, max) {
  return typeof valor === 'string' && valor.trim().length > 0 && valor.trim().length <= max;
}

/**
 * Valida y sanea el identificador recibido por parámetro de ruta.
 * No confía en que el frontend envíe siempre un número.
 */
export function validarId(rawId) {
  const valor = String(rawId ?? '');

  if (!/^\d+$/.test(valor) || !Number.isSafeInteger(Number(valor))) {
    throw badRequest('ID_INVALIDO', 'El identificador debe ser un número entero positivo.');
  }

  return Number(valor);
}

/**
 * Valida los filtros opcionales de listado (estado, moneda, búsqueda).
 */
export function validarFiltros(query = {}) {
  const filtros = {};
  const { estado, moneda, busqueda } = query;

  if (estado !== undefined && estado !== '') {
    if (!ESTADOS_VALIDOS.includes(estado)) {
      throw badRequest(
        'ESTADO_INVALIDO',
        `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}.`
      );
    }
    filtros.estado = estado;
  }

  if (moneda !== undefined && moneda !== '') {
    if (!MONEDAS_VALIDAS.includes(moneda)) {
      throw badRequest(
        'MONEDA_INVALIDA',
        `La moneda debe ser una de: ${MONEDAS_VALIDAS.join(', ')}.`
      );
    }
    filtros.moneda = moneda;
  }

  if (busqueda !== undefined && String(busqueda).trim() !== '') {
    filtros.busqueda = String(busqueda).trim().slice(0, MAX_BUSQUEDA);
  }

  return filtros;
}

/**
 * Valida y sanea el body de creación de una transferencia.
 * Cualquier campo no reconocido aquí (ej. `estado`, `referencia`, `id`)
 * queda ignorado silenciosamente: nunca llega al service.
 */
export function validarCreacion(body = {}) {
  const { cuentaOrigen, cuentaDestino, titularDestino, monto, moneda, descripcion } = body ?? {};

  if (!esTextoValido(cuentaOrigen, MAX_CUENTA)) {
    throw badRequest(
      'CUENTA_ORIGEN_INVALIDA',
      `La cuenta de origen es obligatoria y debe tener máximo ${MAX_CUENTA} caracteres.`
    );
  }

  if (!esTextoValido(cuentaDestino, MAX_CUENTA)) {
    throw badRequest(
      'CUENTA_DESTINO_INVALIDA',
      `La cuenta de destino es obligatoria y debe tener máximo ${MAX_CUENTA} caracteres.`
    );
  }

  if (!esTextoValido(titularDestino, MAX_TITULAR)) {
    throw badRequest(
      'TITULAR_DESTINO_INVALIDO',
      `El titular de destino es obligatorio y debe tener máximo ${MAX_TITULAR} caracteres.`
    );
  }

  const montoNumerico = Number(monto);
  const montoValido =
    monto !== undefined && monto !== null && monto !== '' && Number.isFinite(montoNumerico);

  if (!montoValido || montoNumerico <= 0) {
    throw badRequest('MONTO_INVALIDO', 'El monto debe ser un número mayor que cero.');
  }

  if (montoNumerico > MONTO_MAXIMO) {
    throw badRequest(
      'MONTO_INVALIDO',
      `El monto no puede ser mayor que ${MONTO_MAXIMO}.`
    );
  }

  if (!MONEDAS_VALIDAS.includes(moneda)) {
    throw badRequest(
      'MONEDA_INVALIDA',
      `La moneda debe ser una de: ${MONEDAS_VALIDAS.join(', ')}.`
    );
  }

  if (cuentaOrigen.trim() === cuentaDestino.trim()) {
    throw badRequest(
      'CUENTAS_IGUALES',
      'La cuenta de origen y la cuenta de destino no pueden ser iguales.'
    );
  }

  let descripcionSaneada = null;
  if (descripcion !== undefined && descripcion !== null && descripcion !== '') {
    if (typeof descripcion !== 'string' || descripcion.trim().length > MAX_DESCRIPCION) {
      throw badRequest(
        'DESCRIPCION_INVALIDA',
        `La descripción debe tener máximo ${MAX_DESCRIPCION} caracteres.`
      );
    }
    descripcionSaneada = descripcion.trim();
  }

  return {
    cuentaOrigen: cuentaOrigen.trim(),
    cuentaDestino: cuentaDestino.trim(),
    titularDestino: titularDestino.trim(),
    monto: montoNumerico,
    moneda,
    descripcion: descripcionSaneada
  };
}
