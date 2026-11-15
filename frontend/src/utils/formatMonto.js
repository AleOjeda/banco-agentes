// Formatea un monto (que puede llegar como string, ya que Sequelize devuelve
// los DECIMAL como string) según la moneda de la fila.
const LOCALE_POR_MONEDA = {
  CLP: 'es-CL',
  ARS: 'es-AR',
  USD: 'en-US'
};

export function formatMonto(monto, moneda) {
  const valorNumerico = Number(monto);

  if (!Number.isFinite(valorNumerico)) {
    return String(monto ?? '');
  }

  const locale = LOCALE_POR_MONEDA[moneda] || 'es-CL';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valorNumerico);
  } catch {
    return `${valorNumerico.toFixed(2)} ${moneda ?? ''}`.trim();
  }
}
