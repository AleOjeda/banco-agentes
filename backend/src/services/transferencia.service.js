import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import Transferencia from '../models/transferencia.model.js';
import { ESTADOS } from '../constants/estados.js';
import { ApiError, notFound, conflict } from '../middlewares/errors.js';
import { generarReferencia } from '../utils/referencia.util.js';

const MAX_INTENTOS_REFERENCIA = 5;

function esErrorDeReferenciaDuplicada(error) {
  return (
    error?.name === 'SequelizeUniqueConstraintError' &&
    (error.errors?.some((e) => e.path === 'referencia') ||
      error.fields?.referencia !== undefined)
  );
}

/**
 * Crea una transferencia siempre en estado NUEVA con una referencia generada
 * por el backend. Reintenta de forma acotada ante la (muy improbable)
 * colisión de referencia, sin propagar el error de unicidad como 500.
 */
export async function crearTransferencia(datos) {
  let ultimoError;

  for (let intento = 0; intento < MAX_INTENTOS_REFERENCIA; intento += 1) {
    const referencia = generarReferencia();

    try {
      return await Transferencia.create({
        ...datos,
        referencia,
        estado: ESTADOS.NUEVA,
        fechaAprobacion: null,
        fechaPago: null
      });
    } catch (error) {
      if (!esErrorDeReferenciaDuplicada(error)) {
        throw error;
      }
      ultimoError = error;
    }
  }

  console.error('No se pudo generar una referencia única tras varios intentos.', ultimoError);
  throw new ApiError(
    500,
    'ERROR_GENERACION_REFERENCIA',
    'No se pudo generar una referencia única. Intente nuevamente.'
  );
}

/**
 * Lista transferencias aplicando filtros opcionales ya validados
 * (estado, moneda, búsqueda parcial por referencia o titular destino).
 */
export async function listarTransferencias(filtros = {}) {
  const where = {};

  if (filtros.estado) {
    where.estado = filtros.estado;
  }

  if (filtros.moneda) {
    where.moneda = filtros.moneda;
  }

  if (filtros.busqueda) {
    where[Op.or] = [
      { referencia: { [Op.like]: `%${filtros.busqueda}%` } },
      { titularDestino: { [Op.like]: `%${filtros.busqueda}%` } }
    ];
  }

  return Transferencia.findAll({ where, order: [['createdAt', 'DESC']] });
}

export async function obtenerTransferenciaPorId(id) {
  const transferencia = await Transferencia.findByPk(id);

  if (!transferencia) {
    throw notFound('TRANSFERENCIA_NO_ENCONTRADA', 'La transferencia solicitada no existe.');
  }

  return transferencia;
}

/**
 * Aplica una transición de estado dentro de una transacción, bloqueando la
 * fila (SELECT ... FOR UPDATE) y validando el estado bajo el lock. Nunca
 * confía en el estado que el cliente cree que tiene la transferencia.
 */
async function transicionarEstado(id, { estadoRequerido, estadoNuevo, campoFecha }) {
  return sequelize.transaction(async (t) => {
    const transferencia = await Transferencia.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!transferencia) {
      throw notFound('TRANSFERENCIA_NO_ENCONTRADA', 'La transferencia solicitada no existe.');
    }

    if (transferencia.estado !== estadoRequerido) {
      throw conflict(
        'TRANSICION_INVALIDA',
        `No es posible pasar de ${transferencia.estado} a ${estadoNuevo}. ` +
          `Se requiere que la transferencia esté en estado ${estadoRequerido}.`
      );
    }

    transferencia.estado = estadoNuevo;
    if (campoFecha) {
      transferencia[campoFecha] = new Date();
    }

    await transferencia.save({ transaction: t });

    return transferencia;
  });
}

export function aprobarTransferencia(id) {
  return transicionarEstado(id, {
    estadoRequerido: ESTADOS.NUEVA,
    estadoNuevo: ESTADOS.APROBADA,
    campoFecha: 'fechaAprobacion'
  });
}

export function pagarTransferencia(id) {
  return transicionarEstado(id, {
    estadoRequerido: ESTADOS.APROBADA,
    estadoNuevo: ESTADOS.PAGADA,
    campoFecha: 'fechaPago'
  });
}

export async function eliminarTransferencia(id) {
  return sequelize.transaction(async (t) => {
    const transferencia = await Transferencia.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!transferencia) {
      throw notFound('TRANSFERENCIA_NO_ENCONTRADA', 'La transferencia solicitada no existe.');
    }

    if (transferencia.estado !== ESTADOS.NUEVA) {
      throw conflict(
        'TRANSICION_INVALIDA',
        `No es posible eliminar una transferencia en estado ${transferencia.estado}. ` +
          `Solo pueden eliminarse transferencias en estado ${ESTADOS.NUEVA}.`
      );
    }

    await transferencia.destroy({ transaction: t });
  });
}
