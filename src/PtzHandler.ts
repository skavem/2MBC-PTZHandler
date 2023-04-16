import {
  IPtzController,
  moveSideEnum,
  zoomSideEnum,
  focusModeEnum,
  focusSideEnum,
} from "./Interfaces";

export interface IMoveSide {
  side: moveSideEnum;
  speed: number;
}

export interface IZoomSide {
  side: zoomSideEnum;
  speed: number;
}

export interface IFocusSide {
  side: focusSideEnum;
  speed: number;
}

export interface IPTZHandler {
  MoveMinSpeed: number;
  MoveMaxSpeed: number;
  FocusZoomMinSpeed: number;
  FocusZoomMaxSpeed: number;

  moveUp: (speed: number) => void;
  moveDown: (speed: number) => void;
  moveLeft: (speed: number) => void;
  moveRight: (speed: number) => void;
  stopMoveSide: (side: moveSideEnum) => void;
  changeMoveSpeed: (speed: number) => void;

  goToPreset: (preset: number) => void;
  savePreset: (preset: number) => void;

  focusIn: (speed: number) => void;
  focusOut: (speed: number) => void;
  stopFocus: () => void;
  changeFocusSpeed: (speed: number) => void;
  autoFocus: () => void;

  zoomIn: (speed: number) => void;
  zoomOut: (speed: number) => void;
  stopZoom: () => void;
  changeZoomSpeed: (speed: number) => void;

  brightnessUp: () => void;
  brightnessDown: () => void;
}

class PtzHandler implements IPTZHandler {
  controller: IPtzController;
  MoveMinSpeed = 0;
  MoveMaxSpeed = 23;
  FocusZoomMinSpeed = 0;
  FocusZoomMaxSpeed = 7;
  brightness = 7;
  movingSides: IMoveSide[];
  zoomSide: IZoomSide | null = null;
  focusSide: IFocusSide | null = null;
  goToPreset;
  savePreset;

  constructor(PtzController: IPtzController) {
    this.controller = PtzController;
    this.movingSides = [];
    this.goToPreset = this.controller.goToPreset.bind(PtzController);
    this.savePreset = this.controller.savePreset.bind(PtzController);
    this.controller.setBrightness(this.brightness)
  }

  _normalizeZoomFocusSpeed(speed: number) {
    if (speed > this.FocusZoomMaxSpeed) speed = this.FocusZoomMaxSpeed;
    if (speed < this.FocusZoomMinSpeed) speed = this.FocusZoomMinSpeed;
    return speed;
  }

  zoomIn(speed: number = 1) {
    if (this.zoomSide !== null && this.zoomSide.side === zoomSideEnum.OUT)
      return;
    speed = this._normalizeZoomFocusSpeed(speed);
    this.zoomSide = { side: zoomSideEnum.IN, speed };
    this.controller.zoom(zoomSideEnum.IN, speed);
  }

  zoomOut(speed: number = 1) {
    if (this.zoomSide !== null && this.zoomSide.side === zoomSideEnum.IN)
      return;
    speed = this._normalizeZoomFocusSpeed(speed);
    this.zoomSide = { side: zoomSideEnum.OUT, speed };
    this.controller.zoom(zoomSideEnum.OUT, speed);
  }

  changeZoomSpeed(speed: number) {
    if (this.zoomSide === null) return;
    this.controller.zoom(this.zoomSide.side, speed);
  }

  stopZoom() {
    this.zoomSide = null;
    this.controller.zoom(zoomSideEnum.STOP, this.FocusZoomMaxSpeed);
  }

  focusIn(speed: number = 1) {
    if (
      this.focusSide !== null &&
      (this.focusSide.side === focusSideEnum.OUT ||
        this.focusSide.speed === speed)
    )
      return;
    speed = this._normalizeZoomFocusSpeed(speed);
    this.focusSide = { side: focusSideEnum.IN, speed };
    this.controller.focus(focusSideEnum.IN, speed);
  }

  focusOut(speed: number = 1) {
    if (
      this.focusSide !== null &&
      (this.focusSide.side === focusSideEnum.IN ||
        this.focusSide.speed === speed)
    )
      return;
    speed = this._normalizeZoomFocusSpeed(speed);
    this.focusSide = { side: focusSideEnum.OUT, speed };
    this.controller.focus(focusSideEnum.OUT, speed);
  }

  changeFocusSpeed(speed: number) {
    if (this.focusSide === null) return;
    this.controller.focus(this.focusSide.side, speed);
  }

  stopFocus() {
    this.focusSide = null;
    this.controller.focus(focusSideEnum.STOP, this.FocusZoomMaxSpeed);
  }

  autoFocus() {
    this.controller.setFocusMode(focusModeEnum.AUTO);
  }

  _move(side: moveSideEnum, speed: number) {
    if (side === moveSideEnum.STOP) {
      this.movingSides = [];
    } else {
      if (!this.movingSides.find((el) => el.side === side)) {
        this.movingSides.push({ side, speed });
      } else {
        return;
      }
    }
    this.controller.move(side, speed);
  }

  stopMoveSide(side: moveSideEnum) {
    this.controller.move(moveSideEnum.STOP, this.MoveMaxSpeed);
    this.movingSides = this.movingSides.filter((el) => el.side !== side);
    this.movingSides.forEach((el) => {
      this.controller.move(el.side, el.speed);
    });
  }

  changeMoveSpeed(speed: number) {
    this.movingSides.forEach((el) => {
      if (el.speed !== speed) {
        el.speed = speed;
        this.controller.move(el.side, speed);
      }
    });
  }

  _normalizeMoveSpeed(speed: number) {
    if (speed > this.MoveMaxSpeed) speed = this.MoveMaxSpeed;
    if (speed < this.MoveMinSpeed) speed = this.MoveMinSpeed;
    return speed;
  }

  moveLeft(speed: number = 1) {
    speed = this._normalizeMoveSpeed(speed);
    this._move(moveSideEnum.LEFT, speed);
  }

  moveRight(speed: number = 1) {
    speed = this._normalizeMoveSpeed(speed);
    this._move(moveSideEnum.RIGHT, speed);
  }

  moveDown(speed: number = 1) {
    speed = this._normalizeMoveSpeed(speed);
    this._move(moveSideEnum.DOWN, speed);
  }

  moveUp(speed: number = 1) {
    speed = this._normalizeMoveSpeed(speed);
    this._move(moveSideEnum.UP, speed);
  }

  stopMove() {
    this._move(moveSideEnum.STOP, this.MoveMaxSpeed);
  }

  setFocusManual() {
    this.controller.setFocusMode(focusModeEnum.MANUAL);
  }

  setFocusAuto() {
    this.controller.setFocusMode(focusModeEnum.AUTO);
  }

  brightnessUp() {
    if (this.brightness >= 15) return
    this.controller.setBrightness(++this.brightness)
  }

  brightnessDown() {
    if (this.brightness <= 0) return
    this.controller.setBrightness(--this.brightness)
  }
}

export default PtzHandler;
