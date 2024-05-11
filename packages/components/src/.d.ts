import { CSSInterpolation } from "@emotion/serialize";

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
    __TRANSLATIONS__: Record<string, string>;
  }
}
