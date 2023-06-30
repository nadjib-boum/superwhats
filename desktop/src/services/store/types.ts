import type { RedisKey } from "ioredis";

export interface IStore {
  name: string;
  serializeKey: (key: string | RedisKey) => string;
  set(key: string, value: any): Promise<any>;
  get(key: string): Promise<any>;
  patch(data: object): Promise<any>;
  collect(keys: RedisKey[]): Promise<any>;
}
