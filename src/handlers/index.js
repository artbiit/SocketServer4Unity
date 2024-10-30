import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { getPacketNames } from '../init/loadProtos.js';
import logger from '../utils/logger.js';

export const handlers = {};
export const handlerIds = {};
export const RESPONSE_SUCCESS_CODE = 0;

// 핸들러들을 자동으로 연결하는 함수
export const loadHandlers = async () => {
  const packetNames = getPacketNames();

  let firstId = -1;
  let handlerId = 0;
  for (const [namespace, types] of Object.entries(packetNames)) {
    firstId++;
    let secondId = 0;
    for (const typeName of Object.keys(types)) {
      try {
        handlerId = firstId * 10 + secondId++;
        if (handlerId < 0 || handlerId > 255) {
          throw new Error(`핸들러 아이디가 허용범위를 벗어났습니다. : ${handlerId}`);
        }
        handlers[handlerId] = {};
        const handlerPath = `./${namespace}/${typeName}.js`;
        const handler = await import(handlerPath);
        handlerIds[`${namespace}.${typeName}`] = handlerId;
        handlers[handlerId].handler = handler.default || handler;
        handlers[handlerId].namespace = namespace;
        handlers[handlerId].typeName = typeName;
        logger.info(`Loaded Handler: ${handlerPath}`);
      } catch (error) {
        logger.error(
          `Handler 로드 중 오류가 발생했습니다: [${handlerId}]${namespace}.${typeName}`,
          error,
        );
      }
    }
  }
  return handlers;
};

export const getHandlerById = (handlerId) => {
  const handler = handlers[handlerId];
  if (!handler) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handler.handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  const handler = handlers[handlerId];
  if (!handler) {
    // packetParser 체크하고 있지만 그냥 추가합니다.
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러ID를 찾을 수 없습니다: name : ${handlerId}`,
    );
  }
  return { namespace: handler.namespace, typeName: handler.typeName };
};
