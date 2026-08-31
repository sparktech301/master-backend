import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379', {
      connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT_MS ?? 10000),
      commandTimeout: Number(process.env.REDIS_COMMAND_TIMEOUT_MS ?? 5000),
      keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'master-backend:',
      maxRetriesPerRequest: 2,
    });
  }

  async set(key: string, value: string, ttlseconds?: number) {
    if (ttlseconds) {
      return await this.client.set(key, value, 'EX', ttlseconds);
    }
    return await this.client.set(key, value);
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async del(key: string) {
    return await this.client.del(key);
  }

  async incr(key: string) {
    return await this.client.incr(key);
  }

  async expire(key: string, ttlSeconds: number) {
    return await this.client.expire(key, ttlSeconds);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
