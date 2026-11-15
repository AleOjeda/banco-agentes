import httpClient from './httpClient.js';

// Todas las llamadas HTTP relativas a transferencias viven acá, centralizadas,
// para que los componentes/hooks no contengan lógica de red directamente.

export async function listar(filtros = {}) {
  const params = {};

  if (filtros.estado) params.estado = filtros.estado;
  if (filtros.moneda) params.moneda = filtros.moneda;
  if (filtros.busqueda) params.busqueda = filtros.busqueda;

  const response = await httpClient.get('/transferencias', { params });
  return response.data;
}

export async function obtener(id) {
  const response = await httpClient.get(`/transferencias/${id}`);
  return response.data;
}

export async function crear(datos) {
  const response = await httpClient.post('/transferencias', datos);
  return response.data;
}

export async function aprobar(id) {
  const response = await httpClient.patch(`/transferencias/${id}/aprobar`);
  return response.data;
}

export async function pagar(id) {
  const response = await httpClient.patch(`/transferencias/${id}/pagar`);
  return response.data;
}

export async function eliminar(id) {
  await httpClient.delete(`/transferencias/${id}`);
}
