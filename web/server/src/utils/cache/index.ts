import Redis, { type RedisKey } from "ioredis";
import type { ICacheUtil } from "./types";

class CacheUtil implements ICacheUtil {
  private client: Redis;
  constructor() {
    this.client = new Redis(process.env.REDIS_URI as string);
  }
  async set(key: string, value: any): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value));
    } catch (err: any) {
      return Promise.reject(err);
    }
  }
  async get(key: string): Promise<any> {
    try {
      const data = await this.client.get(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (err: any) {
      return Promise.reject(err);
    }
  }
  async push(listName: string, ...items: any[]): Promise<number> {
    try {
      return await this.client.lpush(listName, ...items);
    } catch (err: any) {
      return Promise.reject(err);
    }
  }
  async range(listName: string): Promise<string[]> {
    try {
      return await this.client.lrange(listName, 0, -1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  }
  async patch(data: object): Promise<void> {
    try {
      await this.client.mset(data);
    } catch (err: any) {
      return Promise.reject(err);
    }
  }
  async collect(keys: RedisKey[]): Promise<(string | null)[]> {
    try {
      return await this.client.mget(keys);
    } catch (err: any) {
      return Promise.reject(err);
    }
  }
}

const cacheUtil = new CacheUtil();

export default cacheUtil;
