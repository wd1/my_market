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
var TradeSafetyComponent = /** @class */ (function () {
    function TradeSafetyComponent(zone, subscriberFactory) {
        var _this = this;
        this.zone = zone;
        this.subscriberFactory = subscriberFactory;
        this.updateValues = function (value) {
            if (value == null)
                return;
            _this.tradeSafetyValue = value.combined;
            _this.buySafety = value.buy;
            _this.sellSafety = value.sell;
            _this.buySizeSafety = value.buyPing;
            _this.sellSizeSafety = value.sellPong;
        };
        this.updateFairValue = function (fv) {
            if (fv == null) {
                _this.clearFairValue();
                return;
            }
            _this.fairValue = fv.price;
        };
        this.clearFairValue = function () {
            _this.fairValue = null;
        };
        this.clear = function () {
            _this.tradeSafetyValue = null;
            _this.buySafety = null;
            _this.sellSafety = null;
            _this.buySizeSafety = null;
            _this.sellSizeSafety = null;
        };
    }
    TradeSafetyComponent.prototype.ngOnInit = function () {
        this.subscriberFactory
            .getSubscriber(this.zone, Models.Topics.FairValue)
            .registerConnectHandler(this.clearFairValue)
            .registerSubscriber(this.updateFairValue);
        this.subscriberFactory
            .getSubscriber(this.zone, Models.Topics.TradeSafetyValue)
            .registerConnectHandler(this.clear)
            .registerSubscriber(this.updateValues);
    };
    __decorate([
        core_1.Input()
    ], TradeSafetyComponent.prototype, "tradeFreq", void 0);
    __decorate([
        core_1.Input()
    ], TradeSafetyComponent.prototype, "product", void 0);
    TradeSafetyComponent = __decorate([
        core_1.Component({
            selector: 'trade-safety',
            template: "<div div class=\"tradeSafety img-rounded\"><div>\n      Fair Value: <span class=\"{{ fairValue ? 'text-danger fairvalue' : 'text-muted' }}\" style=\"font-size:121%;\">{{ fairValue | number:'1.'+product.fixed+'-'+product.fixed }}</span>,\n      BuyPing: <span class=\"{{ buySizeSafety ? 'text-danger' : 'text-muted' }}\">{{ buySizeSafety | number:'1.'+product.fixed+'-'+product.fixed }}</span>,\n      SellPing: <span class=\"{{ sellSizeSafety ? 'text-danger' : 'text-muted' }}\">{{ sellSizeSafety | number:'1.'+product.fixed+'-'+product.fixed }}</span>,\n      BuyTS: <span class=\"{{ buySafety ? 'text-danger' : 'text-muted' }}\">{{ buySafety | number:'1.2-2' }}</span>,\n      SellTS: <span class=\"{{ sellSafety ? 'text-danger' : 'text-muted' }}\">{{ sellSafety | number:'1.2-2' }}</span>,\n      TotalTS: <span class=\"{{ tradeSafetyValue ? 'text-danger' : 'text-muted' }}\">{{ tradeSafetyValue | number:'1.2-2' }}</span>,\n      openOrders/60sec: <span class=\"{{ tradeFreq ? 'text-danger' : 'text-muted' }}\">{{ tradeFreq | number:'1.0-0' }}</span>\n    </div>\n  </div>"
        }),
        __param(0, core_1.Inject(core_1.NgZone)),
        __param(1, core_1.Inject(shared_directives_1.SubscriberFactory))
    ], TradeSafetyComponent);
    return TradeSafetyComponent;
}());
exports.TradeSafetyComponent = TradeSafetyComponent;
