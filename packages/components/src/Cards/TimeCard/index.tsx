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

function convertTo12Hour(time: string) {
  // Create a new Date object
  const [hour, minute] = time.split(":");
  const date = new Date();

  // Set the hours and minutes of the Date object
  date.setHours(parseInt(hour));
  date.setMinutes(parseInt(minute));

  // Use Intl.DateTimeFormat to format the time
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.formatToParts(date);
}

function formatDate(dateString: string): string {
  // Create a new Date object
  const date = new Date(dateString);

  // Use Intl.DateTimeFormat to format the date
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  // Format the date
  let formattedDate = formatter.format(date);

  // Add the ordinal suffix
  const day = date.getDate();
  const suffix = daySuffix(day);

  // Replace the day number with the number plus the suffix
  formattedDate = formattedDate.replace(/\d+/, `${day}${suffix}`);

  return formattedDate;
}
type CustomFormatter = (date: Date, formatter: FormatFunction) => React.ReactNode;
type OmitProperties = "title" | "as" | "active" | "entity" | "service" | "serviceData" | "longPressCallback" | "modalProps";
export interface TimeCardProps extends Omit<CardBaseProps<"div">, OmitProperties> {
  /** provide a custom entity to read the time from, if not found/provided it will update from machine time @default "sensor.time" */
  timeEntity?: FilterByDomain<EntityName, "sensor">;
  /** provide a custom entity to read the date from, if not found/provided it will update from machine time @default "sensor.date" */
  dateEntity?: FilterByDomain<EntityName, "sensor">;
  /** time format, by providing this it will bypass the sensor.time entity if available, for formatting options @see https://www.npmjs.com/package/intl-dateformat#formatters  @default "hh:mm a", you can also provide a custom function which will call every time the component re-renders */
  timeFormat?: string | CustomFormatter;
  /** date format, by providing this it will bypass the sensor.date entity if available, for formatting options @see https://www.npmjs.com/package/intl-dateformat#formatters  @default "dddd, MMMM DD YYYY", you can also provide a custom function which will call every time the component re-renders */
  dateFormat?: string | CustomFormatter;
  /** add this if you do not want to include the date, @default false */
  hideDate?: boolean;
  /** add this if you do not want to include the time, @default false */
  hideTime?: boolean;
  /** remove the icon before the time, @default false */
  hideIcon?: boolean;
  /** update throttle time in milliseconds for the timer when you're not using the entities and using custom formatters @default 1000 */
  throttleTime?: number;
  /** the name of the icon, defaults to the sensor.date icon or mdi:calendar @default mdi:calendar */
  icon?: string;
  /** the props for the icon, which includes styles for the icon */
  iconProps?: Omit<IconProps, "icon">;
  /** center everything instead of left aligned @default false */
  center?: boolean;
  /** callback when the card is pressed, it will return the time sensor entity */
  onClick?: (entity: HassEntityWithService<"sensor">, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const DEFAULT_TIME_FORMAT = "hh:mm A";
const DEFAULT_DATE_FORMAT = "dddd, MMMM DD YYYY";

const customFormatter = createDateFormatter({});

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
  const previousTimeRef = useRef<number>(Date.now());
  const requestRef = useRef<number>(undefined);
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const timeSensor = useEntity(timeEntity ?? "sensor.time", {
    returnNullIfNotFound: true,
  });
  const dateSensor = useEntity(dateEntity ?? "sensor.date", {
    returnNullIfNotFound: true,
  });
  const dateIcon = useMemo(() => icon || dateSensor?.attributes?.icon || "mdi:calendar", [icon, dateSensor]);
  const [formatted, amOrPm] = useMemo(() => {
    const parts = convertTo12Hour(timeSensor?.state ?? "00:00");
    const hour = parts.find((part) => part.type === "hour");
    const minute = parts.find((part) => part.type === "minute");
    const amOrPm = parts.find((part) => part.type === "dayPeriod");
    return [`${hour?.value}:${minute?.value}`, amOrPm?.value];
  }, [timeSensor?.state]);
  const hasOnClick = typeof onClick === "function";

  const timeValue = useMemo(() => {
    if (timeSensor && !timeFormat) {
      return (
        <>
          <Time className="time">{formatted}</Time>
          <AmOrPm className="time-suffix">{amOrPm}</AmOrPm>
        </>
      );
    }
    try {
      return (
        <Time className="time">
          {typeof timeFormat === "function"
            ? timeFormat(currentTime, customFormatter)
            : customFormatter(currentTime, timeFormat ?? DEFAULT_TIME_FORMAT)}
        </Time>
      );
    } catch (e) {
      console.error("Time formatting error", e);
      return <Time className="time">{customFormatter(currentTime, DEFAULT_TIME_FORMAT)}</Time>;
    }
  }, [amOrPm, currentTime, formatted, timeFormat, timeSensor]);

  const dateValue = useMemo(() => {
    try {
      return dateSensor && !dateFormat
        ? formatDate(dateSensor.state)
        : typeof dateFormat === "function"
          ? dateFormat(currentTime, customFormatter)
          : customFormatter(currentTime, dateFormat ?? DEFAULT_DATE_FORMAT);
    } catch (e) {
      console.error("Date formatting error", e);
      return customFormatter(currentTime, DEFAULT_DATE_FORMAT);
    }
  }, [currentTime, dateFormat, dateSensor]);

  const updateClock = useCallback(() => {
    const now = Date.now();
    const elapsed = now - previousTimeRef.current;
    if (elapsed >= throttleTime) {
      // Update the clock every second
      setCurrentTime(new Date());
      previousTimeRef.current = now - (elapsed % throttleTime); // Adjust for any drift
    }
    requestRef.current = requestAnimationFrame(updateClock);
  }, [throttleTime]);

  useEffect(() => {
    const hasEntities = timeSensor || dateSensor;
    const hasFormatters = timeFormat || dateFormat;
    if (hasEntities && !hasFormatters) return; // let home assistant trigger updates
    requestRef.current = requestAnimationFrame(updateClock);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [updateClock, timeFormat, dateFormat, timeSensor, dateSensor]);

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
/** There's no required props on this component, by default it retrieves information from the time and date sensor
 * from your home assistant information and the dates are formatted by the timezone specified in your home assistant settings.
 *
 * If you do NOT want to use the entities from home assistant, even if they're available, simply provide a "format" attribute and it will skip
 * the retrieval of the time and date sensors and use the format provided using a custom implementation outside of home assistant.
 * */
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
