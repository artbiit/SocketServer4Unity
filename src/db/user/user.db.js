import { mysql } from '../mysql.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../utils.js';

export const findUserByDeviceID = async (deviceId) => {
  const [rows] = await mysql.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  return rows.length ? toCamelCase(rows[0]) : null;
};

export const upsertUser = async (id, deviceId) => {
  const [result] = await mysql.query(SQL_QUERIES.UPSERT_USER, [id, deviceId]);
  const user = await findUserByDeviceID(deviceId);
  return { id, deviceId, seqNo: user.seqNo };
};
