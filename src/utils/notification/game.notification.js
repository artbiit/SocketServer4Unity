import { handlerIds } from '../../handlers/index.js';
import { createResponse } from '../response/createResponse.js';

export const createLocationPacket = (users) => {
  return createResponse(handlerIds['gameNotification.LocationUpdate'], 0, { users }, null);
};

export const createPingPacket = (timestamp) => {
  return createResponse(handlerIds['common.Ping'], 0, { timestamp }, null);
};
