import net from 'net';
import { loadProtos, getProtoMessages } from '../init/loadProtos.js';
import { handlerIds, loadHandlers } from '../handlers/index.js';
import configs from '../configs/configs.js';
import Client from './client.js';
await loadProtos();
await loadHandlers();
const { SERVER_PORT } = configs;

let client = new Client('localhost', SERVER_PORT);
await client.connect();

const initialPayload = {
  deviceId: 'xxxxx',
  clientVersion: '1.0.1',
};

client.sendMessage(initialPayload, 'initial.InitialPacket');
