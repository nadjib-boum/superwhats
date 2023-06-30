"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevelColors;
(function (LogLevelColors) {
    LogLevelColors["INFO"] = "\u001B[36m";
    LogLevelColors["SUCCESS"] = "\u001B[32m";
    LogLevelColors["WARN"] = "\u001B[33m";
    LogLevelColors["ERROR"] = "\u001B[31m";
})(LogLevelColors || (LogLevelColors = {}));
class Logger {
    static log(level, text) {
        const formulatedText = `[+] ${text}`;
        if (level === "INFO") {
            return console.log(`${LogLevelColors.INFO}%s\x1b[0m`, formulatedText);
        }
        if (level === "SUCCESS") {
            return console.log(`${LogLevelColors.SUCCESS}%s\x1b[0m`, formulatedText);
        }
        if (level === "WARN") {
            return console.log(`${LogLevelColors.WARN}%s\x1b[0m`, formulatedText);
        }
        if (level === "ERROR") {
            return console.log(`${LogLevelColors.ERROR}%s\x1b[0m`, formulatedText);
        }
        console.log(text);
    }
}
exports.default = Logger;
