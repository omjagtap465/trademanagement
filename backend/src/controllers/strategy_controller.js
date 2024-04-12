import { asyncHandler } from "../../utils/async_handler.js";
import { StrategyService } from "../services/index.js";
import { ApiResponse } from "../../utils/api_response.js";
import { TOTP } from "totp-generator";
const strategyService = new StrategyService();
const addStrategyController = asyncHandler(async (req, res) => {
  const { strategyName, userId } = req.body;

  if (!strategyName || !userId) {
    return res
      .status(400)
      .json({ message: "Strategy Name or userId is missing" });
  }
  const addstrategy = await strategyService.createStrategy(
    strategyName,
    userId
  );
  const selectStrategy = await strategyService.getStrategy(strategyName);
  return res
    .status(201)
    .json(
      new ApiResponse(200, selectStrategy, "Strategy Created Successfully")
    );
});
const deleteStrategyController = asyncHandler(async (req, res) => {
  const { strategyId } = req.body;
  if (!strategyId) {
    return res.status(400).json({ message: "Strategy  userId is missing" });
  }

  const deleteStrategy = await strategyService.deleteStrategy(strategyId);
  return res.json(
    new ApiResponse(200, deleteStrategy, "Strategy Deleted Successfully")
  );
});
export { addStrategyController, deleteStrategyController };
