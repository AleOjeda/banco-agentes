import { Router } from 'express';
import * as transferenciaController from '../controllers/transferencia.controller.js';

const router = Router();

router.get('/transferencias', transferenciaController.listar);
router.get('/transferencias/:id', transferenciaController.obtener);
router.post('/transferencias', transferenciaController.crear);
router.patch('/transferencias/:id/aprobar', transferenciaController.aprobar);
router.patch('/transferencias/:id/pagar', transferenciaController.pagar);
router.delete('/transferencias/:id', transferenciaController.eliminar);

export default router;
