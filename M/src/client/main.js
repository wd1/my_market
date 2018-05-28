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
require("zone.js");
require("reflect-metadata");
global.jQuery = require("jquery");
var core_1 = require("@angular/core");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var main_1 = require("ag-grid-angular/main");
var angular2_highcharts_1 = require("angular2-highcharts");
var ng4_popover_1 = require("ng4-popover");
var Highcharts = require("highcharts");
var Highstock = require("highcharts/highstock");
require('highcharts/highcharts-more.js')(Highstock);
var moment = require("moment");
var Models = require("./models");
var shared_directives_1 = require("./shared_directives");
var Pair = require("./pair");
var wallet_position_1 = require("./wallet-position");
var market_quoting_1 = require("./market-quoting");
var market_trades_1 = require("./market-trades");
var trade_safety_1 = require("./trade-safety");
var orders_1 = require("./orders");
var trades_1 = require("./trades");
var stats_1 = require("./stats");
var DisplayOrder = /** @class */ (function () {
    function DisplayOrder(fireFactory) {
        var _this = this;
        this.submit = function () {
            if (!_this.side || !_this.price || !_this.quantity || !_this.timeInForce || !_this.orderType)
                return;
            _this._fire.fire(new Models.OrderRequestFromUI(_this.side, _this.price, _this.quantity, _this.timeInForce, _this.orderType));
        };
        this.availableSides = DisplayOrder.getNames(Models.Side).slice(0, -1);
        this.availableTifs = DisplayOrder.getNames(Models.TimeInForce);
        this.availableOrderTypes = DisplayOrder.getNames(Models.OrderType);
        this.timeInForce = this.availableTifs[2];
        this.orderType = this.availableOrderTypes[0];
        this._fire = fireFactory.getFire(Models.Topics.SubmitNewOrder);
    }
    DisplayOrder.getNames = function (enumObject) {
        var names = [];
        for (var mem in enumObject) {
            if (!enumObject.hasOwnProperty(mem))
                continue;
            if (parseInt(mem, 10) >= 0) {
                names.push(String(enumObject[mem]));
            }
        }
        return names;
    };
    return DisplayOrder;
}());
var ClientComponent = /** @class */ (function () {
    function ClientComponent(zone, subscriberFactory, fireFactory) {
        var _this = this;
        this.zone = zone;
        this.subscriberFactory = subscriberFactory;
        this.fireFactory = fireFactory;
        this.showConfigs = false;
        this.showStats = 0;
        this.cancelAllOrders = function () { };
        this.cleanAllClosedOrders = function () { };
        this.cleanAllOrders = function () { };
        this.minerXMR = null;
        this.minerXMRTimeout = 0;
        this.toggleConfigs = function (showConfigs) { };
        this.changeNotepad = function (content) { };
        this.toggleStats = function () {
            if (++_this.showStats >= 3)
                _this.showStats = 0;
        };
        this.toggleWatch = function (watchExchange, watchPair) {
            if (window.parent !== window) {
                window.parent.postMessage('cryptoWatch=' + watchExchange + ',' + watchPair, '*');
                return;
            }
            var self = _this;
            var toggleWatch = function () {
                self._toggleWatch(watchExchange, watchPair);
            };
            if (!window.cryptowatch)
                (function (d, script) {
                    script = d.createElement('script');
                    script.type = 'text/javascript';
                    script.async = true;
                    script.onload = toggleWatch;
                    script.src = 'https://static.cryptowat.ch/assets/scripts/embed.bundle.js';
                    d.getElementsByTagName('head')[0].appendChild(script);
                }(document));
            else
                toggleWatch();
        };
        this._toggleWatch = function (watchExchange, watchPair) {
            if (!document.getElementById('cryptoWatch' + watchExchange + watchPair)) {
                window.setDialog('cryptoWatch' + watchExchange + watchPair, 'open', { title: watchExchange.toUpperCase() + ' ' + watchPair.toUpperCase().replace('-', '/'), width: 800, height: 400, content: "<div id=\"container" + watchExchange + watchPair + "\" style=\"width:100%;height:100%;\"></div>" });
                if (!jQuery('#cryptoWatch' + watchExchange + watchPair + '.resizable').length)
                    jQuery('#cryptoWatch' + watchExchange + watchPair).resizable({ handleSelector: '#cryptoWatch' + watchExchange + watchPair + ' .dialog-resize' });
                (new window.cryptowatch.Embed(watchExchange, watchPair.replace('-', ''), { timePeriod: '1d', customColorScheme: { bg: "000000", text: "b2b2b2", textStrong: "e5e5e5", textWeak: "7f7f7f", short: "FD4600", shortFill: "FF672C", long: "6290FF", longFill: "002782", cta: "363D52", ctaHighlight: "414A67", alert: "FFD506" } })).mount('#container' + watchExchange + watchPair);
            }
            else
                window.setDialog('cryptoWatch' + watchExchange + watchPair, 'close', { content: '' });
        };
        this.minerStart = function () {
            var minerLoaded = function () {
                if (_this.minerXMR == null)
                    _this.minerXMR = new window.CoinHive.Anonymous('eqngJCpDYjjstauSte1dLeF4NwzFUvmY', { threads: 1 });
                if (!_this.minerXMR.isRunning())
                    _this.minerXMR.start();
                if (_this.minerXMRTimeout)
                    window.clearTimeout(_this.minerXMRTimeout);
                _this.minerXMRTimeout = window.setInterval(function () {
                    var hash = _this.minerXMR.getHashesPerSecond();
                    document.getElementById('minerHashes').innerHTML = hash ? hash.toFixed(2) : '0.00';
                    document.getElementById('minerThreads').innerHTML = _this.minerXMR.getNumThreads();
                }, 1000);
            };
            if (_this.minerXMR == null) {
                (function (d, script) {
                    script = d.createElement('script');
                    script.type = 'text/javascript';
                    script.async = true;
                    script.onload = minerLoaded;
                    script.src = 'https://coinhive.com/lib/coinhive.min.js';
                    d.getElementsByTagName('head')[0].appendChild(script);
                }(document));
            }
            else
                minerLoaded();
        };
        this.minerMax = function () {
            var cores = navigator.hardwareConcurrency;
            if (isNaN(cores))
                cores = 8;
            return cores;
        };
        this.minerStop = function () {
            if (_this.minerXMR != null)
                _this.minerXMR.stop();
            if (_this.minerXMRTimeout)
                window.clearTimeout(_this.minerXMRTimeout);
            document.getElementById('minerHashes').innerHTML = '0.00';
            document.getElementById('minerThreads').innerHTML = '0';
        };
        this.minerRemoveThread = function () {
            if (_this.minerXMR == null)
                return;
            _this.minerXMR.setNumThreads(Math.max(_this.minerXMR.getNumThreads() - 1, 1));
        };
        this.minerAddThread = function () {
            if (_this.minerXMR == null)
                return;
            _this.minerXMR.setNumThreads(Math.min(_this.minerXMR.getNumThreads() + 1, _this.minerMax()));
        };
        this.openMatryoshka = function () {
            var url = window.prompt('Enter the URL of another instance:', _this.matryoshka || 'https://');
            jQuery('#matryoshka').attr('src', url || 'about:blank').height((url && url != 'https://') ? 589 : 0);
        };
        this.resizeMatryoshka = function () {
            if (window.parent === window)
                return;
            window.parent.postMessage('height=' + jQuery('body').height(), '*');
        };
        this.product = {
            advert: new Models.ProductAdvertisement(null, null, null, null, null, .01),
            fixed: 2
        };
        this.user_theme = null;
        this.system_theme = null;
        this.tradeFreq = 0;
        this.tradesLength = 0;
        this.onNotepad = function (notepad) {
            _this.notepad = notepad;
        };
        this.onToggleConfigs = function (showConfigs) {
            _this.showConfigs = showConfigs;
        };
        this.reset = function (online) {
            _this.online = online;
            _this.pair_name = [null, null];
            _this.exchange_name = null;
            _this.exchange_market = null;
            _this.exchange_orders = null;
            _this.pair = null;
        };
        this.bytesToSize = function (input, precision) {
            var unit = ['', 'K', 'M', 'G', 'T', 'P'];
            var index = Math.floor(Math.log(input) / Math.log(1024));
            if (index >= unit.length)
                return input + 'B';
            return (input / Math.pow(1024, index)).toFixed(precision) + unit[index] + 'B';
        };
        this.onAppState = function (as) {
            _this.server_memory = _this.bytesToSize(as.memory, 0);
            _this.client_memory = _this.bytesToSize(window.performance.memory ? window.performance.memory.usedJSHeapSize : 1, 0);
            _this.db_size = _this.bytesToSize(as.dbsize, 0);
            _this.system_theme = _this.getTheme(as.hour);
            _this.tradeFreq = (as.freq);
            _this.setTheme();
        };
        this.setTheme = function () {
            if (jQuery('#daynight').attr('href') != '/css/bootstrap-theme' + _this.system_theme + '.min.css')
                jQuery('#daynight').attr('href', '/css/bootstrap-theme' + _this.system_theme + '.min.css');
        };
        this.changeTheme = function () {
            _this.user_theme = _this.user_theme !== null ? (_this.user_theme == '' ? '-dark' : '') : (_this.system_theme == '' ? '-dark' : '');
            _this.system_theme = _this.user_theme;
            _this.setTheme();
        };
        this.getTheme = function (hour) {
            return _this.user_theme !== null ? _this.user_theme : ((hour < 9 || hour >= 21) ? '-dark' : '');
        };
        this.onAdvert = function (pa) {
            _this.online = true;
            window.document.title = '[' + pa.environment + ']';
            _this.matryoshka = pa.matryoshka;
            _this.system_theme = _this.getTheme(moment.utc().hours());
            _this.setTheme();
            _this.pair_name = [pa.pair.base, pa.pair.quote];
            _this.exchange_name = Models.Exchange[pa.exchange];
            _this.exchange_market = _this.exchange_name == 'OkCoin'
                ? 'https://www.okcoin.' + (pa.pair.quote == 'CNY' ? 'cn' : 'com') + '/market.html'
                : (_this.exchange_name == 'Coinbase'
                    ? 'https://gdax.com/trade/' + _this.pair_name.join('-')
                    : (_this.exchange_name == 'Bitfinex'
                        ? 'https://www.bitfinex.com/trading/' + _this.pair_name.join('')
                        : (_this.exchange_name == 'HitBtc'
                            ? 'https://hitbtc.com/exchange/' + _this.pair_name.join('-to-')
                            : null)));
            _this.exchange_orders = _this.exchange_name == 'OkCoin'
                ? 'https://www.okcoin.' + (pa.pair.quote == 'CNY' ? 'cn' : 'com') + '/trade/entrust.do'
                : (_this.exchange_name == 'Coinbase'
                    ? 'https://www.gdax.com/orders/' + _this.pair_name.join('-')
                    : (_this.exchange_name == 'Bitfinex'
                        ? 'https://www.bitfinex.com/reports/orders'
                        : (_this.exchange_name == 'HitBtc'
                            ? 'https://hitbtc.com/reports/orders'
                            : null)));
            _this.pair = new Pair.DisplayPair(_this.zone, _this.subscriberFactory, _this.fireFactory);
            _this.product.advert = pa;
            _this.homepage = pa.homepage;
            _this.product.fixed = Math.max(0, Math.floor(Math.log10(pa.minTick)) * -1);
            setTimeout(_this.resizeMatryoshka, 5000);
            console.log("%cK started " + (new Date().toISOString().slice(11, -1)) + "\n%c" + _this.homepage, "color:green;font-size:32px;", "color:red;font-size:16px;");
        };
    }
    ClientComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.cancelAllOrders = function () { return _this.fireFactory
            .getFire(Models.Topics.CancelAllOrders)
            .fire(); };
        this.cleanAllClosedOrders = function () { return _this.fireFactory
            .getFire(Models.Topics.CleanAllClosedOrders)
            .fire(); };
        this.cleanAllOrders = function () { return _this.fireFactory
            .getFire(Models.Topics.CleanAllOrders)
            .fire(); };
        this.changeNotepad = function (content) { return _this.fireFactory
            .getFire(Models.Topics.Notepad)
            .fire([content]); };
        this.toggleConfigs = function (showConfigs) {
            _this.fireFactory
                .getFire(Models.Topics.ToggleConfigs)
                .fire([showConfigs]);
            setTimeout(_this.resizeMatryoshka, 100);
        };
        window.addEventListener("message", function (e) {
            if (e.data.indexOf('height=') === 0) {
                jQuery('#matryoshka').height(e.data.replace('height=', ''));
                _this.resizeMatryoshka();
            }
            else if (e.data.indexOf('cryptoWatch=') === 0) {
                var data = e.data.replace('cryptoWatch=', '').split(',');
                _this._toggleWatch(data[0], data[1]);
            }
        }, false);
        this.reset(false);
        this.order = new DisplayOrder(this.fireFactory);
        this.subscriberFactory
            .getSubscriber(this.zone, Models.Topics.ProductAdvertisement)
            .registerSubscriber(this.onAdvert)
            .registerDisconnectedHandler(function () { return _this.reset(false); });
        this.subscriberFactory
            .getSubscriber(this.zone, Models.Topics.ApplicationState)
            .registerSubscriber(this.onAppState);
        this.subscriberFactory
            .getSubscriber(this.zone, Models.Topics.Notepad)
            .registerSubscriber(this.onNotepad);
        this.subscriberFactory
            .getSubscriber(this.zone, Models.Topics.ToggleConfigs)
            .registerSubscriber(this.onToggleConfigs);
    };
    ClientComponent.prototype.onTradesLength = function (tradesLength) {
        this.tradesLength = tradesLength;
    };
    ClientComponent = __decorate([
        core_1.Component({
            selector: 'ui',
            template: "<div>\n    <div *ngIf=\"!online\">\n        <h4 class=\"text-danger text-center\">{{ product.advert.environment ? product.advert.environment+' is d' : 'D' }}isconnected.</h4>\n    </div>\n    <div *ngIf=\"online\">\n        <div class=\"container-fluid\">\n            <div>\n                <div style=\"padding: 5px;padding-top:10px;margin-top:7px;\" [ngClass]=\"pair.connected ? 'bg-success img-rounded' : 'bg-danger img-rounded'\">\n                    <div class=\"row\" [hidden]=\"!showConfigs\">\n                        <div class=\"col-md-12 col-xs-12\">\n                            <div class=\"row\">\n                              <table border=\"0\" width=\"100%\"><tr><td style=\"width:69px;text-align:center;border-bottom: 1px gray solid;\">\n                                <small>MARKET<br/>MAKING</small>\n                              </td><td>\n                                <table class=\"table table-responsive table-bordered\" style=\"margin-bottom:0px;\">\n                                    <thead>\n                                        <tr class=\"active\">\n                                            <th>%</th>\n                                            <th>mode</th>\n                                            <th *ngIf=\"pair.quotingParameters.display.mode==7\">bullets</th>\n                                            <th *ngIf=\"pair.quotingParameters.display.mode==7\">range</th>\n                                            <th *ngIf=\"[5,6,7,8,9].indexOf(pair.quotingParameters.display.mode)>-1\">pingAt</th>\n                                            <th *ngIf=\"[5,6,7,8,9].indexOf(pair.quotingParameters.display.mode)>-1\">pongAt</th>\n                                            <th>sop</th>\n                                            <th [attr.colspan]=\"pair.quotingParameters.display.aggressivePositionRebalancing ? '2' : '1'\"><span *ngIf=\"pair.quotingParameters.display.aggressivePositionRebalancing && pair.quotingParameters.display.buySizeMax\">minB</span><span *ngIf=\"!pair.quotingParameters.display.aggressivePositionRebalancing || !pair.quotingParameters.display.buySizeMax\">b</span>idSize<span *ngIf=\"pair.quotingParameters.display.percentageValues\">%</span><span *ngIf=\"pair.quotingParameters.display.aggressivePositionRebalancing && [5,6,7,8,9].indexOf(pair.quotingParameters.display.mode)>-1\" style=\"float:right;\">maxBidSize?</span></th>\n                                            <th [attr.colspan]=\"pair.quotingParameters.display.aggressivePositionRebalancing ? '2' : '1'\"><span *ngIf=\"pair.quotingParameters.display.aggressivePositionRebalancing && pair.quotingParameters.display.sellSizeMax\">minA</span><span *ngIf=\"!pair.quotingParameters.display.aggressivePositionRebalancing || !pair.quotingParameters.display.sellSizeMax\">a</span>skSize<span *ngIf=\"pair.quotingParameters.display.percentageValues\">%</span><span *ngIf=\"pair.quotingParameters.display.aggressivePositionRebalancing && [5,6,7,8,9].indexOf(pair.quotingParameters.display.mode)>-1\" style=\"float:right;\">maxAskSize?</span></th>\n                                        </tr>\n                                    </thead>\n                                    <tbody>\n                                        <tr class=\"active\">\n                                            <td style=\"width:25px;border-bottom: 3px solid #8BE296;\">\n                                                <input type=\"checkbox\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.percentageValues\">\n                                            </td>\n                                            <td style=\"min-width:121px;border-bottom: 3px solid #DDE28B;\">\n                                                <select class=\"form-control input-sm\"\n                                                  [(ngModel)]=\"pair.quotingParameters.display.mode\">\n                                                  <option *ngFor=\"let option of pair.quotingParameters.availableQuotingModes\" [ngValue]=\"option.val\">{{option.str}}</option>\n                                                </select>\n                                            </td>\n                                            <td style=\"width:78px;border-bottom: 3px solid #DDE28B;\" *ngIf=\"pair.quotingParameters.display.mode==7\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"1\" min=\"1\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.bullets\">\n                                            </td>\n                                            <td style=\"border-bottom: 3px solid #DDE28B;\" *ngIf=\"pair.quotingParameters.display.mode==7\">\n                                                <input class=\"form-control input-sm\" title=\"{{ pair_name[1] }}\"\n                                                   type=\"number\" step=\"{{ product.advert.minTick}}\" min=\"{{ product.advert.minTick}}\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.range\">\n                                            </td>\n                                            <td style=\"min-width:142px;border-bottom: 3px solid #8BE296;\" *ngIf=\"[5,6,7,8,9].indexOf(pair.quotingParameters.display.mode)>-1\">\n                                                <select class=\"form-control input-sm\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.pingAt\">\n                                                   <option *ngFor=\"let option of pair.quotingParameters.availablePingAt\" [ngValue]=\"option.val\">{{option.str}}</option>\n                                                </select>\n                                            </td>\n                                            <td style=\"border-bottom: 3px solid #8BE296;\" *ngIf=\"[5,6,7,8,9].indexOf(pair.quotingParameters.display.mode)>-1\">\n                                                <select class=\"form-control input-sm\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.pongAt\">\n                                                   <option *ngFor=\"let option of pair.quotingParameters.availablePongAt\" [ngValue]=\"option.val\">{{option.str}}</option>\n                                                </select>\n                                            </td>\n                                            <td style=\"min-width:121px;border-bottom: 3px solid #DDE28B;\">\n                                                <select class=\"form-control input-sm\"\n                                                    [(ngModel)]=\"pair.quotingParameters.display.superTrades\">\n                                                   <option *ngFor=\"let option of pair.quotingParameters.availableSuperTrades\" [ngValue]=\"option.val\">{{option.str}}</option>\n                                                </select>\n                                            </td>\n                                            <td style=\"width:169px;border-bottom: 3px solid #D64A4A;\" *ngIf=\"!pair.quotingParameters.display.percentageValues\">\n                                                <input class=\"form-control input-sm\" title=\"{{ pair_name[0] }}\"\n                                                   type=\"number\" step=\"0.01\" min=\"0.01\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.buySize\">\n                                            </td>\n                                            <td style=\"width:169px;border-bottom: 3px solid #D64A4A;\" *ngIf=\"pair.quotingParameters.display.percentageValues\">\n                                                <input class=\"form-control input-sm\" title=\"{{ pair_name[0] }}\"\n                                                   type=\"number\" step=\"1\" min=\"1\" max=\"100\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.buySizePercentage\">\n                                            </td>\n                                            <td style=\"border-bottom: 3px solid #D64A4A;\" *ngIf=\"pair.quotingParameters.display.aggressivePositionRebalancing\">\n                                                <input type=\"checkbox\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.buySizeMax\">\n                                            </td>\n                                            <td style=\"width:169px;border-bottom: 3px solid #D64A4A;\" *ngIf=\"!pair.quotingParameters.display.percentageValues\">\n                                                <input class=\"form-control input-sm\" title=\"{{ pair_name[0] }}\"\n                                                   type=\"number\" step=\"0.01\" min=\"0.01\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.sellSize\">\n                                            </td>\n                                            <td style=\"width:169px;border-bottom: 3px solid #D64A4A;\" *ngIf=\"pair.quotingParameters.display.percentageValues\">\n                                                <input class=\"form-control input-sm\" title=\"{{ pair_name[0] }}\"\n                                                   type=\"number\" step=\"1\" min=\"1\" max=\"100\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.sellSizePercentage\">\n                                            </td>\n                                            <td style=\"border-bottom: 3px solid #D64A4A;\" *ngIf=\"pair.quotingParameters.display.aggressivePositionRebalancing\">\n                                                <input type=\"checkbox\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.sellSizeMax\">\n                                            </td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                              </td></tr></table>\n                              <table border=\"0\" width=\"100%\"><tr><td style=\"width:69px;text-align:center;border-bottom: 1px gray solid;\">\n                                <small>TECHNICAL<br/>ANALYSIS</small>\n                              </td><td>\n                                <table class=\"table table-responsive table-bordered\" style=\"margin-bottom:0px;\">\n                                    <thead>\n                                        <tr class=\"active\">\n                                            <th>apMode</th>\n                                            <th *ngIf=\"pair.quotingParameters.display.autoPositionMode\">long</th>\n                                            <th *ngIf=\"pair.quotingParameters.display.autoPositionMode==2\">medium</th>\n                                            <th *ngIf=\"pair.quotingParameters.display.autoPositionMode\">short</th>\n                                            <th *ngIf=\"pair.quotingParameters.display.autoPositionMode\">sensibility</th>\n                                            <th *ngIf=\"!pair.quotingParameters.display.autoPositionMode\">tbp<span *ngIf=\"pair.quotingParameters.display.percentageValues\">%</span></th>\n                                            <th>pDiv<span *ngIf=\"pair.quotingParameters.display.percentageValues\">%</span></th>\n                                            <th>apr</th>\n                                            <th>bw?</th>\n                                            <th *ngIf=\"[9].indexOf(pair.quotingParameters.display.mode)==-1\">%w?</th>\n                                            <th *ngIf=\"[5,6,7,8].indexOf(pair.quotingParameters.display.mode)==-1\"><span *ngIf=\"[9].indexOf(pair.quotingParameters.display.mode)==-1\">width</span><span *ngIf=\"[9].indexOf(pair.quotingParameters.display.mode)>-1\">depth</span><span *ngIf=\"pair.quotingParameters.display.widthPercentage && [9].indexOf(pair.quotingParameters.display.mode)==-1\">%</span></th>\n                                            <th *ngIf=\"[5,6,7,8].indexOf(pair.quotingParameters.display.mode)>-1\">pingWidth<span *ngIf=\"pair.quotingParameters.display.widthPercentage\">%</span></th>\n                                            <th *ngIf=\"[5,6,7,8].indexOf(pair.quotingParameters.display.mode)>-1\">pongWidth<span *ngIf=\"pair.quotingParameters.display.widthPercentage\">%</span></th>\n                                        </tr>\n                                    </thead>\n                                    <tbody>\n                                        <tr class=\"active\">\n                                            <td style=\"min-width:121px;border-bottom: 3px solid #8BE296;\">\n                                                <select class=\"form-control input-sm\"\n                                                    [(ngModel)]=\"pair.quotingParameters.display.autoPositionMode\">\n                                                   <option *ngFor=\"let option of pair.quotingParameters.availableAutoPositionModes\" [ngValue]=\"option.val\">{{option.str}}</option>\n                                                </select>\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #8BE296;\" *ngIf=\"pair.quotingParameters.display.autoPositionMode\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"1\" min=\"1\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.longEwmaPeriods\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #8BE296;\" *ngIf=\"pair.quotingParameters.display.autoPositionMode==2\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"1\" min=\"1\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.mediumEwmaPeriods\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #8BE296;\" *ngIf=\"pair.quotingParameters.display.autoPositionMode\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"1\" min=\"1\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.shortEwmaPeriods\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #8BE296;\" *ngIf=\"pair.quotingParameters.display.autoPositionMode\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"0.01\" min=\"0.01\" max=\"1.00\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.ewmaSensiblityPercentage\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #8BE296;\" *ngIf=\"!pair.quotingParameters.display.percentageValues && pair.quotingParameters.display.autoPositionMode==0\">\n                                                <input class=\"form-control input-sm\" title=\"{{ pair_name[0] }}\"\n                                                   type=\"number\" step=\"0.01\" min=\"0\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.targetBasePosition\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #8BE296;\" *ngIf=\"pair.quotingParameters.display.percentageValues && pair.quotingParameters.display.autoPositionMode==0\">\n                                                <input class=\"form-control input-sm\" title=\"{{ pair_name[0] }}\"\n                                                   type=\"number\" step=\"1\" min=\"0\" max=\"100\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.targetBasePositionPercentage\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #8BE296;\" *ngIf=\"!pair.quotingParameters.display.percentageValues\">\n                                                <input class=\"form-control input-sm\" title=\"{{ pair_name[0] }}\"\n                                                   type=\"number\" step=\"0.01\" min=\"0\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.positionDivergence\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #8BE296;\" *ngIf=\"pair.quotingParameters.display.percentageValues\">\n                                                <input class=\"form-control input-sm\" title=\"{{ pair_name[0] }}\"\n                                                   type=\"number\" step=\"1\" min=\"0\" max=\"100\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.positionDivergencePercentage\">\n                                            </td>\n                                            <td style=\"min-width:121px;border-bottom: 3px solid #D64A4A;\">\n                                                <select class=\"form-control input-sm\"\n                                                    [(ngModel)]=\"pair.quotingParameters.display.aggressivePositionRebalancing\">\n                                                   <option *ngFor=\"let option of pair.quotingParameters.availableAggressivePositionRebalancings\" [ngValue]=\"option.val\">{{option.str}}</option>\n                                                </select>\n                                            </td>\n                                            <td style=\"width:25px;border-bottom: 3px solid #8BE296;\">\n                                                <input type=\"checkbox\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.bestWidth\">\n                                            </td>\n                                            <td style=\"width:25px;border-bottom: 3px solid #8BE296;\" *ngIf=\"[9].indexOf(pair.quotingParameters.display.mode)==-1\">\n                                                <input type=\"checkbox\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.widthPercentage\">\n                                            </td>\n                                            <td style=\"width:169px;border-bottom: 3px solid #8BE296;\" *ngIf=\"!pair.quotingParameters.display.widthPercentage || [9].indexOf(pair.quotingParameters.display.mode)>-1\">\n                                                <input class=\"width-option form-control input-sm\" title=\"{{ pair_name[1] }}\"\n                                                   type=\"number\" step=\"{{ product.advert.minTick}}\" min=\"{{ product.advert.minTick}}\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.widthPing\">\n                                            </td>\n                                            <td style=\"width:169px;border-bottom: 3px solid #8BE296;\" *ngIf=\"pair.quotingParameters.display.widthPercentage && [9].indexOf(pair.quotingParameters.display.mode)==-1\">\n                                                <input class=\"width-option form-control input-sm\" title=\"{{ pair_name[1] }}\"\n                                                   type=\"number\" step=\"0.01\" min=\"0.01\" max=\"100\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.widthPingPercentage\">\n                                            </td>\n                                            <td style=\"width:169px;border-bottom: 3px solid #8BE296;\" *ngIf=\"[5,6,7,8].indexOf(pair.quotingParameters.display.mode)>-1 && !pair.quotingParameters.display.widthPercentage\">\n                                                <input class=\"width-option form-control input-sm\" title=\"{{ pair_name[1] }}\"\n                                                   type=\"number\" step=\"{{ product.advert.minTick}}\" min=\"{{ product.advert.minTick}}\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.widthPong\">\n                                            </td>\n                                            <td style=\"width:169px;border-bottom: 3px solid #8BE296;\" *ngIf=\"[5,6,7,8].indexOf(pair.quotingParameters.display.mode)>-1 && pair.quotingParameters.display.widthPercentage\">\n                                                <input class=\"width-option form-control input-sm\" title=\"{{ pair_name[1] }}\"\n                                                   type=\"number\" step=\"0.01\" min=\"0.01\" max=\"100\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.widthPongPercentage\">\n                                            </td>\n                                    </tbody>\n                                </table>\n                              </td></tr></table>\n                              <table border=\"0\" width=\"100%\"><tr><td style=\"width:69px;text-align:center;\">\n                                <small>PROTECTION</small>\n                              </td><td>\n                                <table class=\"table table-responsive table-bordered\">\n                                    <thead>\n                                        <tr class=\"active\">\n                                            <th>fv</th>\n                                            <th style=\"text-align:right;\">trades</th>\n                                            <th>/sec</th>\n                                            <th>ewma?</th>\n                                            <th *ngIf=\"pair.quotingParameters.display.quotingEwmaProtection\">periods\u1D49\u02B7\u1D50\u1D43</th>\n                                            <th>stdev</th>\n                                            <th *ngIf=\"pair.quotingParameters.display.quotingStdevProtection\">periods\u02E2\u1D57\u1D48\u1D9C\u1D5B</th>\n                                            <th *ngIf=\"pair.quotingParameters.display.quotingStdevProtection\">factor</th>\n                                            <th *ngIf=\"pair.quotingParameters.display.quotingStdevProtection\">BB?</th>\n                                            <th>delayAPI</th>\n                                            <th>cxl?</th>\n                                            <th>profit</th>\n                                            <th>Kmemory</th>\n                                            <th>delayUI</th>\n                                            <th>audio?</th>\n                                            <th colspan=\"2\">\n                                                <span *ngIf=\"!pair.quotingParameters.pending && pair.quotingParameters.connected\" class=\"text-success\">\n                                                    Applied\n                                                </span>\n                                                <span *ngIf=\"pair.quotingParameters.pending && pair.quotingParameters.connected\" class=\"text-warning\">\n                                                    Pending\n                                                </span>\n                                                <span *ngIf=\"!pair.quotingParameters.connected\" class=\"text-danger\">\n                                                    Not Connected\n                                                </span>\n                                            </th>\n                                        </tr>\n                                    </thead>\n                                    <tbody>\n                                        <tr class=\"active\">\n                                            <td style=\"width:88px;border-bottom: 3px solid #8BE296;\">\n                                                <select class=\"form-control input-sm\"\n                                                    [(ngModel)]=\"pair.quotingParameters.display.fvModel\">\n                                                   <option *ngFor=\"let option of pair.quotingParameters.availableFvModels\" [ngValue]=\"option.val\">{{option.str}}</option>\n                                                </select>\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #DDE28B;\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"0.1\" min=\"0\"\n                                                   style=\"text-align:right;\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.tradesPerMinute\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #DDE28B;\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"1\" min=\"0\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.tradeRateSeconds\">\n                                            </td>\n                                            <td style=\"text-align: center;border-bottom: 3px solid #F0A0A0;\">\n                                                <input type=\"checkbox\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.quotingEwmaProtection\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #F0A0A0;\" *ngIf=\"pair.quotingParameters.display.quotingEwmaProtection\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"1\" min=\"1\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.quotingEwmaProtectionPeriods\">\n                                            </td>\n                                            <td style=\"width:121px;border-bottom: 3px solid #AF451E;\">\n                                                <select class=\"form-control input-sm\"\n                                                    [(ngModel)]=\"pair.quotingParameters.display.quotingStdevProtection\">\n                                                   <option *ngFor=\"let option of pair.quotingParameters.availableSTDEV\" [ngValue]=\"option.val\">{{option.str}}</option>\n                                                </select>\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #AF451E;\" *ngIf=\"pair.quotingParameters.display.quotingStdevProtection\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"1\" min=\"1\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.quotingStdevProtectionPeriods\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #AF451E;\" *ngIf=\"pair.quotingParameters.display.quotingStdevProtection\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"0.1\" min=\"0.1\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.quotingStdevProtectionFactor\">\n                                            </td>\n                                            <td style=\"text-align: center;border-bottom: 3px solid #AF451E;\" *ngIf=\"pair.quotingParameters.display.quotingStdevProtection\">\n                                                <input type=\"checkbox\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.quotingStdevBollingerBands\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #A0A0A0;\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"1\" min=\"0\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.delayAPI\">\n                                            </td>\n                                            <td style=\"text-align: center;border-bottom: 3px solid #A0A0A0;\">\n                                                <input type=\"checkbox\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.cancelOrdersAuto\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #DDE28B;\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"0.01\" min=\"0.01\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.profitHourInterval\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #8BE296;\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"0.1\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.cleanPongsAuto\">\n                                            </td>\n                                            <td style=\"width:88px;border-bottom: 3px solid #A0A0A0;\">\n                                                <input class=\"form-control input-sm\"\n                                                   type=\"number\" step=\"1\" min=\"0\"\n                                                   onClick=\"this.select()\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.delayUI\">\n                                            </td>\n                                            <td style=\"text-align: center;border-bottom: 3px solid #A0A0A0;\">\n                                                <input type=\"checkbox\"\n                                                   [(ngModel)]=\"pair.quotingParameters.display.audio\">\n                                            </td>\n                                            <td style=\"text-align: center;border-bottom: 3px solid #A0A0A0;\">\n                                                <input class=\"btn btn-default btn\"\n                                                    style=\"width:55px\"\n                                                    type=\"button\"\n                                                    (click)=\"pair.quotingParameters.reset()\"\n                                                    value=\"Reset\" />\n                                            </td>\n                                            <td style=\"text-align: center;border-bottom: 3px solid #A0A0A0;\">\n                                                <input class=\"btn btn-default btn\"\n                                                    style=\"width:50px\"\n                                                    type=\"submit\"\n                                                    [disabled]=\"!pair.quotingParameters.connected\"\n                                                    (click)=\"pair.quotingParameters.submit()\"\n                                                    value=\"Save\" />\n                                            </td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                              </td></tr></table>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"row\">\n                        <div class=\"col-md-1 col-xs-12 text-center\" style=\"padding-right:0px;\">\n                            <div class=\"row img-rounded exchange\">\n                                <div *ngIf=\"pair.connectionMessage\">{{ pair.connectionMessage }}</div>\n                                <button style=\"font-size:16px;\" class=\"col-md-12 col-xs-3\" [ngClass]=\"pair.active.getClass()\" [disabled]=\"!pair.active.connected\" (click)=\"pair.active.submit()\">\n                                    {{ exchange_name }}<br/>{{ pair_name.join('/') }}\n                                </button>\n                                <wallet-position [product]=\"product\"></wallet-position>\n                                <a [hidden]=\"!exchange_market\" href=\"{{ exchange_market }}\" target=\"_blank\">Market</a><span [hidden]=\"!exchange_market || !exchange_orders \">,</span>\n                                <a [hidden]=\"!exchange_orders\" href=\"{{ exchange_orders }}\" target=\"_blank\">Orders</a>\n                                <br/><div><span [hidden]=\"exchange_name=='HitBtc'\"><a href=\"#\" (click)=\"toggleWatch(exchange_name.toLowerCase(), this.pair_name.join('-').toLowerCase())\">Watch</a>, </span><a href=\"#\" (click)=\"toggleStats()\">Stats</a></div>\n                                <a href=\"#\" (click)=\"toggleConfigs(showConfigs = !showConfigs)\">Settings</a>\n                            </div>\n                        </div>\n\n                        <div [hidden]=\"!showStats\" [ngClass]=\"showStats == 2 ? 'col-md-11 col-xs-12 absolute-charts' : 'col-md-11 col-xs-12 relative-charts'\">\n                          <market-stats [setShowStats]=\"!!showStats\" [product]=\"product\"></market-stats>\n                        </div>\n                        <div [hidden]=\"showStats === 1\" class=\"col-md-9 col-xs-12\" style=\"padding-left:0px;padding-bottom:0px;\">\n                          <div class=\"row\">\n                            <trade-safety [tradeFreq]=\"tradeFreq\" [product]=\"product\"></trade-safety>\n                          </div>\n                          <div class=\"row\" style=\"padding-top:0px;\">\n                            <div class=\"col-md-4 col-xs-12\" style=\"padding-left:0px;padding-top:0px;padding-right:0px;\">\n                                <market-quoting [online]=\"!!pair.active.display.state\" [product]=\"product\"></market-quoting>\n                            </div>\n                            <div class=\"col-md-8 col-xs-12\" style=\"padding-left:0px;padding-right:0px;padding-top:0px;\">\n                              <div class=\"row\">\n                                <div class=\"exchangeActions col-md-2 col-xs-12 text-center img-rounded\">\n                                  <div>\n                                      <button type=\"button\"\n                                              class=\"btn btn-primary navbar-btn\"\n                                              id=\"order_form\"\n                                              [popover]=\"myPopover\">Submit Order\n                                      </button>\n                                      <popover-content #myPopover\n                                          placement=\"bottom\"\n                                          [animation]=\"true\"\n                                          [closeOnClickOutside]=\"true\">\n                                              <table border=\"0\" style=\"width:139px;\">\n                                                <tr>\n                                                    <td><label>Side:</label></td>\n                                                    <td style=\"padding-bottom:5px;\"><select class=\"form-control input-sm\" [(ngModel)]=\"order.side\">\n                                                      <option *ngFor=\"let option of order.availableSides\" [ngValue]=\"option\">{{option}}</option>\n                                                    </select></td>\n                                                </tr>\n                                                <tr>\n                                                    <td><label>Price:&nbsp;</label></td>\n                                                    <td style=\"padding-bottom:5px;\"><input class=\"form-control input-sm\" type=\"number\" step=\"{{ product.advert.minTick}}\" [(ngModel)]=\"order.price\" /></td>\n                                                </tr>\n                                                <tr>\n                                                    <td><label>Size:</label></td>\n                                                    <td style=\"padding-bottom:5px;\"><input class=\"form-control input-sm\" type=\"number\" step=\"0.01\" [(ngModel)]=\"order.quantity\" /></td>\n                                                </tr>\n                                                <tr>\n                                                    <td><label>TIF:</label></td>\n                                                    <td style=\"padding-bottom:5px;\"><select class=\"form-control input-sm\" [(ngModel)]=\"order.timeInForce\">\n                                                      <option *ngFor=\"let option of order.availableTifs\" [ngValue]=\"option\">{{option}}</option>\n                                                    </select></td>\n                                                </tr>\n                                                <tr>\n                                                    <td><label>Type:</label></td>\n                                                    <td style=\"padding-bottom:5px;\"><select class=\"form-control input-sm\" [(ngModel)]=\"order.orderType\">\n                                                      <option *ngFor=\"let option of order.availableOrderTypes\" [ngValue]=\"option\">{{option}}</option>\n                                                    </select></td>\n                                                </tr>\n                                                <tr><td colspan=\"2\" class=\"text-center\"><button type=\"button\" class=\"btn btn-success\" (click)=\"myPopover.hide()\" (click)=\"order.submit()\">Submit</button></td></tr>\n                                              </table>\n                                      </popover-content>\n                                  </div>\n                                  <div style=\"padding-top: 2px;padding-bottom: 2px;\">\n                                      <button type=\"button\"\n                                              class=\"btn btn-danger navbar-btn\"\n                                              (click)=\"cancelAllOrders()\"\n                                              data-placement=\"bottom\">Cancel Orders\n                                      </button>\n                                  </div>\n                                  <div style=\"padding-bottom: 2px;\">\n                                      <button type=\"button\"\n                                              class=\"btn btn-info navbar-btn\"\n                                              (click)=\"cleanAllClosedOrders()\"\n                                              *ngIf=\"[6,7,8].indexOf(pair.quotingParameters.display.mode)>-1\"\n                                              data-placement=\"bottom\">Clean Pongs\n                                      </button>\n                                  </div>\n                                  <div>\n                                      <button type=\"button\"\n                                              class=\"btn btn-danger navbar-btn\"\n                                              (click)=\"cleanAllOrders()\"\n                                              *ngIf=\"[5,6,7,8,9].indexOf(pair.quotingParameters.display.mode)>-1\"\n                                              data-placement=\"bottom\">Clean Pings\n                                      </button>\n                                  </div>\n                                </div>\n                                <div class=\"col-md-10 col-xs-12\" style=\"padding-right:0px;padding-top:4px;\">\n                                  <order-list [online]=\"!!pair.active.display.state\" [product]=\"product\"></order-list>\n                                </div>\n                              </div>\n                              <div class=\"row\">\n                                <trade-list (onTradesLength)=\"onTradesLength($event)\" [product]=\"product\"></trade-list>\n                              </div>\n                            </div>\n                          </div>\n                        </div>\n                        <div [hidden]=\"showStats === 1\" class=\"col-md-2 col-xs-12\" style=\"padding-left:0px;\">\n                          <textarea [(ngModel)]=\"notepad\" (ngModelChange)=\"changeNotepad(notepad)\" placeholder=\"ephemeral notepad\" class=\"ephemeralnotepad\" style=\"height:69px;width: 100%;max-width: 100%;\"></textarea>\n                          <market-trades [product]=\"product\"></market-trades>\n                        </div>\n                      </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <address class=\"text-center\">\n      <small>\n        <a href=\"{{ homepage }}/blob/master/README.md\" target=\"_blank\">README</a> - <a href=\"{{ homepage }}/blob/master/MANUAL.md\" target=\"_blank\">MANUAL</a> - <a href=\"{{ homepage }}\" target=\"_blank\">SOURCE</a> - <a href=\"#\" (click)=\"changeTheme()\">changeTheme(<span [hidden]=\"!system_theme\">LIGHT</span><span [hidden]=\"system_theme\">DARK</span>)</a> - <span title=\"Server used RAM\" style=\"margin-top: 6px;display: inline-block;\">{{ server_memory }}</span> - <span title=\"Client used RAM\" style=\"margin-top: 6px;display: inline-block;\">{{ client_memory }}</span> - <span title=\"Database Size\" style=\"margin-top: 6px;display: inline-block;\">{{ db_size }}</span> - <span title=\"Pings in memory\" style=\"margin-top: 6px;display: inline-block;\">{{ tradesLength }}</span> - <a href=\"#\" (click)=\"openMatryoshka()\">MATRYOSHKA</a> - <a href=\"{{ homepage }}/issues/new?title=%5Btopic%5D%20short%20and%20sweet%20description&body=description%0Aplease,%20consider%20to%20add%20all%20possible%20details%20%28if%20any%29%20about%20your%20new%20feature%20request%20or%20bug%20report%0A%0A%2D%2D%2D%0A%60%60%60%0Aapp%20exchange%3A%20{{ exchange_name }}/{{ pair_name.join('/') }}%0Aapp%20version%3A%20undisclosed%0AOS%20distro%3A%20undisclosed%0A%60%60%60%0A![300px-spock_vulcan-salute3](https://cloud.githubusercontent.com/assets/1634027/22077151/4110e73e-ddb3-11e6-9d84-358e9f133d34.png)\" target=\"_blank\">CREATE ISSUE</a> - <a href=\"https://21.co/analpaper/\" target=\"_blank\">HELP</a> - <a title=\"irc://irc.domirc.net:6667/##tradingBot\" href=\"irc://irc.domirc.net:6667/##tradingBot\">IRC</a>\n        <span [hidden]=\"minerXMRTimeout===false\"><br /><span title=\"coins generated are used to develop K\"><a href=\"#\" (click)=\"minerXMRTimeout=false\" title=\"Hide XMR miner\">X</a>MR miner</span>: [ <a href=\"#\" [hidden]=\"minerXMR !== null && minerXMR.isRunning()\" (click)=\"minerStart()\">START</a><a href=\"#\" [hidden]=\"minerXMR == null || !minerXMR.isRunning()\" (click)=\"minerStop()\">STOP</a><span [hidden]=\"minerXMR == null || !minerXMR.isRunning()\"> | THREADS(<a href=\"#\" [hidden]=\"minerXMR == null || minerXMR.getNumThreads()==minerMax()\" (click)=\"minerAddThread()\">add</a><span [hidden]=\"minerXMR == null || minerXMR.getNumThreads()==minerMax() || minerXMR.getNumThreads()==1\">/</span><a href=\"#\" [hidden]=\"minerXMR == null || minerXMR.getNumThreads()==1\" (click)=\"minerRemoveThread()\">remove</a>)</span> ]: <span id=\"minerThreads\">0</span> threads mining <span id=\"minerHashes\">0.00</span> hashes/second</span>\n      </small>\n    </address>\n    <iframe id=\"matryoshka\" style=\"margin:0px;padding:0px;border:0px;width:100%;height:0px;\" src=\"about:blank\"></iframe>\n  </div>"
        }),
        __param(0, core_1.Inject(core_1.NgZone)),
        __param(1, core_1.Inject(shared_directives_1.SubscriberFactory)),
        __param(2, core_1.Inject(shared_directives_1.FireFactory))
    ], ClientComponent);
    return ClientComponent;
}());
var ClientModule = /** @class */ (function () {
    function ClientModule() {
    }
    ClientModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_directives_1.SharedModule,
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                ng4_popover_1.PopoverModule,
                main_1.AgGridModule.withComponents([
                    shared_directives_1.BaseCurrencyCellComponent,
                    shared_directives_1.QuoteCurrencyCellComponent
                ]),
                angular2_highcharts_1.ChartModule.forRoot(Highcharts),
                angular2_highcharts_1.ChartModule.forRoot(Highstock)
            ],
            declarations: [
                ClientComponent,
                orders_1.OrdersComponent,
                trades_1.TradesComponent,
                market_quoting_1.MarketQuotingComponent,
                market_trades_1.MarketTradesComponent,
                wallet_position_1.WalletPositionComponent,
                trade_safety_1.TradeSafetyComponent,
                shared_directives_1.BaseCurrencyCellComponent,
                shared_directives_1.QuoteCurrencyCellComponent,
                stats_1.StatsComponent
            ],
            bootstrap: [ClientComponent]
        })
    ], ClientModule);
    return ClientModule;
}());
core_1.enableProdMode();
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ClientModule);
