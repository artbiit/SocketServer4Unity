import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket, playerId, deviceId) {
    this.id = id;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.sequence = Math.floor(Math.random() * 2_100_000_000) + 1;
    this.lastUpdateTime = Date.now();
    this.playerId = playerId;
    this.deviceId = deviceId;
    this.hasMoved = false;
  }

  updatePosition(x, y) {
    // 현재 위치를 이전 위치로 저장
    this.prevX = this.x;
    this.prevY = this.y;

    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  getNextSequence() {
    if (++this.sequence > 4294967295) {
      this.sequence = 1;
    }
    return this.sequence;
  }

  ping() {
    const now = Date.now();

    // console.log(`${this.id}: ping`);
    this.socket.write(createPingPacket(now, this.id));
  }

  handlePong(timestamp) {
    const now = Date.now();
    this.latency = (now - timestamp) / 2;
    console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  // 추측 항법을 사용하여 위치를 추정하는 메서드
  calculatePosition(latency) {
    const timeDiff = latency / 1000; // 레이턴시를 초 단위로 계산

    // x, y 축에서 이동 속도 계산
    const speedX = (this.x - this.prevX) / (timeDiff || 1); // 시간차가 0인 경우 1로 나누어 속도 계산
    const speedY = (this.y - this.prevY) / (timeDiff || 1);

    // 예상 위치 계산
    const predictedX = this.x + speedX * timeDiff;
    const predictedY = this.y + speedY * timeDiff;

    // 이동한 거리 계산
    const distanceX = predictedX - this.x;
    const distanceY = predictedY - this.y;
    const totalDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2); // 유클리드 거리

    if (totalDistance >= 1.0) {
      this.hasMoved = true;
    }

    // 예상 위치 반환
    return {
      id: this.id,
      x: predictedX,
      y: predictedY,
    };
  }
}

export default User;
