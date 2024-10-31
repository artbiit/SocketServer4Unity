import { addUser, getUserByDeviceId } from '../../session/user.session.js';
import { RESPONSE_SUCCESS_CODE } from '../index.js';
import { upsertUser } from '../../db/user/user.db.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Result from '../result.js';
import configs from '../../configs/configs.js';
import { v4 as uuidv4 } from 'uuid';
import CustomError from '../../utils/error/customError.js';
import { findUserCoordinates } from '../../db/user/user.coord.db.js';
import game from '../../classes/models/game.class.js';

const { CLIENT_VERSIONS } = configs;

const initialHandler = async ({ socket, payload }) => {
  const result = new Result(RESPONSE_SUCCESS_CODE, {});

  try {
    const { deviceId, clientVersion, playerId } = payload;

    //이미 세션에 같은 deviceId가 있으면 등록 거절
    if (getUserByDeviceId(deviceId)) {
      throw new CustomError(ErrorCodes.ALREADY_INIT_USER);
    }

    if (CLIENT_VERSIONS.includes(clientVersion)) {
      const userId = uuidv4();
      const user = await upsertUser(userId, deviceId);
      const lastCoord = await findUserCoordinates(user.seqNo);

      let x = 0.0;
      let y = 0.0;

      if (lastCoord) {
        x = lastCoord.xCoord;
        y = lastCoord.yCoord;
      }

      addUser(socket, userId, playerId, deviceId, x, y, user.seqNo);
      result.payload = { userId, x, y, allLocation: game.getAllLocation() };
      console.log(result.payload);
    } else {
      throw new CustomError(ErrorCodes.CLIENT_VERSION_MISMATCH);
    }
  } catch (e) {
    throw e;
  }

  return result;
};

export default initialHandler;
