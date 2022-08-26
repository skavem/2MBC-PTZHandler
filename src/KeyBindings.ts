import { moveSideEnum } from "./Interfaces";
import { IGlobalKeyDownMap } from "node-global-key-listener";
import { IKeyFuncs } from "./KeyboardHandler";
import { IPTZHandler } from "./PtzHandler";

const bindings = function (ptz: IPTZHandler) {
  const convertKeysToMoveSpeed = (keys: IGlobalKeyDownMap) => {
    if (keys["RIGHT SHIFT"]) return ptz.MoveMaxSpeed;
    if (keys["RIGHT CTRL"]) return 3;
    return 0;
  };

  const converKeysToFocusZoomSpeed = (keys: IGlobalKeyDownMap) => {
    if (keys["RIGHT SHIFT"]) return ptz.FocusZoomMaxSpeed;
    if (keys["RIGHT CTRL"]) return 2;
    return 0;
  };

  const keys: IKeyFuncs = {
    VK_UP: (keyState, keys) => {
      if (keyState === "DOWN") {
        ptz.moveUp(convertKeysToMoveSpeed(keys));
      } else {
        ptz.stopMoveSide(moveSideEnum.UP);
      }
    },

    VK_DOWN: (keyState, keys) => {
      if (keyState === "DOWN") {
        ptz.moveDown(convertKeysToMoveSpeed(keys));
      } else {
        ptz.stopMoveSide(moveSideEnum.DOWN);
      }
    },

    VK_LEFT: (keyState, keys) => {
      if (keyState === "DOWN") {
        ptz.moveLeft(convertKeysToMoveSpeed(keys));
      } else {
        ptz.stopMoveSide(moveSideEnum.LEFT);
      }
    },

    VK_RIGHT: (keyState, keys) => {
      if (keyState === "DOWN") {
        ptz.moveRight(convertKeysToMoveSpeed(keys));
      } else {
        ptz.stopMoveSide(moveSideEnum.RIGHT);
      }
    },

    VK_RSHIFT: (keyState, keys) => {
      ptz.changeMoveSpeed(
        keyState === "DOWN" ? ptz.MoveMaxSpeed : ptz.MoveMinSpeed
      );
      ptz.changeZoomSpeed(
        keyState === "DOWN" ? ptz.FocusZoomMaxSpeed : ptz.FocusZoomMinSpeed
      );
      ptz.changeFocusSpeed(keyState === "DOWN" ? ptz.FocusZoomMaxSpeed : ptz.FocusZoomMinSpeed)
    },
    
    VK_RCONTROL: (keyState, keys) => {
      ptz.changeMoveSpeed(keyState === "DOWN" ? 3 : ptz.MoveMinSpeed);
      ptz.changeZoomSpeed(keyState === "DOWN" ? 2 : ptz.FocusZoomMinSpeed);
      ptz.changeFocusSpeed(keyState === "DOWN" ? 2 : ptz.FocusZoomMinSpeed)
    },
    
    VK_PRIOR: (keyState, keys) => {
      if (keyState === "DOWN") {
        ptz.zoomIn(converKeysToFocusZoomSpeed(keys));
      } else {
        ptz.stopZoom();
      }
    },
    
    VK_NEXT: (keyState, keys) => {
      if (keyState === "DOWN") {
        ptz.zoomOut(converKeysToFocusZoomSpeed(keys));
      } else {
        ptz.stopZoom();
      }
    },
    
    VK_HOME: (keyState, keys) => {
      if (keyState === "DOWN") {
        ptz.focusIn(converKeysToFocusZoomSpeed(keys));
      } else {
        ptz.stopFocus();
      }
    },
    
    VK_END: (keyState, keys) => {
      if (keyState === "DOWN") {
        ptz.focusOut(converKeysToFocusZoomSpeed(keys));
      } else {
        ptz.stopFocus();
      }
    },
    
    VK_SCROLL: (keyState, keys) => {
      if (keyState === "UP") {
        ptz.autoFocus()
      }
    },

    VK_INSERT: (keyState, keys) => {
      if (keyState === 'UP') ptz.brightnessUp()
    },

    VK_DELETE: (keyState, keys) => {
      if (keyState === 'UP') ptz.brightnessDown()
    }
  };

  for (let i = 0; i < 10; i++) {
    keys[`VK_NUMPAD${i}`] = (keyState, keys) => {
      if (keyState === "UP") {
        if (keys["RIGHT CTRL"]) {
          ptz.savePreset(i);
        } else {
          ptz.goToPreset(i);
        }
      }
    };
  }

  return keys;
};

export default bindings;
