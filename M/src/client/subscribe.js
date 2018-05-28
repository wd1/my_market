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
var Observable_1 = require("rxjs/Observable");
var Models = require("./models");
var KSocket = /** @class */ (function (_super) {
    __extends(KSocket, _super);
    function KSocket() {
        var _this = _super.call(this, location.origin.replace('http', 'ws')) || this;
        _this.setEventListener = function (ev, cb) {
            if (typeof events[ev] == 'undefined')
                events[ev] = [];
            events[ev].push(cb);
            _this.addEventListener(ev, cb);
        };
        var _loop_1 = function (ev) {
            events[ev].forEach(function (cb) { return _this.addEventListener(ev, cb); });
        };
        for (var ev in events) {
            _loop_1(ev);
        }
        _this.addEventListener('close', function () {
            setTimeout(function () { socket = new KSocket(); }, 5000);
        });
        return _this;
    }
    return KSocket;
}(WebSocket));
var events = {};
var socket = new KSocket();
var Subscriber = /** @class */ (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(_topic) {
        var _this = _super.call(this, function (observer) {
            if (socket.readyState == 1)
                _this.onConnect();
            socket.setEventListener('open', _this.onConnect);
            socket.setEventListener('close', _this.onDisconnect);
            socket.setEventListener('message', function (msg) {
                var topic = msg.data.substr(0, 2);
                var data = JSON.parse(msg.data.substr(2));
                if (Models.Prefixes.MESSAGE + _this._topic == topic)
                    observer.next(data);
                else if (Models.Prefixes.SNAPSHOT + _this._topic == topic)
                    data.forEach(function (item) { return setTimeout(function () { return observer.next(item); }, 0); });
            });
            return function () { };
        }) || this;
        _this._topic = _topic;
        _this._connectHandler = null;
        _this._disconnectHandler = null;
        _this.onConnect = function () {
            if (_this._connectHandler !== null)
                _this._connectHandler();
            socket.send(Models.Prefixes.SNAPSHOT + _this._topic);
        };
        _this.onDisconnect = function () {
            if (_this._disconnectHandler !== null)
                _this._disconnectHandler();
        };
        _this.registerSubscriber = function (incrementalHandler) {
            if (!_this._incrementalHandler) {
                _this.subscribe(incrementalHandler);
                _this._incrementalHandler = true;
            }
            else
                throw new Error("already registered incremental handler for topic " + _this._topic);
            return _this;
        };
        _this.registerDisconnectedHandler = function (handler) {
            if (_this._disconnectHandler === null)
                _this._disconnectHandler = handler;
            else
                throw new Error("already registered disconnect handler for topic " + _this._topic);
            return _this;
        };
        _this.registerConnectHandler = function (handler) {
            if (_this._connectHandler === null)
                _this._connectHandler = handler;
            else
                throw new Error("already registered connect handler for topic " + _this._topic);
            return _this;
        };
        return _this;
    }
    Object.defineProperty(Subscriber.prototype, "connected", {
        get: function () {
            return socket.readyState == 1;
        },
        enumerable: true,
        configurable: true
    });
    return Subscriber;
}(Observable_1.Observable));
exports.Subscriber = Subscriber;
var Fire = /** @class */ (function () {
    function Fire(_topic) {
        var _this = this;
        this._topic = _topic;
        this.fire = function (msg) {
            socket.send(Models.Prefixes.MESSAGE + _this._topic + (typeof msg == 'object' ? JSON.stringify(msg) : msg));
        };
    }
    return Fire;
}());
exports.Fire = Fire;
