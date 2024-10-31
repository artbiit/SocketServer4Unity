import { mysql } from '../mysql.js';
import { COORD_QUERIES } from './user.coord.queris.js';
import { toCamelCase } from '../utils.js';

export const findUserCoordinates = async (userSeqNo) => {
  const [rows] = await mysql.query(COORD_QUERIES.FIND_USER_COORDINATES, [userSeqNo]);
  return rows.length ? toCamelCase(rows[0]) : null;
};

export const upsertUserCoordinates = async (userSeqNo, xCoord, yCoord) => {
  await mysql.query(COORD_QUERIES.UPSERT_USER_COORDINATES, [userSeqNo, xCoord, yCoord]);
  return { userSeqNo, xCoord, yCoord };
};

export const deleteUserCoordinates = async (userSeqNo) => {
  await mysql.query(COORD_QUERIES.DELETE_USER_COORDINATES, [userSeqNo]);
};
