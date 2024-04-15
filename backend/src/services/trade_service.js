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
    let prices = new Map();
    selectedTradesByStrategy.forEach((stock) => {
      let key = `${stock.tradingsymbol} ${stock.side}`;
      if (!trades.has(key)) {
        trades.set(key, {
          quantity: 0,
          price: 0,
          lots: 0,
        });
        prices.set(key, {
          price: {},
        });
      }
      let currentTrade = trades.get(key);
      currentTrade.quantity += stock.quantity;
      let priceOfEachStrike = prices.get(key);
      currentTrade.lots += 1;
      priceOfEachStrike.price[currentTrade.lots] = stock.price;
      currentTrade.price =
        (currentTrade.price + stock.price) / currentTrade.lots;
      //
      const oppositeSide = stock.side == "Buy" ? "Sell" : "Buy";
      const oppositeKey = `${stock.tradingsymbol} ${oppositeSide}`;
      if (trades.has(oppositeKey)) {
        let priceOfEachStrikeOppositSide = prices.get(oppositeKey);
        let oppositeTrade = trades.get(oppositeKey);
        const quantity = oppositeTrade.quantity - currentTrade.quantity;
        let oppositeOrderTradePrice = priceOfEachStrikeOppositSide.price;
        let currentOrderTradePrice = priceOfEachStrike.price;
        oppositeOrderTradePrice[`${currentTrade.lots}`] = 0;
        let oppositeValue = 0;
        let oppositeCount = 0;
        for (const key in oppositeOrderTradePrice) {
          if (oppositeOrderTradePrice[key] > 0) {
            oppositeValue += oppositeOrderTradePrice[key];
            oppositeCount++;
          }

          console.log(
            "Current Trade Price",
            oppositeValue,
            "Count",
            oppositeCount,
            oppositeValue / oppositeCount,
            "Key",
            oppositeValue
          );
        }
        let val = 0;
        let count = 0;
        let i = 0;
        for (const key in currentOrderTradePrice) {
          i++;
          if (i < currentTrade.lots) {
            currentOrderTradePrice[key] = 0;
          }
          if (currentOrderTradePrice[key] > 0) {
            // if(currentOrderTradePrice[key] < ;)
            val += currentOrderTradePrice[key];
            count++;
          }

          console.log(
            "Current Trade Price self",
            val,
            "Count",
            count,
            val / count,
            "Key",
            key
          );
        }
        let finalPriceOpposite = oppositeValue / oppositeCount;
        let finalPrice = val / count;
        if (isNaN(finalPriceOpposite)) {
          finalPriceOpposite = 0;
        }
        if (quantity >= 0) {
          trades.set(oppositeKey, {
            quantity: quantity,
            price: finalPriceOpposite,
            lots: oppositeTrade.lots,
          });
          trades.set(key, {
            quantity: 0,
            price: 0,
            lots: currentTrade.lots,
          });
        } else {
          trades.set(oppositeKey, {
            quantity: 0,
            price: 0,
            lots: oppositeTrade.lots,
          });
          trades.set(key, {
            quantity: Math.abs(quantity),
            price: finalPrice,
            lots: currentTrade.lots,
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
// 100+100
// buy order 100 + 99 / 2;
// 99.5
// sell order 106
// the positon which exits gets 0  buy avg is (100 +99 )/2 = 99.5 this is wrong
// sell position 100 -106 if quantity 0 then o price set
// if quantity  (100 +99)/2 --> 99.5 - 106
// if sell order then   so remove the 1st buy from the hashmap   100 -108 = 8
// s
(100 * 2 + 106 * 1) / 150;
