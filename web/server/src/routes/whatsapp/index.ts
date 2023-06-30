import { Router, type Request, type Response, NextFunction } from "express";
import multer from "multer";
import { setSSEHeaders } from "../../middlewares/whatsapp";
import whatsappService from "../../services/whatsapp";
import store from "../../services/store";
import Logger from "../../utils/logger";
import { sleep } from "../../helpers/time";
import { serializeSSEChunk } from "../../helpers/serializers";
import { random } from "../../helpers/math";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

type MemoryStore = {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isMessagingPaused: boolean;
  isAppSending: boolean;
  isMessagingCancelled: boolean;
  minDelay: number;
  maxDelay: number;
  mimeType: string;
};

const memoryStore: MemoryStore = {
  isInitialized: false,
  isAuthenticated: false,
  isMessagingPaused: false,
  isAppSending: false,
  isMessagingCancelled: false,
  minDelay: 1,
  maxDelay: 2,
  mimeType: "",
};

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!memoryStore.isAuthenticated) {
    return res.status(401).send("USER_UNAUTHENTICATED");
  }
  next();
};

router.get("/init", async (req: Request, res: Response) => {
  Logger.log("INFO", "Client Initialization Started");
  if (memoryStore.isInitialized) {
    Logger.log("WARN", "Client Already Initialized");
    return res
      .status(401)
      .send({ success: false, msg: "APP_ALREADY_INITIALIZED" });
  }
  try {
    const client = await whatsappService.init();
    router.get(
      "/auth",
      [setSSEHeaders],
      async (req: Request, res: Response) => {
        Logger.log("INFO", "Client Authentication Started");
        if (memoryStore.isAuthenticated) {
          Logger.log("WARN", "Client Already Authenticated");
          return res
            .status(401)
            .send({ success: false, msg: "APP_ALREADY_AUTHENTICATED" });
        }
        try {
          client.onReady(async () => {
            res.write(
              serializeSSEChunk({ success: true, msg: "AUTH_SUCCEED" })
            );
            memoryStore.isAuthenticated = true;
            Logger.log("SUCCESS", "Client Authentication Succeed");
            res.write("data: SSE_END\n\n");
          });
          client.onQR((qr: string) => {
            res.write(
              serializeSSEChunk({ success: true, msg: "QR_GENERATED", qr })
            );
            Logger.log("SUCCESS", "QR Generated");
          });
        } catch (err: any) {
          Logger.log("ERROR", "Client Authentication Failed");
          console.log(err);
          res.status(401).send({ success: false, error: "AUTH_FAILED" });
        }
      }
    );
    router.post(
      "/message/init",
      [isAuthenticated, upload.array("files")],
      async (req: Request, res: Response) => {
        Logger.log("INFO", "Messaging Initialized");
        try {
          const { minDelay, maxDelay } = req.body;
          const { files } = req;
          memoryStore.minDelay = +minDelay;
          memoryStore.maxDelay = +maxDelay;
          const safeFiles: any = files;
          const phonesFile = safeFiles[0].buffer.toString();
          const templateFile = safeFiles[1].buffer.toString();
          let messageMedia = "";
          if (safeFiles.length > 2) {
            messageMedia = safeFiles[2].buffer.toString("base64");
            memoryStore.mimeType = safeFiles[2].mimetype;
          }
          const phoneList = whatsappService.parsePhoneList(phonesFile);
          await store.patch({
            phoneList: phoneList,
            template: templateFile,
            media: messageMedia,
          });
          Logger.log("SUCCESS", "Messaging Initialized Successfully");
          res.send({ success: true, totalMessages: phoneList.length });
        } catch (err: any) {
          Logger.log("ERROR", "Messaging Initialization Failed");
          console.log(err);
          res.send({ success: false, error: "MESSAGE_INIT_FAILED" });
        }
      }
    );
    router.get(
      "/message",
      [isAuthenticated, setSSEHeaders],
      async (req: Request, res: Response) => {
        Logger.log("INFO", "Messaging Started");
        try {
          if (memoryStore.isAppSending) {
            return res
              .status(401)
              .send({ success: false, error: "APP_ALREADY_SENDING" });
          }
          memoryStore.isAppSending = true;
          const [phoneList, template, media] = await store.collect([
            "phoneList",
            "template",
            "media",
          ]);
          const { minDelay, maxDelay } = memoryStore;
          const totalMessages = phoneList.length;

          for (let i = 0; i < totalMessages; i++) {
            controlLoop: while (true) {
              await sleep(200);
              if (memoryStore.isMessagingPaused) continue controlLoop;
              break controlLoop;
            }

            if (memoryStore.isMessagingCancelled) {
              memoryStore.isMessagingPaused = false;
              memoryStore.isAppSending = false;
              memoryStore.isMessagingCancelled = false;
              Logger.log("SUCCESS", "Messaging Cancelled");
              res.write("data: SSE_END\n\n");
              return;
            }
            const delay = random(minDelay, maxDelay - 0.2) * 1000;
            await sleep(delay);
            const { phone, params } = phoneList[i];
            const message = whatsappService.bindParamsToTemplate(
              params,
              template
            );
            if (media) {
              await client.sendMessageWithMedia(
                phone,
                {
                  mediaBase64: media,
                  mimeType: memoryStore.mimeType,
                },
                message
              );
            } else {
              await client.sendMessage(phone, message);
            }

            res.write(serializeSSEChunk({ currentMessage: i, totalMessages }));
          }
          memoryStore.isAppSending = false;
          Logger.log("SUCCESS", "Messaging Completed");
          res.write("data: SSE_END\n\n");
        } catch (err: any) {
          Logger.log("ERROR", "Messaging Failed");
          console.log(err);
          res.status(200).send({ success: false, error: "" });
        }
      }
    );
    router.post("/message/pause", (req: Request, res: Response) => {
      memoryStore.isMessagingPaused = true;
      Logger.log("INFO", "Messaging Paused");
      res.status(200).send({ success: true });
    });
    router.post("/message/play", (req: Request, res: Response) => {
      memoryStore.isMessagingPaused = false;
      Logger.log("INFO", "Messaging Started Again");
      res.status(200).send({ success: true });
    });
    router.post("/message/cancel", (req: Request, res: Response) => {
      memoryStore.isMessagingCancelled = true;
      memoryStore.isMessagingPaused = false;
      Logger.log("INFO", "Messaging Cancelling Initialized");
      res.status(200).send({ success: true });
    });
    router.get("/destroy", async (req: Request, res: Response) => {
      try {
        await client.destroy();
        memoryStore.isAuthenticated = false;
        memoryStore.isInitialized = false;
        memoryStore.isMessagingPaused = false;
        memoryStore.isAppSending = false;
        memoryStore.isMessagingCancelled = false;
        Logger.log("SUCCESS", "Client Destroyed Successfully");
        res.status(200).send({ success: true });
      } catch (err: any) {
        Logger.log("ERROR", "Client Destroy Failed");
        console.log(err);
        res
          .status(500)
          .send({ success: false, error: "SESSION_DESTROY_FAILED" });
      }
    });
    memoryStore.isInitialized = true;
    Logger.log("SUCCESS", "Client initialized Successfully");
    res.status(200).send({ success: true });
  } catch (err: any) {
    Logger.log("ERROR", "Client Initialization Failed");
    console.log(err);
    res.status(400).send({ success: false });
  }
});

export default router;
