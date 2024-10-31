import { getUserBySocket } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import logger from '../../utils/logger.js';

const pingHandler = ({ socket, payload }) => {
  const user = getUserBySocket(socket);

  if (!user) {
    logger.error(`Recv Ping but user not found : ${JSON.stringify(payload)}`);
    return null;
  }

  const { timestamp } = payload;
  user.handlePong(timestamp);
};

export default pingHandler;
