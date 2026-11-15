import Chip from '@mui/material/Chip';
import { ESTADO_CHIP_COLOR, ESTADO_LABELS } from '../../constants/estados.js';

function EstadoChip({ estado }) {
  return (
    <Chip
      label={ESTADO_LABELS[estado] ?? estado}
      color={ESTADO_CHIP_COLOR[estado] ?? 'default'}
      size="small"
    />
  );
}

export default EstadoChip;
