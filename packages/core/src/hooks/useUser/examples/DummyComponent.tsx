import { HassUser } from "home-assistant-js-websocket";

export function DummyComponent(props: Partial<HassUser | null>) {
  return props;
}
