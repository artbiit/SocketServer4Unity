import { removeUser } from '../session/user.session.js';
import logger from '../utils/logger.js';

export const onError = (socket) => (err) => {
  logger.error('소켓 오류:', err);
  removeUser(socket);
};
