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
var OrdersComponent = /** @class */ (function () {
    function OrdersComponent(zone, subscriberFactory, fireFactory) {
        var _this = this;
        this.zone = zone;
        this.subscriberFactory = subscriberFactory;
        this.fireFactory = fireFactory;
        this.gridOptions = {};
        this.subscribed = false;
        this.loadSubscriber = function () {
            if (_this.subscribed)
                return;
            _this.subscribed = true;
            _this.fireCxl = _this.fireFactory
                .getFire(Models.Topics.CancelOrder);
            _this.subscriberFactory
                .getSubscriber(_this.zone, Models.Topics.OrderStatusReports)
                .registerSubscriber(_this.addRowData);
        };
        this.createColumnDefs = function () {
            return [
                { width: 30, field: "cancel", headerName: 'cxl', cellRenderer: function (params) {
                        return '<button type="button" class="btn btn-danger btn-xs"><span data-action-type="remove" style="font-size: 16px;font-weight: bold;padding: 0px;line-height: 12px;">&times;</span></button>';
                    } },
                { width: 82, field: 'time', headerName: 'time', cellRenderer: function (params) {
                        return (params.value) ? params.value.format('HH:mm:ss,SSS') : '';
                    },
                    cellClass: 'fs11px', comparator: function (a, b) { return a.diff(b); }
                },
                { width: 40, field: 'side', headerName: 'side', cellRenderer: function (params) {
                        return (params.data.pong ? '¯' : '_') + params.value;
                    }, cellClass: function (params) {
                        if (params.value === 'Bid')
                            return 'buy';
                        else if (params.value === 'Ask')
                            return "sell";
                    } },
                { width: 74, field: 'price', headerName: 'px',
                    sort: 'desc', cellClass: function (params) {
                        return (params.data.side === 'Ask') ? "sell" : "buy";
                    }, cellRendererFramework: shared_directives_1.QuoteCurrencyCellComponent },
                { width: 60, field: 'qty', headerName: 'qty', cellClass: function (params) {
                        return (params.data.side === 'Ask') ? "sell" : "buy";
                    }, cellRendererFramework: shared_directives_1.BaseCurrencyCellComponent },
                { width: 74, field: 'value', headerName: 'value', cellClass: function (params) {
                        return (params.data.side === 'Ask') ? "sell" : "buy";
                    }, cellRendererFramework: shared_directives_1.QuoteCurrencyCellComponent },
                { width: 45, field: 'type', headerName: 'type' },
                { width: 40, field: 'tif', headerName: 'tif' },
                { width: 45, field: 'lat', headerName: 'lat' },
                { width: 90, field: 'orderId', headerName: 'openOrderId', cellRenderer: function (params) {
                        return (params.value) ? params.value.toString().split('-')[0] : '';
                    } }
            ];
        };
        this.onCellClicked = function ($event) {
            if ($event.event.target.getAttribute("data-action-type") != 'remove')
                return;
            _this.fireCxl.fire({
                orderId: $event.data.orderId,
                exchange: $event.data.exchange
            });
            _this.gridOptions.api.updateRowData({ remove: [$event.data] });
        };
        this.addRowData = function (o) {
            if (!_this.gridOptions.api)
                return;
            if (typeof o[0] == 'object') {
                // this.gridOptions.api.setRowData([]);
                return o.forEach(function (x) { return setTimeout(_this.addRowData(x), 0); });
            }
            var exists = false;
            var isClosed = (o.orderStatus == Models.OrderStatus.Cancelled
                || o.orderStatus == Models.OrderStatus.Complete);
            _this.gridOptions.api.forEachNode(function (node) {
                if (!exists && node.data.orderId == o.orderId) {
                    exists = true;
                    if (isClosed)
                        _this.gridOptions.api.updateRowData({ remove: [node.data] });
                    else {
                        node.setData(Object.assign(node.data, {
                            time: (moment.isMoment(o.time) ? o.time : moment(o.time)),
                            price: o.price,
                            value: Math.round(o.price * o.quantity * 100) / 100,
                            tif: Models.TimeInForce[o.timeInForce],
                            lat: o.computationalLatency + 'ms',
                            qty: o.quantity
                        }));
                    }
                }
            });
            setTimeout(function () { return _this.gridOptions.api.refreshView(); }, 0);
            if (!exists && !isClosed)
                _this.gridOptions.api.updateRowData({ add: [{
                            orderId: o.orderId,
                            side: Models.Side[o.side],
                            price: o.price,
                            value: Math.round(o.price * o.quantity * 100) / 100,
                            exchange: o.exchange,
                            type: Models.OrderType[o.type],
                            tif: Models.TimeInForce[o.timeInForce],
                            lat: o.computationalLatency + 'ms',
                            qty: o.quantity,
                            pong: o.isPong,
                            time: (moment.isMoment(o.time) ? o.time : moment(o.time)),
                            quoteSymbol: _this.product.advert.pair.quote,
                            productFixed: _this.product.fixed
                        }] });
        };
    }
    Object.defineProperty(OrdersComponent.prototype, "online", {
        set: function (online) {
            var _this = this;
            if (online)
                return;
            if (!this.gridOptions.api)
                return;
            this.gridOptions.api.setRowData([]);
            setTimeout(function () { return _this.gridOptions.api.refreshView(); }, 0);
        },
        enumerable: true,
        configurable: true
    });
    OrdersComponent.prototype.ngOnInit = function () {
        this.gridOptions.rowData = [];
        this.gridOptions.enableSorting = true;
        this.gridOptions.columnDefs = this.createColumnDefs();
        this.gridOptions.suppressNoRowsOverlay = true;
        setTimeout(this.loadSubscriber, 500);
    };
    __decorate([
        core_1.Input()
    ], OrdersComponent.prototype, "product", void 0);
    __decorate([
        core_1.Input()
    ], OrdersComponent.prototype, "online", null);
    OrdersComponent = __decorate([
        core_1.Component({
            selector: 'order-list',
            template: "<ag-grid-angular #orderList class=\"ag-fresh ag-dark\" style=\"height: 135px;width: 99.99%;\" rowHeight=\"21\" [gridOptions]=\"gridOptions\" (cellClicked)=\"onCellClicked($event)\"></ag-grid-angular>"
        }),
        __param(0, core_1.Inject(core_1.NgZone)),
        __param(1, core_1.Inject(shared_directives_1.SubscriberFactory)),
        __param(2, core_1.Inject(shared_directives_1.FireFactory))
    ], OrdersComponent);
    return OrdersComponent;
}());
exports.OrdersComponent = OrdersComponent;
