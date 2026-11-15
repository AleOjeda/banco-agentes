// Formatea una fecha ISO a un formato legible (dd/mm/aaaa hh:mm).
export function formatFecha(isoDate) {
  if (!isoDate) return '-';

  const fecha = new Date(isoDate);

  if (Number.isNaN(fecha.getTime())) return '-';

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(fecha);
}
