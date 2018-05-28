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
var Highcharts = require("highcharts");
var Models = require("./models");
var shared_directives_1 = require("./shared_directives");
var StatsComponent = /** @class */ (function () {
    function StatsComponent(zone, subscriberFactory) {
        var _this = this;
        this.zone = zone;
        this.subscriberFactory = subscriberFactory;
        this.saveInstance = function (chartInstance, chartId) {
            _this[chartId + 'Chart'] = Highcharts.charts.length;
            Highcharts.charts.push(chartInstance);
        };
        this.pointFormatterBase = function () {
            return (this.series.type == 'arearange')
                ? '<tr><td><span style="color:' + this.series.color + '">●</span>' + this.series.name + ' High:</td><td style="text-align:right;"> <b>' + this.high.toFixed(Highcharts.customProductFixed) + ' ' + (Highcharts.customQuoteCurrency) + '</b></td></tr>'
                    + '<tr><td><span style="color:' + this.series.color + '">●</span>' + this.series.name + ' Low:</td><td style="text-align:right;"> <b>' + this.low.toFixed(Highcharts.customProductFixed) + ' ' + (Highcharts.customQuoteCurrency) + '</b></td></tr>'
                : '<tr><td><span style="color:' + this.series.color + '">' + Highcharts.customSymbols[this.series.symbol] + '</span> ' + this.series.name + ':</td><td style="text-align:right;"> <b>' + this.y.toFixed(Highcharts.customProductFixed) + ' ' + (Highcharts.customQuoteCurrency) + '</b></td></tr>';
        };
        this.pointFormatterQuote = function () {
            return '<tr><td><span style="color:' + this.series.color + '">' + Highcharts.customSymbols[this.series.symbol] + '</span> ' + this.series.name + ':</td><td style="text-align:right;"> <b>' + this.y.toFixed(8) + ' ' + (Highcharts.customBaseCurrency) + '</b></td></tr>';
        };
        this.syncExtremes = function (e) {
            var thisChart = this.chart;
            if (e.trigger !== 'syncExtremes') {
                Highcharts.each(Highcharts.charts, function (chart) {
                    if (chart !== thisChart && chart.xAxis[0].setExtremes)
                        chart.xAxis[0].setExtremes(e.min, e.max, undefined, true, { trigger: 'syncExtremes' });
                });
            }
        };
        this.fvChartOptions = {
            title: 'fair value',
            chart: {
                width: 700,
                height: 339,
                zoomType: false,
                backgroundColor: 'rgba(255, 255, 255, 0)',
            },
            navigator: { enabled: false },
            rangeSelector: { enabled: false, height: 0 },
            scrollbar: { enabled: false },
            credits: { enabled: false },
            xAxis: {
                type: 'datetime',
                crosshair: true,
                // events: {setExtremes: this.syncExtremes},
                labels: { enabled: false },
                gridLineWidth: 0,
                dateTimeLabelFormats: { millisecond: '%H:%M:%S', second: '%H:%M:%S', minute: '%H:%M', hour: '%H:%M', day: '%m-%d', week: '%m-%d', month: '%m', year: '%Y' }
            },
            yAxis: [{
                    title: { text: 'Fair Value and Trades' },
                    labels: { enabled: false },
                    gridLineWidth: 0
                }, {
                    title: { text: 'STDEV 20' },
                    labels: { enabled: false },
                    opposite: true,
                    gridLineWidth: 0
                }],
            legend: {
                enabled: true,
                itemStyle: {
                    color: 'lightgray'
                },
                itemHoverStyle: {
                    color: 'gray'
                },
                itemHiddenStyle: {
                    color: 'black'
                }
            },
            tooltip: {
                shared: true,
                useHTML: true,
                headerFormat: '<small>{point.x:%A} <b>{point.x:%H:%M:%S}</b></small><table>',
                footerFormat: '</table>'
            },
            series: [{
                    name: 'Fair Value',
                    type: 'spline',
                    lineWidth: 4,
                    colorIndex: 2,
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    data: [],
                    id: 'fvseries'
                }, {
                    name: 'Width',
                    type: 'arearange',
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    lineWidth: 0,
                    colorIndex: 2,
                    fillOpacity: 0.2,
                    zIndex: -1,
                    data: []
                }, {
                    name: 'Sell',
                    type: 'spline',
                    zIndex: 1,
                    colorIndex: 5,
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    data: [],
                    id: 'sellseries'
                }, {
                    name: 'Sell',
                    type: 'flags',
                    zIndex: 2,
                    colorIndex: 5,
                    data: [],
                    onSeries: 'sellseries',
                    shape: 'circlepin',
                    width: 16
                }, {
                    name: 'Buy',
                    type: 'spline',
                    zIndex: 1,
                    colorIndex: 0,
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    data: [],
                    id: 'buyseries'
                }, {
                    name: 'Buy',
                    type: 'flags',
                    zIndex: 2,
                    colorIndex: 0,
                    data: [],
                    onSeries: 'buyseries',
                    shape: 'circlepin',
                    width: 16
                }, {
                    name: 'EWMA Quote',
                    type: 'spline',
                    color: '#ffff00',
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    data: []
                }, {
                    name: 'EWMA Long',
                    type: 'spline',
                    colorIndex: 6,
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    data: []
                }, {
                    name: 'EWMA Medium',
                    type: 'spline',
                    colorIndex: 6,
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    data: []
                }, {
                    name: 'EWMA Short',
                    type: 'spline',
                    colorIndex: 3,
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    data: []
                }, {
                    name: 'STDEV Fair',
                    type: 'spline',
                    lineWidth: 1,
                    color: '#af451e',
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    yAxis: 1,
                    data: []
                }, {
                    name: 'STDEV Tops',
                    type: 'spline',
                    lineWidth: 1,
                    color: '#af451e',
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    yAxis: 1,
                    data: []
                }, {
                    name: 'STDEV TopAsk',
                    type: 'spline',
                    lineWidth: 1,
                    color: '#af451e',
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    yAxis: 1,
                    data: []
                }, {
                    name: 'STDEV TopBid',
                    type: 'spline',
                    lineWidth: 1,
                    color: '#af451e',
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    yAxis: 1,
                    data: []
                }, {
                    name: 'STDEV BBFair',
                    type: 'arearange',
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    lineWidth: 0,
                    color: '#af451e',
                    fillOpacity: 0.2,
                    zIndex: -1,
                    data: []
                }, {
                    name: 'STDEV BBTops',
                    type: 'arearange',
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    lineWidth: 0,
                    color: '#af451e',
                    fillOpacity: 0.2,
                    zIndex: -1,
                    data: []
                }, {
                    name: 'STDEV BBTop',
                    type: 'arearange',
                    tooltip: { pointFormatter: this.pointFormatterBase },
                    lineWidth: 0,
                    color: '#af451e',
                    fillOpacity: 0.2,
                    zIndex: -1,
                    data: []
                }]
        };
        this.quoteChartOptions = {
            title: 'quote wallet',
            chart: {
                width: 700,
                height: 167,
                zoomType: false,
                resetZoomButton: { theme: { display: 'none' } },
                backgroundColor: 'rgba(255, 255, 255, 0)'
            },
            credits: { enabled: false },
            tooltip: {
                shared: true,
                useHTML: true,
                headerFormat: '<small>{point.x:%A} <b>{point.x:%H:%M:%S}</b></small><table>',
                footerFormat: '</table>',
                pointFormatter: this.pointFormatterBase
            },
            plotOptions: {
                area: { stacking: 'normal', connectNulls: true, marker: { enabled: false } },
                spline: { marker: { enabled: false } }
            },
            xAxis: {
                type: 'datetime',
                crosshair: true,
                // events: {setExtremes: this.syncExtremes},
                labels: { enabled: true },
                dateTimeLabelFormats: { millisecond: '%H:%M:%S', second: '%H:%M:%S', minute: '%H:%M', hour: '%H:%M', day: '%m-%d', week: '%m-%d', month: '%m', year: '%Y' }
            },
            yAxis: [{
                    title: { text: 'Total Position' },
                    opposite: true,
                    labels: { enabled: false },
                    gridLineWidth: 0
                }, {
                    title: { text: 'Available and Held' },
                    min: 0,
                    labels: { enabled: false },
                    gridLineWidth: 0
                }],
            legend: { enabled: false },
            series: [{
                    name: 'Total Value',
                    type: 'spline',
                    zIndex: 1,
                    colorIndex: 2,
                    lineWidth: 3,
                    data: []
                }, {
                    name: 'Target',
                    type: 'spline',
                    yAxis: 1,
                    zIndex: 2,
                    colorIndex: 6,
                    data: []
                }, {
                    name: 'Available',
                    type: 'area',
                    colorIndex: 0,
                    fillOpacity: 0.2,
                    yAxis: 1,
                    data: []
                }, {
                    name: 'Held',
                    type: 'area',
                    colorIndex: 0,
                    yAxis: 1,
                    marker: { symbol: 'triangle-down' },
                    data: []
                }]
        };
        this.baseChartOptions = {
            title: 'base wallet',
            chart: {
                width: 700,
                height: 167,
                zoomType: false,
                resetZoomButton: { theme: { display: 'none' } },
                backgroundColor: 'rgba(255, 255, 255, 0)'
            },
            credits: { enabled: false },
            tooltip: {
                shared: true,
                headerFormat: '<small>{point.x:%A} <b>{point.x:%H:%M:%S}</b></small><table>',
                footerFormat: '</table>',
                useHTML: true,
                pointFormatter: this.pointFormatterQuote
            },
            plotOptions: {
                area: { stacking: 'normal', connectNulls: true, marker: { enabled: false } },
                spline: { marker: { enabled: false } }
            },
            xAxis: {
                type: 'datetime',
                crosshair: true,
                // events: {setExtremes: this.syncExtremes},
                labels: { enabled: false },
                dateTimeLabelFormats: { millisecond: '%H:%M:%S', second: '%H:%M:%S', minute: '%H:%M', hour: '%H:%M', day: '%m-%d', week: '%m-%d', month: '%m', year: '%Y' }
            },
            yAxis: [{
                    title: { text: 'Total Position' },
                    opposite: true,
                    labels: { enabled: false },
                    gridLineWidth: 0
                }, {
                    title: { text: 'Available and Held' },
                    min: 0,
                    labels: { enabled: false },
                    gridLineWidth: 0
                }],
            legend: { enabled: false },
            series: [{
                    name: 'Total Value',
                    type: 'spline',
                    zIndex: 1,
                    colorIndex: 2,
                    lineWidth: 3,
                    data: []
                }, {
                    name: 'Target (TBP)',
                    type: 'spline',
                    yAxis: 1,
                    zIndex: 2,
                    colorIndex: 6,
                    data: []
                }, {
                    name: 'Available',
                    type: 'area',
                    yAxis: 1,
                    colorIndex: 5,
                    fillOpacity: 0.2,
                    data: []
                }, {
                    name: 'Held',
                    type: 'area',
                    yAxis: 1,
                    colorIndex: 5,
                    data: []
                }]
        };
        this.updateCharts = function (time) {
            _this.removeOldPoints(time);
            if (_this.fairValue) {
                if (_this.stdevWidth) {
                    if (_this.stdevWidth.fv)
                        Highcharts.charts[_this.fvChart].series[10].addPoint([time, _this.stdevWidth.fv], false);
                    if (_this.stdevWidth.tops)
                        Highcharts.charts[_this.fvChart].series[11].addPoint([time, _this.stdevWidth.tops], false);
                    if (_this.stdevWidth.ask)
                        Highcharts.charts[_this.fvChart].series[12].addPoint([time, _this.stdevWidth.ask], false);
                    if (_this.stdevWidth.bid)
                        Highcharts.charts[_this.fvChart].series[13].addPoint([time, _this.stdevWidth.bid], false);
                    if (_this.stdevWidth.fv && _this.stdevWidth.fvMean)
                        Highcharts.charts[_this.fvChart].series[14].addPoint([time, _this.stdevWidth.fvMean - _this.stdevWidth.fv, _this.stdevWidth.fvMean + _this.stdevWidth.fv], _this.showStats, false, false);
                    if (_this.stdevWidth.tops && _this.stdevWidth.topsMean)
                        Highcharts.charts[_this.fvChart].series[15].addPoint([time, _this.stdevWidth.topsMean - _this.stdevWidth.tops, _this.stdevWidth.topsMean + _this.stdevWidth.tops], _this.showStats, false, false);
                    if (_this.stdevWidth.ask && _this.stdevWidth.bid && _this.stdevWidth.askMean && _this.stdevWidth.bidMean)
                        Highcharts.charts[_this.fvChart].series[16].addPoint([time, _this.stdevWidth.bidMean - _this.stdevWidth.bid, _this.stdevWidth.askMean + _this.stdevWidth.ask], _this.showStats, false, false);
                }
                if (_this.ewmaQuote)
                    Highcharts.charts[_this.fvChart].series[6].addPoint([time, _this.ewmaQuote], false);
                if (_this.ewmaLong)
                    Highcharts.charts[_this.fvChart].series[7].addPoint([time, _this.ewmaLong], false);
                if (_this.ewmaMedium)
                    Highcharts.charts[_this.fvChart].series[8].addPoint([time, _this.ewmaMedium], false);
                if (_this.ewmaShort)
                    Highcharts.charts[_this.fvChart].series[9].addPoint([time, _this.ewmaShort], false);
                Highcharts.charts[_this.fvChart].series[0].addPoint([time, _this.fairValue], _this.showStats);
                if (_this.width)
                    Highcharts.charts[_this.fvChart].series[1].addPoint([time, _this.fairValue - _this.width, _this.fairValue + _this.width], _this.showStats, false, false);
            }
            if (_this.positionData) {
                Highcharts.charts[_this.quoteChart].yAxis[1].setExtremes(0, Math.max(_this.positionData.quoteValue, Highcharts.charts[_this.quoteChart].yAxis[1].getExtremes().dataMax), false, true, { trigger: 'syncExtremes' });
                Highcharts.charts[_this.baseChart].yAxis[1].setExtremes(0, Math.max(_this.positionData.value, Highcharts.charts[_this.baseChart].yAxis[1].getExtremes().dataMax), false, true, { trigger: 'syncExtremes' });
                if (_this.targetBasePosition) {
                    Highcharts.charts[_this.quoteChart].series[1].addPoint([time, (_this.positionData.value - _this.targetBasePosition) * _this.positionData.quoteValue / _this.positionData.value], false);
                    Highcharts.charts[_this.baseChart].series[1].addPoint([time, _this.targetBasePosition], false);
                }
                Highcharts.charts[_this.quoteChart].series[0].addPoint([time, _this.positionData.quoteValue], false);
                Highcharts.charts[_this.quoteChart].series[2].addPoint([time, _this.positionData.quoteAmount], false);
                Highcharts.charts[_this.quoteChart].series[3].addPoint([time, _this.positionData.quoteHeldAmount], _this.showStats);
                Highcharts.charts[_this.baseChart].series[0].addPoint([time, _this.positionData.value], false);
                Highcharts.charts[_this.baseChart].series[2].addPoint([time, _this.positionData.baseAmount], false);
                Highcharts.charts[_this.baseChart].series[3].addPoint([time, _this.positionData.baseHeldAmount], _this.showStats);
            }
        };
        this.updateFairValue = function (fv) {
            if (fv == null)
                return;
            _this.fairValue = fv.price;
        };
        this.addEWMAChartData = function (ewma) {
            if (ewma === null)
                return;
            _this.fairValue = ewma.fairValue;
            if (ewma.ewmaQuote)
                _this.ewmaQuote = ewma.ewmaQuote;
            if (ewma.ewmaShort)
                _this.ewmaShort = ewma.ewmaShort;
            if (ewma.ewmaMedium)
                _this.ewmaMedium = ewma.ewmaMedium;
            if (ewma.ewmaLong)
                _this.ewmaLong = ewma.ewmaLong;
            if (ewma.stdevWidth)
                _this.stdevWidth = ewma.stdevWidth;
        };
        this.updateMarket = function (update) {
            if (update && update.bids && update.bids.length && update.asks && update.asks.length)
                _this.width = (update.asks[0].price - update.bids[0].price) / 2;
        };
        this.addTradesChartData = function (t) {
            var time = new Date().getTime();
            Highcharts.charts[_this.fvChart].series[Models.Side[t.side] == 'Bid' ? 4 : 2].addPoint([time, t.price], false);
            Highcharts.charts[_this.fvChart].series[Models.Side[t.side] == 'Bid' ? 5 : 3].addPoint({
                x: time,
                title: (t.pong ? '¯' : '_') + (Models.Side[t.side] == 'Bid' ? 'B' : 'S'),
                useHTML: true,
                text: '<tr><td colspan="2"><b><span style="color:' + (Models.Side[t.side] == 'Bid' ? '#0000FF' : '#FF0000') + ';">' + (Models.Side[t.side] == 'Bid' ? '▼' : '▲') + '</span> ' + (Models.Side[t.side] == 'Bid' ? 'Buy' : 'Sell') + '</b> (P' + (t.pong ? 'o' : 'i') + 'ng)</td></tr>'
                    + '<tr><td>' + 'Price:</td><td style="text-align:right;"> <b>' + t.price.toFixed(Highcharts.customProductFixed) + ' ' + (Highcharts.customQuoteCurrency) + '</b></td></tr>'
                    + '<tr><td>' + 'Qty:</td><td style="text-align:right;"> <b>' + t.quantity.toFixed(8) + ' ' + (Highcharts.customBaseCurrency) + '</b></td></tr>'
                    + '<tr><td>' + 'Value:</td><td style="text-align:right;"> <b>' + t.value.toFixed(Highcharts.customProductFixed) + ' ' + (Highcharts.customQuoteCurrency) + '</b></td></tr>'
            }, _this.showStats && !_this.fairValue);
            _this.updateCharts(time);
        };
        this.updateTargetBasePosition = function (value) {
            if (value == null)
                return;
            _this.targetBasePosition = value.tbp;
        };
        this.updatePosition = function (o) {
            if (o === null)
                return;
            var time = new Date().getTime();
            if (!Highcharts.customBaseCurrency)
                Highcharts.customBaseCurrency = o.pair.base;
            if (!Highcharts.customQuoteCurrency)
                Highcharts.customQuoteCurrency = o.pair.quote;
            _this.positionData = o;
        };
        this.removeOldPoints = function (time) {
            Highcharts.charts.forEach(function (chart) {
                chart.series.forEach(function (serie) {
                    while (serie.data.length && Math.abs(time - serie.data[0].x) > 21600000)
                        serie.data[0].remove(false);
                });
            });
        };
    }
    Object.defineProperty(StatsComponent.prototype, "setShowStats", {
        set: function (showStats) {
            if (!this.showStats && showStats)
                Highcharts.charts.forEach(function (chart) { return chart.redraw(false); });
            this.showStats = showStats;
        },
        enumerable: true,
        configurable: true
    });
    StatsComponent.prototype.ngOnInit = function () {
        var _this = this;
        Highcharts.customBaseCurrency = '';
        Highcharts.customQuoteCurrency = '';
        Highcharts.customProductFixed = this.product.fixed;
        Highcharts.customSymbols = { 'circle': '●', 'diamond': '♦', 'square': '■', 'triangle': '▲', 'triangle-down': '▼' };
        Highcharts.setOptions({ global: { getTimezoneOffset: function () { return new Date().getTimezoneOffset(); } } });
        setTimeout(function () {
            jQuery('chart').bind('mousemove touchmove touchstart', function (e) {
                var chart, point, i, event, containerLeft, thisLeft;
                for (i = 0; i < Highcharts.charts.length; ++i) {
                    chart = Highcharts.charts[i];
                    containerLeft = jQuery(chart.container).offset().left;
                    thisLeft = jQuery(this).offset().left;
                    if (containerLeft == thisLeft && jQuery(chart.container).offset().top == jQuery(this).offset().top)
                        continue;
                    chart.pointer.reset = function () { return undefined; };
                    var ev = jQuery.extend(jQuery.Event(e.originalEvent.type), {
                        which: 1,
                        chartX: e.originalEvent.chartX,
                        chartY: e.originalEvent.chartY,
                        clientX: (containerLeft != thisLeft) ? containerLeft - thisLeft + e.originalEvent.clientX : e.originalEvent.clientX,
                        clientY: e.originalEvent.clientY,
                        pageX: (containerLeft != thisLeft) ? containerLeft - thisLeft + e.originalEvent.pageX : e.originalEvent.pageX,
                        pageY: e.originalEvent.pageY,
                        screenX: (containerLeft != thisLeft) ? containerLeft - thisLeft + e.originalEvent.screenX : e.originalEvent.screenX,
                        screenY: e.originalEvent.screenY
                    });
                    event = chart.pointer.normalize(ev);
                    point = chart.series[0].searchPoint(event, true);
                    if (point) {
                        point.onMouseOver();
                        point.series.chart.xAxis[0].drawCrosshair(event, point);
                    }
                }
            });
            jQuery('chart').bind('mouseleave', function (e) {
                var chart, point, i, event;
                for (i = 0; i < Highcharts.charts.length; ++i) {
                    chart = Highcharts.charts[i];
                    event = chart.pointer.normalize(e.originalEvent);
                    point = chart.series[0].searchPoint(event, true);
                    if (point) {
                        point.onMouseOut();
                        chart.tooltip.hide(point);
                        chart.xAxis[0].hideCrosshair();
                    }
                }
            });
            _this.subscriberFactory
                .getSubscriber(_this.zone, Models.Topics.FairValue)
                .registerSubscriber(_this.updateFairValue);
            _this.subscriberFactory
                .getSubscriber(_this.zone, Models.Topics.MarketData)
                .registerSubscriber(_this.updateMarket);
            _this.subscriberFactory
                .getSubscriber(_this.zone, Models.Topics.Position)
                .registerSubscriber(_this.updatePosition);
            _this.subscriberFactory
                .getSubscriber(_this.zone, Models.Topics.TargetBasePosition)
                .registerSubscriber(_this.updateTargetBasePosition);
            _this.subscriberFactory
                .getSubscriber(_this.zone, Models.Topics.EWMAChart)
                .registerSubscriber(_this.addEWMAChartData);
            _this.subscriberFactory
                .getSubscriber(_this.zone, Models.Topics.TradesChart)
                .registerSubscriber(_this.addTradesChartData);
            setInterval(function () { return _this.updateCharts(new Date().getTime()); }, 10000);
        }, 10000);
    };
    __decorate([
        core_1.Input()
    ], StatsComponent.prototype, "product", void 0);
    __decorate([
        core_1.Input()
    ], StatsComponent.prototype, "setShowStats", null);
    StatsComponent = __decorate([
        core_1.Component({
            selector: 'market-stats',
            template: "<div class=\"col-md-6 col-xs-6\">\n  <table><tr><td>\n    <chart style=\"position:relative;top:5px;height:339px;width:700px;\" type=\"StockChart\" [options]=\"fvChartOptions\" (load)=\"saveInstance($event.context, 'fv')\"></chart>\n  </td><td>\n    <chart style=\"position:relative;top:10px;height:167px;width:700px;\" [options]=\"baseChartOptions\" (load)=\"saveInstance($event.context, 'base')\"></chart>\n    <chart style=\"position:relative;top:11px;height:167px;width:700px;\" [options]=\"quoteChartOptions\" (load)=\"saveInstance($event.context, 'quote')\"></chart>\n  </td></tr></table>\n    </div>"
        }),
        __param(0, core_1.Inject(core_1.NgZone)),
        __param(1, core_1.Inject(shared_directives_1.SubscriberFactory))
    ], StatsComponent);
    return StatsComponent;
}());
exports.StatsComponent = StatsComponent;
