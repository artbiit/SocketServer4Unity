import { getProtoMessages } from '../../init/loadProtos.js';
import configs from '../../configs/configs.js';

const { PACKET_HEADER_LENGTH } = configs;

export const createResponse = (handlerId, responseCode, data = null) => {
  const protoMessages = getProtoMessages();
  const Response = protoMessages.response.Response;
  const responsePayload = {
    handlerId,
    responseCode: responseCode,
    timestamp: Date.now(),
    data: data ? Buffer.from(JSON.stringify(data)) : null,
  };

  const buffer = Response.encode(responsePayload).finish();
  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(PACKET_HEADER_LENGTH);
  packetLength.writeUintBE(buffer.length + PACKET_HEADER_LENGTH, 0, PACKET_HEADER_LENGTH); // 패킷 길이에 타입 바이트 포함

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, buffer]);
};
