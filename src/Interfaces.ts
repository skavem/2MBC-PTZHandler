export enum moveSideEnum {
  UP = 1,
  DOWN = 2,
  LEFT = 3,
  RIGHT = 4,
  STOP = 0,
  RESET = 5,
}

export enum zoomSideEnum {
  IN = 1,
  OUT = 2,
  STOP = 0,
}

export enum focusSideEnum {
  IN = 1,
  OUT = 2,
  STOP = 0,
}

export enum focusModeEnum {
  AUTO = "auto",
  MANUAL = "manual",
}

export interface IPtzController {
  move: (side: moveSideEnum, speed: number) => void;
  zoom: (side: zoomSideEnum, speed: number) => void;
  focus: (side: focusSideEnum, speed: number) => void;
  setFocusMode: (mode: focusModeEnum) => void;
  goToPreset: (preset: number) => void;
  savePreset: (preset: number) => void;
  setBrightness: (brightness: number) => void;
}
