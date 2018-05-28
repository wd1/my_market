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
var moment = require("moment");
var Models = require("./models");
var shared_directives_1 = require("./shared_directives");
var MarketTradesComponent = /** @class */ (function () {
    function MarketTradesComponent(zone, subscriberFactory) {
        var _this = this;
        this.zone = zone;
        this.subscriberFactory = subscriberFactory;
        this.gridOptions = {};
        this.subscribed = false;
        this.loadSubscriber = function () {
            if (_this.subscribed)
                return;
            _this.subscribed = true;
            _this.gridOptions.rowData = [];
            _this.subscriberFactory
                .getSubscriber(_this.zone, Models.Topics.MarketTrade)
                .registerDisconnectedHandler(function () { return _this.gridOptions.rowData.length = 0; })
                .registerSubscriber(_this.addRowData);
        };
        this.createColumnDefs = function () {
            return [
                { width: 82, field: 'time', headerName: 'time', cellRenderer: function (params) {
                        return (params.value) ? params.value.format('HH:mm:ss,SSS') : '';
                    },
                    comparator: function (a, b) { return a.diff(b); },
                    sort: 'desc', cellClass: function (params) {
                        return 'fs11px ' + (!params.data.recent ? "text-muted" : "");
                    } },
                { width: 75, field: 'price', headerName: 'price', cellClass: function (params) {
                        return (params.data.side === 'Ask') ? "sell" : "buy";
                    }, cellRendererFramework: shared_directives_1.QuoteCurrencyCellComponent },
                { width: 50, field: 'quantity', headerName: 'qty', cellClass: function (params) {
                        return (params.data.side === 'Ask') ? "sell" : "buy";
                    }, cellRendererFramework: shared_directives_1.BaseCurrencyCellComponent },
                { width: 40, field: 'side', headerName: 'side', cellClass: function (params) {
                        if (params.value === 'Bid')
                            return 'buy';
                        else if (params.value === 'Ask')
                            return "sell";
                    } }
            ];
        };
        this.addRowData = function (trade) {
            if (!_this.gridOptions.api)
                return;
            if (trade != null)
                _this.gridOptions.api.updateRowData({ add: [{
                            price: trade.price,
                            quantity: trade.quantity,
                            time: (moment.isMoment(trade.time) ? trade.time : moment(trade.time)),
                            recent: true,
                            side: Models.Side[trade.side],
                            quoteSymbol: trade.pair.quote,
                            productFixed: _this.product.fixed
                        }] });
            _this.gridOptions.api.forEachNode(function (node) {
                if (Math.abs(moment.utc().valueOf() - moment(node.data.time).valueOf()) > 3600000)
                    _this.gridOptions.api.updateRowData({ remove: [node.data] });
                else if (Math.abs(moment.utc().valueOf() - moment(node.data.time).valueOf()) > 7000)
                    node.setData(Object.assign(node.data, { recent: false }));
            });
        };
    }
    MarketTradesComponent.prototype.ngOnInit = function () {
        this.gridOptions.columnDefs = this.createColumnDefs();
        this.gridOptions.enableSorting = true;
        this.gridOptions.overlayLoadingTemplate = "<span class=\"ag-overlay-no-rows-center\">click to view data</span>";
        this.gridOptions.overlayNoRowsTemplate = "<span class=\"ag-overlay-no-rows-center\">empty history</span>";
    };
    __decorate([
        core_1.Input()
    ], MarketTradesComponent.prototype, "product", void 0);
    MarketTradesComponent = __decorate([
        core_1.Component({
            selector: 'market-trades',
            template: "<ag-grid-angular #marketList (click)=\"this.loadSubscriber()\" class=\"ag-fresh ag-dark {{ subscribed ? 'ag-subscribed' : 'ag-not-subscribed' }} marketTrades\" style=\"height: 259px;width: 100%;\" rowHeight=\"21\" [gridOptions]=\"gridOptions\"></ag-grid-angular>"
        }),
        __param(0, core_1.Inject(core_1.NgZone)),
        __param(1, core_1.Inject(shared_directives_1.SubscriberFactory))
    ], MarketTradesComponent);
    return MarketTradesComponent;
}());
exports.MarketTradesComponent = MarketTradesComponent;
