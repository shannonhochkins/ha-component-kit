import { useUsers, AuthUser } from "@hakit/core";

export function DummyComponent(props: Partial<ReturnType<typeof useUsers> | null>) {
  return props;
}

export function DummyComponentAuthUser(props: Partial<AuthUser>) {
  return props;
}
