import * as transferenciaService from '../services/transferencia.service.js';
import { validarCreacion, validarFiltros, validarId } from '../validators/transferencia.validator.js';

// Controladores delgados: validan/parsean la entrada HTTP y delegan toda
// la lógica de negocio al service. Express 5 reenvía automáticamente los
// errores de promesas rechazadas al middleware de errores.

export async function listar(req, res) {
  const filtros = validarFiltros(req.query);
  const transferencias = await transferenciaService.listarTransferencias(filtros);
  res.status(200).json(transferencias);
}

export async function obtener(req, res) {
  const id = validarId(req.params.id);
  const transferencia = await transferenciaService.obtenerTransferenciaPorId(id);
  res.status(200).json(transferencia);
}

export async function crear(req, res) {
  const datos = validarCreacion(req.body);
  const transferencia = await transferenciaService.crearTransferencia(datos);
  res.status(201).json(transferencia);
}

export async function aprobar(req, res) {
  const id = validarId(req.params.id);
  const transferencia = await transferenciaService.aprobarTransferencia(id);
  res.status(200).json(transferencia);
}

export async function pagar(req, res) {
  const id = validarId(req.params.id);
  const transferencia = await transferenciaService.pagarTransferencia(id);
  res.status(200).json(transferencia);
}

export async function eliminar(req, res) {
  const id = validarId(req.params.id);
  await transferenciaService.eliminarTransferencia(id);
  res.status(204).send();
}
