import net from 'net';
import { loadProtos, getProtoMessages } from '../init/loadProtos.js';
import { getProtoTypeNameByHandlerId, handlerIds, loadHandlers } from '../handlers/index.js';
import configs from '../configs/configs.js';

await loadProtos();
await loadHandlers();

const protoMessages = getProtoMessages();
const Packet = protoMessages['common'].Packet;

const { PACKET_HEADER_LENGTH, PACKET_TYPE_LENGTH, PACKET_TOTAL_LENGTH } = configs;

/**
 * 주어진 페이로드와 handlerId를 common.Packet으로 래핑하여 전송 가능한 버퍼 생성
 * @param {Buffer} data - 래핑할 페이로드 버퍼
 * @param {string} handlerId - 해당 핸들러 ID
 * @param {string} userId - 유저 ID (예: UUID)
 * @param {number} sequence - 패킷의 시퀀스 번호
 * @returns {Buffer} 최종 전송할 버퍼
 */
function wrapWithCommonPacket(data = {}, userId = '', sequence, payloadType) {
  const [packageName, typeName] = payloadType.split('.');

  const handlerId = handlerIds[payloadType];
  console.log(payloadType, ' => ', handlerId);
  if (handlerId === undefined) {
    throw new Error(`${payloadType} 메시지에 대한 핸들러 ID를 찾을 수 없습니다.`);
  }

  const payloadMessage = protoMessages[packageName][typeName];

  if (!payloadMessage) {
    console.error(`${payloadType} 프로토메세지 찾을 수 없음`);
    return;
  }

  const payloadBuffer = payloadMessage.encode(data).finish();

  const packetPayload = {
    userId,
    sequence,
    payload: payloadBuffer,
  };

  const packet = Packet.encode(packetPayload).finish();

  const lengthBuffer = Buffer.alloc(PACKET_HEADER_LENGTH);
  lengthBuffer.writeIntBE(packet.length, 0, PACKET_HEADER_LENGTH);

  const handlerIdBuffer = Buffer.alloc(PACKET_TYPE_LENGTH);
  handlerIdBuffer.writeUintBE(handlerId, 0, PACKET_TYPE_LENGTH);

  return Buffer.concat([lengthBuffer, handlerIdBuffer, packet]);
}

const connections = [];
/**
 * Client 클래스는 서버와의 소켓 연결을 관리하고 메시지를 전송할 수 있게 해줍니다.
 */
class Client {
  userId = '';
  sequence = 0;
  lastReceiveTime = null;
  lastServerTime = null;
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.client = null;
    this.buffer = Buffer.alloc(0);
  }

  /**
   * 서버와 연결을 설정하고 연결이 완료되면 콜백을 호출합니다.
   */
  connect() {
    return new Promise((resolve, reject) => {
      if (this.client) {
        resolve();
        return;
      }

      this.client = net.createConnection({ host: this.host, port: this.port }, () => {
        connections.push(this);
        console.log('서버에 연결되었습니다.');
        resolve();
      });

      this.client.on('data', (data) => {
        // 기존 버퍼에 새로 수신된 데이터를 추가
        this.buffer = Buffer.concat([this.buffer, data]);

        while (this.buffer.length >= PACKET_HEADER_LENGTH) {
          const length = this.buffer.readUintBE(0, PACKET_HEADER_LENGTH);

          // console.log(
          //   `패킷 길이 (헤더 제외): ${length} (${PACKET_HEADER_LENGTH}) = ${length - PACKET_HEADER_LENGTH}`,
          // );
          //    console.log(`현재 버퍼 길이: ${this.buffer.length}`);
          if (this.buffer.length >= length) {
            const packet = this.buffer.subarray(PACKET_HEADER_LENGTH, length);
            // console.log(`실제 데이터 패킷 길이: ${packet.length}`);
            this.buffer = this.buffer.subarray(length);

            try {
              const result = this.decodeResponse(packet);
              if (result.sequence > 0) {
                this.sequence = result.sequence;
              }
              this.lastReceiveTime = Date.now();
              this.lastServerTime = result.timestamp;

              switch (result.handlerId) {
                case handlerIds['common.initial']:
                  this.userId = result.data.userId;
                  break;
              }
              console.log(
                `서버로부터 데이터 도착 :`,
                getProtoTypeNameByHandlerId(result.handlerId),
                '\n',
                result,
              );
            } catch (error) {
              console.error(error);
            }
          } else {
            break;
          }
        }
      });

      this.client.on('end', () => {
        this.client = null;
        console.log('서버와의 연결이 종료되었습니다.');
      });

      this.client.on('error', (err) => {
        this.client = null;
        console.error('서버 연결 중 에러 발생:', err.message);
        reject(err);
      });
    });
  }

  /**
   * 서버에 래핑된 메시지를 전송합니다.
   * @param {Buffer} payload - 래핑할 페이로드 버퍼
   * @param {string} handlerId - 해당 핸들러 ID
   */
  sendMessage(data, payloadType) {
    if (!this.client) {
      throw new Error('서버에 연결되어 있지 않습니다.');
    }
    const wrappedPacket = wrapWithCommonPacket(data, this.userId, this.sequence, payloadType);
    this.client.write(wrappedPacket);
  }

  /**
   * 서버로부터 받은 버퍼를 해독하여 Response 메시지를 반환합니다.
   * @param {Buffer} buffer - 서버로부터 받은 응답 버퍼
   * @returns {Object} 파싱된 응답 객체
   */
  decodeResponse = (buffer) => {
    const protoMessages = getProtoMessages();
    const Response = protoMessages.response.Response;

    // Response 메시지 해독
    const decodedResponse = Response.decode(buffer);

    // 해독한 Response 객체를 JSON으로 변환
    return {
      handlerId: decodedResponse.handlerId,
      responseCode: decodedResponse.responseCode,
      timestamp: new Date(decodedResponse.timestamp.toNumber()),
      data: decodedResponse.data ? JSON.parse(decodedResponse.data.toString()) : null,
      sequence: decodedResponse.sequence,
    };
  };

  /**
   * 서버와의 연결을 닫습니다.
   */
  disconnect() {
    if (this.client) {
      this.client.end();
      console.log('서버 연결이 종료되었습니다.');
      this.client = null;
    }
  }
}

process.on('exit', (code) => {
  allDisconnect();
});

process.on('SIGTERM', () => {
  allDisconnect();
  process.exit();
});

process.on('SIGTERM', () => {
  allDisconnect();
  process.exit();
});

function allDisconnect() {
  connections.forEach((conn) => conn.disconnect());
}

export { wrapWithCommonPacket, Client };
export default Client;
