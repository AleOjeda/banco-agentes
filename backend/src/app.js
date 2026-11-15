import './config/env.js';
import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import transferenciaRoutes from './routes/transferencia.routes.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api', transferenciaRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
