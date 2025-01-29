import { useIcon } from "@hakit/core";

export function IconExample() {
  const icon = useIcon("mdi:home", {
    color: "red",
    style: {
      fontSize: 40,
    },
  });
  return <div>{icon}</div>;
}
