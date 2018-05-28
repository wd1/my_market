"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Models = require("./models");
var shared_directives_1 = require("./shared_directives");
var MarketQuotingComponent = /** @class */ (function () {
    function MarketQuotingComponent(zone, subscriberFactory) {
        var _this = this;
        this.zone = zone;
        this.subscriberFactory = subscriberFactory;
        this.clearMarket = function () {
            _this.levels = [];
        };
        this.clearTargetBasePosition = function () {
            _this.targetBasePosition = null;
            _this.sideAPRSafety = null;
        };
        this.clearAddress = function () {
            _this.a = "";
        };
        this.clearQuote = function () {
            _this.orderBids = [];
            _this.orderAsks = [];
        };
        this.updateAddress = function (A) {
            _this.a = A.a;
        };
        this.clearQuoteStatus = function () {
            _this.bidStatus = Models.QuoteStatus[1];
            _this.askStatus = Models.QuoteStatus[1];
            _this.quotesInMemoryNew = 0;
            _this.quotesInMemoryWorking = 0;
            _this.quotesInMemoryDone = 0;
        };
        this.updateTargetBasePosition = function (value) {
            if (value == null)
                return;
            _this.targetBasePosition = value.tbp;
            _this.sideAPRSafety = value.sideAPR || 'Off';
        };
        this.updateMarket = function (update) {
            if (update == null && typeof update.bids == "undefined" || typeof update.asks == "undefined") {
                _this.clearMarket();
                return;
            }
            for (var i = 0; i < _this.orderAsks.length; i++)
                if (!update.asks.filter(function (x) { return x.price === _this.orderAsks[i].price; }).length) {
                    for (var j = 0; j < update.asks.length; j++)
                        if (update.asks[j].price > _this.orderAsks[i].price)
                            break;
                    update.asks.splice(j - (j == update.asks.length ? 0 : 1), 0, { price: _this.orderAsks[i].price, size: _this.orderAsks[i].quantity });
                    update.asks = update.asks.slice(0, -1);
                }
            for (var i = 0; i < _this.orderBids.length; i++)
                if (!update.bids.filter(function (x) { return x.price === _this.orderBids[i].price; }).length) {
                    for (var j = 0; j < update.bids.length; j++)
                        if (update.bids[j].price < _this.orderBids[i].price)
                            break;
                    update.bids.splice(j - (j == update.bids.length ? 0 : 1), 0, { price: _this.orderBids[i].price, size: _this.orderBids[i].quantity });
                    update.bids = update.bids.slice(0, -1);
                }
            var _levels = [];
            for (var j = 0; j < update.asks.length; j++) {
                if (j >= _levels.length)
                    _levels[j] = {};
                _levels[j] = Object.assign(_levels[j], { askPrice: update.asks[j].price, askSize: update.asks[j].size });
            }
            for (var j = 0; j < update.bids.length; j++) {
                if (j >= _levels.length)
                    _levels[j] = {};
                _levels[j] = Object.assign(_levels[j], { bidPrice: update.bids[j].price, bidSize: update.bids[j].size });
                if (j == 0)
                    _this.diffMD = _levels[j].askPrice - _levels[j].bidPrice;
                else if (j == 1)
                    _this.diffPx = Math.max((_this.qAskPx && _this.qBidPx) ? _this.qAskPx - _this.qBidPx : 0, 0);
            }
            var modAsk;
            var modBid;
            for (var i = _this.levels.length; i--;) {
                if (i >= _levels.length) {
                    _levels[i] = {};
                    continue;
                }
                modAsk = 2;
                modBid = 2;
                for (var h = _levels.length; h--;) {
                    if (modAsk === 2 && _this.levels[i].askPrice === _levels[h].askPrice)
                        modAsk = _this.levels[i].askSize !== _levels[h].askSize ? 1 : 0;
                    if (modBid === 2 && _this.levels[i].bidPrice === _levels[h].bidPrice)
                        modBid = _this.levels[i].bidSize !== _levels[h].bidSize ? 1 : 0;
                    if (modBid !== 2 && modAsk !== 2)
                        break;
                }
                _levels[i] = Object.assign(_levels[i], { bidMod: modBid, askMod: modAsk });
            }
            for (var h = _levels.length; h--;) {
                modAsk = 0;
                modBid = 0;
                for (var i = _this.levels.length; i--;) {
                    if (!modAsk && _this.levels[i].askPrice === _levels[h].askPrice)
                        modAsk = 1;
                    if (!modBid && _this.levels[i].bidPrice === _levels[h].bidPrice)
                        modBid = 1;
                    if (modBid && modAsk)
                        break;
                }
                if (!modBid)
                    _levels[h] = Object.assign(_levels[h], { bidMod: 1 });
                if (!modAsk)
                    _levels[h] = Object.assign(_levels[h], { askMod: 1 });
            }
            _this.updateQuoteClass(_levels);
        };
        this.updateQuote = function (o) {
            if (typeof o[0] == 'object') {
                // this.clearQuote();
                return o.forEach(function (x) { return setTimeout(_this.updateQuote(x), 0); });
            }
            var orderSide = o.side === Models.Side.Bid ? 'orderBids' : 'orderAsks';
            if (o.orderStatus == Models.OrderStatus.Cancelled
                || o.orderStatus == Models.OrderStatus.Complete)
                _this[orderSide] = _this[orderSide].filter(function (x) { return x.orderId !== o.orderId; });
            else if (!_this[orderSide].filter(function (x) { return x.orderId === o.orderId; }).length)
                _this[orderSide].push({
                    orderId: o.orderId,
                    side: o.side,
                    price: o.price,
                    quantity: o.quantity,
                });
            if (_this.orderBids.length) {
                var bid = _this.orderBids.reduce(function (a, b) { return a.price > b.price ? a : b; });
                _this.qBidPx = bid.price;
                _this.qBidSz = bid.quantity;
            }
            else {
                _this.qBidPx = null;
                _this.qBidSz = null;
            }
            if (_this.orderAsks.length) {
                var ask = _this.orderAsks.reduce(function (a, b) { return a.price < b.price ? a : b; });
                _this.qAskPx = ask.price;
                _this.qAskSz = ask.quantity;
            }
            else {
                _this.qAskPx = null;
                _this.qAskSz = null;
            }
            _this.updateQuoteClass();
        };
        this.updateQuoteStatus = function (status) {
            if (status == null) {
                _this.clearQuoteStatus();
                return;
            }
            _this.bidStatus = Models.QuoteStatus[status.bidStatus];
            _this.askStatus = Models.QuoteStatus[status.askStatus];
            _this.quotesInMemoryNew = status.quotesInMemoryNew;
            _this.quotesInMemoryWorking = status.quotesInMemoryWorking;
            _this.quotesInMemoryDone = status.quotesInMemoryDone;
        };
        this.updateQuoteClass = function (levels) {
            if (document.body.className != "visible")
                return;
            if (levels && levels.length > 0) {
                var _loop_1 = function (i) {
                    if (i >= _this.levels.length)
                        _this.levels[i] = {};
                    if (levels[i].bidMod === 1)
                        jQuery('.bidsz' + i + '.num').addClass('buy');
                    if (levels[i].askMod === 1)
                        jQuery('.asksz' + i + '.num').addClass('sell');
                    jQuery('.bidsz' + i).css('opacity', levels[i].bidMod === 2 ? 0.4 : 1.0);
                    jQuery('.asksz' + i).css('opacity', levels[i].askMod === 2 ? 0.4 : 1.0);
                    setTimeout(function () {
                        jQuery('.bidsz' + i).css('opacity', levels[i].bidMod === 2 ? 0.0 : 1.0);
                        jQuery('.asksz' + i).css('opacity', levels[i].askMod === 2 ? 0.0 : 1.0);
                        setTimeout(function () {
                            _this.levels[i] = Object.assign(_this.levels[i], { bidPrice: levels[i].bidPrice, bidSize: levels[i].bidSize, askPrice: levels[i].askPrice, askSize: levels[i].askSize });
                            _this.levels[i].bidClass = 'active';
                            for (var j = 0; j < _this.orderBids.length; j++)
                                if (_this.orderBids[j].price === _this.levels[i].bidPrice)
                                    _this.levels[i].bidClass = 'success buy';
                            _this.levels[i].bidClassVisual = String('vsBuy visualSize').concat(Math.round(Math.max(Math.min((Math.log(_this.levels[i].bidSize) / Math.log(2)) * 4, 19), 1)));
                            _this.levels[i].askClass = 'active';
                            for (var j = 0; j < _this.orderAsks.length; j++)
                                if (_this.orderAsks[j].price === _this.levels[i].askPrice)
                                    _this.levels[i].askClass = 'success sell';
                            _this.levels[i].askClassVisual = String('vsAsk visualSize').concat(Math.round(Math.max(Math.min((Math.log(_this.levels[i].askSize) / Math.log(2)) * 4, 19), 1)));
                            setTimeout(function () { jQuery('.asksz' + i + ', .bidsz' + i).css('opacity', 1.0); jQuery('.asksz' + i + '.num' + ', .bidsz' + i + '.num').removeClass('sell').removeClass('buy'); }, 1);
                        }, 0);
                    }, 221);
                };
                for (var i = 0; i < levels.length; i++) {
                    _loop_1(i);
                }
            }
        };
        this.clearMarket();
        this.clearQuote();
    }
    Object.defineProperty(MarketQuotingComponent.prototype, "online", {
        set: function (online) {
            if (online)
                return;
            this.clearQuote();
            this.updateQuoteClass();
        },
        enumerable: true,
        configurable: true
    });
    MarketQuotingComponent.prototype.ngOnInit = function () {
        var _this = this;
        [
            [Models.Topics.MarketData, this.updateMarket, this.clearMarket],
            [Models.Topics.OrderStatusReports, this.updateQuote, this.clearQuote],
            [Models.Topics.QuoteStatus, this.updateQuoteStatus, this.clearQuoteStatus],
            [Models.Topics.TargetBasePosition, this.updateTargetBasePosition, this.clearTargetBasePosition],
            [Models.Topics.ApplicationState, this.updateAddress, this.clearAddress]
        ].forEach(function (x) { return (function (topic, updateFn, clearFn) {
            _this.subscriberFactory
                .getSubscriber(_this.zone, topic)
                .registerConnectHandler(clearFn)
                .registerSubscriber(updateFn);
        }).call(_this, x[0], x[1], x[2]); });
    };
    __decorate([
        core_1.Input()
    ], MarketQuotingComponent.prototype, "product", void 0);
    __decorate([
        core_1.Input()
    ], MarketQuotingComponent.prototype, "online", null);
    MarketQuotingComponent = __decorate([
        core_1.Component({
            selector: 'market-quoting',
            template: "<div class=\"tradeSafety2\" style=\"margin-top:-4px;padding-top:0px;padding-right:0px;\"><div style=\"padding-top:0px;padding-right:0px;\">\n      Market Width: <span class=\"{{ diffMD ? 'text-danger' : 'text-muted' }}\">{{ diffMD | number:'1.'+product.fixed+'-'+product.fixed }}</span>,\n      Quote Width: <span class=\"{{ diffPx ? 'text-danger' : 'text-muted' }}\">{{ diffPx | number:'1.'+product.fixed+'-'+product.fixed }}</span>\n      <div style=\"padding-left:0px;\">Wallet TBP: <span class=\"text-danger\">{{ targetBasePosition | number:'1.3-3' }}</span>, APR: <span class=\"{{ sideAPRSafety!='Off' ? 'text-danger' : 'text-muted' }}\">{{ sideAPRSafety }}</span>, Quotes: <span title=\"New Quotes in memory\" class=\"{{ quotesInMemoryNew ? 'text-danger' : 'text-muted' }}\">{{ quotesInMemoryNew }}</span>/<span title=\"Working Quotes in memory\" class=\"{{ quotesInMemoryWorking ? 'text-danger' : 'text-muted' }}\">{{ quotesInMemoryWorking }}</span>/<span title=\"Other Quotes in memory\" class=\"{{ quotesInMemoryDone ? 'text-danger' : 'text-muted' }}\">{{ quotesInMemoryDone }}</span></div>\n      </div></div><div style=\"padding-right:4px;padding-left:4px;padding-top:4px;\"><table class=\"marketQuoting table table-hover table-responsive text-center\">\n      <tr class=\"active\">\n        <td>bidSize&nbsp;</td>\n        <td>bidPrice</td>\n        <td>askPrice</td>\n        <td>askSize&nbsp;</td>\n      </tr>\n      <tr class=\"info\">\n        <th *ngIf=\"bidStatus == 'Live'\" class=\"text-danger\">{{ qBidSz | number:'1.4-4' }}<span *ngIf=\"!qBidSz\">&nbsp;</span></th>\n        <th *ngIf=\"bidStatus == 'Live'\" class=\"text-danger\">{{ qBidPx | number:'1.'+product.fixed+'-'+product.fixed }}</th>\n        <th *ngIf=\"bidStatus != 'Live'\" colspan=\"2\" class=\"text-danger\" title=\"Bids Quote Status\">{{ bidStatus }}</th>\n        <th *ngIf=\"askStatus == 'Live'\" class=\"text-danger\">{{ qAskPx | number:'1.'+product.fixed+'-'+product.fixed }}</th>\n        <th *ngIf=\"askStatus == 'Live'\" class=\"text-danger\">{{ qAskSz | number:'1.4-4' }}<span *ngIf=\"!qAskSz\">&nbsp;</span></th>\n        <th *ngIf=\"askStatus != 'Live'\" colspan=\"2\" class=\"text-danger\" title=\"Ask Quote Status\">{{ askStatus }}</th>\n      </tr>\n      <tr class=\"active\" *ngFor=\"let level of levels; let i = index\">\n        <td *ngIf=\"i == 1 && levels.length == 4\" colspan=\"4\"><div class=\"text-danger\" style=\"height:174px;\"><br />Do you want to <a href=\"{{ product.advert.homepage }}/blob/master/README.md#unlock\" target=\"_blank\">unlock</a> all market levels?<br />and to collaborate with the development?<br /><br />Make an acceptable Pull Request on github.<br/>Or send 0.12100000 BTC or more to:<br /><a href=\"https://www.blocktrail.com/BTC/address/{{ a }}\" target=\"_blank\">{{ a }}</a><br /><br />Wait 2 confirmations and restart this bot.<!-- you can remove this message, but obviously the missing market levels will not be displayed magically. the market levels will be only displayed if the also displayed address is credited with 0.12100000 BTC. Note that if you make a Pull Request i will credit the payment for you easy, just let me know in the description of the PR what is the BTC Address displayed in your bot. --></div></td>\n        <td *ngIf=\"i != 1 || levels.length != 4\" [ngClass]=\"level.bidClass\"><div style=\"z-index:2;position:relative;\" [ngClass]=\"'bidsz' + i + ' num'\">{{ level.bidSize | number:'1.4-4' }}</div><div style=\"float:right;margin-right:19px;\"><div [ngClass]=\"level.bidClassVisual\">&nbsp;</div></div></td>\n        <td *ngIf=\"i != 1 || levels.length != 4\" [ngClass]=\"level.bidClass\"><div [ngClass]=\"'bidsz' + i\">{{ level.bidPrice | number:'1.'+product.fixed+'-'+product.fixed }}</div></td>\n        <td *ngIf=\"i != 1 || levels.length != 4\" [ngClass]=\"level.askClass\"><div [ngClass]=\"'asksz' + i\">{{ level.askPrice | number:'1.'+product.fixed+'-'+product.fixed }}</div></td>\n        <td *ngIf=\"i != 1 || levels.length != 4\" [ngClass]=\"level.askClass\"><div style=\"float:left;\"><div [ngClass]=\"level.askClassVisual\">&nbsp;</div></div><div style=\"z-index:2;position:relative;\" [ngClass]=\"'asksz' + i + ' num'\">{{ level.askSize | number:'1.4-4' }}</div></td>\n      </tr>\n    </table></div>"
        }),
        __param(0, core_1.Inject(core_1.NgZone)),
        __param(1, core_1.Inject(shared_directives_1.SubscriberFactory))
    ], MarketQuotingComponent);
    return MarketQuotingComponent;
}());
exports.MarketQuotingComponent = MarketQuotingComponent;
