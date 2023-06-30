"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizePhone = void 0;
const sanitizePhone = (phone) => {
    return phone.replace(/[-+\)\(\s]/g, "");
};
exports.sanitizePhone = sanitizePhone;
