import { Area } from "@hakit/core";

export function DummyComponent(props: Partial<{
  areas: Area[]
}>) {
  return props;
}


export function DummyComponent2(props: Partial<Area>) {
  return props;
}
