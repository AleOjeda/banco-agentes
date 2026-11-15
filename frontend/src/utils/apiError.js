// Extrae un mensaje de error comprensible a partir de un error de Axios,
// siguiendo el shape de error del backend: { error: { code, message } }.
export function getApiErrorMessage(err, fallback = 'Ocurrió un error inesperado.') {
  const backendMessage = err?.response?.data?.error?.message;

  if (backendMessage) return backendMessage;

  if (err?.response) {
    return `El servidor respondió con un error (${err.response.status}).`;
  }

  if (err?.request) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
  }

  return fallback;
}

export function getApiErrorCode(err) {
  return err?.response?.data?.error?.code ?? null;
}
