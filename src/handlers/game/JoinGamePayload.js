import { getGameSession } from '../../session/game.session.js';
import { getUserById } from '../../session/user.session.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerIds, RESPONSE_SUCCESS_CODE } from '../index.js';
import Result from '../result.js';

const joinGameHandler = ({ socket, payload }) => {
  const result = new Result(handlerIds.game.JoinGamePayload, RESPONSE_SUCCESS_CODE, {});

  const { gameId, userId } = payload;
  const gameSession = getGameSession(gameId);

  if (!gameSession) {
    result.responseCode = ErrorCodes.GAME_NOT_FOUND;
    result.payload = { message: '게임 세션을 찾을 수 없습니다.' };
    return result;
  }

  const user = getUserById(userId);
  if (!user) {
    result.responseCode = ErrorCodes.USER_NOT_FOUND;
    result.payload = { message: '유저를 찾을 수 없습니다.' };
    return result;
  }

  const existUser = gameSession.getUser(user.id);
  if (!existUser) {
    gameSession.addUser(user);
  }

  result.payload = { gameId, message: '게임에 참가했습니다.' };
  return result;
};

export default joinGameHandler;
