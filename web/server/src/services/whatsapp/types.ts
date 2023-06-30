import type { MessageSendOptions, MessageMedia } from "whatsapp-web.js";

export type PhoneItem = {
  phone: string;
  params: object;
};

export type MsgMedia = {
  mimeType: string;
  mediaBase64: string;
};

export interface IWhatsappService {
  generateQR(): Promise<any>;
  onReady(callback: () => void): void;
  onQR(callback: (qr: string) => void): void;
  sendMessage(
    to: string,
    message: string,
    options: MessageSendOptions
  ): Promise<void>;
  sendMessageWithMedia(
    to: string,
    msgMedia: MsgMedia,
    caption: string,
    options: MessageSendOptions
  ): Promise<void>;
  parsePhoneList(phoneString: string): PhoneItem[];
  bindParamsToTemplate(phoneItem: PhoneItem, template: string): string;
  destroy(): Promise<void>;
}
