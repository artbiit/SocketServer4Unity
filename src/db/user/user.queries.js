export const SQL_QUERIES = {
  FIND_USER_BY_DEVICE_ID:
    'SELECT seq_no, id, device_id, last_login, created_at FROM user WHERE device_id = ?',
  UPSERT_USER: `INSERT INTO user (id, device_id) VALUES(?, ?) ON DUPLICATE KEY UPDATE device_id = VALUES(device_id)`,
};
