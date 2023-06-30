import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import whatsappRouter from "./routes/whatsapp";

const app = express();
app.use(
  cors({
    origin: ["http://127.0.0.1:5173"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use("/api/whatsapp", whatsappRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
