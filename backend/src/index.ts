import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import vehiclesRoutes from './routes/vehicles';
import damageRoutes from './routes/damage';
import typebotRoutes from './routes/typebot';
import aiRoutes from './routes/ai';
import dataRoutes from './routes/data';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/damage-records', damageRoutes);
app.use('/api/typebot', typebotRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/data', dataRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on ${port}`));
