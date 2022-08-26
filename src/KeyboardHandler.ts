import {
  GlobalKeyboardListener,
  IGlobalKeyDownMap,
} from "node-global-key-listener";

export interface IKeyFuncs {
  [key: string]: (keyState: "DOWN" | "UP", keys: IGlobalKeyDownMap) => void;
}

class KeyboardHandler {
  keyFuncs: IKeyFuncs;
  _listener: GlobalKeyboardListener;
  constructor(keyFuncs: IKeyFuncs) {
    this._listener = new GlobalKeyboardListener();

    this.keyFuncs = keyFuncs;

    this._listener.addListener((e, down) => {
      console.log(e.rawKey._nameRaw);
      if (e.rawKey._nameRaw in this.keyFuncs) {
        this.keyFuncs[e.rawKey._nameRaw](e.state, down);
      }
    });
  }
}

export default KeyboardHandler;
