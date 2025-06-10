import { appConfig } from './../config/app';
import logger from 'jet-logger';
import server from './server';

const SERVER_START_MSG = ('Express server started on port: ' + 
  (appConfig.port).toString());

server.listen(appConfig.port, () => logger.info(SERVER_START_MSG));
