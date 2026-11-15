import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { ESTADOS_VALIDOS, ESTADO_LABELS } from '../../constants/estados.js';
import { MONEDAS_VALIDAS } from '../../constants/monedas.js';

const DEBOUNCE_MS = 400;

// Barra de filtros: estado, moneda y buscador (con debounce para no disparar
// una petición por cada tecla).
function FiltrosBar({ filtros, onChange }) {
  // El buscador es el dueño de su propio valor mientras el usuario escribe;
  // solo se propaga al padre (con debounce) para no disparar una petición
  // por cada tecla. `filtros.busqueda` no cambia por fuera de este componente.
  const [busquedaLocal, setBusquedaLocal] = useState(filtros.busqueda);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (busquedaLocal !== filtros.busqueda) {
        onChange({ busqueda: busquedaLocal });
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busquedaLocal]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3
      }}
    >
      <TextField
        select
        label="Estado"
        size="small"
        value={filtros.estado}
        onChange={(e) => onChange({ estado: e.target.value })}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">Todos</MenuItem>
        {ESTADOS_VALIDOS.map((estado) => (
          <MenuItem key={estado} value={estado}>
            {ESTADO_LABELS[estado]}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Moneda"
        size="small"
        value={filtros.moneda}
        onChange={(e) => onChange({ moneda: e.target.value })}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">Todas</MenuItem>
        {MONEDAS_VALIDAS.map((moneda) => (
          <MenuItem key={moneda} value={moneda}>
            {moneda}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Buscar por referencia o destinatario"
        size="small"
        value={busquedaLocal}
        onChange={(e) => setBusquedaLocal(e.target.value)}
        sx={{ minWidth: 260, flexGrow: 1 }}
      />
    </Box>
  );
}

export default FiltrosBar;
