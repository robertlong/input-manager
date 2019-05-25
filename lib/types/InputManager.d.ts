import EventEmitter from "eventemitter3";
export interface KeyboardRawEventMapping {
    reset: boolean;
    defaultValue: any;
    action: string;
    handler: (event: KeyboardEvent, input: InputManager, mapping: KeyboardRawEventMapping) => any;
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
    hotkeys?: {
        [key: string]: string;
    };
    globalHotkeys?: {
        [key: string]: string;
    };
}
export interface MouseRawEventMapping {
    reset: boolean;
    defaultValue: any;
    action: string;
    handler: (event: MouseEvent, input: InputManager, mapping: MouseRawEventMapping) => any;
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
    handler: (event: WheelEvent, input: InputManager, mapping: WheelRawEventMapping) => any;
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
export declare type ComputedActionTransform = (input: InputManager, computedAction: ComputedAction, dt: number, time: number) => void;
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
    buttons?: {
        [buttonKey: string]: number;
    };
    axes?: {
        [axisKey: string]: number;
    };
}
export declare type GamepadMappingTest = (gamepad: Gamepad) => boolean;
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
export default class InputManager extends EventEmitter {
    canvas: HTMLCanvasElement;
    mappings: Map<string, InputMapping>;
    mapping: InputMapping;
    private initialState;
    private state;
    private resetKeys;
    private boundingClientRect;
    private mouseDownTarget?;
    private vrDisplay;
    private connectedGamepads;
    private registeredGamepads;
    constructor(canvas: HTMLCanvasElement);
    enableInputMapping(key: string, mapping: InputMapping): void;
    disableInputMapping(key: string): void;
    private setInputMapping;
    private handleEventMappings;
    private handleKeyMappings;
    private handlePosition;
    private onKeyDown;
    private onKeyUp;
    private onWindowMouseDown;
    private onMouseDown;
    private onWindowMouseUp;
    private onMouseUp;
    private onMouseMove;
    private onWheel;
    private onClick;
    private onDoubleClick;
    private onContextMenu;
    private onResize;
    private onWindowBlur;
    enterXR(): Promise<void>;
    exitXR(): false | Promise<void>;
    registerGamepad(key: string, test: GamepadMappingTest, deviceMapping: GamepadDeviceMapping): void;
    private onGamepadConnected;
    private onGamepadDisconnected;
    update(dt: number, time: number): void;
    reset(): void;
    get(key: string): any;
    dispose(): void;
}
