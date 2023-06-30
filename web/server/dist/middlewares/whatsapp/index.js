"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSSEHeaders = void 0;
const setSSEHeaders = (req, res, next) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    next();
};
exports.setSSEHeaders = setSSEHeaders;
