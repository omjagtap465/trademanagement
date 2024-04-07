import express from "express";
import { router } from "./v1/index.js";

const appRouter = express.Router();
appRouter.use("/v1", router);
export { appRouter };
