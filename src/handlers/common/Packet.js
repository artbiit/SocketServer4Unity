import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerIds } from '../index.js';

const packetHandler = ({ socket, payload }) => {
  return new Result(handlerIds.common.Packet, ErrorCodes.SOCKET_ERROR, {
    message: '비정상 요청입니다.',
  });
};

export default packetHandler;
