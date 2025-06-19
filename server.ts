import express from 'express';
import routes from './src/routes';
import { connectDB } from './src/database/db';
import { setupSwagger } from './swagger';
import './src/jobs/index';
import cors from 'cors';
import dotenv from 'dotenv';
import { startAgenda } from 'queues/agendaQueue';

dotenv.config();

const app = express();
app.use(cors({
    origin: [process.env.APP_URL || 'localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(cors());
app.use(express.json());
app.use('/', routes);

connectDB();
setupSwagger(app);
if (process.env.AGENDA_ENABLE == 'true') startAgenda().catch(console.error);

export default app;
