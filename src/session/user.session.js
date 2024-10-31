import User from '../classes/models/user.class.js';
import logger from '../utils/logger.js';
import game from '../classes/models/game.class.js';
import { upsertUserCoordinates } from '../db/user/user.coord.db.js';

export const userSessions = [];

export const addUser = (socket, uuid, playerId, deviceId, x = 0.0, y = 0.0, seqNo) => {
  logger.info(`addUser : ${uuid} `);
  const user = new User(uuid, socket, playerId, deviceId);
  user.x = Number(x);
  user.y = Number(y);
  user.prevX = user.x;
  user.prevY = user.y;
  user.seqNo = seqNo;
  userSessions.push(user);
  game.addUser(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);

  if (index !== -1) {
    const user = userSessions[index];
    const userId = user.id;
    upsertUserCoordinates(user.seqNo, user.x, user.y);
    if (game.getUser(userId)) {
      game.removeUser(userId);
    }
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserById = (id) => {
  return userSessions.find((user) => {
    return user.id === id;
  });
};

export const getUserByDeviceId = (deviceId) => {
  return userSessions.find((user) => user.deviceId === deviceId);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
