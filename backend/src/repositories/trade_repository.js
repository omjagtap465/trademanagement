import { sqlConnection } from "../config/db.config.js";
class TradeRepository {
  constructor() {}
  async create(query, strategyDetails) {
    const queryResult = await sqlConnection(query, strategyDetails);
    return queryResult;
  }
  async select(query, strategyDetails) {
    const queryResult = await sqlConnection(query, strategyDetails);
    return queryResult;
  }
  //   async createTrade(query, strategyDetails) {
  //     const queryResult = await sqlConnection(query, strategyDetails);
  //     return queryResult;
  //   }
  //   async deleteStrategy(query, strategyId) {
  //     const queryResult = await sqlConnection(query, strategyId);
  //     return queryResult;
  //   }
}
export { TradeRepository };
