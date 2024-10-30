import { CLIENT_VERSIONS, PACKET_TOTAL_LENGTH, PACKET_TYPE_LENGTH } from './constants.js';
import env from './env.js';

const configs = {
  CLIENT_VERSIONS,
  PACKET_TOTAL_LENGTH,
  PACKET_TYPE_LENGTH,
  ...env,
};

export default configs;
