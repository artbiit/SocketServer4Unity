import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { RESPONSE_SUCCESS_CODE } from '../index.js';
import Result from '../result.js';

const pingHandler = ({ socket, payload }) => {
  return new Result(RESPONSE_SUCCESS_CODE, {
    message: 'Pong.',
  });
};

export default pingHandler;
