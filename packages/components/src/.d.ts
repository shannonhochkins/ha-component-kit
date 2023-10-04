import { CSSInterpolation } from "@emotion/serialize";

declare module "react" {
  interface Attributes {
    css?: CSSInterpolation;
    cssStyles?: CSSInterpolation;
  }
}
