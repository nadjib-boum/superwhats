"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
const random = (a, b) => {
    return a + Math.random() * (b - a);
};
exports.random = random;
