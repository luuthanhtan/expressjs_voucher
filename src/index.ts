import logger from 'jet-logger';
import dotenv from 'dotenv';
import server from './server';

dotenv.config();
const SERVER_START_MSG = ('Express server started on port: ' + 
  (process.env.PORT??3000).toString());

server.listen(process.env.PORT, () => logger.info(SERVER_START_MSG));
