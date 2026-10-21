import type { HistoryOptions, useHistory } from "@hakit/core";

export function DummyComponentHistoryOptions(props: Partial<HistoryOptions>) {
  return props;
}
export function DummyComponentHistoryReturn(props: Partial<ReturnType<typeof useHistory>>) {
  return props;
}
