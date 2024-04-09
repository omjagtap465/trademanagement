import { sqlConnection } from "../config/db.config.js";
class StrategyRepositoy {
  constructor() {}
  async createStrategy(query, strategyDetails) {
    const queryResult = await sqlConnection(query, strategyDetails);
    return queryResult;
  }
  async getStrategy(query, strategyDetails) {
    const queryResult = await sqlConnection(query, strategyDetails);
    return queryResult;
  }
  async deleteStrategy(query, strategyId) {
    const queryResult = await sqlConnection(query, strategyId);
    return queryResult;
  }
}
export { StrategyRepositoy };
