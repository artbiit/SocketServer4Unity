import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import { getPacketNames, loadProtos } from '../init/loadProtos.js';
import logger from '../utils/logger.js';
import fs from 'fs';

import test from './game/CreateGamePayload.js';
console.log(test);
// 현재 파일의 절대 경로 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 핸들러들을 자동으로 연결하는 함수
export const loadHandlers = async () => {
  const handlers = {};
  const packetNames = getPacketNames();

  for (const [namespace, types] of Object.entries(packetNames)) {
    handlers[namespace] = {};
    for (const typeName of Object.keys(types)) {
      try {
        const handlerPath = `./${namespace}/${typeName}.js`;

        const handler = await import(handlerPath);
        handlers[namespace][typeName] = handler;
        logger.info(`Loaded Handler: ${handlerPath}`);
      } catch (error) {
        logger.error(`Handler 로드 중 오류가 발생했습니다: ${namespace}.${typeName}`, error);
      }
    }
  }
  return handlers;
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    // packetParser 체크하고 있지만 그냥 추가합니다.
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[handlerId].protoType;
};

await loadProtos();
const handlers = await loadHandlers();
