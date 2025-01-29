import { useIcon } from "@hakit/core";

export function IconExample() {
  const icon = useIcon("mdi:home");
  return <div>{icon}</div>;
}
