class Result {
  constructor(handlerId, responseCode, payload) {
    if (!Number.isInteger(handlerId)) {
      throw new Error('handlerId must be an integer');
    }
    if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
      throw new Error('payload must be an object');
    }
    if (!Number.isInteger(responseCode)) {
      throw new Error('responseCode must be an integer');
    }

    this.handlerId = handlerId;
    this.responseCode = responseCode;
    this.payload = payload;
  }
}

export default Result;
