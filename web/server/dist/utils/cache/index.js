"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
class CacheUtil {
    constructor() {
        this.client = new ioredis_1.default(process.env.REDIS_URI);
    }
    async set(key, value) {
        try {
            await this.client.set(key, JSON.stringify(value));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async get(key) {
        try {
            const data = await this.client.get(key);
            if (data) {
                return JSON.parse(data);
            }
            return null;
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async push(listName, ...items) {
        try {
            return await this.client.lpush(listName, ...items);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async range(listName) {
        try {
            return await this.client.lrange(listName, 0, -1);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async patch(data) {
        try {
            await this.client.mset(data);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async collect(keys) {
        try {
            return await this.client.mget(keys);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}
const cacheUtil = new CacheUtil();
exports.default = cacheUtil;
