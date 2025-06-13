import express from 'express';
import routes from './src/routes';
import { connectDB } from './src/database/db';
import { setupSwagger } from './src/swagger';

const app = express();
app.use(express.json());
app.use('/', routes);

connectDB();
setupSwagger(app);

export default app;
