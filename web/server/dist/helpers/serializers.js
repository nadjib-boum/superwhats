"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializePhone = exports.serializeSSEChunk = void 0;
const serializeSSEChunk = (chunk) => {
    return `data: ${JSON.stringify(chunk)}\n\n`;
};
exports.serializeSSEChunk = serializeSSEChunk;
const serializePhone = (phone) => {
    return `${phone}@c.us`;
};
exports.serializePhone = serializePhone;
