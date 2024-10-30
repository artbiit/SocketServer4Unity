import { getGameSession } from '../../session/game.session.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { RESPONSE_SUCCESS_CODE } from '../index.js';
import Result from '../result.js';

const updateLocationHandler = ({ socket, payload }) => {
  const result = new Result(handlerIds.game.UpdateLocationPayLoad, RESPONSE_SUCCESS_CODE, {});

  const { gameId, userId, x, y } = payload;

  const gameSession = getGameSession(gameId);
  if (!gameSessions) {
    result.responseCode = ErrorCodes.GAME_NOT_FOUND;
    return result;
  }

  const user = gameSession.getUser(userId);
  if (!user) {
    result.responseCode = ErrorCodes.USER_NOT_FOUND;
    return result;
  }

  user.updatePosition(x, y);
  result.payload = gameSession.getAllLocation();
};

export default updateLocationHandler;
