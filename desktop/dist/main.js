"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const whatsapp_1 = __importDefault(require("./routes/whatsapp"));
const expressApp = (0, express_1.default)();
expressApp.use((0, cors_1.default)({
    origin: ["http://127.0.0.1:5173"],
}));
expressApp.use(express_1.default.json());
expressApp.use(express_1.default.urlencoded({ extended: true }));
expressApp.use("/api/whatsapp", whatsapp_1.default);
const createWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
    });
    win.loadFile("dist/index.html");
};
electron_1.app.whenReady().then(() => {
    expressApp.listen(5000, () => {
        console.log("Superwhats Server is running on port 5000");
        createWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
