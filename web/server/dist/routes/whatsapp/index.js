"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const whatsapp_1 = require("../../middlewares/whatsapp");
const whatsapp_2 = __importDefault(require("../../services/whatsapp"));
const store_1 = __importDefault(require("../../services/store"));
const logger_1 = __importDefault(require("../../utils/logger"));
const time_1 = require("../../helpers/time");
const serializers_1 = require("../../helpers/serializers");
const math_1 = require("../../helpers/math");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const memoryStore = {
    isInitialized: false,
    isAuthenticated: false,
    isMessagingPaused: false,
    isAppSending: false,
    isMessagingCancelled: false,
    minDelay: 1,
    maxDelay: 2,
    mimeType: "",
};
const isAuthenticated = (req, res, next) => {
    if (!memoryStore.isAuthenticated) {
        return res.status(401).send("USER_UNAUTHENTICATED");
    }
    next();
};
router.get("/init", async (req, res) => {
    logger_1.default.log("INFO", "Client Initialization Started");
    if (memoryStore.isInitialized) {
        logger_1.default.log("WARN", "Client Already Initialized");
        return res
            .status(401)
            .send({ success: false, msg: "APP_ALREADY_INITIALIZED" });
    }
    try {
        const client = await whatsapp_2.default.init();
        router.get("/auth", [whatsapp_1.setSSEHeaders], async (req, res) => {
            logger_1.default.log("INFO", "Client Authentication Started");
            if (memoryStore.isAuthenticated) {
                logger_1.default.log("WARN", "Client Already Authenticated");
                return res
                    .status(401)
                    .send({ success: false, msg: "APP_ALREADY_AUTHENTICATED" });
            }
            try {
                client.onReady(async () => {
                    res.write((0, serializers_1.serializeSSEChunk)({ success: true, msg: "AUTH_SUCCEED" }));
                    memoryStore.isAuthenticated = true;
                    logger_1.default.log("SUCCESS", "Client Authentication Succeed");
                    res.write("data: SSE_END\n\n");
                });
                client.onQR((qr) => {
                    res.write((0, serializers_1.serializeSSEChunk)({ success: true, msg: "QR_GENERATED", qr }));
                    logger_1.default.log("SUCCESS", "QR Generated");
                });
            }
            catch (err) {
                logger_1.default.log("ERROR", "Client Authentication Failed");
                console.log(err);
                res.status(401).send({ success: false, error: "AUTH_FAILED" });
            }
        });
        router.post("/message/init", [isAuthenticated, upload.array("files")], async (req, res) => {
            logger_1.default.log("INFO", "Messaging Initialized");
            try {
                const { minDelay, maxDelay } = req.body;
                const { files } = req;
                memoryStore.minDelay = +minDelay;
                memoryStore.maxDelay = +maxDelay;
                const safeFiles = files;
                const phonesFile = safeFiles[0].buffer.toString();
                const templateFile = safeFiles[1].buffer.toString();
                let messageMedia = "";
                if (safeFiles.length > 2) {
                    messageMedia = safeFiles[2].buffer.toString("base64");
                    memoryStore.mimeType = safeFiles[2].mimetype;
                }
                const phoneList = whatsapp_2.default.parsePhoneList(phonesFile);
                await store_1.default.patch({
                    phoneList: phoneList,
                    template: templateFile,
                    media: messageMedia,
                });
                logger_1.default.log("SUCCESS", "Messaging Initialized Successfully");
                res.send({ success: true, totalMessages: phoneList.length });
            }
            catch (err) {
                logger_1.default.log("ERROR", "Messaging Initialization Failed");
                console.log(err);
                res.send({ success: false, error: "MESSAGE_INIT_FAILED" });
            }
        });
        router.get("/message", [isAuthenticated, whatsapp_1.setSSEHeaders], async (req, res) => {
            logger_1.default.log("INFO", "Messaging Started");
            try {
                if (memoryStore.isAppSending) {
                    return res
                        .status(401)
                        .send({ success: false, error: "APP_ALREADY_SENDING" });
                }
                memoryStore.isAppSending = true;
                const [phoneList, template, media] = await store_1.default.collect([
                    "phoneList",
                    "template",
                    "media",
                ]);
                const { minDelay, maxDelay } = memoryStore;
                const totalMessages = phoneList.length;
                for (let i = 0; i < totalMessages; i++) {
                    controlLoop: while (true) {
                        await (0, time_1.sleep)(200);
                        if (memoryStore.isMessagingPaused)
                            continue controlLoop;
                        break controlLoop;
                    }
                    if (memoryStore.isMessagingCancelled) {
                        memoryStore.isMessagingPaused = false;
                        memoryStore.isAppSending = false;
                        memoryStore.isMessagingCancelled = false;
                        logger_1.default.log("SUCCESS", "Messaging Cancelled");
                        res.write("data: SSE_END\n\n");
                        return;
                    }
                    const delay = (0, math_1.random)(minDelay, maxDelay - 0.2) * 1000;
                    await (0, time_1.sleep)(delay);
                    const { phone, params } = phoneList[i];
                    const message = whatsapp_2.default.bindParamsToTemplate(params, template);
                    if (media) {
                        await client.sendMessageWithMedia(phone, {
                            mediaBase64: media,
                            mimeType: memoryStore.mimeType,
                        }, message);
                    }
                    else {
                        await client.sendMessage(phone, message);
                    }
                    res.write((0, serializers_1.serializeSSEChunk)({ currentMessage: i, totalMessages }));
                }
                memoryStore.isAppSending = false;
                logger_1.default.log("SUCCESS", "Messaging Completed");
                res.write("data: SSE_END\n\n");
            }
            catch (err) {
                logger_1.default.log("ERROR", "Messaging Failed");
                console.log(err);
                res.status(200).send({ success: false, error: "" });
            }
        });
        router.post("/message/pause", (req, res) => {
            memoryStore.isMessagingPaused = true;
            logger_1.default.log("INFO", "Messaging Paused");
            res.status(200).send({ success: true });
        });
        router.post("/message/play", (req, res) => {
            memoryStore.isMessagingPaused = false;
            logger_1.default.log("INFO", "Messaging Started Again");
            res.status(200).send({ success: true });
        });
        router.post("/message/cancel", (req, res) => {
            memoryStore.isMessagingCancelled = true;
            memoryStore.isMessagingPaused = false;
            logger_1.default.log("INFO", "Messaging Cancelling Initialized");
            res.status(200).send({ success: true });
        });
        router.get("/destroy", async (req, res) => {
            try {
                await client.destroy();
                memoryStore.isAuthenticated = false;
                memoryStore.isInitialized = false;
                memoryStore.isMessagingPaused = false;
                memoryStore.isAppSending = false;
                memoryStore.isMessagingCancelled = false;
                logger_1.default.log("SUCCESS", "Client Destroyed Successfully");
                res.status(200).send({ success: true });
            }
            catch (err) {
                logger_1.default.log("ERROR", "Client Destroy Failed");
                console.log(err);
                res
                    .status(500)
                    .send({ success: false, error: "SESSION_DESTROY_FAILED" });
            }
        });
        memoryStore.isInitialized = true;
        logger_1.default.log("SUCCESS", "Client initialized Successfully");
        res.status(200).send({ success: true });
    }
    catch (err) {
        logger_1.default.log("ERROR", "Client Initialization Failed");
        console.log(err);
        res.status(400).send({ success: false });
    }
});
exports.default = router;
