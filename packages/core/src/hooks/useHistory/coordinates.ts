/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EntityHistoryState } from "./history";
const STROKE_WIDTH = 5;
const average = (items: any[]): number => items.reduce((sum, entry) => sum + parseFloat(entry.state), 0) / items.length;

const lastValue = (items: any[]): number => parseFloat(items[items.length - 1].state) || 0;

const calcPoints = (history: any, hours: number, width: number, detail: number, min: number, max: number): number[][] => {
  const coords = [] as number[][];
  const height = 80;
  let yRatio = (max - min) / height;
  yRatio = yRatio !== 0 ? yRatio : height;
  let xRatio = width / (hours - (detail === 1 ? 1 : 0));
  xRatio = isFinite(xRatio) ? xRatio : width;

  const first = history.filter(Boolean)[0];
  let last = [average(first), lastValue(first)];

  const getCoords = (item: any[], i: number, offset = 0, depth = 1): void => {
    if (depth > 1 && item) {
      return item.forEach((subItem, index) => getCoords(subItem, i, index, depth - 1));
    }

    const x = xRatio * (i + offset / 6);

    if (item) {
      last = [average(item), lastValue(item)];
    }
    const y = height + STROKE_WIDTH / 2 - ((item ? last[0] : last[1]) - min) / yRatio;
    // @ts-expect-error - bad types FROM HOME ASSISTANT
    return coords.push([x, y]);
  };

  for (let i = 0; i < history.length; i += 1) {
    getCoords(history[i], i, 0, detail);
  }

  if (coords.length === 1) {
    coords[1] = [width, coords[0][1]];
  }

  coords.push([width, coords[coords.length - 1][1]]);
  return coords;
};

type AccumulatorType = { [key: number]: NumericEntityHistoryState[] };

export const coordinates = (
  history: NumericEntityHistoryState[],
  hours: number,
  width: number,
  detail: number,
  limits?: { min?: number; max?: number },
): number[][] | undefined => {
  history.forEach((item) => {
    item.state = Number(item.state);
  });
  if (history.every((item) => Number.isNaN(item.state))) {
    history = history.map((item, index) => {
      if (Number.isNaN(item.state)) {
        return {
          ...item,
          state: index,
        };
      }
      return item;
    });
  }
  history = history.filter((item) => !Number.isNaN(item.state));

  const min = limits?.min !== undefined ? limits.min : Math.min(...history.map((item) => item.state));
  const max = limits?.max !== undefined ? limits.max : Math.max(...history.map((item) => item.state));
  const now = new Date().getTime();

  const reduce = (res: NumericEntityHistoryState[][], item: NumericEntityHistoryState, point: boolean): AccumulatorType => {
    const age = now - new Date(item.last_changed).getTime();

    let key = Math.abs(age / (1000 * 3600) - hours);
    if (point) {
      key = (key - Math.floor(key)) * 60;
      key = Number((Math.round(key / 10) * 10).toString()[0]);
    } else {
      key = Math.floor(key);
    }
    if (!res[key]) {
      res[key] = [];
    }
    res[key].push(item);
    return res;
  };
  // @ts-expect-error - bad typing, fix later
  history = history.reduce<NumericEntityHistoryState[][]>(
    // @ts-expect-error - bad typing, fix later
    (res, item) => reduce(res, item, false),
    [],
  );
  if (detail > 1) {
    history = history.map((entry) =>
      // @ts-expect-error - bad typing, fix later
      entry.reduce((res, item) => reduce(res, item, true), []),
    );
  }
  if (!history.length) {
    return undefined;
  }

  return calcPoints(history, hours, width, detail, min, max);
};

export interface NumericEntityHistoryState {
  state: number;
  _state: string;
  last_changed: number;
}

export const coordinatesMinimalResponseCompressedState = (
  history: EntityHistoryState[],
  hours: number,
  width: number,
  detail: number,
  limits?: { min?: number; max?: number },
): number[][] | undefined => {
  if (!history) {
    return undefined;
  }
  const numericHistory: NumericEntityHistoryState[] = history.map((item) => ({
    _state: item.s,
    state: Number(item.s),
    // With minimal response and compressed state, we don't have last_changed,
    // so we use last_updated since its always the same as last_changed since
    // we already filtered out states that are the same.
    last_changed: item.lu * 1000,
  }));
  return coordinates(numericHistory, hours, width, detail, limits);
};
