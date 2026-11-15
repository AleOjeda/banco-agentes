import { useCallback, useState } from 'react';
import * as transferenciasApi from '../services/transferenciasApi.js';
import { getApiErrorMessage } from '../utils/apiError.js';

// Centraliza las acciones de creación/aprobación/pago/eliminación con su
// propio estado de "en curso", para poder deshabilitar botones y evitar
// doble envío. No decide qué hacer con el resultado (snackbar, refetch):
// eso queda a cargo de quien use el hook (la página).
export function useTransferenciaAcciones() {
  const [creando, setCreando] = useState(false);
  const [procesandoId, setProcesandoId] = useState(null);

  const crear = useCallback(async (datos) => {
    setCreando(true);
    try {
      const creada = await transferenciasApi.crear(datos);
      return { ok: true, data: creada };
    } catch (err) {
      return { ok: false, message: getApiErrorMessage(err, 'No se pudo crear la transferencia.') };
    } finally {
      setCreando(false);
    }
  }, []);

  const ejecutar = useCallback(async (id, accion) => {
    setProcesandoId(id);
    try {
      const data = await accion(id);
      return { ok: true, data };
    } catch (err) {
      return { ok: false, message: getApiErrorMessage(err) };
    } finally {
      setProcesandoId(null);
    }
  }, []);

  const aprobar = useCallback((id) => ejecutar(id, transferenciasApi.aprobar), [ejecutar]);
  const pagar = useCallback((id) => ejecutar(id, transferenciasApi.pagar), [ejecutar]);
  const eliminar = useCallback((id) => ejecutar(id, transferenciasApi.eliminar), [ejecutar]);

  return { creando, procesandoId, crear, aprobar, pagar, eliminar };
}
