import { Redis, RedisKey } from "ioredis";
import cacheUtil from "../../utils/cache";
import type { IStore } from "./types";

class Store implements IStore {
  public name: string;
  public serializeKey: (key: string | RedisKey) => string;
  constructor(name: string) {
    this.name = name;
    this.serializeKey = (key: string | RedisKey): string => {
      return `${this.name}_${key}`;
    };
    cacheUtil.patch({
      [this.serializeKey("phoneList")]: "[]",
      [this.serializeKey("store_template")]: "",
    });
  }
  async set(key: string, value: any): Promise<any> {
    try {
      await cacheUtil.set(this.serializeKey(key), value);
    } catch (err: any) {
      return Promise.reject(err);
    }
  }
  async get(key: string): Promise<any> {
    try {
      return await cacheUtil.get(this.serializeKey(key));
    } catch (err: any) {
      return Promise.reject(err);
    }
  }
  async patch(data: any): Promise<any> {
    const serializedData: any = {};
    for (const key in data) {
      serializedData[this.serializeKey(key)] = JSON.stringify(data[key]);
    }
    try {
      await cacheUtil.patch(serializedData);
    } catch (err: any) {
      return Promise.reject(err);
    }
  }
  async collect(keys: RedisKey[]): Promise<any> {
    try {
      const data: any = await cacheUtil.collect(
        keys.map((key: RedisKey) => this.serializeKey(key))
      );
      const parsedData = data.map((d: any) => JSON.parse(d));
      return parsedData;
    } catch (err: any) {
      return Promise.reject(err);
    }
  }
}

const cacheStore = new Store("cacheStore");

export default cacheStore;
