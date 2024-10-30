import { v4 as uuidv4 } from 'uuid';
import { addGameSession } from '../../session/game.session.js';
import Result from '../result.js';
import { getUserById } from '../../session/user.session.js';
import { handlerIds, RESPONSE_SUCCESS_CODE } from '../index.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const createGameHandler = ({ socket, payload }) => {
  const result = new Result(handlerIds.game.CreateGamePayload, RESPONSE_SUCCESS_CODE, {});
  const { userId } = payload;

  const gameId = uuidv4();
  const gameSession = addGameSession(gameId);
  const user = getUserById(userId);
  if (!user) {
    result.responseCode = ErrorCodes.USER_NOT_FOUND;
  } else {
    gameSession.addUser(user);
    result.payload = { gameId, message: '게임이 생성되었습니다.' };
  }
};

export default createGameHandler;
