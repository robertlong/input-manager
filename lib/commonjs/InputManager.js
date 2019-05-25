"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Mousetrap_1 = __importDefault(require("./Mousetrap"));
var eventemitter3_1 = __importDefault(require("eventemitter3"));
function initializeValue(source, initialState, state, resetKeys, value, reset, resetPosition) {
    var e_1, _a;
    if (resetPosition === void 0) { resetPosition = true; }
    if (!source) {
        return;
    }
    for (var sourceKey in source) {
        if (source.hasOwnProperty(sourceKey)) {
            var targetKey = source[sourceKey];
            if (sourceKey === "event") {
                try {
                    for (var _b = __values(targetKey), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var _d = _c.value, defaultValue = _d.defaultValue, action = _d.action, eventReset = _d.reset;
                        if (action !== undefined && defaultValue !== undefined) {
                            initialState[action] = defaultValue;
                            state[action] = defaultValue;
                            if (eventReset) {
                                resetKeys.push(action);
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                continue;
            }
            else if (sourceKey === "position") {
                initialState[targetKey] = { x: 0, y: 0 };
                state[targetKey] =
                    state[targetKey] !== undefined
                        ? state[targetKey]
                        : { x: 0, y: 0 };
                if (resetPosition) {
                    resetKeys.push(targetKey);
                }
                continue;
            }
            initialState[targetKey] = value;
            state[targetKey] =
                state[targetKey] !== undefined
                    ? state[targetKey]
                    : value;
            if (reset) {
                resetKeys.push(targetKey);
            }
        }
    }
}
function isInputSelected() {
    var el = document.activeElement;
    var nodeName = el.nodeName;
    return (el.isContentEditable ||
        nodeName === "INPUT" ||
        nodeName === "SELECT" ||
        nodeName === "TEXTAREA");
}
function normalizeWheel(value) {
    if (value === 0) {
        return value;
    }
    return value > 0 ? 1 : -1;
}
function mergeMappings(mappings) {
    var e_2, _a, e_3, _b;
    var output = {
        keyboard: {
            pressed: {},
            keyup: {},
            keydown: {},
            hotkeys: {},
            globalHotkeys: {}
        },
        mouse: {
            click: {},
            dblclick: {},
            move: {},
            wheel: {},
            pressed: {},
            mouseup: {},
            mousedown: {}
        },
        computed: []
    };
    try {
        for (var _c = __values(mappings.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var mapping = _d.value;
            var keyboard = mapping.keyboard, mouse = mapping.mouse, computed = mapping.computed, rest = __rest(mapping, ["keyboard", "mouse", "computed"]);
            if (keyboard) {
                if (keyboard.pressed) {
                    Object.assign(output.keyboard.pressed, keyboard.pressed);
                }
                if (keyboard.keyup) {
                    Object.assign(output.keyboard.keyup, keyboard.keyup);
                }
                if (keyboard.keydown) {
                    Object.assign(output.keyboard.keydown, keyboard.keydown);
                }
                if (keyboard.hotkeys) {
                    Object.assign(output.keyboard.hotkeys, keyboard.hotkeys);
                }
                if (keyboard.globalHotkeys) {
                    Object.assign(output.keyboard.globalHotkeys, keyboard.globalHotkeys);
                }
            }
            if (mouse) {
                if (mouse.click) {
                    Object.assign(output.mouse.click, mouse.click);
                }
                if (mouse.dblclick) {
                    Object.assign(output.mouse.dblclick, mouse.dblclick);
                }
                if (mouse.move) {
                    Object.assign(output.mouse.move, mouse.move);
                }
                if (mouse.wheel) {
                    Object.assign(output.mouse.wheel, mouse.wheel);
                }
                if (mouse.pressed) {
                    Object.assign(output.mouse.pressed, mouse.pressed);
                }
                if (mouse.mouseup) {
                    Object.assign(output.mouse.mouseup, mouse.mouseup);
                }
                if (mouse.mousedown) {
                    Object.assign(output.mouse.mousedown, mouse.mousedown);
                }
            }
            Object.assign(output, rest);
            if (computed) {
                try {
                    for (var computed_1 = __values(computed), computed_1_1 = computed_1.next(); !computed_1_1.done; computed_1_1 = computed_1.next()) {
                        var obj = computed_1_1.value;
                        output.computed.push(obj);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (computed_1_1 && !computed_1_1.done && (_b = computed_1.return)) _b.call(computed_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return output;
}
function deleteValues(state, mappingObj) {
    for (var key in mappingObj) {
        var action = mappingObj[key];
        delete state[action];
    }
}
var mouseButtons = ["left", "middle", "right", "button4", "button5"];
var SPECIAL_ALIASES = {
    option: "alt",
    command: "meta",
    return: "enter",
    escape: "esc",
    plus: "+",
    mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
};
var InputManager = /** @class */ (function (_super) {
    __extends(InputManager, _super);
    function InputManager(canvas) {
        var e_4, _a, e_5, _b;
        var _this = _super.call(this) || this;
        _this.onKeyDown = function (event) {
            if (isInputSelected()) {
                return;
            }
            var preventDefault = false;
            var keyboardMapping = _this.mapping.keyboard;
            if (!keyboardMapping) {
                return;
            }
            var pressedMapping = keyboardMapping.pressed;
            if (pressedMapping) {
                preventDefault = _this.handleKeyMappings(pressedMapping, event, 1);
            }
            var keydownMapping = keyboardMapping.keydown;
            if (keydownMapping) {
                preventDefault = _this.handleKeyMappings(keydownMapping, event, 1);
                if (keydownMapping.event) {
                    _this.handleEventMappings(keydownMapping.event, event);
                    preventDefault = true;
                }
            }
            if (preventDefault) {
                event.preventDefault();
            }
        };
        _this.onKeyUp = function (event) {
            if (isInputSelected()) {
                return;
            }
            var preventDefault = false;
            var keyboardMapping = _this.mapping.keyboard;
            if (!keyboardMapping) {
                return;
            }
            var pressedMapping = keyboardMapping.pressed;
            if (pressedMapping) {
                preventDefault = _this.handleKeyMappings(pressedMapping, event, 0);
            }
            var keyupMapping = keyboardMapping.keyup;
            if (keyupMapping) {
                preventDefault = _this.handleKeyMappings(keyupMapping, event, 0);
                if (keyupMapping.event) {
                    _this.handleEventMappings(keyupMapping.event, event);
                    preventDefault = true;
                }
            }
            if (preventDefault) {
                event.preventDefault();
            }
        };
        _this.onWindowMouseDown = function (event) {
            _this.mouseDownTarget = event.target;
        };
        _this.onMouseDown = function (event) {
            _this.mouseDownTarget = event.target;
            var mouseMapping = _this.mapping.mouse;
            if (!mouseMapping) {
                return;
            }
            var buttonKey = mouseButtons[event.button];
            var pressedMapping = mouseMapping.pressed;
            if (pressedMapping) {
                var action = pressedMapping[buttonKey];
                if (action) {
                    _this.state[action] = 1;
                }
            }
            var mousedownMapping = mouseMapping.mousedown;
            if (mousedownMapping) {
                var action = mousedownMapping[buttonKey];
                if (action) {
                    _this.state[action] = 1;
                }
                if (mousedownMapping.event) {
                    _this.handleEventMappings(mousedownMapping.event, event);
                }
                if (mousedownMapping.position) {
                    _this.handlePosition(mousedownMapping.position, event);
                }
            }
        };
        _this.onWindowMouseUp = function (event) {
            var canvas = _this.canvas;
            var mouseDownTarget = _this.mouseDownTarget;
            _this.mouseDownTarget = undefined;
            if (event.target === canvas || mouseDownTarget !== canvas) {
                return;
            }
            _this.onMouseUp(event);
        };
        _this.onMouseUp = function (event) {
            var mouseMapping = _this.mapping.mouse;
            if (!mouseMapping) {
                return;
            }
            var buttonKey = mouseButtons[event.button];
            var pressedMapping = mouseMapping.pressed;
            if (pressedMapping) {
                var action = pressedMapping[buttonKey];
                if (action) {
                    _this.state[action] = 0;
                }
            }
            var mouseupMapping = mouseMapping.mouseup;
            if (mouseupMapping) {
                var action = mouseupMapping[buttonKey];
                if (action) {
                    _this.state[action] = 1;
                }
                if (mouseupMapping.event) {
                    _this.handleEventMappings(mouseupMapping.event, event);
                }
                if (mouseupMapping.position) {
                    _this.handlePosition(mouseupMapping.position, event);
                }
            }
        };
        _this.onMouseMove = function (event) {
            event.stopPropagation();
            var mouseMapping = _this.mapping.mouse;
            if (!mouseMapping) {
                return;
            }
            var moveMapping = mouseMapping.move;
            if (!moveMapping) {
                return;
            }
            for (var key in moveMapping) {
                if (moveMapping.hasOwnProperty(key)) {
                    if (key === "event") {
                        _this.handleEventMappings(moveMapping.event, event);
                    }
                    else if (key === "movementX" || key === "movementY") {
                        _this.state[moveMapping[key]] += event[key];
                    }
                    else if (key === "normalizedMovementX") {
                        _this.state[moveMapping[key]] +=
                            -event.movementX / _this.canvas.clientWidth;
                    }
                    else if (key === "normalizedMovementY") {
                        _this.state[moveMapping[key]] +=
                            -event.movementY / _this.canvas.clientHeight;
                    }
                    else if (key === "position") {
                        _this.handlePosition(moveMapping.position, event);
                    }
                    else {
                        _this.state[moveMapping[key]] = event[key];
                    }
                }
            }
        };
        _this.onWheel = function (event) {
            var mouseMapping = _this.mapping.mouse;
            if (!mouseMapping) {
                return;
            }
            var wheelMapping = mouseMapping.wheel;
            if (!wheelMapping) {
                return;
            }
            for (var key in wheelMapping) {
                if (wheelMapping.hasOwnProperty(key)) {
                    if (key === "event") {
                        _this.handleEventMappings(wheelMapping.event, event);
                    }
                    else if (key === "deltaX" || key === "deltaY") {
                        _this.state[wheelMapping[key]] += event[key];
                    }
                    else if (key === "normalizedDeltaX") {
                        _this.state[wheelMapping[key]] = normalizeWheel(event.deltaX);
                    }
                    else if (key === "normalizedDeltaY") {
                        _this.state[wheelMapping[key]] = normalizeWheel(event.deltaY);
                    }
                    else {
                        _this.state[wheelMapping[key]] = event[key];
                    }
                }
            }
        };
        _this.onClick = function (event) {
            var mouseMapping = _this.mapping.mouse;
            if (!mouseMapping) {
                return;
            }
            var clickMapping = mouseMapping.click;
            if (clickMapping && clickMapping.event) {
                _this.handleEventMappings(clickMapping.event, event);
            }
            if (clickMapping.position) {
                _this.handlePosition(clickMapping.position, event);
            }
        };
        _this.onDoubleClick = function (event) {
            var mouseMapping = _this.mapping.mouse;
            if (!mouseMapping) {
                return;
            }
            var dblclickMapping = mouseMapping.dblclick;
            if (!dblclickMapping) {
                return;
            }
            if (dblclickMapping.event) {
                _this.handleEventMappings(dblclickMapping.event, event);
            }
            if (dblclickMapping.position) {
                _this.handlePosition(dblclickMapping.position, event);
            }
        };
        _this.onContextMenu = function (event) {
            event.preventDefault();
        };
        _this.onResize = function () {
            _this.boundingClientRect = _this.canvas.getBoundingClientRect();
        };
        _this.onWindowBlur = function () {
            for (var key in _this.initialState) {
                _this.state[key] = _this.initialState[key];
            }
        };
        _this.onGamepadConnected = function (event) {
            var e_6, _a;
            var gamepad = event.gamepad;
            try {
                for (var _b = __values(_this.registeredGamepads), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = _c.value, test = _d.test, key = _d.key, deviceMapping = _d.deviceMapping;
                    if (test(gamepad)) {
                        _this.connectedGamepads.push({
                            test: test,
                            gamepad: gamepad,
                            key: key,
                            deviceMapping: deviceMapping
                        });
                        return;
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        };
        _this.onGamepadDisconnected = function (event) {
            var gamepad = event.gamepad;
            var index = _this.connectedGamepads.findIndex(function (g) { return g.test(gamepad); });
            if (index !== -1) {
                _this.connectedGamepads.splice(index, 1);
            }
        };
        _this.canvas = canvas;
        _this.mappings = new Map();
        _this.mapping = {};
        _this.initialState = {};
        _this.state = {};
        _this.resetKeys = [];
        _this.boundingClientRect = _this.canvas.getBoundingClientRect();
        _this.mouseDownTarget = undefined;
        window.addEventListener("keydown", _this.onKeyDown);
        window.addEventListener("keyup", _this.onKeyUp);
        canvas.addEventListener("wheel", _this.onWheel);
        canvas.addEventListener("mousemove", _this.onMouseMove);
        canvas.addEventListener("mousedown", _this.onMouseDown);
        window.addEventListener("mousedown", _this.onWindowMouseDown);
        canvas.addEventListener("mouseup", _this.onMouseUp);
        window.addEventListener("mouseup", _this.onWindowMouseUp);
        canvas.addEventListener("dblclick", _this.onDoubleClick);
        canvas.addEventListener("click", _this.onClick);
        canvas.addEventListener("contextmenu", _this.onContextMenu);
        window.addEventListener("resize", _this.onResize);
        window.addEventListener("blur", _this.onWindowBlur);
        _this.vrDisplay = null;
        if ("getVRDisplays" in navigator) {
            window.addEventListener("vrdisplayconnect", function (event) {
                _this.vrDisplay = event.display;
                _this.emit("vrdisplayconnect", _this.vrDisplay);
            });
            window.addEventListener("vrdisplaydisconnect", function () {
                _this.emit("vrDisplaydisconnect");
            });
            window.addEventListener("vrdisplaypresentchange", function () {
                _this.emit("vrdisplaypresentchange");
            });
            window.addEventListener("vrdisplayactivate", function (event) {
                _this.vrDisplay = event.display;
                _this.vrDisplay.requestPresent([{ source: canvas }]);
                _this.emit("vrdisplayactivate");
            });
            navigator
                .getVRDisplays()
                .then(function (displays) {
                if (displays.length > 0) {
                    _this.vrDisplay = displays[0];
                    _this.emit("vrdisplayconnect", _this.vrDisplay);
                }
            })
                .catch(console.error);
        }
        _this.registeredGamepads = [];
        _this.connectedGamepads = [];
        try {
            for (var _c = __values(navigator.getGamepads()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var gamepad = _d.value;
                try {
                    for (var _e = __values(_this.registeredGamepads), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var _g = _f.value, test = _g.test, key = _g.key, deviceMapping = _g.deviceMapping;
                        if (test(gamepad)) {
                            _this.connectedGamepads.push({
                                test: test,
                                gamepad: gamepad,
                                key: key,
                                deviceMapping: deviceMapping
                            });
                            break;
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
        window.addEventListener("gamepadconnected", _this.onGamepadConnected);
        window.addEventListener("gamepaddisconnected", _this.onGamepadDisconnected);
        return _this;
    }
    InputManager.prototype.enableInputMapping = function (key, mapping) {
        this.mappings.set(key, mapping);
        this.setInputMapping(mergeMappings(this.mappings));
    };
    InputManager.prototype.disableInputMapping = function (key) {
        var e_7, _a;
        var mapping = this.mappings.get(key);
        if (mapping) {
            var state = this.state;
            var keyboard = mapping.keyboard, mouse = mapping.mouse, computed = mapping.computed;
            if (keyboard) {
                if (keyboard.pressed) {
                    deleteValues(state, keyboard.pressed);
                }
                if (keyboard.keyup) {
                    deleteValues(state, keyboard.keyup);
                }
                if (keyboard.keydown) {
                    deleteValues(state, keyboard.keydown);
                }
                if (keyboard.hotkeys) {
                    for (var binding in keyboard.hotkeys) {
                        Mousetrap_1.default.unbind(binding);
                    }
                    deleteValues(state, keyboard.hotkeys);
                }
                if (keyboard.globalHotkeys) {
                    for (var binding in keyboard.globalHotkeys) {
                        Mousetrap_1.default.unbindGlobal(binding);
                    }
                    deleteValues(state, keyboard.globalHotkeys);
                }
            }
            if (mouse) {
                if (mouse.click) {
                    deleteValues(state, mouse.click);
                }
                if (mouse.dblclick) {
                    deleteValues(state, mouse.dblclick);
                }
                if (mouse.move) {
                    deleteValues(state, mouse.move);
                }
                if (mouse.wheel) {
                    deleteValues(state, mouse.wheel);
                }
                if (mouse.pressed) {
                    deleteValues(state, mouse.pressed);
                }
                if (mouse.mouseup) {
                    deleteValues(state, mouse.mouseup);
                }
                if (mouse.mousedown) {
                    deleteValues(state, mouse.mousedown);
                }
            }
            if (computed) {
                try {
                    for (var computed_2 = __values(computed), computed_2_1 = computed_2.next(); !computed_2_1.done; computed_2_1 = computed_2.next()) {
                        var obj = computed_2_1.value;
                        delete state[obj.action];
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (computed_2_1 && !computed_2_1.done && (_a = computed_2.return)) _a.call(computed_2);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
            this.mappings.delete(key);
            this.setInputMapping(mergeMappings(this.mappings));
        }
    };
    InputManager.prototype.setInputMapping = function (mapping) {
        var e_8, _a;
        this.mapping = mapping;
        var initialState = {};
        var state = this.state;
        var resetKeys = [];
        var keyboard = mapping.keyboard;
        if (keyboard) {
            initializeValue(keyboard.pressed, initialState, state, resetKeys, 0, false);
            initializeValue(keyboard.keydown, initialState, state, resetKeys, 0, true);
            initializeValue(keyboard.keyup, initialState, state, resetKeys, 0, true);
            var hotkeys = keyboard.hotkeys;
            if (hotkeys) {
                var _loop_1 = function (binding) {
                    var action = hotkeys[binding];
                    Mousetrap_1.default.bind(binding, function () {
                        state[action] = true;
                        return false;
                    });
                    initialState[action] = false;
                    state[action] = false;
                    resetKeys.push(action);
                };
                for (var binding in hotkeys) {
                    _loop_1(binding);
                }
            }
            var globalHotkeys = keyboard.globalHotkeys;
            if (globalHotkeys) {
                var _loop_2 = function (binding) {
                    var action = globalHotkeys[binding];
                    Mousetrap_1.default.bindGlobal(binding, function () {
                        state[action] = true;
                        return false;
                    });
                    initialState[action] = false;
                    state[action] = false;
                    resetKeys.push(action);
                };
                for (var binding in globalHotkeys) {
                    _loop_2(binding);
                }
            }
        }
        var mouse = mapping.mouse;
        if (mouse) {
            initializeValue(mouse.click, initialState, state, resetKeys, 0, true);
            initializeValue(mouse.dblclick, initialState, state, resetKeys, 0, true);
            initializeValue(mouse.move, initialState, state, resetKeys, 0, true, false);
            initializeValue(mouse.wheel, initialState, state, resetKeys, 0, true);
            initializeValue(mouse.pressed, initialState, state, resetKeys, 0, false);
            initializeValue(mouse.mousedown, initialState, state, resetKeys, 0, true);
            initializeValue(mouse.mouseup, initialState, state, resetKeys, 0, true);
        }
        var computed = mapping.computed;
        if (computed) {
            try {
                for (var computed_3 = __values(computed), computed_3_1 = computed_3.next(); !computed_3_1.done; computed_3_1 = computed_3.next()) {
                    var computedProp = computed_3_1.value;
                    var action = computedProp.action, transform = computedProp.transform, defaultValue = computedProp.defaultValue, reset = computedProp.reset;
                    var value = defaultValue !== undefined
                        ? defaultValue
                        : transform(this, computedProp, null, null);
                    if (action === undefined) {
                        throw new Error("Action is undefined for " + computedProp);
                    }
                    initialState[action] = value;
                    state[action] = value;
                    if (reset) {
                        resetKeys.push(action);
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (computed_3_1 && !computed_3_1.done && (_a = computed_3.return)) _a.call(computed_3);
                }
                finally { if (e_8) throw e_8.error; }
            }
        }
        this.initialState = initialState;
        this.resetKeys = resetKeys;
    };
    InputManager.prototype.handleEventMappings = function (eventMappings, event) {
        for (var i = 0; i < eventMappings.length; i++) {
            var eventMapping = eventMappings[i];
            var handler = eventMapping.handler, action = eventMapping.action;
            var result = handler(event, this, eventMapping);
            if (action) {
                this.state[action] = result;
            }
        }
    };
    InputManager.prototype.handleKeyMappings = function (keyMappings, event, value) {
        var eventKey = event.key.toLowerCase();
        var preventDefault = false;
        for (var key in keyMappings) {
            var action = keyMappings[key];
            if (eventKey === key) {
                this.state[action] = value;
                preventDefault = true;
                continue;
            }
            var specialAlias = SPECIAL_ALIASES[key];
            if (eventKey === specialAlias) {
                this.state[action] = value;
                preventDefault = true;
            }
        }
        return preventDefault;
    };
    InputManager.prototype.handlePosition = function (positionAction, event) {
        var position = this.state[positionAction];
        if (position) {
            var rect = this.boundingClientRect;
            position.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            position.y = ((event.clientY - rect.top) / rect.height) * -2 + 1;
        }
    };
    InputManager.prototype.enterXR = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!("getVRDisplays" in navigator)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.vrDisplay.requestPresent([{ source: this.canvas }])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2: throw new Error("Webvr not supported.");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    InputManager.prototype.exitXR = function () {
        if ("getVRDisplays" in navigator) {
            if (!this.vrDisplay || !this.vrDisplay.isPresenting) {
                return false;
            }
            return this.vrDisplay.exitPresent();
        }
        return false;
    };
    InputManager.prototype.registerGamepad = function (key, test, deviceMapping) {
        this.registeredGamepads.push({ test: test, key: key, deviceMapping: deviceMapping });
    };
    InputManager.prototype.update = function (dt, time) {
        var connectedGamepads = this.connectedGamepads;
        for (var i = 0; i < connectedGamepads.length; i++) {
            var _a = connectedGamepads[i], gamepad = _a.gamepad, gamepadKey = _a.key, deviceMapping = _a.deviceMapping;
            var gamepadActionMapping = this.mapping.gamepads[gamepadKey];
            if (gamepadActionMapping) {
                for (var key in gamepadActionMapping) {
                    var action = gamepadActionMapping[key];
                    if (deviceMapping.buttons &&
                        deviceMapping.buttons[key] !== undefined) {
                        var button = deviceMapping.buttons[key];
                        this.state[action] = gamepad.buttons[button].pressed;
                    }
                    else if (deviceMapping.axes &&
                        deviceMapping.axes[key] !== undefined) {
                        var axis = deviceMapping.axes[key];
                        this.state[action] = gamepad.axes[axis];
                    }
                }
            }
        }
        var computed = this.mapping.computed;
        if (computed) {
            for (var i = 0; i < computed.length; i++) {
                var computedProp = computed[i];
                var action = computedProp.action, transform = computedProp.transform;
                this.state[action] = transform(this, computedProp, dt, time);
            }
        }
    };
    InputManager.prototype.reset = function () {
        for (var i = 0; i < this.resetKeys.length; i++) {
            var key = this.resetKeys[i];
            var actionState = this.state[key];
            var initialActionState = this.initialState[key];
            if (typeof actionState === "object" &&
                typeof this.initialState === "object") {
                if (actionState !== null && initialActionState !== null) {
                    this.state[key] = __assign({}, this.state[key], initialActionState);
                }
                else if (initialActionState !== null) {
                    this.state[key] = __assign({}, initialActionState);
                }
            }
            else {
                this.state[key] = initialActionState;
            }
        }
    };
    InputManager.prototype.get = function (key) {
        return this.state[key] || 0;
    };
    InputManager.prototype.dispose = function () {
        var canvas = this.canvas;
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
        canvas.removeEventListener("wheel", this.onWheel);
        canvas.removeEventListener("mousemove", this.onMouseMove);
        canvas.removeEventListener("mousedown", this.onMouseDown);
        window.removeEventListener("mousedown", this.onWindowMouseDown);
        canvas.removeEventListener("mouseup", this.onMouseUp);
        window.removeEventListener("mouseup", this.onWindowMouseUp);
        canvas.removeEventListener("dblclick", this.onDoubleClick);
        canvas.removeEventListener("click", this.onClick);
        canvas.removeEventListener("contextmenu", this.onContextMenu);
        window.removeEventListener("resize", this.onResize);
        window.removeEventListener("blur", this.onWindowBlur);
    };
    return InputManager;
}(eventemitter3_1.default));
exports.default = InputManager;
