import express from 'express';
import routes from './routes';
import { connectDB } from './db';

const app = express();
app.use(express.json());
app.use('/api', routes);

connectDB();

export default app;
