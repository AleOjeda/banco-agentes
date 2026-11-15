import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import EstadoChip from './EstadoChip.jsx';
import { ESTADOS } from '../../constants/estados.js';
import { formatMonto } from '../../utils/formatMonto.js';
import { formatFecha } from '../../utils/formatFecha.js';
import { fechaRelevante } from '../../utils/fechaRelevante.js';

// Tabla de transferencias. Las acciones disponibles dependen del estado de
// cada fila. No contiene lógica HTTP: delega en `onAccion` (provisto por la
// página) que abre el diálogo de confirmación correspondiente.
function TransferenciasTable({ transferencias, procesandoId, onAccion }) {
  if (transferencias.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No hay transferencias que coincidan con los filtros actuales.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow>
            <TableCell>Referencia</TableCell>
            <TableCell>Destinatario</TableCell>
            <TableCell align="right">Monto</TableCell>
            <TableCell>Moneda</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transferencias.map((transferencia) => {
            const bloqueada = procesandoId !== null && procesandoId !== undefined;

            return (
              <TableRow key={transferencia.id} hover>
                <TableCell>{transferencia.referencia}</TableCell>
                <TableCell>{transferencia.titularDestino}</TableCell>
                <TableCell align="right">
                  {formatMonto(transferencia.monto, transferencia.moneda)}
                </TableCell>
                <TableCell>{transferencia.moneda}</TableCell>
                <TableCell>
                  <EstadoChip estado={transferencia.estado} />
                </TableCell>
                <TableCell>{formatFecha(fechaRelevante(transferencia))}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {transferencia.estado === ESTADOS.NUEVA && (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={bloqueada}
                          onClick={() => onAccion('aprobar', transferencia)}
                        >
                          Aprobar
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          disabled={bloqueada}
                          onClick={() => onAccion('eliminar', transferencia)}
                        >
                          Eliminar
                        </Button>
                      </>
                    )}

                    {transferencia.estado === ESTADOS.APROBADA && (
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={bloqueada}
                        onClick={() => onAccion('pagar', transferencia)}
                      >
                        Marcar como pagada
                      </Button>
                    )}

                    {transferencia.estado === ESTADOS.PAGADA && (
                      <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>
                        Sin acciones
                      </Box>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransferenciasTable;
