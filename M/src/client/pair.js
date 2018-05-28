"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Models = require("./models");
var FormViewModel = /** @class */ (function () {
    function FormViewModel(defaultParameter, _sub, _fire, _submitConverter) {
        if (_submitConverter === void 0) { _submitConverter = null; }
        var _this = this;
        this._sub = _sub;
        this._fire = _fire;
        this._submitConverter = _submitConverter;
        this.pending = false;
        this.connected = false;
        this.reset = function () {
            _this.display = JSON.parse(JSON.stringify(_this.master));
        };
        this.update = function (p) {
            _this.master = JSON.parse(JSON.stringify(p));
            _this.display = JSON.parse(JSON.stringify(p));
            _this.pending = false;
        };
        this.submit = function () {
            _this.pending = true;
            _this._fire.fire(_this._submitConverter(_this.display));
        };
        if (this._submitConverter === null)
            this._submitConverter = function (d) { return d; };
        _sub.registerSubscriber(this.update);
        this.connected = _sub.connected;
        this.master = JSON.parse(JSON.stringify(defaultParameter));
        this.display = JSON.parse(JSON.stringify(defaultParameter));
    }
    return FormViewModel;
}());
var QuotingButtonViewModel = /** @class */ (function (_super) {
    __extends(QuotingButtonViewModel, _super);
    function QuotingButtonViewModel(sub, fire) {
        var _this = _super.call(this, { state: 0 }, sub, fire, function (d) { return { state: Math.abs(d.state - 1) }; }) || this;
        _this.getClass = function () {
            if (_this.pending)
                return "btn btn-warning";
            if (_this.display.state)
                return "btn btn-success";
            return "btn btn-danger";
        };
        return _this;
    }
    return QuotingButtonViewModel;
}(FormViewModel));
var DisplayQuotingParameters = /** @class */ (function (_super) {
    __extends(DisplayQuotingParameters, _super);
    function DisplayQuotingParameters(sub, fire) {
        var _this = _super.call(this, {}, sub, fire) || this;
        _this.availableQuotingModes = [];
        _this.availableFvModels = [];
        _this.availableAutoPositionModes = [];
        _this.availableAggressivePositionRebalancings = [];
        _this.availableSuperTrades = [];
        _this.availablePingAt = [];
        _this.availablePongAt = [];
        _this.availableSTDEV = [];
        _this.availableQuotingModes = DisplayQuotingParameters.getMapping(Models.QuotingMode);
        _this.availableFvModels = DisplayQuotingParameters.getMapping(Models.FairValueModel);
        _this.availableAutoPositionModes = DisplayQuotingParameters.getMapping(Models.AutoPositionMode);
        _this.availableAggressivePositionRebalancings = DisplayQuotingParameters.getMapping(Models.APR);
        _this.availableSuperTrades = DisplayQuotingParameters.getMapping(Models.SOP);
        _this.availablePingAt = DisplayQuotingParameters.getMapping(Models.PingAt);
        _this.availablePongAt = DisplayQuotingParameters.getMapping(Models.PongAt);
        _this.availableSTDEV = DisplayQuotingParameters.getMapping(Models.STDEV);
        return _this;
    }
    DisplayQuotingParameters.getMapping = function (enumObject) {
        var names = [];
        for (var mem in enumObject) {
            if (!enumObject.hasOwnProperty(mem))
                continue;
            var val = parseInt(mem, 10);
            if (val >= 0) {
                var str = String(enumObject[mem]);
                if (str == 'AK47')
                    str = 'AK-47';
                names.push({ 'str': str, 'val': val });
            }
        }
        return names;
    };
    return DisplayQuotingParameters;
}(FormViewModel));
var DisplayPair = /** @class */ (function () {
    function DisplayPair(zone, subscriberFactory, fireFactory) {
        var _this = this;
        this.zone = zone;
        this.connected = false;
        this.connectedToExchange = false;
        this.connectedToServer = false;
        this.connectionMessage = null;
        this.setStatus = function () {
            _this.connected = (_this.connectedToExchange && _this.connectedToServer);
            // console.log("connection status changed: ", this.connected, "connectedToExchange", this.connectedToExchange, "connectedToServer", this.connectedToServer);
            if (_this.connected) {
                _this.connectionMessage = null;
                return;
            }
            _this.connectionMessage = '';
            if (!_this.connectedToExchange)
                _this.connectionMessage = 'Connecting to exchange..';
            if (!_this.connectedToServer)
                _this.connectionMessage = 'Disconnected from server';
        };
        this.setExchangeStatus = function (cs) {
            _this.connectedToExchange = cs.status == Models.Connectivity.Connected;
            _this.setStatus();
        };
        this.setServerStatus = function (cs) {
            _this.connectedToServer = cs;
            _this.setStatus();
        };
        this.connectedToServer = subscriberFactory
            .getSubscriber(zone, Models.Topics.ExchangeConnectivity)
            .registerSubscriber(this.setExchangeStatus)
            .registerConnectHandler(function () { return _this.setServerStatus(true); })
            .registerDisconnectedHandler(function () { return _this.setServerStatus(false); })
            .connected;
        this.setStatus();
        this.active = new QuotingButtonViewModel(subscriberFactory
            .getSubscriber(zone, Models.Topics.ActiveState), fireFactory
            .getFire(Models.Topics.ActiveState));
        this.quotingParameters = new DisplayQuotingParameters(subscriberFactory
            .getSubscriber(zone, Models.Topics.QuotingParametersChange), fireFactory
            .getFire(Models.Topics.QuotingParametersChange));
    }
    return DisplayPair;
}());
exports.DisplayPair = DisplayPair;
