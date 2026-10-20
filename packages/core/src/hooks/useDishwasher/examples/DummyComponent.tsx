import type { DishwasherEntities, DishwasherCycle, UseDishwasherOptions, UseDishwasherReturn } from "@hakit/core";

export function DummyComponentEntities(props: Partial<DishwasherEntities>) {
  return props;
}
export function DummyComponentOptions(props: Partial<UseDishwasherOptions>) {
  return props;
}
export function DummyComponentReturn(props: Partial<UseDishwasherReturn>) {
  return props;
}
export function DummyComponentCycle(props: Partial<DishwasherCycle>) {
  return props;
}
export function DummyComponentPrograms(props: Partial<UseDishwasherReturn["programs"]>) {
  return props;
}
export function DummyComponentHistory(props: Partial<UseDishwasherReturn["history"]>) {
  return props;
}
