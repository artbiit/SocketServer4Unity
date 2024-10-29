import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { onData } from './onData.js';
import logger from '../utils/logger.js';

export const onConnection = (socket) => {
  logger.info('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort);
  socket.buffer = Buffer.alloc(0);
  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
