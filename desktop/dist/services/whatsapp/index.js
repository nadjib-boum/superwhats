"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const wwebjs_mongo_1 = require("wwebjs-mongo");
const csv_1 = __importDefault(require("../../utils/csv"));
const sanitizers_1 = require("../../helpers/sanitizers");
const serializers_1 = require("../../helpers/serializers");
class WhatsappService {
    async init() {
        await mongoose_1.default.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
        });
        const mongoStore = new wwebjs_mongo_1.MongoStore({ mongoose: mongoose_1.default });
        this.client = new whatsapp_web_js_1.Client({
            authStrategy: new whatsapp_web_js_1.RemoteAuth({
                store: mongoStore,
                backupSyncIntervalMs: 300000,
            }),
        });
        this.client = new whatsapp_web_js_1.Client({
            authStrategy: new whatsapp_web_js_1.NoAuth(),
        });
        this.client.initialize();
        return this;
    }
    generateQR() {
        return new Promise((resolve) => {
            this.client?.on("qr", (qr) => {
                resolve(qr);
            });
        });
    }
    onQR(callback) {
        this.client?.on("qr", callback);
    }
    onReady(callback) {
        this.client?.on("ready", callback);
    }
    async sendMessage(to, message, options = {}) {
        try {
            const sanitized = (0, sanitizers_1.sanitizePhone)(to);
            const serialized = (0, serializers_1.serializePhone)(sanitized);
            await this.client?.sendMessage(serialized, message, options);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async sendMessageWithMedia(to, msgMedia, caption, options = {}) {
        try {
            const sanitized = (0, sanitizers_1.sanitizePhone)(to);
            const serialized = (0, serializers_1.serializePhone)(sanitized);
            const { mimeType, mediaBase64 } = msgMedia;
            const whMedia = new whatsapp_web_js_1.MessageMedia(mimeType, mediaBase64);
            await this.client?.sendMessage(serialized, whMedia, {
                ...options,
                caption,
            });
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    parsePhoneList(phoneString) {
        const phoneCSV = csv_1.default.parse(phoneString);
        const params = phoneCSV[0].slice(1);
        const phoneCSVContent = phoneCSV.slice(1);
        const phoneList = [];
        let phoneParams = {};
        for (const row of phoneCSVContent) {
            for (const p in params) {
                phoneParams[params[p]] = row[+p + 1];
            }
            phoneList.push({ phone: row[0], params: phoneParams });
            phoneParams = {};
        }
        return phoneList;
    }
    bindParamsToTemplate(params, template) {
        let result = template;
        for (const [paramKey, paramValue] of Object.entries(params)) {
            result = result.replaceAll(`{{${paramKey}}}`, paramValue);
        }
        return result;
    }
    async destroy() {
        await this.client?.destroy();
    }
}
const whatsappService = new WhatsappService();
exports.default = whatsappService;
