import { useEffect, useState, useCallback } from 'react';
import { fetchHealth } from '../services/healthApi.js';

export const HEALTH_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

function getErrorMessage(err) {
  return err.response
    ? `El servidor respondió con un error (${err.response.status}).`
    : 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
}

export function useHealth() {
  const [status, setStatus] = useState(HEALTH_STATUS.LOADING);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchHealth()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setStatus(HEALTH_STATUS.SUCCESS);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err));
        setStatus(HEALTH_STATUS.ERROR);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const refetch = useCallback(() => {
    setStatus(HEALTH_STATUS.LOADING);
    setError(null);

    fetchHealth()
      .then((result) => {
        setData(result);
        setStatus(HEALTH_STATUS.SUCCESS);
      })
      .catch((err) => {
        setError(getErrorMessage(err));
        setStatus(HEALTH_STATUS.ERROR);
      });
  }, []);

  return { status, data, error, refetch };
}
