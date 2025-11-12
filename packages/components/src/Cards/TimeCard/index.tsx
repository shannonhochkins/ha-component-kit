import styled from "@emotion/styled";
import { useMemo, useRef, useCallback, useEffect, useState } from "react";
import { type HassEntityWithService, useStore, useEntity, FilterByDomain, EntityName } from "@hakit/core";
import { Icon, type IconProps } from "@iconify/react";
import { Row, Column, fallback, CardBase, type CardBaseProps, type AvailableQueries } from "@components";
import { createDateFormatter, daySuffix } from "./formatter";
import { ErrorBoundary } from "react-error-boundary";
import { FormatFunction } from "./types";
import { Time, AmOrPm } from "./shared";

const Card = styled(CardBase as React.ComponentType<CardBaseProps<"div", FilterByDomain<EntityName, "sensor">>>)`
  cursor: default;
`;

const Contents = styled.div`
  padding: 1rem;
  height: 100%;
  .primary-icon {
    color: var(--ha-A200);
    font-size: 30px;
  }
  &:not(:disabled),
  &:not(.disabled) {
    &:hover,
    &:active {
      .primary-icon {
        color: var(--ha-A400);
      }
    }
  }
`;

// We intentionally removed bespoke locale logic in favor of the central formatter exposed via useStore.
// The only custom logic retained locally is the ordinal day suffix (1st, 2nd, 3rd...) which Home Assistant
// itself does not currently expose as a dedicated helper; we compose that around the shared formatter parts.
type CustomFormatter = (date: Date, formatter: FormatFunction) => React.ReactNode;
type OmitProperties = "title" | "as" | "active" | "entity" | "service" | "serviceData" | "longPressCallback" | "modalProps";
export interface TimeCardProps extends Omit<CardBaseProps<"div">, OmitProperties> {
  /** Optional Home Assistant sensor providing time (state string HH:MM). If omitted, component uses internal ticking clock.
   * Entity value is assumed already localized by HA; we only derive optional AM/PM suffix. */
  timeEntity?: FilterByDomain<EntityName, "sensor">;
  /** Optional Home Assistant sensor providing date (state string YYYY-MM-DD). If omitted, component uses current date locally but
   * formats via HA locale/timezone helpers. */
  dateEntity?: FilterByDomain<EntityName, "sensor">;
  /** Custom time format pattern or function. Providing this always ignores `timeEntity` even if present.
   * Pattern uses intl-dateformat style tokens; function receives (date, haFormatter). */
  timeFormat?: string | CustomFormatter;
  /** Custom date format pattern or function. Providing this always ignores `dateEntity` even if present.
   * Pattern uses intl-dateformat style tokens; function receives (date, haFormatter). */
  dateFormat?: string | CustomFormatter;
  /** Hide the date portion entirely. @default false */
  hideDate?: boolean;
  /** Hide the time portion entirely. @default false */
  hideTime?: boolean;
  /** Hide the leading icon. @default false */
  hideIcon?: boolean;
  /** Milliseconds throttle for internal ticker when NOT entity-driven (custom formats or missing entities). @default 1000 */
  throttleTime?: number;
  /** Override icon; falls back to date entity icon or mdi:calendar. */
  icon?: string;
  /** Additional icon props/styles. */
  iconProps?: Omit<IconProps, "icon">;
  /** Center align contents instead of left alignment. @default false */
  center?: boolean;
  /** Click handler; receives time sensor entity when entity-driven. */
  onClick?: (entity: HassEntityWithService<"sensor">, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const DEFAULT_TIME_FORMAT = "hh:mm A";
const DEFAULT_DATE_FORMAT = "dddd, MMMM DD YYYY";

const customFormatter = createDateFormatter({});
// HA-aware wrapper adding locale & timezone when formatting outside entity-driven mode.
// Ensures non-entity clock/date respects Home Assistant user preferences instead of browser defaults.

function InternalTimeCard({
  timeEntity,
  dateEntity,
  timeFormat,
  dateFormat,
  throttleTime = 1000,
  hideDate = false,
  hideIcon = false,
  hideTime = false,
  center = false,
  icon,
  iconProps,
  className,
  children,
  disabled,
  onClick,
  cssStyles,
  key,
  ...rest
}: TimeCardProps): React.ReactNode {
  const [currentTime, setCurrentTime] = useState(new Date());
  // Access the centralized, timezone & locale aware formatter from the store (HA config + user profile driven)
  const formatter = useStore((s) => s.formatter);
  const locale = useStore((s) => s.locale);
  const config = useStore((s) => s.config);
  const language = locale?.language;
  const timeZone = config?.time_zone;

  const { formatAmPmSuffix, formatDateWeekday, formatDateMonth, formatDateYear, formatTime } = formatter;
  const previousTimeRef = useRef<number>(Date.now());
  const requestRef = useRef<number>(undefined);
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const timeSensor = useEntity(timeEntity ?? "unknown", {
    returnNullIfNotFound: true,
  });
  const dateSensor = useEntity(dateEntity ?? "unknown", {
    returnNullIfNotFound: true,
  });
  const dateIcon = useMemo(() => icon || dateSensor?.attributes?.icon || "mdi:calendar", [icon, dateSensor]);
  const [formatted, amOrPm] = useMemo(() => {
    // Entity-driven path: sensor.time already reflects HA timezone & user locale preferences.
    // Do not re-format the HH:MM portion; only optionally derive AM/PM suffix if user prefers 12h.
    if (timeSensor && !timeFormat) {
      const raw = timeSensor.state ?? "00:00"; // 24h HH:MM
      const [h, m] = raw.split(":").map(Number);
      const entityDate = new Date();
      entityDate.setHours(h, m, 0, 0);
      // Decide suffix using HA-aware formatter; keep raw string unchanged.
      return [raw, formatAmPmSuffix(entityDate)];
    }
    // Non-entity path: use HA-aware formatter (NOT browser locale/timezone) for both parts.
    const timeStr = formatTime(currentTime); // includes suffix if AM/PM preference, else 24h.
    // Split suffix out so UI stays consistent with separate span.
    const match = timeStr.match(/^(.*?)(?:\s([AP]M))$/i);
    if (match) {
      return [match[1], match[2]];
    }
    return [timeStr, undefined];
  }, [timeSensor, timeFormat, currentTime, formatTime, formatAmPmSuffix]);
  const hasOnClick = typeof onClick === "function";

  // Memoized HA format function (FormatFunction signature) injecting locale/timezone.
  const haFormatter = useCallback<FormatFunction>(
    (date, format, opts) => {
      return customFormatter(date, format, { locale: language, timezone: timeZone, ...opts });
    },
    [language, timeZone],
  );

  const timeValue = useMemo(() => {
    if (timeSensor && !timeFormat) {
      return (
        <>
          <Time className="time">{formatted}</Time>
          {amOrPm && <AmOrPm className="time-suffix">{amOrPm}</AmOrPm>}
        </>
      );
    }
    // Custom formatter path retained for backwards compatibility; note it uses browser timezone.
    // Prefer built-in HA formatter functions instead; if user supplies pattern we fall back.
    if (!timeSensor && !timeFormat) {
      return (
        <>
          <Time className="time">{formatted}</Time>
          {amOrPm && <AmOrPm className="time-suffix">{amOrPm}</AmOrPm>}
        </>
      );
    }
    try {
      return (
        <Time className="time">
          {typeof timeFormat === "function"
            ? timeFormat(currentTime, haFormatter)
            : haFormatter(currentTime, timeFormat ?? DEFAULT_TIME_FORMAT)}
        </Time>
      );
    } catch (e) {
      console.error("Time formatting error", e);
      return <Time className="time">{formatted}</Time>;
    }
  }, [amOrPm, currentTime, formatted, timeFormat, timeSensor, haFormatter]);

  const dateValue = useMemo(() => {
    if (hideDate) return null;
    try {
      // Entity path using HA date entity (YYYY-MM-DD) and HA-aware formatter parts.
      if (dateSensor && !dateFormat) {
        const parts = dateSensor.state.split("-").map(Number);
        if (parts.length === 3) {
          const d = new Date(parts[0], parts[1] - 1, parts[2]);
          const day = d.getDate();
          const suffix = daySuffix(day);
          // Compose: Weekday, Month <day><suffix> <year>
          return `${formatDateWeekday(d)}, ${formatDateMonth(d)} ${day}${suffix} ${formatDateYear(d)}`;
        }
      }
      // Non-entity default path: build HA timezone/locale aware date using formatter parts (with ordinal).
      if (!dateSensor && !dateFormat) {
        const d = currentTime;
        const day = d.getDate();
        const suffix = daySuffix(day);
        return `${formatDateWeekday(d)}, ${formatDateMonth(d)} ${day}${suffix} ${formatDateYear(d)}`;
      }
      // Custom formatting path now injected with HA locale/timezone via haFormatter.
      return typeof dateFormat === "function"
        ? dateFormat(currentTime, haFormatter)
        : haFormatter(currentTime, dateFormat ?? DEFAULT_DATE_FORMAT);
    } catch (e) {
      console.error("Date formatting error", e);
      return haFormatter(currentTime, DEFAULT_DATE_FORMAT);
    }
  }, [hideDate, dateSensor, dateFormat, currentTime, formatDateWeekday, formatDateMonth, formatDateYear, haFormatter]);

  const updateClock = useCallback(() => {
    const now = Date.now();
    const elapsed = now - previousTimeRef.current;
    if (elapsed >= throttleTime) {
      setCurrentTime(new Date());
      previousTimeRef.current = now - (elapsed % throttleTime);
    }
    requestRef.current = requestAnimationFrame(updateClock);
  }, [throttleTime]);

  // Only run a ticker when we are NOT fully entity-driven for both time & date (i.e. custom formats or missing entities)
  const needTicker = useMemo(() => {
    const timeEntityDriven = timeSensor && !timeFormat;
    const dateEntityDriven = dateSensor && !dateFormat;
    return !(timeEntityDriven && dateEntityDriven);
  }, [timeSensor, timeFormat, dateSensor, dateFormat]);

  useEffect(() => {
    if (!needTicker) return; // Entity-driven; rely on websocket updates.
    requestRef.current = requestAnimationFrame(updateClock);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [needTicker, updateClock]);

  return (
    <Card
      key={key}
      cssStyles={`
        ${globalComponentStyle?.timeCard ?? ""}
        ${cssStyles ?? ""}
      `}
      className={`${className ?? ""} time-card`}
      disableScale={disabled || !hasOnClick}
      disableActiveState={rest.disableActiveState ?? !hasOnClick}
      disableRipples={rest.disableRipples ?? !hasOnClick}
      onClick={(_: unknown, event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (hasOnClick && timeSensor) {
          onClick?.(timeSensor, event);
        }
      }}
      {...rest}
    >
      <Contents>
        <Column className="column" gap="0.5rem" alignItems={center ? "center" : "flex-start"} fullHeight wrap="nowrap">
          {(!hideIcon || !hideTime) && (
            <Row className="row" gap="0.5rem" alignItems="center" wrap="nowrap">
              {!hideIcon && <Icon className="icon primary-icon" icon={dateIcon} {...(iconProps ?? {})} />}
              {!hideTime && timeValue}
            </Row>
          )}
          {!hideDate && <Row>{dateValue}</Row>}
        </Column>
        {children && <div className="children">{children}</div>}
      </Contents>
    </Card>
  );
}
/**
 *
 * Default behavior: Renders current clock time & date using Home Assistant locale, timezone and 12/24h preference.
 * It maintains an internal ticking Date (throttled) unless both a `timeEntity` and `dateEntity` are provided
 * without custom format overrides—in which case updates rely on HA websocket events. Entities are optional.
 *
 * Custom formats (timeFormat/dateFormat): Always override entity usage for that portion. The function versions of the formatters will receive a timezone/locale aware formatter from the home assistant instance, so output still respects user settings. Pattern strings use intl-dateformat tokens.
 *
 * Ordinal day suffix (1st, 2nd, 3rd...) is added locally when composing default date output.
 */
export function TimeCard(props: TimeCardProps) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "TimeCard" })}>
      <InternalTimeCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
