import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ConfirmDialog from '../components/transferencias/ConfirmDialog.jsx';
import FiltrosBar from '../components/transferencias/FiltrosBar.jsx';
import TransferenciaFormDialog from '../components/transferencias/TransferenciaFormDialog.jsx';
import TransferenciasTable from '../components/transferencias/TransferenciasTable.jsx';
import { LISTADO_STATUS, useTransferencias } from '../hooks/useTransferencias.js';
import { useTransferenciaAcciones } from '../hooks/useTransferenciaAcciones.js';

const CONFIRM_CONFIG = {
  aprobar: {
    title: 'Aprobar transferencia',
    confirmLabel: 'Aprobar',
    confirmColor: 'primary',
    mensajeExito: 'Transferencia aprobada.',
    describe: (t) => `¿Confirmás aprobar la transferencia ${t.referencia}?`
  },
  pagar: {
    title: 'Marcar como pagada',
    confirmLabel: 'Pagar',
    confirmColor: 'primary',
    mensajeExito: 'Transferencia marcada como pagada.',
    describe: (t) => `¿Confirmás marcar como pagada la transferencia ${t.referencia}?`
  },
  eliminar: {
    title: 'Eliminar transferencia',
    confirmLabel: 'Eliminar',
    confirmColor: 'error',
    mensajeExito: 'Transferencia eliminada.',
    describe: (t) =>
      `¿Confirmás eliminar la transferencia ${t.referencia}? Esta acción no se puede deshacer.`
  }
};

function TransferenciasPage() {
  const { status, transferencias, error, filtros, actualizarFiltros, refetch } =
    useTransferencias();
  const { creando, procesandoId, crear, aprobar, pagar, eliminar } = useTransferenciaAcciones();

  const [formOpen, setFormOpen] = useState(false);
  const [confirmState, setConfirmState] = useState(null); // { tipo, transferencia }
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const notificar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCrear = async (datos) => {
    const resultado = await crear(datos);
    if (resultado.ok) {
      notificar('Transferencia creada correctamente.', 'success');
      refetch();
    }
    return resultado;
  };

  const handleAccionRequest = (tipo, transferencia) => {
    setConfirmState({ tipo, transferencia });
  };

  const handleConfirmar = async () => {
    if (!confirmState) return;

    const { tipo, transferencia } = confirmState;
    const accion = { aprobar, pagar, eliminar }[tipo];
    const resultado = await accion(transferencia.id);

    setConfirmState(null);

    if (resultado.ok) {
      notificar(CONFIRM_CONFIG[tipo].mensajeExito, 'success');
    } else {
      notificar(resultado.message, 'error');
    }

    // Se refresca siempre: en éxito para reflejar el nuevo estado, en error
    // porque puede deberse a que otra sesión ya modificó/eliminó el registro.
    refetch();
  };

  const confirmConfig = confirmState ? CONFIRM_CONFIG[confirmState.tipo] : null;

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, px: 2, pb: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Transferencias
        </Typography>
        <Button variant="contained" onClick={() => setFormOpen(true)}>
          Nueva transferencia
        </Button>
      </Stack>

      <FiltrosBar filtros={filtros} onChange={actualizarFiltros} />

      {status === LISTADO_STATUS.LOADING && (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 4 }}>
          <CircularProgress size={24} />
          <Typography>Cargando transferencias...</Typography>
        </Stack>
      )}

      {status === LISTADO_STATUS.ERROR && (
        <Stack spacing={2} sx={{ py: 2 }}>
          <Alert severity="error">{error}</Alert>
          <Box>
            <Button variant="outlined" onClick={refetch}>
              Reintentar
            </Button>
          </Box>
        </Stack>
      )}

      {status === LISTADO_STATUS.SUCCESS && (
        <TransferenciasTable
          transferencias={transferencias}
          procesandoId={procesandoId}
          onAccion={handleAccionRequest}
        />
      )}

      <TransferenciaFormDialog
        open={formOpen}
        submitting={creando}
        onSubmit={handleCrear}
        onClose={() => setFormOpen(false)}
      />

      {confirmConfig && (
        <ConfirmDialog
          open={Boolean(confirmState)}
          title={confirmConfig.title}
          message={confirmConfig.describe(confirmState.transferencia)}
          confirmLabel={confirmConfig.confirmLabel}
          confirmColor={confirmConfig.confirmColor}
          loading={procesandoId === confirmState.transferencia.id}
          onConfirm={handleConfirmar}
          onClose={() => setConfirmState(null)}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TransferenciasPage;
