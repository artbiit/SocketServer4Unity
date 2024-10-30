import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById, handlers } from '../handlers/index.js';
import { handleError } from '../utils/error/errorHandler.js';
import { createResponse } from '../utils/response/createResponse.js';
import configs from '../configs/configs.js';
import { getUserBySocket } from '../session/user.session.js';

const { PACKET_HEADER_LENGTH, PACKET_TYPE_LENGTH } = configs;

const PACKET_TOTAL_LENGTH = PACKET_HEADER_LENGTH + PACKET_TYPE_LENGTH;
export const onData = (socket) => async (data) => {
  // 기존 버퍼에 새로 수신된 데이터를 추가
  socket.buffer = Buffer.concat([socket.buffer, data]);

  while (socket.buffer.length >= PACKET_TOTAL_LENGTH) {
    // 1. 패킷 길이 정보 수신 (4바이트)
    const length = socket.buffer.readUintBE(0, PACKET_HEADER_LENGTH);
    // 2. 패킷 타입 정보 수신 (1바이트)
    const handlerId = socket.buffer.readUintBE(PACKET_HEADER_LENGTH, PACKET_TYPE_LENGTH);
    const requiredLength = PACKET_TOTAL_LENGTH + length;

    // 3. 패킷 전체 길이 확인 후 데이터 수신
    if (socket.buffer.length >= requiredLength) {
      // 패킷 데이터를 자르고 버퍼에서 제거
      const packet = socket.buffer.slice(PACKET_TOTAL_LENGTH, requiredLength);
      socket.buffer = socket.buffer.slice(requiredLength);
      const user = getUserBySocket(socket);

      try {
        const { payload, sequence, userIdByPacket } = packetParser(handlerId, user, packet);
        const handler = getHandlerById(handlerId);

        const result = await handler({
          socket,
          payload,
        });

        const response = createResponse(handlerId, result.responseCode, result.payload, user?.id);

        socket.write(response);
      } catch (error) {
        handleError(socket, error);
      }
    } else {
      // 아직 전체 패킷이 도착하지 않음
      break;
    }
  }
};
