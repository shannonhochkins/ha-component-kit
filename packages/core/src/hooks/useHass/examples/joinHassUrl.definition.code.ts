import { useHass } from "@hakit/core";

export function JoinHassUrlDefinitionExample() {
  const { joinHassUrl } = useHass.getState().helpers;
  const url = joinHassUrl("/other");
  console.debug(url);
  return null;
}
