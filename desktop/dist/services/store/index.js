"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = __importDefault(require("../../utils/cache"));
class Store {
    constructor(name) {
        this.name = name;
        this.serializeKey = (key) => {
            return `${this.name}_${key}`;
        };
        cache_1.default.patch({
            [this.serializeKey("phoneList")]: "[]",
            [this.serializeKey("store_template")]: "",
        });
    }
    async set(key, value) {
        try {
            await cache_1.default.set(this.serializeKey(key), value);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async get(key) {
        try {
            return await cache_1.default.get(this.serializeKey(key));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async patch(data) {
        const serializedData = {};
        for (const key in data) {
            serializedData[this.serializeKey(key)] = JSON.stringify(data[key]);
        }
        try {
            await cache_1.default.patch(serializedData);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async collect(keys) {
        try {
            const data = await cache_1.default.collect(keys.map((key) => this.serializeKey(key)));
            const parsedData = data.map((d) => JSON.parse(d));
            return parsedData;
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}
const cacheStore = new Store("cacheStore");
exports.default = cacheStore;
