declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.jpg' {
  const value: string;
  export = value;
}

declare module "*.svg?react" {
  import * as React from "react";

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<"svg"> & { title?: string }
  >;

  export default ReactComponent;
}