import { HassUser } from "home-assistant-js-websocket";
import { useStore } from "../useStore";

export function useUser(): HassUser | null {
  const user = useStore((state) => state.user);
  return user;
}
