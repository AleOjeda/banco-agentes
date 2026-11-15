import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useHealth, HEALTH_STATUS } from '../hooks/useHealth.js';

function HealthPage() {
  const { status, data, error, refetch } = useHealth();

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 8, px: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Banco Agentes
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Estado de conexión con el backend
      </Typography>

      <Stack spacing={2} sx={{ mt: 3 }}>
        {status === HEALTH_STATUS.LOADING && (
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={24} />
            <Typography>Consultando el backend...</Typography>
          </Stack>
        )}

        {status === HEALTH_STATUS.SUCCESS && (
          <Alert severity="success">
            Backend disponible.{' '}
            <Chip label={data?.status ?? 'ok'} color="success" size="small" />
          </Alert>
        )}

        {status === HEALTH_STATUS.ERROR && (
          <Alert severity="error">{error}</Alert>
        )}

        <Box>
          <Button
            variant="outlined"
            onClick={refetch}
            disabled={status === HEALTH_STATUS.LOADING}
          >
            Reintentar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default HealthPage;
