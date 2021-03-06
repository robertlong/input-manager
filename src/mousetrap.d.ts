interface ExtendedKeyboardEvent extends KeyboardEvent {
  returnValue: boolean; // IE returnValue
}

interface MousetrapStatic {
  (el: Element): MousetrapInstance;
  new (el?: Element): MousetrapInstance;
  addKeycodes(keycodes: { [key: number]: string }): void;
  stopCallback: (e: ExtendedKeyboardEvent, element: Element, combo: string) => boolean;
  bind(keys: string|string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): void;
  unbind(keys: string|string[], action?: string): void;
  trigger(keys: string, action?: string): void;
  reset(): void;

  /** https://craig.is/killing/mice#extensions.global */
  bindGlobal(keyArray: string|string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): void;
  unbindGlobal(keyArray: string|string[], callback?: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): void;
}

interface MousetrapInstance {
  stopCallback: (e: ExtendedKeyboardEvent, element: Element, combo: string) => boolean;
  bind(keys: string|string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): void;
  unbind(keys: string|string[], action?: string): void;
  trigger(keys: string, action?: string): void;
  handleKey(character: string, modifiers: string[], e: ExtendedKeyboardEvent): void;
  reset(): void;
}

declare var Mousetrap: MousetrapStatic;

export default Mousetrap;