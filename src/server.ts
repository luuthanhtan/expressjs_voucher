import express from 'express';
import routes from './routes';
import { connectDB } from './db';
import { setupSwagger } from './swagger';

const app = express();
app.use(express.json());
app.use('/', routes);

connectDB();
setupSwagger(app);

export default app;
