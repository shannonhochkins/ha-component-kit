// declare hassConnection as type of createConnection on window
import { type Connection, type Auth } from "home-assistant-js-websocket";
declare global {
  interface Window {
    hassConnection: Promise<{ auth: Auth; conn: Connection }>;
    hassConnectionReady?: (hassConnection: Window["hassConnection"]) => void;
  }
}