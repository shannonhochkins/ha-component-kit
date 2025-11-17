import { useHass } from "@hakit/core";

export function CallApiSnapshotExample() {
  const { helpers } = useHass.getState();
  helpers.callApi<Record<string, unknown>>("/config").then(() => {});
  return null;
}
