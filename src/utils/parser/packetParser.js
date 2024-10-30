import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';
import logger from '../logger.js';

export const packetParser = (handlerId, user, data) => {
  const protoMessages = getProtoMessages();

  // 핸들러 ID에 따라 적절한 payload 구조를 디코딩

  const commonPacket = protoMessages.common.Packet;
  let packet = null;
  try {
    packet = commonPacket.decode(data);
  } catch (error) {
    logger.error(error);
    throw new CustomError(
      ErrorCodes.PACKET_DECODE_ERROR,
      `패킷 디코딩 중 문제 발생 : ${namespace}.${typeName}`,
    );
  }

  const userIdByPacket = packet.userId;
  const sequence = packet.sequence;

  // 유저가 접속해 있는 상황에서 시퀀스 검증
  // 패킷에도 sequence가 정의 되어있어야 검사.
  if (sequence && user && user.sequence !== packet.sequence) {
    throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값입니다. ');
  }

  // 핸들러 ID에 따라 적절한 payload 구조를 디코딩
  const { namespace, typeName } = getProtoTypeNameByHandlerId(handlerId);
  const PayloadType = protoMessages[namespace][typeName];
  let payload;
  try {
    payload = PayloadType.decode(packet.payload);
  } catch (error) {
    logger.error(error);
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.');
  }

  // 필드가 비어 있거나, 필수 필드가 누락된 경우 처리
  const expectedFields = Object.keys(PayloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0) {
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,
      `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
    );
  }
  return { payload, sequence, userIdByPacket };
};
