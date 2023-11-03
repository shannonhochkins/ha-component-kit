import { useCallback, useState, useMemo, useEffect, useRef } from "react";
import { subscribeLogbook, type LogbookStreamMessage, type LogbookEntry } from "./logbook";
import { type EntityName, useHass } from "@core";
import type { Connection } from "home-assistant-js-websocket";
import { useDebouncedCallback } from "use-debounce";

interface LogbookTimePeriod {
  now: Date;
  startTime: Date;
  endTime: Date;
  purgeBeforePythonTime: number | undefined;
}

export interface UseLogOptions {
  hoursToShow?: number;
  startTime?: Date;
  endTime?: Date;
}
type RecentTime = {
  // Seconds
  recent: number;
};
type TimeRange = { range: [Date, Date] };
type Time = TimeRange | RecentTime;

const DEFAULT_HOURS_TO_SHOW = 24;

const findStartOfRecentTime = (now: Date, recentTime: number) => new Date(now.getTime() - recentTime * 1000).getTime() / 1000;

export function useLogs(entityId: EntityName, options?: UseLogOptions) {
  const { useStore } = useHass();
  const [error, setError] = useState<string | undefined>(undefined);
  const connection = useStore((state) => state.connection);
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const _entriesRef = useRef<LogbookEntry[]>([]);
  const _subscribed = useRef<boolean>(false);
  const _unsubscribe = useRef<void | (() => Promise<void>)>(undefined);

  const time = useMemo(() => {
    // @ts-expect-error - properties are added manually
    const time: Time = {};
    if (options?.hoursToShow) {
      (time as RecentTime).recent = options.hoursToShow * 60 * 60;
    } else if (options?.startTime && options?.endTime) {
      (time as TimeRange).range = [options.startTime, options.endTime];
    } else {
      (time as RecentTime).recent = DEFAULT_HOURS_TO_SHOW * 60 * 60;
    }
    return time;
  }, [options]);

  const _calculateLogbookPeriod = useCallback(() => {
    const now = new Date();
    if ("range" in time) {
      return <LogbookTimePeriod>{
        now: now,
        startTime: time.range[0],
        endTime: time.range[1],
        purgeBeforePythonTime: undefined,
      };
    }
    if ("recent" in time) {
      const purgeBeforePythonTime = findStartOfRecentTime(now, time.recent);
      return <LogbookTimePeriod>{
        now: now,
        startTime: new Date(purgeBeforePythonTime * 1000),
        // end streaming one year from now
        endTime: new Date(now.getTime() + 86400 * 365 * 1000),
        purgeBeforePythonTime: findStartOfRecentTime(now, time.recent),
      };
    }
    throw new Error("Unexpected time specified");
  }, [time]);

  const _nonExpiredRecords = useCallback(
    (purgeBeforePythonTime: number | undefined) =>
      !_entriesRef.current
        ? []
        : purgeBeforePythonTime
        ? _entriesRef.current.filter((entry) => entry.when > purgeBeforePythonTime!)
        : _entriesRef.current,
    [],
  );

  const _processStreamMessage = useCallback(
    (streamMessage: LogbookStreamMessage) => {
      const purgeBeforePythonTime = time && "recent" in time ? findStartOfRecentTime(new Date(), time.recent) : undefined;
      // Put newest ones on top. Reverse works in-place so
      // make a copy first.
      const newEntries = [...streamMessage.events].reverse();
      if (!_entriesRef.current.length) {
        _entriesRef.current = newEntries;
        setEntries(newEntries);
        return;
      }
      if (!newEntries.length) {
        // Empty messages are still sent to
        // indicate no more historical events
        return;
      }
      const nonExpiredRecords = _nonExpiredRecords(purgeBeforePythonTime);
      // Entries are sorted in descending order with newest first.
      if (!nonExpiredRecords.length) {
        _entriesRef.current = newEntries;
        // We have no records left, so we can just replace the list
        setEntries(newEntries);
      } else if (
        newEntries[newEntries.length - 1].when > // oldest new entry
        nonExpiredRecords[0].when // newest old entry
      ) {
        // The new records are newer than the old records
        // append the old records to the end of the new records
        _entriesRef.current = newEntries.concat(nonExpiredRecords);
        setEntries(_entriesRef.current);
      } else if (
        nonExpiredRecords[nonExpiredRecords.length - 1].when > // oldest old entry
        newEntries[0].when // newest new entry
      ) {
        _entriesRef.current = nonExpiredRecords.concat(newEntries);
        // The new records are older than the old records
        // append the new records to the end of the old records
        setEntries(_entriesRef.current);
      } else {
        _entriesRef.current = nonExpiredRecords.concat(newEntries).sort((a: LogbookEntry, b: LogbookEntry) => b.when - a.when);
        // The new records are in the middle of the old records
        // so we need to re-sort them
        setEntries(_entriesRef.current);
      }
    },
    [time, _nonExpiredRecords],
  );

  useEffect(() => {
    return () => {
      _subscribed.current = false;
      _entriesRef.current = [];
      setEntries([]);
    };
  }, []);

  const subscribeLogbookPeriod = useCallback(
    (entityId: EntityName, logbookPeriod: LogbookTimePeriod) => {
      const unsubscribe = subscribeLogbook(
        connection as Connection,
        (streamMessage) => {
          // "recent" means start time is a sliding window
          // so we need to calculate an expireTime to
          // purge old events
          console.log("subscribed stream", _subscribed.current);
          if (!_subscribed.current) {
            // Message came in before we had a chance to unload
            return;
          }
          _processStreamMessage(streamMessage);
        },
        logbookPeriod.startTime.toISOString(),
        logbookPeriod.endTime.toISOString(),
        [entityId],
      ).catch((err) => {
        _subscribed.current = false;
        if (err instanceof Error) {
          setError(err.message);
        }
      });

      return unsubscribe;
    },
    [connection, _processStreamMessage],
  );

  const debounceSubscribeLogbookPeriod = useDebouncedCallback(async (entityId: EntityName, logBookPeriod: LogbookTimePeriod) => {
    if (_unsubscribe.current) {
      const unsubscribe = await _unsubscribe.current;
      if (unsubscribe) {
        await unsubscribe();
      }
      _unsubscribe.current = undefined;
    }
    _subscribed.current = true;
    _unsubscribe.current = await subscribeLogbookPeriod(entityId, logBookPeriod);
  }, 100);

  useEffect(() => {
    const logBookPeriod = _calculateLogbookPeriod();

    debounceSubscribeLogbookPeriod(entityId, logBookPeriod);

    return () => {
      _subscribed.current = false;
      if (_unsubscribe.current) {
        _unsubscribe.current();
      }
    };
  }, [_calculateLogbookPeriod, debounceSubscribeLogbookPeriod, subscribeLogbookPeriod, entityId]);

  if (error) {
    throw new Error(error);
  }

  return useMemo(() => entries, [entries]);
}
