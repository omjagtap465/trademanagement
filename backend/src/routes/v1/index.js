import express from "express";
import {
  loginUserController,
  registerController,
  addStrategyController,
  deleteStrategyController,
} from "../../controllers/index.js";
const router = express.Router();
router.post("/register", registerController);
router.post("/login", loginUserController);
router.post("/addstrategy", addStrategyController);
router.post("/deletestrategy", deleteStrategyController);
router.post("/", deleteStrategyController);
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
