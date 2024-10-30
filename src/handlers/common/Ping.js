import { getUserBySocket } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const pingHandler = ({ socket, payload }) => {
  const user = getUserBySocket(socket);

  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND);
  }

  const { timestamp } = payload;
  user.handlePong(timestamp);
};

export default pingHandler;
