import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import categoryRoutes from './routes/categories.js';
import analyticsRoutes from './routes/analytics.js';
import reviewRoutes from './routes/reviews.js';
import bannerRoutes from './routes/banners.js';
import settingsRoutes from './routes/settings.js';
import pixelRoutes from './routes/pixels.js';
import customerRoutes from './routes/customers.js';
import trackingRoutes from './routes/tracking.js';
import variantRoutes from './routes/variants.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/pixels', pixelRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/variants', variantRoutes);

app.get('/', (req, res) => res.json({ name: 'BagStyle DZ API', version: '1.0.0', frontend: 'http://localhost:5174' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

await initDb();

app.listen(PORT, () => {
  console.log(`BagStyle DZ backend running on http://localhost:${PORT}`);
});
