import logger from '../utils/logger.js';

export const onEnd = (socket) => () => {
  logger.log('클라이언트 연결이 종료되었습니다.');
};
