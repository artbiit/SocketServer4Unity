class Result {
  constructor(responseCode, payload) {
    if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
      throw new Error('payload must be an object');
    }
    if (!Number.isInteger(responseCode)) {
      throw new Error('responseCode must be an integer');
    }

    this.responseCode = responseCode;
    this.payload = payload;
  }
}

export default Result;
