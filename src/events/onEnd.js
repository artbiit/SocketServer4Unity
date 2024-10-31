import { removeUser } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { handleError } from '../utils/error/errorHandler.js';
import logger from '../utils/logger.js';

export const onEnd = (socket) => () => {
  logger.info('클라이언트 연결이 종료되었습니다.');
  removeUser(socket);
};
