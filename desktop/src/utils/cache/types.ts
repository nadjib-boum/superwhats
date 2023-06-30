import type { RedisKey } from "ioredis";

export interface ICacheUtil {
  set(key: string, value: any): Promise<void>;
  get(key: string): Promise<string | null>;
  push(listName: string, ...items: any[]): Promise<any>;
  range(listName: string): Promise<string[]>;
  patch(data: object): Promise<void>;
  collect(keys: RedisKey[]): Promise<(string | null)[]>;
}
