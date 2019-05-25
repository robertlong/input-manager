var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
import Mousetrap from "./Mousetrap";
import EventEmitter from "eventemitter3";
function initializeValue(source, initialState, state, resetKeys, value, reset, resetPosition = true) {
    if (!source) {
        return;
    }
    for (const sourceKey in source) {
        if (source.hasOwnProperty(sourceKey)) {
            const targetKey = source[sourceKey];
            if (sourceKey === "event") {
                for (const { defaultValue, action, reset: eventReset } of targetKey) {
                    if (action !== undefined && defaultValue !== undefined) {
                        initialState[action] = defaultValue;
                        state[action] = defaultValue;
                        if (eventReset) {
                            resetKeys.push(action);
                        }
                    }
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
    const el = document.activeElement;
    const nodeName = el.nodeName;
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
    const output = {
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
    for (const mapping of mappings.values()) {
        const { keyboard, mouse, computed } = mapping, rest = __rest(mapping, ["keyboard", "mouse", "computed"]);
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
            for (const obj of computed) {
                output.computed.push(obj);
            }
        }
    }
    return output;
}
function deleteValues(state, mappingObj) {
    for (const key in mappingObj) {
        const action = mappingObj[key];
        delete state[action];
    }
}
const mouseButtons = ["left", "middle", "right", "button4", "button5"];
const SPECIAL_ALIASES = {
    option: "alt",
    command: "meta",
    return: "enter",
    escape: "esc",
    plus: "+",
    mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
};
export default class InputManager extends EventEmitter {
    constructor(canvas) {
        super();
        this.onKeyDown = (event) => {
            if (isInputSelected()) {
                return;
            }
            let preventDefault = false;
            const keyboardMapping = this.mapping.keyboard;
            if (!keyboardMapping) {
                return;
            }
            const pressedMapping = keyboardMapping.pressed;
            if (pressedMapping) {
                preventDefault = this.handleKeyMappings(pressedMapping, event, 1);
            }
            const keydownMapping = keyboardMapping.keydown;
            if (keydownMapping) {
                preventDefault = this.handleKeyMappings(keydownMapping, event, 1);
                if (keydownMapping.event) {
                    this.handleEventMappings(keydownMapping.event, event);
                    preventDefault = true;
                }
            }
            if (preventDefault) {
                event.preventDefault();
            }
        };
        this.onKeyUp = (event) => {
            if (isInputSelected()) {
                return;
            }
            let preventDefault = false;
            const keyboardMapping = this.mapping.keyboard;
            if (!keyboardMapping) {
                return;
            }
            const pressedMapping = keyboardMapping.pressed;
            if (pressedMapping) {
                preventDefault = this.handleKeyMappings(pressedMapping, event, 0);
            }
            const keyupMapping = keyboardMapping.keyup;
            if (keyupMapping) {
                preventDefault = this.handleKeyMappings(keyupMapping, event, 0);
                if (keyupMapping.event) {
                    this.handleEventMappings(keyupMapping.event, event);
                    preventDefault = true;
                }
            }
            if (preventDefault) {
                event.preventDefault();
            }
        };
        this.onWindowMouseDown = (event) => {
            this.mouseDownTarget = event.target;
        };
        this.onMouseDown = (event) => {
            this.mouseDownTarget = event.target;
            const mouseMapping = this.mapping.mouse;
            if (!mouseMapping) {
                return;
            }
            const buttonKey = mouseButtons[event.button];
            const pressedMapping = mouseMapping.pressed;
            if (pressedMapping) {
                const action = pressedMapping[buttonKey];
                if (action) {
                    this.state[action] = 1;
                }
            }
            const mousedownMapping = mouseMapping.mousedown;
            if (mousedownMapping) {
                const action = mousedownMapping[buttonKey];
                if (action) {
                    this.state[action] = 1;
                }
                if (mousedownMapping.event) {
                    this.handleEventMappings(mousedownMapping.event, event);
                }
                if (mousedownMapping.position) {
                    this.handlePosition(mousedownMapping.position, event);
                }
            }
        };
        this.onWindowMouseUp = (event) => {
            const canvas = this.canvas;
            const mouseDownTarget = this.mouseDownTarget;
            this.mouseDownTarget = undefined;
            if (event.target === canvas || mouseDownTarget !== canvas) {
                return;
            }
            this.onMouseUp(event);
        };
        this.onMouseUp = (event) => {
            const mouseMapping = this.mapping.mouse;
            if (!mouseMapping) {
                return;
            }
            const buttonKey = mouseButtons[event.button];
            const pressedMapping = mouseMapping.pressed;
            if (pressedMapping) {
                const action = pressedMapping[buttonKey];
                if (action) {
                    this.state[action] = 0;
                }
            }
            const mouseupMapping = mouseMapping.mouseup;
            if (mouseupMapping) {
                const action = mouseupMapping[buttonKey];
                if (action) {
                    this.state[action] = 1;
                }
                if (mouseupMapping.event) {
                    this.handleEventMappings(mouseupMapping.event, event);
                }
                if (mouseupMapping.position) {
                    this.handlePosition(mouseupMapping.position, event);
                }
            }
        };
        this.onMouseMove = (event) => {
            event.stopPropagation();
            const mouseMapping = this.mapping.mouse;
            if (!mouseMapping) {
                return;
            }
            const moveMapping = mouseMapping.move;
            if (!moveMapping) {
                return;
            }
            for (const key in moveMapping) {
                if (moveMapping.hasOwnProperty(key)) {
                    if (key === "event") {
                        this.handleEventMappings(moveMapping.event, event);
                    }
                    else if (key === "movementX" || key === "movementY") {
                        this.state[moveMapping[key]] += event[key];
                    }
                    else if (key === "normalizedMovementX") {
                        this.state[moveMapping[key]] +=
                            -event.movementX / this.canvas.clientWidth;
                    }
                    else if (key === "normalizedMovementY") {
                        this.state[moveMapping[key]] +=
                            -event.movementY / this.canvas.clientHeight;
                    }
                    else if (key === "position") {
                        this.handlePosition(moveMapping.position, event);
                    }
                    else {
                        this.state[moveMapping[key]] = event[key];
                    }
                }
            }
        };
        this.onWheel = (event) => {
            const mouseMapping = this.mapping.mouse;
            if (!mouseMapping) {
                return;
            }
            const wheelMapping = mouseMapping.wheel;
            if (!wheelMapping) {
                return;
            }
            for (const key in wheelMapping) {
                if (wheelMapping.hasOwnProperty(key)) {
                    if (key === "event") {
                        this.handleEventMappings(wheelMapping.event, event);
                    }
                    else if (key === "deltaX" || key === "deltaY") {
                        this.state[wheelMapping[key]] += event[key];
                    }
                    else if (key === "normalizedDeltaX") {
                        this.state[wheelMapping[key]] = normalizeWheel(event.deltaX);
                    }
                    else if (key === "normalizedDeltaY") {
                        this.state[wheelMapping[key]] = normalizeWheel(event.deltaY);
                    }
                    else {
                        this.state[wheelMapping[key]] = event[key];
                    }
                }
            }
        };
        this.onClick = (event) => {
            const mouseMapping = this.mapping.mouse;
            if (!mouseMapping) {
                return;
            }
            const clickMapping = mouseMapping.click;
            if (clickMapping && clickMapping.event) {
                this.handleEventMappings(clickMapping.event, event);
            }
            if (clickMapping.position) {
                this.handlePosition(clickMapping.position, event);
            }
        };
        this.onDoubleClick = (event) => {
            const mouseMapping = this.mapping.mouse;
            if (!mouseMapping) {
                return;
            }
            const dblclickMapping = mouseMapping.dblclick;
            if (!dblclickMapping) {
                return;
            }
            if (dblclickMapping.event) {
                this.handleEventMappings(dblclickMapping.event, event);
            }
            if (dblclickMapping.position) {
                this.handlePosition(dblclickMapping.position, event);
            }
        };
        this.onContextMenu = (event) => {
            event.preventDefault();
        };
        this.onResize = () => {
            this.boundingClientRect = this.canvas.getBoundingClientRect();
        };
        this.onWindowBlur = () => {
            for (const key in this.initialState) {
                this.state[key] = this.initialState[key];
            }
        };
        this.onGamepadConnected = (event) => {
            const gamepad = event.gamepad;
            for (const { test, key, deviceMapping } of this.registeredGamepads) {
                if (test(gamepad)) {
                    this.connectedGamepads.push({
                        test,
                        gamepad,
                        key,
                        deviceMapping
                    });
                    return;
                }
            }
        };
        this.onGamepadDisconnected = (event) => {
            const gamepad = event.gamepad;
            const index = this.connectedGamepads.findIndex(g => g.test(gamepad));
            if (index !== -1) {
                this.connectedGamepads.splice(index, 1);
            }
        };
        this.canvas = canvas;
        this.mappings = new Map();
        this.mapping = {};
        this.initialState = {};
        this.state = {};
        this.resetKeys = [];
        this.boundingClientRect = this.canvas.getBoundingClientRect();
        this.mouseDownTarget = undefined;
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        canvas.addEventListener("wheel", this.onWheel);
        canvas.addEventListener("mousemove", this.onMouseMove);
        canvas.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mousedown", this.onWindowMouseDown);
        canvas.addEventListener("mouseup", this.onMouseUp);
        window.addEventListener("mouseup", this.onWindowMouseUp);
        canvas.addEventListener("dblclick", this.onDoubleClick);
        canvas.addEventListener("click", this.onClick);
        canvas.addEventListener("contextmenu", this.onContextMenu);
        window.addEventListener("resize", this.onResize);
        window.addEventListener("blur", this.onWindowBlur);
        this.vrDisplay = null;
        if ("getVRDisplays" in navigator) {
            window.addEventListener("vrdisplayconnect", (event) => {
                this.vrDisplay = event.display;
                this.emit("vrdisplayconnect", this.vrDisplay);
            });
            window.addEventListener("vrdisplaydisconnect", () => {
                this.emit("vrDisplaydisconnect");
            });
            window.addEventListener("vrdisplaypresentchange", () => {
                this.emit("vrdisplaypresentchange");
            });
            window.addEventListener("vrdisplayactivate", (event) => {
                this.vrDisplay = event.display;
                this.vrDisplay.requestPresent([{ source: canvas }]);
                this.emit("vrdisplayactivate");
            });
            navigator
                .getVRDisplays()
                .then(displays => {
                if (displays.length > 0) {
                    this.vrDisplay = displays[0];
                    this.emit("vrdisplayconnect", this.vrDisplay);
                }
            })
                .catch(console.error);
        }
        this.registeredGamepads = [];
        this.connectedGamepads = [];
        for (const gamepad of navigator.getGamepads()) {
            for (const { test, key, deviceMapping } of this.registeredGamepads) {
                if (test(gamepad)) {
                    this.connectedGamepads.push({
                        test,
                        gamepad,
                        key,
                        deviceMapping
                    });
                    break;
                }
            }
        }
        window.addEventListener("gamepadconnected", this.onGamepadConnected);
        window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected);
    }
    enableInputMapping(key, mapping) {
        this.mappings.set(key, mapping);
        this.setInputMapping(mergeMappings(this.mappings));
    }
    disableInputMapping(key) {
        const mapping = this.mappings.get(key);
        if (mapping) {
            const state = this.state;
            const { keyboard, mouse, computed } = mapping;
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
                    for (const binding in keyboard.hotkeys) {
                        Mousetrap.unbind(binding);
                    }
                    deleteValues(state, keyboard.hotkeys);
                }
                if (keyboard.globalHotkeys) {
                    for (const binding in keyboard.globalHotkeys) {
                        Mousetrap.unbindGlobal(binding);
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
                for (const obj of computed) {
                    delete state[obj.action];
                }
            }
            this.mappings.delete(key);
            this.setInputMapping(mergeMappings(this.mappings));
        }
    }
    setInputMapping(mapping) {
        this.mapping = mapping;
        const initialState = {};
        const state = this.state;
        const resetKeys = [];
        const keyboard = mapping.keyboard;
        if (keyboard) {
            initializeValue(keyboard.pressed, initialState, state, resetKeys, 0, false);
            initializeValue(keyboard.keydown, initialState, state, resetKeys, 0, true);
            initializeValue(keyboard.keyup, initialState, state, resetKeys, 0, true);
            const hotkeys = keyboard.hotkeys;
            if (hotkeys) {
                for (const binding in hotkeys) {
                    const action = hotkeys[binding];
                    Mousetrap.bind(binding, () => {
                        state[action] = true;
                        return false;
                    });
                    initialState[action] = false;
                    state[action] = false;
                    resetKeys.push(action);
                }
            }
            const globalHotkeys = keyboard.globalHotkeys;
            if (globalHotkeys) {
                for (const binding in globalHotkeys) {
                    const action = globalHotkeys[binding];
                    Mousetrap.bindGlobal(binding, () => {
                        state[action] = true;
                        return false;
                    });
                    initialState[action] = false;
                    state[action] = false;
                    resetKeys.push(action);
                }
            }
        }
        const mouse = mapping.mouse;
        if (mouse) {
            initializeValue(mouse.click, initialState, state, resetKeys, 0, true);
            initializeValue(mouse.dblclick, initialState, state, resetKeys, 0, true);
            initializeValue(mouse.move, initialState, state, resetKeys, 0, true, false);
            initializeValue(mouse.wheel, initialState, state, resetKeys, 0, true);
            initializeValue(mouse.pressed, initialState, state, resetKeys, 0, false);
            initializeValue(mouse.mousedown, initialState, state, resetKeys, 0, true);
            initializeValue(mouse.mouseup, initialState, state, resetKeys, 0, true);
        }
        const computed = mapping.computed;
        if (computed) {
            for (const computedProp of computed) {
                const { action, transform, defaultValue, reset } = computedProp;
                const value = defaultValue !== undefined
                    ? defaultValue
                    : transform(this, computedProp, null, null);
                if (action === undefined) {
                    throw new Error(`Action is undefined for ${computedProp}`);
                }
                initialState[action] = value;
                state[action] = value;
                if (reset) {
                    resetKeys.push(action);
                }
            }
        }
        this.initialState = initialState;
        this.resetKeys = resetKeys;
    }
    handleEventMappings(eventMappings, event) {
        for (let i = 0; i < eventMappings.length; i++) {
            const eventMapping = eventMappings[i];
            const { handler, action } = eventMapping;
            const result = handler(event, this, eventMapping);
            if (action) {
                this.state[action] = result;
            }
        }
    }
    handleKeyMappings(keyMappings, event, value) {
        const eventKey = event.key.toLowerCase();
        let preventDefault = false;
        for (const key in keyMappings) {
            const action = keyMappings[key];
            if (eventKey === key) {
                this.state[action] = value;
                preventDefault = true;
                continue;
            }
            const specialAlias = SPECIAL_ALIASES[key];
            if (eventKey === specialAlias) {
                this.state[action] = value;
                preventDefault = true;
            }
        }
        return preventDefault;
    }
    handlePosition(positionAction, event) {
        const position = this.state[positionAction];
        if (position) {
            const rect = this.boundingClientRect;
            position.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            position.y = ((event.clientY - rect.top) / rect.height) * -2 + 1;
        }
    }
    enterXR() {
        return __awaiter(this, void 0, void 0, function* () {
            if ("getVRDisplays" in navigator) {
                yield this.vrDisplay.requestPresent([{ source: this.canvas }]);
            }
            else {
                throw new Error("Webvr not supported.");
            }
        });
    }
    exitXR() {
        if ("getVRDisplays" in navigator) {
            if (!this.vrDisplay || !this.vrDisplay.isPresenting) {
                return false;
            }
            return this.vrDisplay.exitPresent();
        }
        return false;
    }
    registerGamepad(key, test, deviceMapping) {
        this.registeredGamepads.push({ test, key, deviceMapping });
    }
    update(dt, time) {
        const connectedGamepads = this.connectedGamepads;
        for (let i = 0; i < connectedGamepads.length; i++) {
            const { gamepad, key: gamepadKey, deviceMapping } = connectedGamepads[i];
            const gamepadActionMapping = this.mapping.gamepads[gamepadKey];
            if (gamepadActionMapping) {
                for (const key in gamepadActionMapping) {
                    const action = gamepadActionMapping[key];
                    if (deviceMapping.buttons &&
                        deviceMapping.buttons[key] !== undefined) {
                        const button = deviceMapping.buttons[key];
                        this.state[action] = gamepad.buttons[button].pressed;
                    }
                    else if (deviceMapping.axes &&
                        deviceMapping.axes[key] !== undefined) {
                        const axis = deviceMapping.axes[key];
                        this.state[action] = gamepad.axes[axis];
                    }
                }
            }
        }
        const computed = this.mapping.computed;
        if (computed) {
            for (let i = 0; i < computed.length; i++) {
                const computedProp = computed[i];
                const { action, transform } = computedProp;
                this.state[action] = transform(this, computedProp, dt, time);
            }
        }
    }
    reset() {
        for (let i = 0; i < this.resetKeys.length; i++) {
            const key = this.resetKeys[i];
            const actionState = this.state[key];
            const initialActionState = this.initialState[key];
            if (typeof actionState === "object" &&
                typeof this.initialState === "object") {
                if (actionState !== null && initialActionState !== null) {
                    this.state[key] = Object.assign({}, this.state[key], initialActionState);
                }
                else if (initialActionState !== null) {
                    this.state[key] = Object.assign({}, initialActionState);
                }
            }
            else {
                this.state[key] = initialActionState;
            }
        }
    }
    get(key) {
        return this.state[key] || 0;
    }
    dispose() {
        const canvas = this.canvas;
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
    }
}
