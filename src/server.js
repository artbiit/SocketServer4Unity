import net from 'net';
import initServer from './init/index.js';
import configs from './configs/configs.js';
import { onConnection } from './events/onConnection.js';
import logger from './utils/logger.js';

const { SERVER_HOST, SERVER_PORT, SERVER_BIND } = configs;

const server = net.createServer(onConnection);

try {
  await initServer();

  server.listen(SERVER_PORT, SERVER_BIND, () => {
    logger.info(`Server is on =>  ${SERVER_BIND}:${SERVER_PORT}`);
  });
} catch (e) {
  logger.error(e);
  process.exit(1);
}
