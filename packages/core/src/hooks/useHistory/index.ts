import { useEffect, useState, useMemo } from "react";
import { useHass } from "@core";
import type { EntityName } from "@core";
import { TimelineState } from "../../HassConnect/history";

export const useHistory = (entity: EntityName | string) => {
  const [history, setHistory] = useState<TimelineState[]>([]);
  const { getHistory } = useHass();

  useEffect(() => {
    const history = getHistory();
    const matchedHistory = history.timeline.find(
      ({ entity_id }) => entity_id === entity,
    );
    setHistory(
      typeof matchedHistory === "undefined" ? [] : matchedHistory.data,
    );
  }, [entity, getHistory]);

  return useMemo(() => history, [history]);
};
