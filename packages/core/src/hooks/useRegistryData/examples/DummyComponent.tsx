import type { RegistryDataKey } from "@core";

interface UseRegistryDataOptions<K extends RegistryDataKey> {
  type: K;
}

export function DummyComponentReturn(props: Partial<UseRegistryDataOptions<RegistryDataKey>>) {
  return props;
}
