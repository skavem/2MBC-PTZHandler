import http = require("node:http");
import {
  IPtzController,
  focusModeEnum,
  zoomSideEnum,
  moveSideEnum,
  focusSideEnum,
} from "./Interfaces";

enum ptzFuncEnum {
  SET = "cgi-bin/web.fcgi?func=set",
  GET = "cgi-bin/web.fcgi?func=get",
}

const cleanResBody = (rb: string) => {
  const regExp = /[\t\s]+/g;
  const retVal = rb.replace(regExp, " ");
  return retVal;
};

class PtzOverHttp implements IPtzController {
  _ip: string;

  constructor(ip: string) {
    this._ip = ip;
  }

  get ip() {
    return this._ip;
  }

  set ip(val: string) {
    this._ip = val;
  }

  _buildBody(req: string) {
    return `{"key":-1348950563,${req}}`;
  }

  async _makeRequest(body: string, way: ptzFuncEnum = ptzFuncEnum.SET) {
    try {
      console.log("req:", body);
      let response = await fetch(`http://${this.ip}/${way}`, {
        body,
        method: 'POST'
      })
      console.log('res: ' + cleanResBody((await response.text())))
    } catch (error) {
      console.error("Couldn't connect: ", error)
    }
  }

  zoom(side: zoomSideEnum, speed: number) {
    let body = this._buildBody(`"image":{"zoom":[${side},${speed}]}`);
    this._makeRequest(body);
  }

  focus(side: focusSideEnum, speed: number) {
    let body = this._buildBody(`"image":{"focus":[${side},${speed}]}`);
    this._makeRequest(body);
  }

  setFocusMode(mode: focusModeEnum) {
    let body = this._buildBody(`"image":{"focus_mode":"${mode}"}`);
    this._makeRequest(body);
  }

  move(side: moveSideEnum, speed: number) {
    let body = this._buildBody(`"image":{"ptz":[${side},${speed}]}`);
    this._makeRequest(body);
  }

  goToPreset(preset: number) {
    let body = this._buildBody(`"image":{"preset":{"call":${preset}}}`);
    this._makeRequest(body);
  }

  savePreset(preset: number) {
    let body = this._buildBody(`"image":{"preset":{"add":${preset}}}`);
    this._makeRequest(body);
  }

  setBrightness(brightness: number) {
    let body = this._buildBody(`"image":{"brightness":${brightness}}`);
    this._makeRequest(body);
  }
}

export default PtzOverHttp;
