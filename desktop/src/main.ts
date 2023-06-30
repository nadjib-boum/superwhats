import { app, BrowserWindow } from "electron";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import whatsappRouter from "./routes/whatsapp";

const expressApp = express();
expressApp.use(
  cors({
    origin: ["http://127.0.0.1:5173"],
  })
);
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use("/api/whatsapp", whatsappRouter);
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("dist/index.html");
};

app.whenReady().then(() => {
  expressApp.listen(5000, () => {
    console.log("Superwhats Server is running on port 5000");
    createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
