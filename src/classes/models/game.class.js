import IntervalManager from '../managers/interval.manager.js';
import { createLocationPacket } from '../../utils/notification/game.notification.js';
class Game {
  constructor() {
    this.users = [];
    this.intervalManager = new IntervalManager();
    this.updateInterval = 33.333; // 기본 인터벌 시간 (30fps)
  }

  startLocationUpdateLoop() {
    if (this.locationUpdateActive) return;
    this.locationUpdateActive = true;

    const update = () => {
      if (this.users.length) {
        const maxLatency = this.getMaxLatency();
        const delay = Math.max(this.updateInterval, maxLatency);

        // 위치 업데이트 로직
        const locationData = this.getHasMovedLocation(delay);
        // console.log(locationData);
        if (locationData.length) {
          const data = createLocationPacket(locationData);
          this.users.forEach((user) => {
            user.socket.write(data);
          });

          //  console.log('Updated Location Data:', locationData);
        }
        setTimeout(update, delay);
      } else {
        this.locationUpdateActive = false;
      }
    };

    update(); // 첫 업데이트 시작
  }

  addUser(user) {
    this.users.push(user);
    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    if (this.users.length === 1) {
      this.startLocationUpdateLoop();
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    if (Number.isNaN(maxLatency)) {
      maxLatency = 0;
    }
    return maxLatency;
  }

  /**
   * 위치가 변동된 유저들만 추측항법 적용 후 해당 유저 목록들만 반환
   */
  getHasMovedLocation(latency) {
    const locationData = this.users
      .map((user) => {
        const result = user.calculatePosition(latency);
        if (result) {
          return { id: user.id, playerId: user.playerId, x: result.x, y: result.y };
        }
        return undefined;
      })
      .filter((location) => location !== undefined);
    return locationData;
  }

  /**
   * 위치 변동 없이 모든 유저의 현 위치 반환
   */
  getAllLocation() {
    const locationData = this.users.map((user) => {
      const { x, y } = user;
      return { id: user.id, playerId: user.playerId, x, y };
    });
    return locationData;
  }
}

const game = new Game();
export default game;
