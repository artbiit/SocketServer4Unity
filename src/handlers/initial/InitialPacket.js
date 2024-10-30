import { addUser } from '../../session/user.session.js';
import { handlerIds, RESPONSE_SUCCESS_CODE } from '../index.js';
import { upsertUser } from '../../db/user/user.db.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Result from '../result.js';
import configs from '../../configs/configs.js';

const { CLIENT_VERSIONS } = configs;

const initialHandler = async ({ socket, userId, payload }) => {
  const result = new Result(handlerIds.initial.InitialPacket, RESPONSE_SUCCESS_CODE, {});

  try {
    const { deviceId, clientVersion } = payload;

    if (CLIENT_VERSIONS.includes(clientVersion)) {
      const user = await upsertUser(null, deviceId);
      addUser(socket, user.id);
      result.payload = { userId: user.id };
    } else {
      result.responseCode = ErrorCodes.CLIENT_VERSION_MISMATCH;
    }
  } catch (e) {
    throw e;
  }

  return result;
};

export default initialHandler;
