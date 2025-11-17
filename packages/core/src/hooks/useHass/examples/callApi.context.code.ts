import { useHass } from "@hakit/core";

export function CallApiContextExample() {
  const { callApi } = useHass.getState().helpers;
  callApi<Record<string, unknown>>("/states").then(() => {});
  return null;
}
