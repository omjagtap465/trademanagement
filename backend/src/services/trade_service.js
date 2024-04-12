import { TradeRepository } from "../repositories/index.js";
const tradeRepository = new TradeRepository();
class TradeService {
  constructor() {}
  async createSymbol(token, optionType, scrip, tradingSymbol, strike) {
    await tradeRepository.create(
      "INSERT INTO symbolmapping (instrument_token,option_type,scrip,tradingsymbol,strike) VALUES (?,?,?,?,?)",
      [token, optionType, scrip, tradingSymbol, strike]
    );
  }
  async selectSymbol(tradingSymbol, strike) {
    const symbol = await tradeRepository.select(
      "SELECT * FROM `symbolmapping` WHERE `tradingsymbol` = ? AND `strike` = ?",
      [tradingSymbol, strike]
    );
    return symbol;
  }
  async createTrade(price, quantity, side, strategyId, symbolMappingId) {
    await tradeRepository.create(
      "INSERT INTO trades (price,quantity,side,strategy_id,symbolmapping_id) VALUES (?,?,?,?,?)",
      [price, quantity, side, strategyId, symbolMappingId]
    );
  }
  async selectTrade(side, strategyId, symbolMappingId) {
    const selectedTrade = await tradeRepository.select(
      "SELECT * FROM `trades` WHERE `side` = ? AND `strategy_id` = ? AND `symbolmapping_id` = ?",
      [side, strategyId, symbolMappingId]
    );
    return selectedTrade;
  }
  async getAllTrades(strategyId) {
    const query = `SELECT price,
tradingsymbol,side,traded_at,
quantity,stg.id,strategy_name
    FROM trades AS t 
    INNER JOIN symbolmapping AS sym
    ON sym.id=t.symbolmapping_id
    INNER JOIN strategies AS stg
    ON stg.id=t.strategy_id
    WHERE stg.id=?`;
    const selectedTradesByStrategy = await tradeRepository.select(query, [
      strategyId,
    ]);
    console.log(selectedTradesByStrategy);
    let trades = new Map();
    selectedTradesByStrategy.forEach((stock) => {
      let key = `${stock.tradingsymbol} ${stock.side}`;
      if (!trades.has(key)) {
        trades.set(key, {
          quantity: 0,
          price: 0,
        });
      }
      let currentTrade = trades.get(key);
      currentTrade.quantity += stock.quantity;
      currentTrade = trades.get(key);
      const oppositeSide = stock.side == "Buy" ? "Sell" : "Buy";
      const oppositeKey = `${stock.tradingsymbol} ${oppositeSide}`;
      if (trades.has(oppositeKey)) {
        let oppositeTrade = trades.get(oppositeKey);
        const quantity = oppositeTrade.quantity - currentTrade.quantity;
        if (quantity >= 0) {
          trades.set(oppositeKey, {
            quantity: quantity,
            // price: currentTrade.price+stock,
          });
          trades.set(key, {
            quantity: 0,
            // price: currentTrade.price+stock,
          });
        } else {
          trades.set(oppositeKey, {
            quantity: 0,
            // price: currentTrade.price+stock,
          });
          trades.set(key, {
            quantity: Math.abs(quantity),
            // price: currentTrade.price+stock,
          });
        }
      }
    });
    console.log(trades);
    const tradesObject = {};
    for (const [key, value] of trades) {
      tradesObject[key] = value;
    }

    const jsonString = JSON.stringify(tradesObject, null, 2);
    return jsonString;
  }
}
export { TradeService };
