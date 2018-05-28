"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subscribe = require("./subscribe");
var FireFactory = /** @class */ (function () {
    function FireFactory() {
        this.getFire = function (topic) {
            return new Subscribe.Fire(topic);
        };
    }
    FireFactory = __decorate([
        core_1.Injectable()
    ], FireFactory);
    return FireFactory;
}());
exports.FireFactory = FireFactory;
var SubscriberFactory = /** @class */ (function () {
    function SubscriberFactory() {
        this.getSubscriber = function (scope, topic) {
            return new EvalAsyncSubscriber(scope, topic);
        };
    }
    SubscriberFactory = __decorate([
        core_1.Injectable()
    ], SubscriberFactory);
    return SubscriberFactory;
}());
exports.SubscriberFactory = SubscriberFactory;
var EvalAsyncSubscriber = /** @class */ (function () {
    function EvalAsyncSubscriber(_scope, topic) {
        var _this = this;
        this._scope = _scope;
        this.registerSubscriber = function (incrementalHandler) {
            return _this._wrapped.registerSubscriber(function (x) { return _this._scope.run(function () { return incrementalHandler(x); }); });
        };
        this.registerConnectHandler = function (handler) {
            return _this._wrapped.registerConnectHandler(function () { return _this._scope.run(handler); });
        };
        this.registerDisconnectedHandler = function (handler) {
            return _this._wrapped.registerDisconnectedHandler(function () { return _this._scope.run(handler); });
        };
        this._wrapped = new Subscribe.Subscriber(topic);
    }
    Object.defineProperty(EvalAsyncSubscriber.prototype, "connected", {
        get: function () { return this._wrapped.connected; },
        enumerable: true,
        configurable: true
    });
    return EvalAsyncSubscriber;
}());
var BaseCurrencyCellComponent = /** @class */ (function () {
    function BaseCurrencyCellComponent() {
    }
    BaseCurrencyCellComponent.prototype.agInit = function (params) {
        this.params = params;
    };
    BaseCurrencyCellComponent = __decorate([
        core_1.Component({
            selector: 'base-currency-cell',
            template: "{{ params.value | number:'1.4-4' }}"
        })
    ], BaseCurrencyCellComponent);
    return BaseCurrencyCellComponent;
}());
exports.BaseCurrencyCellComponent = BaseCurrencyCellComponent;
var QuoteCurrencyCellComponent = /** @class */ (function () {
    function QuoteCurrencyCellComponent() {
        this.quoteSymbol = 'USD';
        this.productFixed = 2;
    }
    QuoteCurrencyCellComponent.prototype.agInit = function (params) {
        this.params = params;
        if ('quoteSymbol' in params.node.data)
            this.quoteSymbol = params.node.data.quoteSymbol.substr(0, 3);
        if ('productFixed' in params.node.data)
            this.productFixed = params.node.data.productFixed;
    };
    QuoteCurrencyCellComponent = __decorate([
        core_1.Component({
            selector: 'quote-currency-cell',
            template: "{{ params.value | currency:quoteSymbol:true:'1.'+productFixed+'-'+productFixed }}"
        })
    ], QuoteCurrencyCellComponent);
    return QuoteCurrencyCellComponent;
}());
exports.QuoteCurrencyCellComponent = QuoteCurrencyCellComponent;
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            providers: [
                SubscriberFactory,
                FireFactory
            ]
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
