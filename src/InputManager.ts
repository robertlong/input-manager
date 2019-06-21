import Mousetrap from "./Mousetrap";
import EventEmitter from "eventemitter3";

export interface KeyboardRawEventMapping {
  reset: boolean;
  defaultValue: any;
  action: string;
  handler: (
    event: KeyboardEvent,
    input: InputManager,
    mapping: KeyboardRawEventMapping
  ) => any;
}

export interface KeyboardEventMapping {
  event?: KeyboardRawEventMapping[];
  [key: string]: string | KeyboardRawEventMapping[];
}

export interface KeyPressedMapping {
  [key: string]: string;
}

export interface KeyboardMapping {
  pressed?: KeyPressedMapping;
  keyup?: KeyboardEventMapping;
  keydown?: KeyboardEventMapping;
  hotkeys?: { [key: string]: string };
  globalHotkeys?: { [key: string]: string };
}

export interface MouseRawEventMapping {
  reset: boolean;
  defaultValue: any;
  action: string;
  handler: (
    event: MouseEvent,
    input: InputManager,
    mapping: MouseRawEventMapping
  ) => any;
}

export interface MouseEventMapping {
  event?: MouseRawEventMapping[];
  movementX?: string;
  movementY?: string;
  normalizedMovementX?: string;
  normalizedMovementY?: string;
  position?: string;
  [key: string]: string | MouseRawEventMapping[];
}

export interface WheelRawEventMapping {
  reset: boolean;
  defaultValue: any;
  action: string;
  handler: (
    event: WheelEvent,
    input: InputManager,
    mapping: WheelRawEventMapping
  ) => any;
}

export interface WheelEventMapping {
  event?: WheelRawEventMapping[];
  deltaX?: string;
  deltaY?: string;
  normalizedDeltaX?: string;
  normalizedDeltaY?: string;
  [key: string]: string | WheelRawEventMapping[];
}

export interface MouseButtonPressedMapping {
  [key: string]: string;
}

export interface MouseMapping {
  click?: MouseEventMapping;
  dblclick?: MouseEventMapping;
  move?: MouseEventMapping;
  wheel?: WheelEventMapping;
  pressed?: MouseButtonPressedMapping;
  mouseup?: MouseEventMapping;
  mousedown?: MouseEventMapping;
}

export interface GamepadMapping {
  [key: string]: string;
}

export type ComputedActionTransform = (
  input: InputManager,
  computedAction: ComputedAction,
  dt: number,
  time: number
) => void;

export interface ComputedAction {
  action: string;
  transform: ComputedActionTransform;
  defaultValue?: any;
  reset?: boolean;
}

export interface InputMapping {
  keyboard?: KeyboardMapping;
  mouse?: MouseMapping;
  gamepads?: {
    [gamepadId: string]: GamepadMapping;
  };
  computed?: ComputedAction[];
}

export interface GamepadDeviceMapping {
  buttons?: { [buttonKey: string]: number };
  axes?: { [axisKey: string]: number };
}

export type GamepadMappingTest = (gamepad: Gamepad) => boolean;

export interface ConnectedGamepad {
  test: GamepadMappingTest;
  gamepad: Gamepad;
  deviceMapping: GamepadDeviceMapping;
  key: string;
}

export interface RegisteredGamepad {
  test: GamepadMappingTest;
  deviceMapping: GamepadDeviceMapping;
  key: string;
}

function initializeValue(
  source:
    | MouseEventMapping
    | WheelEventMapping
    | KeyboardEventMapping
    | MouseButtonPressedMapping
    | KeyPressedMapping,
  initialState: { [action: string]: any },
  state: { [action: string]: any },
  resetKeys: string[],
  value: any,
  reset: boolean,
  resetPosition: boolean = true
) {
  if (!source) {
    return;
  }

  for (const sourceKey in source) {
    if (source.hasOwnProperty(sourceKey)) {
      const targetKey = source[sourceKey];

      if (sourceKey === "event") {
        for (const { defaultValue, action, reset: eventReset } of targetKey as
          | KeyboardRawEventMapping[]
          | WheelRawEventMapping[]
          | MouseRawEventMapping[]) {
          if (action !== undefined && defaultValue !== undefined) {
            initialState[action] = defaultValue;
            state[action] = defaultValue;

            if (eventReset) {
              resetKeys.push(action);
            }
          }
        }
        continue;
      } else if (sourceKey === "position") {
        initialState[targetKey as string] = { x: 0, y: 0 };
        state[targetKey as string] =
          state[targetKey as string] !== undefined
            ? state[targetKey as string]
            : { x: 0, y: 0 };

        if (resetPosition) {
          resetKeys.push(targetKey as string);
        }
        continue;
      }

      initialState[targetKey as string] = value;
      state[targetKey as string] =
        state[targetKey as string] !== undefined
          ? state[targetKey as string]
          : value;

      if (reset) {
        resetKeys.push(targetKey as string);
      }
    }
  }
}

function isInputSelected() {
  const el = document.activeElement;
  const nodeName = el.nodeName;
  return (
    (el as HTMLInputElement).isContentEditable ||
    nodeName === "INPUT" ||
    nodeName === "SELECT" ||
    nodeName === "TEXTAREA"
  );
}

function normalizeWheel(value: number) {
  if (value === 0) {
    return value;
  }

  return value > 0 ? 1 : -1;
}

function mergeMappings(mappings: Map<string, InputMapping>) {
  const output: InputMapping = {
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
    const { keyboard, mouse, computed, ...rest } = mapping;

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

function deleteValues(
  state: { [action: string]: any },
  mappingObj: { [key: string]: any }
) {
  for (const key in mappingObj) {
    const action = mappingObj[key];
    delete state[action];
  }
}

const mouseButtons = ["left", "middle", "right", "button4", "button5"];

const SPECIAL_ALIASES: { [key: string]: string } = {
  option: "alt",
  command: "meta",
  return: "enter",
  escape: "esc",
  plus: "+",
  mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
};

export default class InputManager extends EventEmitter {
  public canvas: HTMLCanvasElement;
  public mappings: Map<string, InputMapping>;
  public mapping: InputMapping;
  private initialState: { [action: string]: any };
  private state: { [action: string]: any };
  private resetKeys: string[];
  private boundingClientRect: ClientRect | DOMRect;
  private mouseDownTarget?: Element;
  private vrDisplay: VRDisplay;
  private connectedGamepads: ConnectedGamepad[];
  private registeredGamepads: RegisteredGamepad[];

  constructor(canvas: HTMLCanvasElement) {
    super();

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
      window.addEventListener("vrdisplayconnect", (event: VRDisplayEvent) => {
        this.vrDisplay = event.display;
        this.emit("vrdisplayconnect", this.vrDisplay);
      });

      window.addEventListener("vrdisplaydisconnect", () => {
        this.emit("vrDisplaydisconnect");
      });

      window.addEventListener("vrdisplaypresentchange", () => {
        this.emit("vrdisplaypresentchange");
      });

      window.addEventListener("vrdisplayactivate", (event: VRDisplayEvent) => {
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

  public enableInputMapping(key: string, mapping: InputMapping) {
    this.mappings.set(key, mapping);
    this.setInputMapping(mergeMappings(this.mappings));
  }

  public disableInputMapping(key: string) {
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

  private setInputMapping(mapping: InputMapping) {
    this.mapping = mapping;

    const initialState: { [action: string]: any } = {};
    const state = this.state;
    const resetKeys: string[] = [];

    const keyboard = mapping.keyboard;

    if (keyboard) {
      initializeValue(
        keyboard.pressed,
        initialState,
        state,
        resetKeys,
        0,
        false
      );
      initializeValue(
        keyboard.keydown,
        initialState,
        state,
        resetKeys,
        0,
        true
      );
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
      initializeValue(
        mouse.move,
        initialState,
        state,
        resetKeys,
        0,
        true,
        false
      );
      initializeValue(mouse.wheel, initialState, state, resetKeys, 0, true);
      initializeValue(mouse.pressed, initialState, state, resetKeys, 0, false);
      initializeValue(mouse.mousedown, initialState, state, resetKeys, 0, true);
      initializeValue(mouse.mouseup, initialState, state, resetKeys, 0, true);
    }

    const computed = mapping.computed;

    if (computed) {
      for (const computedProp of computed) {
        const { action, transform, defaultValue, reset } = computedProp;
        const value =
          defaultValue !== undefined
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

  private handleEventMappings(
    eventMappings:
      | KeyboardRawEventMapping[]
      | MouseRawEventMapping[]
      | WheelRawEventMapping[],
    event: MouseEvent | KeyboardEvent | WheelEvent
  ) {
    for (let i = 0; i < eventMappings.length; i++) {
      const eventMapping = eventMappings[i] as any;
      const { handler, action } = eventMapping;
      const result = handler(event as any, this, eventMapping);
      if (action) {
        this.state[action] = result;
      }
    }
  }

  private handleKeyMappings(
    keyMappings: KeyboardEventMapping,
    event: KeyboardEvent,
    value: any
  ) {
    const eventKey = event.key.toLowerCase();
    let preventDefault = false;

    for (const key in keyMappings) {
      const action = keyMappings[key] as string;

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

  private handlePosition(positionAction: string, event: MouseEvent) {
    const position = this.state[positionAction];

    if (position) {
      const rect = this.boundingClientRect;
      position.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      position.y = ((event.clientY - rect.top) / rect.height) * -2 + 1;
    }
  }

  private onKeyDown = (event: KeyboardEvent) => {
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

  private onKeyUp = (event: KeyboardEvent) => {
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

  private onWindowMouseDown = (event: MouseEvent) => {
    this.mouseDownTarget = event.target as Element;
  };

  private onMouseDown = (event: MouseEvent) => {
    this.mouseDownTarget = event.target as Element;

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
      const action = mousedownMapping[buttonKey] as string;

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

  private onWindowMouseUp = (event: MouseEvent) => {
    const canvas = this.canvas;
    const mouseDownTarget = this.mouseDownTarget;

    this.mouseDownTarget = undefined;

    if (event.target === canvas || mouseDownTarget !== canvas) {
      return;
    }

    this.onMouseUp(event);
  };

  private onMouseUp = (event: MouseEvent) => {
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
      const action = mouseupMapping[buttonKey] as string;

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

  private onMouseMove = (event: MouseEvent) => {
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
        } else if (key === "movementX" || key === "movementY") {
          this.state[moveMapping[key]] += event[key];
        } else if (key === "normalizedMovementX") {
          this.state[moveMapping[key]] +=
            -event.movementX / this.canvas.clientWidth;
        } else if (key === "normalizedMovementY") {
          this.state[moveMapping[key]] +=
            -event.movementY / this.canvas.clientHeight;
        } else if (key === "position") {
          this.handlePosition(moveMapping.position, event);
        } else {
          this.state[moveMapping[key] as string] = (event as any)[key];
        }
      }
    }
  };

  private onWheel = (event: WheelEvent) => {
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
        } else if (key === "deltaX" || key === "deltaY") {
          this.state[wheelMapping[key]] += event[key];
        } else if (key === "normalizedDeltaX") {
          this.state[wheelMapping[key]] = normalizeWheel(event.deltaX);
        } else if (key === "normalizedDeltaY") {
          this.state[wheelMapping[key]] = normalizeWheel(event.deltaY);
        } else {
          this.state[wheelMapping[key] as string] = (event as any)[key];
        }
      }
    }
  };

  private onClick = (event: MouseEvent) => {
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

  private onDoubleClick = (event: MouseEvent) => {
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

  private onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  private onResize = () => {
    this.boundingClientRect = this.canvas.getBoundingClientRect();
  };

  private onWindowBlur = () => {
    for (const key in this.initialState) {
      this.state[key] = this.initialState[key];
    }
  };

  public async enterXR() {
    if ("getVRDisplays" in navigator) {
      await this.vrDisplay.requestPresent([{ source: this.canvas }]);
    } else {
      throw new Error("Webvr not supported.");
    }
  }

  public exitXR() {
    if ("getVRDisplays" in navigator) {
      if (!this.vrDisplay || !this.vrDisplay.isPresenting) {
        return false;
      }
      return this.vrDisplay.exitPresent();
    }

    return false;
  }

  public registerGamepad(
    key: string,
    test: GamepadMappingTest,
    deviceMapping: GamepadDeviceMapping
  ) {
    this.registeredGamepads.push({ test, key, deviceMapping });
  }

  private onGamepadConnected = (event: GamepadEvent) => {
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

  private onGamepadDisconnected = (event: GamepadEvent) => {
    const gamepad = event.gamepad;
    const index = this.connectedGamepads.findIndex(g => g.test(gamepad));
    if (index !== -1) {
      this.connectedGamepads.splice(index, 1);
    }
  };

  public update(dt: number, time: number) {
    const connectedGamepads = this.connectedGamepads;

    if (connectedGamepads.length > 0 && this.mapping.gamepads) {
      const gamepads = navigator.getGamepads();

      for (let i = 0; i < connectedGamepads.length; i++) {
        const {
          gamepad: initialGamepad,
          key: gamepadKey,
          deviceMapping
        } = connectedGamepads[i];
        const gamepadActionMapping = this.mapping.gamepads[gamepadKey];
        const gamepad = gamepads[initialGamepad.index];

        if (gamepadActionMapping) {
          for (const key in gamepadActionMapping) {
            const action = gamepadActionMapping[key];

            if (
              deviceMapping.buttons &&
              deviceMapping.buttons[key] !== undefined
            ) {
              const button = deviceMapping.buttons[key];
              this.state[action] = gamepad.buttons[button].pressed;
            } else if (
              deviceMapping.axes &&
              deviceMapping.axes[key] !== undefined
            ) {
              const axis = deviceMapping.axes[key];
              this.state[action] = gamepad.axes[axis];
            }
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

  public reset() {
    for (let i = 0; i < this.resetKeys.length; i++) {
      const key = this.resetKeys[i];

      const actionState = this.state[key];
      const initialActionState = this.initialState[key];

      if (
        typeof actionState === "object" &&
        typeof this.initialState === "object"
      ) {
        if (actionState !== null && initialActionState !== null) {
          this.state[key] = { ...this.state[key], ...initialActionState };
        } else if (initialActionState !== null) {
          this.state[key] = { ...initialActionState };
        }
      } else {
        this.state[key] = initialActionState;
      }
    }
  }

  public get(key: string) {
    return this.state[key] || 0;
  }

  public dispose() {
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
