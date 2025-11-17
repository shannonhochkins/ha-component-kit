import { HassUser } from "home-assistant-js-websocket";
import { useHass } from "../useHass";

export function useUser(): HassUser | null {
  const user = useHass((state) => state.user);
  return user;
}
