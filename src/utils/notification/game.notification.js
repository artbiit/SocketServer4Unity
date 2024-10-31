import { handlerIds } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { createResponse } from '../response/createResponse.js';

export const createLocationPacket = (users) => {
  return createResponse(handlerIds['gameNotification.LocationUpdate'], 0, { users }, null);
};

export const gameStartNotification = (gameId, timestamp) => {
  const protoMessages = getProtoMessages();
  const Start = protoMessages.gameNotification.Start;

  const payload = { gameId, timestamp };
  const message = Start.create(payload);
  const startPacket = Start.encode(message).finish();
  //return makeNotification(startPacket, PACKET_TYPE.GAME_START);
};

export const createPingPacket = (timestamp) => {
  return createResponse(handlerIds['common.Ping'], 0, { timestamp }, null);
};
