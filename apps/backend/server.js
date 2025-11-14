import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import propertiesRoutes from './routes/properties.js';
import bookingsRoutes from './routes/bookings.js';
import suggestRoutes from './routes/suggest.js';
import authRoutes from './routes/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

await connectDatabase();

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/suggest', suggestRoutes);

app.use(errorHandler);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);

    if (process.env.RENDER) {
        const PING_INTERVAL = 14 * 60 * 1000;
        const SERVER_URL =
            process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`;

        setInterval(async () => {
            try {
                const response = await fetch(`${SERVER_URL}/health`);
                console.log(
                    `[Self-ping] Status: ${
                        response.status
                    } at ${new Date().toISOString()}`
                );
            } catch (error) {
                console.error('[Self-ping] Error:', error.message);
            }
        }, PING_INTERVAL);

        console.log('Самопинг активирован для Render');
    }
});
