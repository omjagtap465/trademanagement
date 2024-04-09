import { StrategyRepositoy } from "../repositories/index.js";
const strategyRepository = new StrategyRepositoy();
class StrategyService {
  async createStrategy(strategyName, userId) {
    await strategyRepository.createStrategy(
      "INSERT INTO strategies (strategy_name,user_id) VALUES (?,?)",
      [strategyName, userId]
    );
  }
  async getStrategy(strategyName) {
    const strategyDetails = await strategyRepository.getStrategy(
      "SELECT * FROM `strategies` WHERE `strategy_name` = ?",
      [strategyName]
    );
    return strategyDetails;
  }
  async deleteStrategy(strategyId) {
    const strategyDetails = await strategyRepository.deleteStrategy(
      "DELETE FROM `strategies` WHERE `id`= ?",
      [strategyId]
    );
    return strategyDetails;
  }
}
export { StrategyService };
