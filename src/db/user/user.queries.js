export const SQL_QUERIES = {
  FIND_USER_BY_DEVICE_ID: 'SELECT * FROM user WHERE device_id = ?',
  CREATE_USER: 'INSERT INTO user (id, device_id) VALUES (?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
  UPSERT_USER: `INSERT INTO user (id, device_id) VALUES(?, ?) ON DUPLICATE KEY UPDATE id = VALUES(id), device_id = VALUES(device_id)`,
};
