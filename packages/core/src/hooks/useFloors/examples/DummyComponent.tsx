import { FloorWithAreas } from "@hakit/core";

export function DummyComponent(
  props: Partial<{
    floors: FloorWithAreas[];
  }>,
) {
  return props;
}

export function DummyComponent2(props: Partial<FloorWithAreas>) {
  return props;
}
