import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { menuRouter } from './routes/menu.js';
import { reservationRouter } from './routes/reservations.js';
import { getDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Initialize DB
getDb();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/admin', reservationRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`DineSync API running on http://localhost:${PORT}`);
});
