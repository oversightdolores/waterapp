import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db';
import pedidoRoutes from './routes/pedido.routes'; // Cambiado a pedido.routes
import usuarioRoutes from './routes/usuario.routes';
import morgan from 'morgan';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas correctas
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/usuarios', usuarioRoutes);

export default app;
