import { CLIENT_VERSIONS } from './constants.js';
import env from './env.js';

const configs = {
  CLIENT_VERSIONS,
  ...env,
};

export default configs;
