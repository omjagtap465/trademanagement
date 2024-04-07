import express from "express";
import { createClient } from "redis";
import { appRouter } from "./routes/index.js";
import cors from "cors";
const app = express();
// const router = express.Router();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use("/api", appRouter);

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
});
