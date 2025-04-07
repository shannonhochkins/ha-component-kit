import { HassUser } from "home-assistant-js-websocket";
import { useHass } from "../useHass";

export function useUser(): HassUser | null {
  const { useStore } = useHass();
  const user = useStore((state) => state.user);
  return user;
}