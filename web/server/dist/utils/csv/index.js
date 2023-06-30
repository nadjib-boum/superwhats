"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CSVUtil {
    static parse(text) {
        const rows = text.trim().split("\n");
        const cols = [];
        for (const row of rows) {
            cols.push(row.split(",").map((r) => r.trim()));
        }
        return cols;
    }
}
exports.default = CSVUtil;
