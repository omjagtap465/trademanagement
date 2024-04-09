import express from "express";
import { createClient } from "redis";
import { appRouter } from "./routes/index.js";
import cors from "cors";
import { sqlConnection } from "./config/db.config.js";
const app = express();
// const router = express.Router();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use("/api", appRouter);

app.listen(port, async () => {
  // await sqlConnection();
  console.log(`Example app listening on port ${port}`);
});
