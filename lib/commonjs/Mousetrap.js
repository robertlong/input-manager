"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mousetrap_1 = __importDefault(require("mousetrap"));
var _globalCallbacks = {};
var _originalStopCallback = mousetrap_1.default.prototype.stopCallback;
mousetrap_1.default.prototype.stopCallback = function (e, element, combo, sequence) {
    var self = this;
    if (self.paused) {
        return true;
    }
    if (_globalCallbacks[combo] || _globalCallbacks[sequence]) {
        return false;
    }
    return _originalStopCallback.call(self, e, element, combo);
};
mousetrap_1.default.prototype.bindGlobal = function (keys, callback, action) {
    var self = this;
    self.bind(keys, callback, action);
    if (keys instanceof Array) {
        for (var i = 0; i < keys.length; i++) {
            _globalCallbacks[keys[i]] = true;
        }
        return;
    }
    _globalCallbacks[keys] = true;
};
mousetrap_1.default.prototype.unbindGlobal = function (keys, callback, action) {
    var self = this;
    self.unbind(keys, callback, action);
    if (keys instanceof Array) {
        for (var i = 0; i < keys.length; i++) {
            delete _globalCallbacks[keys[i]];
        }
        return;
    }
    delete _globalCallbacks[keys];
};
mousetrap_1.default.init();
exports.default = mousetrap_1.default;
