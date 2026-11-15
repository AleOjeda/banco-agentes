import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/health', () => {
  it('responde 200 con el estado del servicio', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/no-existe', () => {
  it('responde 404 con el shape estándar de error para rutas inexistentes', async () => {
    const response = await request(app).get('/api/no-existe');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: { code: 'RUTA_NO_ENCONTRADA', message: expect.any(String) },
    });
  });
});
