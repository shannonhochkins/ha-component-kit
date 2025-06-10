import { useUsers } from "@hakit/core";

export function DummyComponent(props: Partial<ReturnType<typeof useUsers> | null>) {
  return props;
}
