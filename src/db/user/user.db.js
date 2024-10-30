import { v4 as uuidv4 } from 'uuid';
import { mysql } from '../mysql.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../utils.js';

export const findUserByDeviceID = async (deviceId) => {
  const [rows] = await mysql.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  return toCamelCase(rows[0]);
};

export const createUser = async (deviceId) => {
  const id = uuidv4();
  await mysql.query(SQL_QUERIES.CREATE_USER, [id, deviceId]);
  return { id, deviceId };
};

export const updateUserLogin = async (id) => {
  await mysql.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};

export const upsertUser = async (id, deviceId) => {
  if (!id) {
    id = uuidv4();
  }
  await mysql.query(SQL_QUERIES.UPSERT_USER, [id, deviceId]);
  return await findUserByDeviceID(deviceId);
};
