import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { RESPONSE_SUCCESS_CODE } from '../index.js';
import Result from '../result.js';
import game from '../../classes/models/game.class.js';
import { getUserBySocket } from '../../session/user.session.js';

const updateLocationHandler = ({ socket, payload }) => {
  const result = new Result(RESPONSE_SUCCESS_CODE, {});

  const { x, y } = payload;

  const user = getUserBySocket(socket);
  if (!user || !game.getUser(user.id)) {
    result.responseCode = ErrorCodes.USER_NOT_FOUND;
    return result;
  }
  user.updatePosition(x, y);
  result.payload = { message: '위치 갱신 완료' };
};

export default updateLocationHandler;
