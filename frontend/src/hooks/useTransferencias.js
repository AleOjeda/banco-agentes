import { useCallback, useEffect, useState } from 'react';
import { listar } from '../services/transferenciasApi.js';
import { getApiErrorMessage } from '../utils/apiError.js';

export const LISTADO_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

const FILTROS_INICIALES = {
  estado: '',
  moneda: '',
  busqueda: ''
};

// Maneja el listado de transferencias: filtros activos, carga/éxito/error,
// y expone `refetch` para refrescar sin recargar la página (ej. después de
// crear/aprobar/pagar/eliminar).
//
// El efecto solo llama a la API y actualiza el estado dentro de sus
// callbacks .then/.catch; el estado de "cargando" se marca desde los
// manejadores de eventos (refetch/actualizarFiltros), no de forma síncrona
// dentro del efecto, para evitar cascadas de renders.
export function useTransferencias() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [reloadToken, setReloadToken] = useState(0);
  const [status, setStatus] = useState(LISTADO_STATUS.LOADING);
  const [transferencias, setTransferencias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    listar(filtros)
      .then((data) => {
        if (cancelled) return;
        setTransferencias(data);
        setStatus(LISTADO_STATUS.SUCCESS);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getApiErrorMessage(err, 'No se pudo cargar el listado de transferencias.'));
        setStatus(LISTADO_STATUS.ERROR);
      });

    return () => {
      cancelled = true;
    };
  }, [filtros, reloadToken]);

  const refetch = useCallback(() => {
    setStatus(LISTADO_STATUS.LOADING);
    setError(null);
    setReloadToken((token) => token + 1);
  }, []);

  const actualizarFiltros = useCallback((nuevosFiltros) => {
    setStatus(LISTADO_STATUS.LOADING);
    setError(null);
    setFiltros((prev) => ({ ...prev, ...nuevosFiltros }));
  }, []);

  return {
    status,
    transferencias,
    error,
    filtros,
    actualizarFiltros,
    refetch
  };
}
