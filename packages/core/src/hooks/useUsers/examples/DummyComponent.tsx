import { useUsers, AuthUser, UseUsersOptions } from "@hakit/core";

export function DummyComponent(props: Partial<ReturnType<typeof useUsers> | null>) {
  return props;
}

export function DummyComponentAuthUser(props: Partial<AuthUser>) {
  return props;
}

export function DummyComponentUseUsersOptions(props: Partial<UseUsersOptions>) {
  return props;
}
