import { FloorRegistryEntry } from "@hakit/core";

export function DummyComponent(
  props: Partial<{
    floors: FloorRegistryEntry[];
  }>,
) {
  return props;
}

export function DummyComponent2(props: Partial<FloorRegistryEntry>) {
  return props;
}
