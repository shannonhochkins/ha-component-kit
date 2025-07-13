import { UseEntityOptions, HistoryOptions, HassEntityWithService } from "@hakit/core";

export function DummyComponentOptions(props: Partial<UseEntityOptions>) {
  return props;
}

export function DummyComponentHistoryOptions(props: Partial<HistoryOptions>) {
  return props;
}

export function DummyComponentReturnValue(props: Partial<HassEntityWithService<"light">>) {
  return props;
}
