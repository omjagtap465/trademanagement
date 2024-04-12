import express from "express";
import {
  loginUserController,
  registerController,
  addStrategyController,
  deleteStrategyController,
  addTradeController,
  getAllTradesController,
  verifyOtpController,
} from "../../controllers/index.js";
const router = express.Router();
router.post("/register", registerController);
router.post("/login", loginUserController);
router.post("/verifyotp", verifyOtpController);
router.post("/addstrategy", addStrategyController);
router.delete("/deletestrategy", deleteStrategyController);
router.post("/trades/add", addTradeController);
router.get("/trades/getalltrades", getAllTradesController);
export { router };
// symbol_mapping
// ins token is num
// option type ( ce or p[e])
// scrip Stock Name
// tradingSymbol reliance
// strike 2800

// trades
// price
// quantity
// side
// strategy_id
// symobol Id

// if symbol is there in the db table symbol_mapp ->
// then ->
//
