import PTZ from "./PtzHandler";
import PtzOverHttp from "./PtzOverHttp";
import KeyListener from "./KeyboardHandler";
import bindings from "./KeyBindings";

const ptz = new PTZ(new PtzOverHttp("192.168.136.16"));

const KL = new KeyListener(bindings(ptz));
