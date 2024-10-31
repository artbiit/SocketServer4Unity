import User from '../classes/models/user.class.js';
import logger from '../utils/logger.js';

export const userSessions = [];

export const addUser = (socket, uuid) => {
  logger.info(`addUser : ${uuid} `);
  const user = new User(uuid, socket);
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserById = (id) => {
  return userSessions.find((user) => {
    return user.id === id;
  });
};

export const getNextSequence = (id) => {
  const user = getUserById(id);
  if (user) {
    return user.getNextSequence();
  }
  return null;
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
