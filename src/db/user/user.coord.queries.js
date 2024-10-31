export const COORD_QUERIES = {
  FIND_USER_COORDINATES: 'SELECT x_coord, y_coord FROM user_coordinates WHERE user_seq_no = ?',
  UPSERT_USER_COORDINATES: `INSERT INTO user_coordinates (user_seq_no, x_coord, y_coord) VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE x_coord = VALUES(x_coord), y_coord = VALUES(y_coord), updated_at = CURRENT_TIMESTAMP`,
  DELETE_USER_COORDINATES: 'DELETE FROM user_coordinates WHERE user_seq_no = ?',
};
