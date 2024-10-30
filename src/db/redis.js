import configs from '../configs/configs.js';
import Redis from 'ioredis';
import logger from '../utils/logger.js';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = configs;

let redis = null;

/**
 * 레디스에 연결을 시도합니다. 만약, 연결 실패시 에러를 던집니다.
 *
 */
const connect = async () => {
  if (redis === null) {
    try {
      redis = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
      });

      // Redis 연결 실패 이벤트 핸들러
      redis.on('error', (err) => {
        logger.error(`Redis connection failed: ${err}`);
        redis = null; // 연결 실패 시 redis 객체를 null로 설정
      });
    } catch (e) {
      logger.error(`Redis connection failed, ${e}`);
      redis = null;
      throw e;
    }
  }
};

/**
 *  redis 연결이 안되어있으면 연결시도 후 반환합니다.
 *  연결실패시 에러객체가 던져집니다.
 * @return {*}
 */
const getRedis = async () => {
  if (redis === null) {
    logger.warn('redis is null. It will try to connect');
    await connect();
  }

  return redis;
};
export { connect, getRedis };
