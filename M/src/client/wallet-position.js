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
var WalletPositionComponent = /** @class */ (function () {
    function WalletPositionComponent(zone, subscriberFactory) {
        var _this = this;
        this.zone = zone;
        this.subscriberFactory = subscriberFactory;
        this.profitBase = 0;
        this.profitQuote = 0;
        this.clearPosition = function () {
            _this.baseCurrency = null;
            _this.quoteCurrency = null;
            _this.basePosition = null;
            _this.quotePosition = null;
            _this.baseHeldPosition = null;
            _this.quoteHeldPosition = null;
            _this.value = null;
            _this.quoteValue = null;
            _this.profitBase = 0;
            _this.profitQuote = 0;
        };
        this.updatePosition = function (o) {
            if (o === null)
                return;
            _this.basePosition = o.baseAmount;
            _this.quotePosition = o.quoteAmount;
            _this.baseHeldPosition = o.baseHeldAmount;
            _this.quoteHeldPosition = o.quoteHeldAmount;
            _this.value = o.value;
            _this.quoteValue = o.quoteValue;
            _this.profitBase = o.profitBase;
            _this.profitQuote = o.profitQuote;
            _this.baseCurrency = o.pair.base;
            _this.quoteCurrency = o.pair.quote;
        };
    }
    WalletPositionComponent.prototype.ngOnInit = function () {
        this.subscriberFactory
            .getSubscriber(this.zone, Models.Topics.Position)
            .registerDisconnectedHandler(this.clearPosition)
            .registerSubscriber(this.updatePosition);
    };
    __decorate([
        core_1.Input()
    ], WalletPositionComponent.prototype, "product", void 0);
    WalletPositionComponent = __decorate([
        core_1.Component({
            selector: 'wallet-position',
            template: "<div class=\"positions\" *ngIf=\"value || quoteValue\">\n    <h4 class=\"col-md-12 col-xs-2\"><small>{{ baseCurrency }}:<br><span title=\"{{ baseCurrency }} Available\" class=\"text-danger\">{{ basePosition | number:'1.8-8' }}</span><br/><span title=\"{{ baseCurrency }} Held\" [ngClass]=\"baseHeldPosition ? 'sell' : 'text-muted'\">{{ baseHeldPosition | number:'1.8-8' }}</span></small></h4>\n    <h4 class=\"col-md-12 col-xs-2\"><small>{{ quoteCurrency }}:<br><span title=\"{{ quoteCurrency }} Available\" class=\"text-danger\">{{ quotePosition | number:'1.'+product.fixed+'-'+product.fixed }}</span><br/><span title=\"{{ quoteCurrency }} Held\" [ngClass]=\"quoteHeldPosition ? 'buy' : 'text-muted'\">{{ quoteHeldPosition | number:'1.'+product.fixed+'-'+product.fixed }}</span></small></h4>\n    <h4 class=\"col-md-12 col-xs-2\" style=\"margin-bottom: 0px!important;\"><small>Value:</small><br><b title=\"{{ baseCurrency }} Total\">{{ value | number:'1.8-8' }}</b><br/><b title=\"{{ quoteCurrency }} Total\">{{ quoteValue | number:'1.'+product.fixed+'-'+product.fixed }}</b></h4>\n    <h4 class=\"col-md-12 col-xs-2\" style=\"margin-top: 0px!important;\"><small style=\"font-size:69%\"><span title=\"{{ baseCurrency }} profit % since last hour\" class=\"{{ profitBase>0 ? 'text-danger' : 'text-muted' }}\">{{ profitBase>=0?'+':'' }}{{ profitBase | number:'1.2-2' }}%</span>, <span title=\"{{ quoteCurrency }} profit % since last hour\" class=\"{{ profitQuote>0 ? 'text-danger' : 'text-muted' }}\">{{ profitQuote>=0?'+':'' }}{{ profitQuote | number:'1.2-2' }}%</span></small></h4>\n  </div>"
        }),
        __param(0, core_1.Inject(core_1.NgZone)),
        __param(1, core_1.Inject(shared_directives_1.SubscriberFactory))
    ], WalletPositionComponent);
    return WalletPositionComponent;
}());
exports.WalletPositionComponent = WalletPositionComponent;
