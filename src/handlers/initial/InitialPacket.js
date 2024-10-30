import { addUser } from '../../session/user.session.js';
import { handlerIds, RESPONSE_SUCCESS_CODE } from '../index.js';
import { upsertUser } from '../../db/user/user.db.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Result from '../result.js';
import configs from '../../configs/configs.js';
import { v4 as uuidv4 } from 'uuid';

const { CLIENT_VERSIONS } = configs;

const initialHandler = async ({ socket, payload }) => {
  const result = new Result(RESPONSE_SUCCESS_CODE, {});

  try {
    const { deviceId, clientVersion } = payload;

    if (CLIENT_VERSIONS.includes(clientVersion)) {
      const userId = uuidv4();
      await upsertUser(userId, deviceId);
      addUser(socket, userId);
      result.payload = { userId };
    } else {
      result.responseCode = ErrorCodes.CLIENT_VERSION_MISMATCH;
    }
  } catch (e) {
    throw e;
  }

  return result;
};

export default initialHandler;
