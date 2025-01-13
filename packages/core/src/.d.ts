// declare hassConnection as type of createConnection on window
import { type CSSInterpolation } from "@emotion/serialize";
import { type Connection, type Auth } from "home-assistant-js-websocket";
declare module "*.png" {
  const value: string;
  export = value;
}

declare module "*.css" {
  const value: string;
  export = value;
}

declare module "*.jpg" {
  const value: string;
  export = value;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
declare module "react" {
  interface Attributes {
    css?: CSSInterpolation;
    cssStyles?: CSSInterpolation;
  }
}

declare module "*.svg?react" {
  import * as React from "react";

  const ReactComponent: React.FunctionComponent<React.ComponentProps<"svg"> & { title?: string }>;

  export default ReactComponent;
}
declare global {
  interface Window {
    hassConnection: Promise<{ auth: Auth; conn: Connection }>;
    hassConnectionReady?: (hassConnection: Window["hassConnection"]) => void;
  }
}
