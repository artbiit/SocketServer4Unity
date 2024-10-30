import fs from 'fs';
import configs from '../configs/configs.js';
import mysql from 'mysql2';
import logger from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 파일의 절대 경로 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_CONNECTION_LIMIT } = configs;

class MysqlService {
  dmlQueue = [];
  queryQueue = [];
  processingDml = false;
  processingQuery = false;

  constructor() {}

  async init() {
    this.createConnectionPool();
    await this.createTables();
  }

  createConnectionPool() {
    this.internalPool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      connectionLimit: DB_CONNECTION_LIMIT,
      enableKeepAlive: true,
      queueLimit: 0,
      waitForConnections: true,
    });
    this.pool = this.internalPool.promise();
  }

  async createTables() {
    const text = fs.readFileSync(path.join(__dirname, `sql/schema.sql`), 'utf-8');

    const jobs = [];
    text.split(';').forEach((qry) => {
      if (!qry.trim()) {
        return;
      }
      jobs.push(this.execute(qry));
    });
    await Promise.all(jobs);
  }

  addToQueue(queue, query, params) {
    return new Promise((resolve, reject) => {
      queue.push({ query, params, resolve, reject });
      this.processQueue(queue);
    });
  }

  async processQueue(queue) {
    if (queue === this.dmlQueue && this.processingDml) return;
    if (queue === this.queryQueue && this.processingQuery) return;

    if (queue.length > 0) {
      const current = queue.shift();
      if (queue === this.dmlQueue) this.processingDml = true;
      if (queue === this.queryQueue) this.processingQuery = true;

      try {
        const result = await this.pool.execute(current.query, current.params);
        current.resolve(result);
      } catch (error) {
        logger.error(`MysqlService.processQueue error: ${error}`);
        current.reject(error);
      } finally {
        if (queue === this.dmlQueue) this.processingDml = false;
        if (queue === this.queryQueue) this.processingQuery = false;

        this.processQueue(queue);
      }
    }
  }

  async execute(qry, params) {
    return this.addToQueue(this.dmlQueue, qry, params);
  }

  async query(qry, params) {
    return this.addToQueue(this.queryQueue, qry, params);
  }

  async transaction(querySet) {
    let conn;
    try {
      conn = await this.pool.getConnection();
      await conn.beginTransaction();
      for (let set of querySet) {
        await conn.execute(set.qry, set.params);
      }
      await conn.commit();
    } catch (error) {
      logger.error(`MysqlService.transaction error: ${error}`);
      if (conn) {
        await conn.rollback();
      }
      throw error;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

const mysql = new MysqlService();

export { mysql };
