import { HassConfig } from "home-assistant-js-websocket";

export function DummyComponentReturn(props: {
  /** @default "LOADING" */
  status: HassConfig["state"] | "LOADING";
}) {
  return props;
}
