"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prefixes = {
    SNAPSHOT: '=',
    MESSAGE: '-'
};
exports.Topics = {
    FairValue: 'a',
    Quote: 'b',
    ActiveSubscription: 'c',
    ActiveState: 'd',
    MarketData: 'e',
    QuotingParametersChange: 'f',
    SafetySettings: 'g',
    Product: 'h',
    OrderStatusReports: 'i',
    ProductAdvertisement: 'j',
    ApplicationState: 'k',
    Notepad: 'l',
    ToggleConfigs: 'm',
    Position: 'n',
    ExchangeConnectivity: 'o',
    SubmitNewOrder: 'p',
    CancelOrder: 'q',
    MarketTrade: 'r',
    Trades: 's',
    ExternalValuation: 't',
    QuoteStatus: 'u',
    TargetBasePosition: 'v',
    TradeSafetyValue: 'w',
    CancelAllOrders: 'x',
    CleanAllClosedOrders: 'y',
    CleanAllOrders: 'z',
    CleanTrade: 'A',
    TradesChart: 'B',
    WalletChart: 'C',
    EWMAChart: 'D'
};
var MarketSide = /** @class */ (function () {
    function MarketSide(price, size) {
        this.price = price;
        this.size = size;
    }
    return MarketSide;
}());
exports.MarketSide = MarketSide;
var Market = /** @class */ (function () {
    function Market(bids, asks) {
        this.bids = bids;
        this.asks = asks;
    }
    return Market;
}());
exports.Market = Market;
var MarketStats = /** @class */ (function () {
    function MarketStats(fv, bid, ask, time) {
        this.fv = fv;
        this.bid = bid;
        this.ask = ask;
        this.time = time;
    }
    return MarketStats;
}());
exports.MarketStats = MarketStats;
var MarketTrade = /** @class */ (function () {
    function MarketTrade(exchange, pair, price, quantity, time, side) {
        this.exchange = exchange;
        this.pair = pair;
        this.price = price;
        this.quantity = quantity;
        this.time = time;
        this.side = side;
    }
    return MarketTrade;
}());
exports.MarketTrade = MarketTrade;
var Connectivity;
(function (Connectivity) {
    Connectivity[Connectivity["Disconnected"] = 0] = "Disconnected";
    Connectivity[Connectivity["Connected"] = 1] = "Connected";
})(Connectivity = exports.Connectivity || (exports.Connectivity = {}));
var Exchange;
(function (Exchange) {
    Exchange[Exchange["Null"] = 0] = "Null";
    Exchange[Exchange["HitBtc"] = 1] = "HitBtc";
    Exchange[Exchange["OkCoin"] = 2] = "OkCoin";
    Exchange[Exchange["Coinbase"] = 3] = "Coinbase";
    Exchange[Exchange["Bitfinex"] = 4] = "Bitfinex";
    Exchange[Exchange["Korbit"] = 5] = "Korbit";
    Exchange[Exchange["Poloniex"] = 6] = "Poloniex";
})(Exchange = exports.Exchange || (exports.Exchange = {}));
var Side;
(function (Side) {
    Side[Side["Bid"] = 0] = "Bid";
    Side[Side["Ask"] = 1] = "Ask";
    Side[Side["Unknown"] = 2] = "Unknown";
})(Side = exports.Side || (exports.Side = {}));
var OrderType;
(function (OrderType) {
    OrderType[OrderType["Limit"] = 0] = "Limit";
    OrderType[OrderType["Market"] = 1] = "Market";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
var TimeInForce;
(function (TimeInForce) {
    TimeInForce[TimeInForce["IOC"] = 0] = "IOC";
    TimeInForce[TimeInForce["FOK"] = 1] = "FOK";
    TimeInForce[TimeInForce["GTC"] = 2] = "GTC";
})(TimeInForce = exports.TimeInForce || (exports.TimeInForce = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["New"] = 0] = "New";
    OrderStatus[OrderStatus["Working"] = 1] = "Working";
    OrderStatus[OrderStatus["Complete"] = 2] = "Complete";
    OrderStatus[OrderStatus["Cancelled"] = 3] = "Cancelled";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var Liquidity;
(function (Liquidity) {
    Liquidity[Liquidity["Make"] = 0] = "Make";
    Liquidity[Liquidity["Take"] = 1] = "Take";
})(Liquidity = exports.Liquidity || (exports.Liquidity = {}));
var EWMAChart = /** @class */ (function () {
    function EWMAChart(stdevWidth, ewmaQuote, ewmaShort, ewmaMedium, ewmaLong, fairValue) {
        this.stdevWidth = stdevWidth;
        this.ewmaQuote = ewmaQuote;
        this.ewmaShort = ewmaShort;
        this.ewmaMedium = ewmaMedium;
        this.ewmaLong = ewmaLong;
        this.fairValue = fairValue;
    }
    return EWMAChart;
}());
exports.EWMAChart = EWMAChart;
var TradeChart = /** @class */ (function () {
    function TradeChart(price, side, quantity, value, pong) {
        this.price = price;
        this.side = side;
        this.quantity = quantity;
        this.value = value;
        this.pong = pong;
    }
    return TradeChart;
}());
exports.TradeChart = TradeChart;
var Trade = /** @class */ (function () {
    function Trade(tradeId, time, exchange, pair, price, quantity, side, value, Ktime, Kqty, Kprice, Kvalue, Kdiff, feeCharged, loadedFromDB) {
        this.tradeId = tradeId;
        this.time = time;
        this.exchange = exchange;
        this.pair = pair;
        this.price = price;
        this.quantity = quantity;
        this.side = side;
        this.value = value;
        this.Ktime = Ktime;
        this.Kqty = Kqty;
        this.Kprice = Kprice;
        this.Kvalue = Kvalue;
        this.Kdiff = Kdiff;
        this.feeCharged = feeCharged;
        this.loadedFromDB = loadedFromDB;
    }
    return Trade;
}());
exports.Trade = Trade;
var CurrencyPosition = /** @class */ (function () {
    function CurrencyPosition(amount, heldAmount, currency) {
        this.amount = amount;
        this.heldAmount = heldAmount;
        this.currency = currency;
    }
    return CurrencyPosition;
}());
exports.CurrencyPosition = CurrencyPosition;
var PositionReport = /** @class */ (function () {
    function PositionReport(baseAmount, quoteAmount, baseHeldAmount, quoteHeldAmount, value, quoteValue, profitBase, profitQuote, pair, exchange) {
        this.baseAmount = baseAmount;
        this.quoteAmount = quoteAmount;
        this.baseHeldAmount = baseHeldAmount;
        this.quoteHeldAmount = quoteHeldAmount;
        this.value = value;
        this.quoteValue = quoteValue;
        this.profitBase = profitBase;
        this.profitQuote = profitQuote;
        this.pair = pair;
        this.exchange = exchange;
    }
    return PositionReport;
}());
exports.PositionReport = PositionReport;
var OrderRequestFromUI = /** @class */ (function () {
    function OrderRequestFromUI(side, price, quantity, timeInForce, orderType) {
        this.side = side;
        this.price = price;
        this.quantity = quantity;
        this.timeInForce = timeInForce;
        this.orderType = orderType;
    }
    return OrderRequestFromUI;
}());
exports.OrderRequestFromUI = OrderRequestFromUI;
var FairValue = /** @class */ (function () {
    function FairValue(price) {
        this.price = price;
    }
    return FairValue;
}());
exports.FairValue = FairValue;
var Quote = /** @class */ (function () {
    function Quote(price, size, isPong) {
        this.price = price;
        this.size = size;
        this.isPong = isPong;
    }
    return Quote;
}());
exports.Quote = Quote;
var TwoSidedQuote = /** @class */ (function () {
    function TwoSidedQuote(bid, ask) {
        this.bid = bid;
        this.ask = ask;
    }
    return TwoSidedQuote;
}());
exports.TwoSidedQuote = TwoSidedQuote;
var QuoteStatus;
(function (QuoteStatus) {
    QuoteStatus[QuoteStatus["Live"] = 0] = "Live";
    QuoteStatus[QuoteStatus["Disconnected"] = 1] = "Disconnected";
    QuoteStatus[QuoteStatus["DisabledQuotes"] = 2] = "DisabledQuotes";
    QuoteStatus[QuoteStatus["MissingData"] = 3] = "MissingData";
    QuoteStatus[QuoteStatus["UnknownHeld"] = 4] = "UnknownHeld";
    QuoteStatus[QuoteStatus["TBPHeld"] = 5] = "TBPHeld";
    QuoteStatus[QuoteStatus["MaxTradesSeconds"] = 6] = "MaxTradesSeconds";
    QuoteStatus[QuoteStatus["WaitingPing"] = 7] = "WaitingPing";
    QuoteStatus[QuoteStatus["DepletedFunds"] = 8] = "DepletedFunds";
    QuoteStatus[QuoteStatus["Crossed"] = 9] = "Crossed";
})(QuoteStatus = exports.QuoteStatus || (exports.QuoteStatus = {}));
var TwoSidedQuoteStatus = /** @class */ (function () {
    function TwoSidedQuoteStatus(bidStatus, askStatus, quotesInMemoryNew, quotesInMemoryWorking, quotesInMemoryDone) {
        this.bidStatus = bidStatus;
        this.askStatus = askStatus;
        this.quotesInMemoryNew = quotesInMemoryNew;
        this.quotesInMemoryWorking = quotesInMemoryWorking;
        this.quotesInMemoryDone = quotesInMemoryDone;
    }
    return TwoSidedQuoteStatus;
}());
exports.TwoSidedQuoteStatus = TwoSidedQuoteStatus;
var CurrencyPair = /** @class */ (function () {
    function CurrencyPair(base, quote) {
        this.base = base;
        this.quote = quote;
    }
    return CurrencyPair;
}());
exports.CurrencyPair = CurrencyPair;
var QuotingMode;
(function (QuotingMode) {
    QuotingMode[QuotingMode["Top"] = 0] = "Top";
    QuotingMode[QuotingMode["Mid"] = 1] = "Mid";
    QuotingMode[QuotingMode["Join"] = 2] = "Join";
    QuotingMode[QuotingMode["InverseJoin"] = 3] = "InverseJoin";
    QuotingMode[QuotingMode["InverseTop"] = 4] = "InverseTop";
    QuotingMode[QuotingMode["PingPong"] = 5] = "PingPong";
    QuotingMode[QuotingMode["Boomerang"] = 6] = "Boomerang";
    QuotingMode[QuotingMode["AK47"] = 7] = "AK47";
    QuotingMode[QuotingMode["HamelinRat"] = 8] = "HamelinRat";
    QuotingMode[QuotingMode["Depth"] = 9] = "Depth";
})(QuotingMode = exports.QuotingMode || (exports.QuotingMode = {}));
var FairValueModel;
(function (FairValueModel) {
    FairValueModel[FairValueModel["BBO"] = 0] = "BBO";
    FairValueModel[FairValueModel["wBBO"] = 1] = "wBBO";
})(FairValueModel = exports.FairValueModel || (exports.FairValueModel = {}));
var AutoPositionMode;
(function (AutoPositionMode) {
    AutoPositionMode[AutoPositionMode["Manual"] = 0] = "Manual";
    AutoPositionMode[AutoPositionMode["EWMA_LS"] = 1] = "EWMA_LS";
    AutoPositionMode[AutoPositionMode["EWMA_LMS"] = 2] = "EWMA_LMS";
})(AutoPositionMode = exports.AutoPositionMode || (exports.AutoPositionMode = {}));
var PingAt;
(function (PingAt) {
    PingAt[PingAt["BothSides"] = 0] = "BothSides";
    PingAt[PingAt["BidSide"] = 1] = "BidSide";
    PingAt[PingAt["AskSide"] = 2] = "AskSide";
    PingAt[PingAt["DepletedSide"] = 3] = "DepletedSide";
    PingAt[PingAt["DepletedBidSide"] = 4] = "DepletedBidSide";
    PingAt[PingAt["DepletedAskSide"] = 5] = "DepletedAskSide";
    PingAt[PingAt["StopPings"] = 6] = "StopPings";
})(PingAt = exports.PingAt || (exports.PingAt = {}));
var PongAt;
(function (PongAt) {
    PongAt[PongAt["ShortPingFair"] = 0] = "ShortPingFair";
    PongAt[PongAt["LongPingFair"] = 1] = "LongPingFair";
    PongAt[PongAt["ShortPingAggressive"] = 2] = "ShortPingAggressive";
    PongAt[PongAt["LongPingAggressive"] = 3] = "LongPingAggressive";
})(PongAt = exports.PongAt || (exports.PongAt = {}));
var APR;
(function (APR) {
    APR[APR["Off"] = 0] = "Off";
    APR[APR["Size"] = 1] = "Size";
    APR[APR["SizeWidth"] = 2] = "SizeWidth";
})(APR = exports.APR || (exports.APR = {}));
var SOP;
(function (SOP) {
    SOP[SOP["Off"] = 0] = "Off";
    SOP[SOP["x2trades"] = 1] = "x2trades";
    SOP[SOP["x3trades"] = 2] = "x3trades";
    SOP[SOP["x2Size"] = 3] = "x2Size";
    SOP[SOP["x3Size"] = 4] = "x3Size";
    SOP[SOP["x2tradesSize"] = 5] = "x2tradesSize";
    SOP[SOP["x3tradesSize"] = 6] = "x3tradesSize";
})(SOP = exports.SOP || (exports.SOP = {}));
var STDEV;
(function (STDEV) {
    STDEV[STDEV["Off"] = 0] = "Off";
    STDEV[STDEV["OnFV"] = 1] = "OnFV";
    STDEV[STDEV["OnFVAPROff"] = 2] = "OnFVAPROff";
    STDEV[STDEV["OnTops"] = 3] = "OnTops";
    STDEV[STDEV["OnTopsAPROff"] = 4] = "OnTopsAPROff";
    STDEV[STDEV["OnTop"] = 5] = "OnTop";
    STDEV[STDEV["OnTopAPROff"] = 6] = "OnTopAPROff";
})(STDEV = exports.STDEV || (exports.STDEV = {}));
var ProductAdvertisement = /** @class */ (function () {
    function ProductAdvertisement(exchange, pair, environment, matryoshka, homepage, minTick) {
        this.exchange = exchange;
        this.pair = pair;
        this.environment = environment;
        this.matryoshka = matryoshka;
        this.homepage = homepage;
        this.minTick = minTick;
    }
    return ProductAdvertisement;
}());
exports.ProductAdvertisement = ProductAdvertisement;
var ApplicationState = /** @class */ (function () {
    function ApplicationState(memory, hour, freq, dbsize) {
        this.memory = memory;
        this.hour = hour;
        this.freq = freq;
        this.dbsize = dbsize;
    }
    return ApplicationState;
}());
exports.ApplicationState = ApplicationState;
var TradeSafety = /** @class */ (function () {
    function TradeSafety(buy, sell, combined, buyPing, sellPong) {
        this.buy = buy;
        this.sell = sell;
        this.combined = combined;
        this.buyPing = buyPing;
        this.sellPong = sellPong;
    }
    return TradeSafety;
}());
exports.TradeSafety = TradeSafety;
var TargetBasePositionValue = /** @class */ (function () {
    function TargetBasePositionValue(tbp, sideAPR) {
        this.tbp = tbp;
        this.sideAPR = sideAPR;
    }
    return TargetBasePositionValue;
}());
exports.TargetBasePositionValue = TargetBasePositionValue;
