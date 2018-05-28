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
var TradesComponent = /** @class */ (function () {
    function TradesComponent(zone, subscriberFactory, fireFactory) {
        var _this = this;
        this.zone = zone;
        this.subscriberFactory = subscriberFactory;
        this.fireFactory = fireFactory;
        this.gridOptions = {};
        this.onTradesLength = new core_1.EventEmitter();
        this.subscribed = false;
        this.loadSubscriber = function () {
            if (_this.subscribed)
                return;
            _this.subscribed = true;
            _this.fireCxl = _this.fireFactory
                .getFire(Models.Topics.CleanTrade);
            _this.subscriberFactory
                .getSubscriber(_this.zone, Models.Topics.QuotingParametersChange)
                .registerSubscriber(_this.updateQP);
            _this.subscriberFactory
                .getSubscriber(_this.zone, Models.Topics.Trades)
                .registerConnectHandler(function () { return _this.gridOptions.rowData.length = 0; })
                .registerSubscriber(_this.addRowData);
        };
        this.createColumnDefs = function () {
            return [
                { width: 30, field: "cancel", headerName: 'cxl', cellRenderer: function (params) {
                        return '<button type="button" class="btn btn-danger btn-xs"><span data-action-type="remove" style="font-size: 16px;font-weight: bold;padding: 0px;line-height: 12px;">&times;</span></button>';
                    } },
                { width: 95, field: 'time', headerName: 't', cellRenderer: function (params) {
                        return (params.value) ? params.value.format('D/M HH:mm:ss') : '';
                    }, cellClass: 'fs11px', comparator: function (aValue, bValue, aNode, bNode) {
                        return (aNode.data.Ktime || aNode.data.time).diff(bNode.data.Ktime || bNode.data.time);
                    }, sort: 'desc' },
                { width: 95, field: 'Ktime', hide: true, headerName: 'timePong', cellRenderer: function (params) {
                        return (params.value && params.value != 'Invalid date') ? params.value.format('D/M HH:mm:ss') : '';
                    }, cellClass: 'fs11px' },
                { width: 40, field: 'side', headerName: 'side', cellClass: function (params) {
                        if (params.value === 'Buy')
                            return 'buy';
                        else if (params.value === 'Sell')
                            return "sell";
                        else if (params.value === 'K')
                            return "kira";
                        else
                            return "unknown";
                    } },
                { width: 80, field: 'price', headerName: 'px', cellClass: function (params) {
                        if (params.data.side === 'K')
                            return (params.data.price > params.data.Kprice) ? "sell" : "buy";
                        else
                            return params.data.side === 'Sell' ? "sell" : "buy";
                    }, cellRendererFramework: shared_directives_1.QuoteCurrencyCellComponent },
                { width: 65, field: 'quantity', headerName: 'qty', cellClass: function (params) {
                        if (params.data.side === 'K')
                            return (params.data.price > params.data.Kprice) ? "sell" : "buy";
                        else
                            return params.data.side === 'Sell' ? "sell" : "buy";
                    }, cellRendererFramework: shared_directives_1.BaseCurrencyCellComponent },
                { width: 69, field: 'value', headerName: 'val', cellClass: function (params) {
                        if (params.data.side === 'K')
                            return (params.data.price > params.data.Kprice) ? "sell" : "buy";
                        else
                            return params.data.side === 'Sell' ? "sell" : "buy";
                    }, cellRendererFramework: shared_directives_1.QuoteCurrencyCellComponent },
                { width: 75, field: 'Kvalue', headerName: 'valPong', hide: true, cellClass: function (params) {
                        if (params.data.side === 'K')
                            return (params.data.price < params.data.Kprice) ? "sell" : "buy";
                        else
                            return params.data.Kqty ? ((params.data.price < params.data.Kprice) ? "sell" : "buy") : "";
                    }, cellRendererFramework: shared_directives_1.QuoteCurrencyCellComponent },
                { width: 65, field: 'Kqty', headerName: 'qtyPong', hide: true, cellClass: function (params) {
                        if (params.data.side === 'K')
                            return (params.data.price < params.data.Kprice) ? "sell" : "buy";
                        else
                            return params.data.Kqty ? ((params.data.price < params.data.Kprice) ? "sell" : "buy") : "";
                    }, cellRendererFramework: shared_directives_1.BaseCurrencyCellComponent },
                { width: 80, field: 'Kprice', headerName: 'pxPong', hide: true, cellClass: function (params) {
                        if (params.data.side === 'K')
                            return (params.data.price < params.data.Kprice) ? "sell" : "buy";
                        else
                            return params.data.Kqty ? ((params.data.price < params.data.Kprice) ? "sell" : "buy") : "";
                    }, cellRendererFramework: shared_directives_1.QuoteCurrencyCellComponent },
                { width: 65, field: 'Kdiff', headerName: 'Kdiff', hide: true, cellClass: function (params) {
                        if (params.data.side === 'K')
                            return "kira";
                        else
                            return "";
                    }, cellRendererFramework: shared_directives_1.QuoteCurrencyCellComponent }
            ];
        };
        this.onCellClicked = function ($event) {
            if ($event.event.target.getAttribute("data-action-type") != 'remove')
                return;
            _this.fireCxl.fire({
                tradeId: $event.data.tradeId
            });
        };
        this.addRowData = function (t) {
            if (!_this.gridOptions.api)
                return;
            if (t.Kqty < 0) {
                _this.gridOptions.api.forEachNode(function (node) {
                    if (node.data.tradeId == t.tradeId)
                        _this.gridOptions.api.updateRowData({ remove: [node.data] });
                });
            }
            else {
                var exists_1 = false;
                _this.gridOptions.api.forEachNode(function (node) {
                    if (!exists_1 && node.data.tradeId == t.tradeId) {
                        exists_1 = true;
                        var merged = (node.data.quantity != t.quantity);
                        if (t.Ktime && t.Ktime == 'Invalid date')
                            t.Ktime = null;
                        node.setData(Object.assign(node.data, {
                            time: (moment.isMoment(t.time) ? t.time : moment(t.time)),
                            quantity: t.quantity,
                            value: t.value,
                            Ktime: t.Ktime ? (moment.isMoment(t.Ktime) ? t.Ktime : moment(t.Ktime)) : null,
                            Kqty: t.Kqty ? t.Kqty : null,
                            Kprice: t.Kprice ? t.Kprice : null,
                            Kvalue: t.Kvalue ? t.Kvalue : null,
                            Kdiff: t.Kdiff ? t.Kdiff : null,
                            side: t.Kqty >= t.quantity ? 'K' : (t.side === Models.Side.Ask ? "Sell" : "Buy")
                        }));
                        if (t.loadedFromDB === false) {
                            if (_this.sortTimeout)
                                window.clearTimeout(_this.sortTimeout);
                            _this.sortTimeout = window.setTimeout(function () {
                                _this.gridOptions.api.setSortModel([{ colId: 'time', sort: 'desc' }]);
                                setTimeout(function () { return _this.gridOptions.api.refreshView(); }, 0);
                            }, 269);
                            if (_this.audio) {
                                var audio = new Audio('/audio/' + (merged ? '0' : '1') + '.mp3');
                                audio.volume = 0.5;
                                audio.play();
                            }
                        }
                    }
                });
                if (!exists_1) {
                    if (t.Ktime && t.Ktime == 'Invalid date')
                        t.Ktime = null;
                    _this.gridOptions.api.updateRowData({ add: [{
                                tradeId: t.tradeId,
                                time: (moment.isMoment(t.time) ? t.time : moment(t.time)),
                                price: t.price,
                                quantity: t.quantity,
                                side: t.Kqty >= t.quantity ? 'K' : (t.side === Models.Side.Ask ? "Sell" : "Buy"),
                                value: t.value,
                                Ktime: t.Ktime ? (moment.isMoment(t.Ktime) ? t.Ktime : moment(t.Ktime)) : null,
                                Kqty: t.Kqty ? t.Kqty : null,
                                Kprice: t.Kprice ? t.Kprice : null,
                                Kvalue: t.Kvalue ? t.Kvalue : null,
                                Kdiff: t.Kdiff && t.Kdiff != 0 ? t.Kdiff : null,
                                quoteSymbol: t.pair.quote,
                                productFixed: _this.product.fixed
                            }] });
                    if (t.loadedFromDB === false && _this.audio) {
                        var audio = new Audio('/audio/0.mp3');
                        audio.volume = 0.5;
                        audio.play();
                    }
                }
            }
            _this.onTradesLength.emit(_this.gridOptions.api.getModel().getRowCount());
        };
        this.updateQP = function (qp) {
            _this.audio = qp.audio;
            if (!_this.gridOptions.api)
                return;
            var isK = (qp.mode === Models.QuotingMode.Boomerang || qp.mode === Models.QuotingMode.HamelinRat || qp.mode === Models.QuotingMode.AK47);
            _this.gridOptions.columnDefs.map(function (r) {
                ['Kqty', 'Kprice', 'Kvalue', 'Kdiff', 'Ktime', ['time', 'timePing'], ['price', 'pxPing'], ['quantity', 'qtyPing'], ['value', 'valPing']].map(function (t) {
                    if (t[0] == r.field)
                        r.headerName = isK ? t[1] : t[1].replace('Ping', '');
                    if (r.field[0] == 'K')
                        r.hide = !isK;
                });
                return r;
            });
            _this.gridOptions.api.setColumnDefs(_this.gridOptions.columnDefs);
        };
    }
    TradesComponent.prototype.ngOnInit = function () {
        this.gridOptions.rowData = [];
        this.gridOptions.enableSorting = true;
        this.gridOptions.columnDefs = this.createColumnDefs();
        this.gridOptions.overlayNoRowsTemplate = "<span class=\"ag-overlay-no-rows-center\">empty history of trades</span>";
        setTimeout(this.loadSubscriber, 3321);
    };
    __decorate([
        core_1.Input()
    ], TradesComponent.prototype, "product", void 0);
    __decorate([
        core_1.Output()
    ], TradesComponent.prototype, "onTradesLength", void 0);
    TradesComponent = __decorate([
        core_1.Component({
            selector: 'trade-list',
            template: "<ag-grid-angular #tradeList class=\"ag-fresh ag-dark\" style=\"height: 159px;width: 99.99%;\" rowHeight=\"21\" [gridOptions]=\"gridOptions\" (cellClicked)=\"onCellClicked($event)\"></ag-grid-angular>"
        }),
        __param(0, core_1.Inject(core_1.NgZone)),
        __param(1, core_1.Inject(shared_directives_1.SubscriberFactory)),
        __param(2, core_1.Inject(shared_directives_1.FireFactory))
    ], TradesComponent);
    return TradesComponent;
}());
exports.TradesComponent = TradesComponent;
