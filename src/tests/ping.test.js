import net from 'net';
import { loadProtos, getProtoMessages } from '../init/loadProtos.js';
import { handlerIds, loadHandlers } from '../handlers/index.js';
import configs from '../configs/configs.js';

await loadProtos();
await loadHandlers();
console.log(handlerIds);
const { SERVER_PORT } = configs;

const PORT = SERVER_PORT;
const HOST = 'localhost';
// Ping 메시지 생성 및 서버로 전송
(async () => {
  try {
    // 핸들러 ID를 가져옵니다.
    const handlerId = handlerIds['common.Ping'];
    if (handlerId === undefined) {
      throw new Error('Ping 메시지에 대한 핸들러 ID를 찾을 수 없습니다.');
    }

    // Packet과 Ping 메시지 생성
    const protoMessages = getProtoMessages();
    const Packet = protoMessages['common'].Packet;
    const Ping = protoMessages['common'].Ping;

    const pingPayload = {
      timestamp: Date.now(),
    };
    const pingMessage = Ping.create(pingPayload);

    // 메시지를 인코딩하고 길이를 포함한 버퍼 생성
    const pingBuffer = Ping.encode(pingMessage).finish();

    const packetPayload = {
      userId: '123e4567-e89b-12d3-a456-426614174000', // 예시 UUID
      sequence: 1,
      payload: pingBuffer,
    };

    const packet = Packet.encode(packetPayload).finish();

    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32BE(packet.length, 0);

    const handlerIdBuffer = Buffer.alloc(1);
    handlerIdBuffer.writeUint8(handlerId);

    const finalBuffer = Buffer.concat([lengthBuffer, handlerIdBuffer, packet]);

    // 서버로 연결하고 메시지 전송
    const client = net.createConnection({ host: HOST, port: PORT }, () => {
      console.log('서버에 연결됨');
      client.write(finalBuffer);
    });

    client.on('data', (data) => {
      console.log('서버로부터 응답:', data.toString());
    });

    client.on('end', () => {
      console.log('서버와의 연결 종료');
    });
  } catch (err) {
    console.error('에러 발생:', err.message);
  }
})();
