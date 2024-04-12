import { asyncHandler } from "../../utils/async_handler.js";
import { ApiResponse } from "../../utils/api_response.js";
import { TradeService } from "../services/index.js";
const tradeService = new TradeService();
const addTradeController = asyncHandler(async (req, res) => {
  const {
    token,
    optionType,
    scrip,
    tradingSymbol,
    strike,
    price,
    quantity,
    side,
    strategyId,
  } = req.body;

  if (
    !token ||
    !optionType ||
    !scrip ||
    !tradingSymbol ||
    !strike ||
    !price ||
    !quantity ||
    !side ||
    !strategyId
  ) {
    return res.status(400).json({
      message:
        "token, optionType, scrip, tradingSymbol, strike,price,quantity,side,strategyId among this any field is missing missing",
    });
  }

  let selectSymbol = await tradeService.selectSymbol(tradingSymbol, strike);
  if (selectSymbol.length == 0) {
    const createSymbol = await tradeService.createSymbol(
      token,
      optionType,
      scrip,
      tradingSymbol,
      strike
    );
    selectSymbol = await tradeService.selectSymbol(tradingSymbol, strike);
  }
  const createTrade = await tradeService.createTrade(
    price,
    quantity,
    side,
    strategyId,
    selectSymbol[0].id
  );
  const selectTrade = await tradeService.selectTrade(
    side,
    strategyId,
    selectSymbol[0].id
  );
  return res
    .status(201)
    .json(new ApiResponse(200, selectSymbol, "Strategy Created Successfully"));
});
const getAllTradesController = asyncHandler(async (req, res) => {
  const { strategyId } = req.body;
  const tradeByStrategy = await tradeService.getAllTrades(strategyId);
  const tradeObj = JSON.parse(tradeByStrategy);
  return res
    .status(201)
    .json(new ApiResponse(200, tradeObj, "Got Strategy Trades  Successfully"));
});
export { addTradeController, getAllTradesController };
