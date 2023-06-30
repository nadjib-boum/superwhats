import mongoose from "mongoose";
import {
  Client,
  RemoteAuth,
  NoAuth,
  MessageMedia,
  type MessageSendOptions,
} from "whatsapp-web.js";
import { MongoStore } from "wwebjs-mongo";
import CSVUtil from "../../utils/csv";
import { sanitizePhone } from "../../helpers/sanitizers";
import { serializePhone } from "../../helpers/serializers";
import type { IWhatsappService, MsgMedia, PhoneItem } from "./types";

class WhatsappService implements IWhatsappService {
  private client: Client | undefined;

  async init(): Promise<WhatsappService> {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.DB_NAME,
    });
    const mongoStore = new MongoStore({ mongoose });
    this.client = new Client({
      authStrategy: new RemoteAuth({
        store: mongoStore,
        backupSyncIntervalMs: 300000,
      }),
    });
    this.client = new Client({
      authStrategy: new NoAuth(),
    });

    this.client.initialize();
    return this;
  }

  generateQR(): Promise<string> {
    return new Promise((resolve) => {
      this.client?.on("qr", (qr: string) => {
        resolve(qr);
      });
    });
  }

  onQR(callback: (qr: string) => void): void {
    this.client?.on("qr", callback);
  }

  onReady(callback: () => void): void {
    this.client?.on("ready", callback);
  }

  async sendMessage(
    to: string,
    message: string,
    options: MessageSendOptions = {}
  ): Promise<void> {
    try {
      const sanitized = sanitizePhone(to);
      const serialized = serializePhone(sanitized);
      await this.client?.sendMessage(serialized, message, options);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  async sendMessageWithMedia(
    to: string,
    msgMedia: MsgMedia,
    caption: string,
    options: MessageSendOptions = {}
  ): Promise<void> {
    try {
      const sanitized = sanitizePhone(to);
      const serialized = serializePhone(sanitized);
      const { mimeType, mediaBase64 } = msgMedia;
      const whMedia = new MessageMedia(mimeType, mediaBase64);
      await this.client?.sendMessage(serialized, whMedia, {
        ...options,
        caption,
      });
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  parsePhoneList(phoneString: string): PhoneItem[] {
    const phoneCSV = CSVUtil.parse(phoneString);
    const params = phoneCSV[0].slice(1);
    const phoneCSVContent = phoneCSV.slice(1);
    const phoneList: PhoneItem[] = [];
    let phoneParams: { [param: string]: string } = {};
    for (const row of phoneCSVContent) {
      for (const p in params) {
        phoneParams[params[p]] = row[+p + 1];
      }
      phoneList.push({ phone: row[0], params: phoneParams });
      phoneParams = {};
    }
    return phoneList;
  }

  bindParamsToTemplate(params: object, template: string): string {
    let result: string = template;
    for (const [paramKey, paramValue] of Object.entries(params)) {
      result = result.replaceAll(`{{${paramKey}}}`, paramValue);
    }
    return result;
  }

  async destroy(): Promise<void> {
    await this.client?.destroy();
  }
}

const whatsappService = new WhatsappService();

export default whatsappService;
