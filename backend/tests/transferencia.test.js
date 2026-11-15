import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import sequelize from '../src/config/database.js';
import Transferencia from '../src/models/transferencia.model.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';

const datosValidos = () => ({
  cuentaOrigen: 'CTA-EMPRESA-001',
  cuentaDestino: 'CTA-PROVEEDOR-020',
  titularDestino: 'Proveedor ficticio',
  monto: 150000,
  moneda: 'CLP',
  descripcion: 'Pago de prueba'
});

async function crearTransferencia(overrides = {}) {
  const response = await request(app)
    .post('/api/transferencias')
    .send({ ...datosValidos(), ...overrides });
  return response;
}

beforeEach(async () => {
  await Transferencia.destroy({ where: {}, truncate: true, force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/transferencias', () => {
  it('crea una transferencia válida en estado NUEVA con referencia única generada por el backend', async () => {
    const response = await crearTransferencia();

    expect(response.status).toBe(201);
    expect(response.body.estado).toBe('NUEVA');
    expect(response.body.referencia).toBeTruthy();
    expect(typeof response.body.referencia).toBe('string');
    expect(response.body.fechaAprobacion).toBeNull();
    expect(response.body.fechaPago).toBeNull();
  });

  it('rechaza monto cero', async () => {
    const response = await crearTransferencia({ monto: 0 });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBeTruthy();
  });

  it('rechaza monto negativo', async () => {
    const response = await crearTransferencia({ monto: -100 });
    expect(response.status).toBe(400);
  });

  it('rechaza un monto que excede el máximo permitido por DECIMAL(14,2)', async () => {
    const response = await crearTransferencia({ monto: 1000000000000 });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('MONTO_INVALIDO');

    const total = await Transferencia.count();
    expect(total).toBe(0);
  });

  it('rechaza cuenta origen y destino iguales', async () => {
    const response = await crearTransferencia({
      cuentaOrigen: 'CTA-MISMA',
      cuentaDestino: 'CTA-MISMA'
    });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('CUENTAS_IGUALES');
  });

  it('rechaza moneda fuera del enum', async () => {
    const response = await crearTransferencia({ moneda: 'EUR' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('MONEDA_INVALIDA');
  });

  it('ignora intentos de forzar estado o referencia desde el body', async () => {
    const response = await crearTransferencia({
      estado: 'PAGADA',
      referencia: 'REF-FORZADA-123'
    });

    expect(response.status).toBe(201);
    expect(response.body.estado).toBe('NUEVA');
    expect(response.body.referencia).not.toBe('REF-FORZADA-123');
  });

  it('genera referencias únicas entre dos creaciones distintas', async () => {
    const primera = await crearTransferencia();
    const segunda = await crearTransferencia();

    expect(primera.body.referencia).not.toBe(segunda.body.referencia);
  });
});

describe('PATCH /api/transferencias/:id/aprobar', () => {
  it('aprueba una transferencia NUEVA', async () => {
    const creada = await crearTransferencia();

    const response = await request(app).patch(`/api/transferencias/${creada.body.id}/aprobar`);

    expect(response.status).toBe(200);
    expect(response.body.estado).toBe('APROBADA');
    expect(response.body.fechaAprobacion).toBeTruthy();
  });

  it('rechaza aprobar una transferencia ya APROBADA', async () => {
    const creada = await crearTransferencia();
    await request(app).patch(`/api/transferencias/${creada.body.id}/aprobar`);

    const response = await request(app).patch(`/api/transferencias/${creada.body.id}/aprobar`);

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('TRANSICION_INVALIDA');
  });

  it('rechaza aprobar una transferencia PAGADA', async () => {
    const creada = await crearTransferencia();
    await request(app).patch(`/api/transferencias/${creada.body.id}/aprobar`);
    await request(app).patch(`/api/transferencias/${creada.body.id}/pagar`);

    const response = await request(app).patch(`/api/transferencias/${creada.body.id}/aprobar`);

    expect(response.status).toBe(409);
  });

  it('responde 404 para una transferencia inexistente', async () => {
    const response = await request(app).patch('/api/transferencias/999999/aprobar');
    expect(response.status).toBe(404);
  });
});

describe('PATCH /api/transferencias/:id/pagar', () => {
  it('paga una transferencia APROBADA', async () => {
    const creada = await crearTransferencia();
    await request(app).patch(`/api/transferencias/${creada.body.id}/aprobar`);

    const response = await request(app).patch(`/api/transferencias/${creada.body.id}/pagar`);

    expect(response.status).toBe(200);
    expect(response.body.estado).toBe('PAGADA');
    expect(response.body.fechaPago).toBeTruthy();
  });

  it('rechaza pagar directamente una transferencia NUEVA', async () => {
    const creada = await crearTransferencia();

    const response = await request(app).patch(`/api/transferencias/${creada.body.id}/pagar`);

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('TRANSICION_INVALIDA');
  });

  it('rechaza pagar una transferencia ya PAGADA', async () => {
    const creada = await crearTransferencia();
    await request(app).patch(`/api/transferencias/${creada.body.id}/aprobar`);
    await request(app).patch(`/api/transferencias/${creada.body.id}/pagar`);

    const response = await request(app).patch(`/api/transferencias/${creada.body.id}/pagar`);

    expect(response.status).toBe(409);
  });
});

describe('DELETE /api/transferencias/:id', () => {
  it('elimina una transferencia NUEVA', async () => {
    const creada = await crearTransferencia();

    const response = await request(app).delete(`/api/transferencias/${creada.body.id}`);

    expect(response.status).toBe(204);

    const detalle = await request(app).get(`/api/transferencias/${creada.body.id}`);
    expect(detalle.status).toBe(404);
  });

  it('rechaza eliminar una transferencia APROBADA', async () => {
    const creada = await crearTransferencia();
    await request(app).patch(`/api/transferencias/${creada.body.id}/aprobar`);

    const response = await request(app).delete(`/api/transferencias/${creada.body.id}`);

    expect(response.status).toBe(409);
  });

  it('rechaza eliminar una transferencia PAGADA', async () => {
    const creada = await crearTransferencia();
    await request(app).patch(`/api/transferencias/${creada.body.id}/aprobar`);
    await request(app).patch(`/api/transferencias/${creada.body.id}/pagar`);

    const response = await request(app).delete(`/api/transferencias/${creada.body.id}`);

    expect(response.status).toBe(409);
  });
});

describe('Recursos inexistentes', () => {
  it('GET de id inexistente responde 404', async () => {
    const response = await request(app).get('/api/transferencias/999999');
    expect(response.status).toBe(404);
  });

  it('DELETE de id inexistente responde 404', async () => {
    const response = await request(app).delete('/api/transferencias/999999');
    expect(response.status).toBe(404);
  });

  it('id no numérico responde 400', async () => {
    const response = await request(app).get('/api/transferencias/abc');
    expect(response.status).toBe(400);
  });

  it('id numérico fuera de rango seguro responde 400', async () => {
    const response = await request(app).get('/api/transferencias/99999999999999999999');
    expect(response.status).toBe(400);
  });
});

describe('GET /api/transferencias (listado y filtros)', () => {
  it('devuelve un arreglo vacío cuando no hay transferencias', async () => {
    const response = await request(app).get('/api/transferencias');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('filtra por estado', async () => {
    const nueva = await crearTransferencia();
    const paraAprobar = await crearTransferencia();
    await request(app).patch(`/api/transferencias/${paraAprobar.body.id}/aprobar`);

    const response = await request(app).get('/api/transferencias?estado=APROBADA');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe(paraAprobar.body.id);
    expect(response.body.some((t) => t.id === nueva.body.id)).toBe(false);
  });

  it('filtra por moneda', async () => {
    await crearTransferencia({ moneda: 'CLP' });
    await crearTransferencia({ moneda: 'USD' });

    const response = await request(app).get('/api/transferencias?moneda=USD');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].moneda).toBe('USD');
  });

  it('rechaza un estado de filtro inválido', async () => {
    const response = await request(app).get('/api/transferencias?estado=INVALIDO');
    expect(response.status).toBe(400);
  });

  it('busca por referencia o titular destino parcial', async () => {
    const creada = await crearTransferencia({ titularDestino: 'Juan Perez Ficticio' });

    const porReferencia = await request(app).get(
      `/api/transferencias?busqueda=${creada.body.referencia.slice(0, 6)}`
    );
    const porTitular = await request(app).get('/api/transferencias?busqueda=Juan Perez');

    expect(porReferencia.status).toBe(200);
    expect(porReferencia.body.some((t) => t.id === creada.body.id)).toBe(true);

    expect(porTitular.status).toBe(200);
    expect(porTitular.body.some((t) => t.id === creada.body.id)).toBe(true);
  });
});

describe('Manejo de errores internos', () => {
  it('no expone el mensaje interno de un error no controlado (ej. Sequelize/MySQL)', () => {
    const errorInterno = new Error(
      "ER_DUP_ENTRY: Duplicate entry 'detalle-interno-mysql' for key 'transferencias.PRIMARY'"
    );
    errorInterno.name = 'SequelizeDatabaseError';

    const res = {
      statusCode: null,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    errorHandler(errorInterno, {}, res, () => {});

    expect(res.statusCode).toBe(500);
    expect(res.body.error.code).toBe('ERROR_INTERNO');
    expect(res.body.error.message).not.toMatch(/mysql|detalle-interno|ER_DUP_ENTRY/i);
  });
});
