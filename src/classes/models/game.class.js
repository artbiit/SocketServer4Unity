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
        const locationData = this.getAllLocation();
        if (locationData.length) {
          this.users.forEach((user) => {
            const data = createLocationPacket(locationData, user.id);
            user.socket.write(data);
          });

          console.log('Updated Location Data:', locationData);
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
    return maxLatency;
  }

  getAllLocation() {
    const maxLatency = this.getMaxLatency();
    const locationData = this.users
      .map((user) => {
        if (user.hasMoved) {
          const { x, y } = user.calculatePosition(maxLatency);
          user.hasMoved = false;
          return { id: user.id, x, y };
        }
        return undefined;
      })
      .filter((location) => location !== undefined);
    return locationData;
  }
}

const game = new Game();
export default game;
