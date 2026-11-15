import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { MONEDAS_VALIDAS } from '../../constants/monedas.js';

const MAX_CUENTA = 100;
const MAX_TITULAR = 150;
const MAX_DESCRIPCION = 255;

const FORM_INICIAL = {
  cuentaOrigen: '',
  cuentaDestino: '',
  titularDestino: '',
  monto: '',
  moneda: 'CLP',
  descripcion: ''
};

// Validación de UX (espejo del backend, que sigue siendo la autoridad real).
// Solo evita envíos obviamente inválidos; el backend valida igual.
function validar(form) {
  const errores = {};

  if (!form.cuentaOrigen.trim()) {
    errores.cuentaOrigen = 'La cuenta de origen es obligatoria.';
  } else if (form.cuentaOrigen.trim().length > MAX_CUENTA) {
    errores.cuentaOrigen = `Máximo ${MAX_CUENTA} caracteres.`;
  }

  if (!form.cuentaDestino.trim()) {
    errores.cuentaDestino = 'La cuenta de destino es obligatoria.';
  } else if (form.cuentaDestino.trim().length > MAX_CUENTA) {
    errores.cuentaDestino = `Máximo ${MAX_CUENTA} caracteres.`;
  }

  if (
    form.cuentaOrigen.trim() &&
    form.cuentaDestino.trim() &&
    form.cuentaOrigen.trim() === form.cuentaDestino.trim()
  ) {
    errores.cuentaDestino = 'La cuenta de destino no puede ser igual a la de origen.';
  }

  if (!form.titularDestino.trim()) {
    errores.titularDestino = 'El titular de destino es obligatorio.';
  } else if (form.titularDestino.trim().length > MAX_TITULAR) {
    errores.titularDestino = `Máximo ${MAX_TITULAR} caracteres.`;
  }

  const montoNumerico = Number(form.monto);
  if (form.monto === '' || !Number.isFinite(montoNumerico) || montoNumerico <= 0) {
    errores.monto = 'El monto debe ser un número mayor que cero.';
  }

  if (!MONEDAS_VALIDAS.includes(form.moneda)) {
    errores.moneda = 'Selecciona una moneda válida.';
  }

  if (form.descripcion.trim().length > MAX_DESCRIPCION) {
    errores.descripcion = `Máximo ${MAX_DESCRIPCION} caracteres.`;
  }

  return errores;
}

// Diálogo de creación de transferencias. No contiene lógica HTTP: recibe
// `onSubmit` (provisto por la página) que ya encapsula la llamada al service.
function TransferenciaFormDialog({ open, submitting, onSubmit, onClose }) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleClose = () => {
    if (submitting) return;
    setForm(FORM_INICIAL);
    setErrores({});
    setErrorServidor(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor(null);

    const erroresValidacion = validar(form);
    setErrores(erroresValidacion);

    if (Object.keys(erroresValidacion).length > 0) return;

    const datos = {
      cuentaOrigen: form.cuentaOrigen.trim(),
      cuentaDestino: form.cuentaDestino.trim(),
      titularDestino: form.titularDestino.trim(),
      monto: Number(form.monto),
      moneda: form.moneda,
      descripcion: form.descripcion.trim() || undefined
    };

    const resultado = await onSubmit(datos);

    if (!resultado.ok) {
      setErrorServidor(resultado.message);
      return;
    }

    setForm(FORM_INICIAL);
    setErrores({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Nueva transferencia</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {errorServidor && <Alert severity="error">{errorServidor}</Alert>}

            <TextField
              label="Cuenta de origen"
              value={form.cuentaOrigen}
              onChange={handleChange('cuentaOrigen')}
              error={Boolean(errores.cuentaOrigen)}
              helperText={errores.cuentaOrigen}
              inputProps={{ maxLength: MAX_CUENTA }}
              disabled={submitting}
              fullWidth
              required
            />

            <TextField
              label="Cuenta de destino"
              value={form.cuentaDestino}
              onChange={handleChange('cuentaDestino')}
              error={Boolean(errores.cuentaDestino)}
              helperText={errores.cuentaDestino}
              inputProps={{ maxLength: MAX_CUENTA }}
              disabled={submitting}
              fullWidth
              required
            />

            <TextField
              label="Titular de destino"
              value={form.titularDestino}
              onChange={handleChange('titularDestino')}
              error={Boolean(errores.titularDestino)}
              helperText={errores.titularDestino}
              inputProps={{ maxLength: MAX_TITULAR }}
              disabled={submitting}
              fullWidth
              required
            />

            <TextField
              label="Monto"
              type="number"
              value={form.monto}
              onChange={handleChange('monto')}
              error={Boolean(errores.monto)}
              helperText={errores.monto}
              disabled={submitting}
              inputProps={{ min: 0, step: '0.01' }}
              fullWidth
              required
            />

            <TextField
              select
              label="Moneda"
              value={form.moneda}
              onChange={handleChange('moneda')}
              error={Boolean(errores.moneda)}
              helperText={errores.moneda}
              disabled={submitting}
              fullWidth
              required
            >
              {MONEDAS_VALIDAS.map((moneda) => (
                <MenuItem key={moneda} value={moneda}>
                  {moneda}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Descripción (opcional)"
              value={form.descripcion}
              onChange={handleChange('descripcion')}
              error={Boolean(errores.descripcion)}
              helperText={errores.descripcion}
              inputProps={{ maxLength: MAX_DESCRIPCION }}
              disabled={submitting}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Crear
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TransferenciaFormDialog;
