import styled from "@emotion/styled";
import { useMemo } from "react";
import { type HassEntityWithService, useEntity } from "@hakit/core";
import { Icon } from "@iconify/react";
import { Row, Column, fallback, Alert, CardBase, type CardBaseProps, type AvailableQueries } from "@components";
import { ErrorBoundary } from "react-error-boundary";

const Card = styled(CardBase)`
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

const Time = styled.h4`
  all: unset;
  font-size: 2rem;
  color: var(--ha-S200-contrast);
  font-weight: 400;
`;
const AmOrPm = styled.h4`
  all: unset;
  font-size: 2rem;
  color: var(--ha-S400-contrast);
  font-weight: 300;
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
  let suffix = "";
  switch (day) {
    case 1:
    case 21:
    case 31:
      suffix = "st";
      break;
    case 2:
    case 22:
      suffix = "nd";
      break;
    case 3:
    case 23:
      suffix = "rd";
      break;
    default:
      suffix = "th";
  }

  // Replace the day number with the number plus the suffix
  formattedDate = formattedDate.replace(/\d+/, `${day}${suffix}`);

  return formattedDate;
}

type OmitProperties = "title" | "as" | "active" | "ref" | "entity" | "service" | "serviceData" | "longPressCallback" | "modalProps";
export interface TimeCardProps extends Omit<CardBaseProps<"div">, OmitProperties> {
  /** add this if you do not want to include the date, @default false */
  hideDate?: boolean;
  /** add this if you do not want to include the time, @default false */
  hideTime?: boolean;
  /** remove the icon before the time, @default false */
  hideIcon?: boolean;
  /** the name of the icon, defaults to the sensor.date icon or mdi:calendar @default mdi:calendar */
  icon?: string;
  /** center everything instead of left aligned @default false */
  center?: boolean;
  /** callback when the card is pressed, it will return the time sensor entity */
  onClick?: (entity: HassEntityWithService<"sensor">, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const Warning = () => (
  <Alert type="warning">
    <p>
      Time or Date sensor is unavailable, please add the <b>"time"</b> & <b>"date"</b> display options to the <b>"date_time"</b> sensor to
      your configuration.yaml in Home Assistant.
    </p>
    <p>
      You can follow the guide{" "}
      <a href="https://www.home-assistant.io/integrations/time_date/" target="_blank">
        here
      </a>
      .
    </p>
  </Alert>
);
function _TimeCard({
  hideDate = false,
  hideIcon = false,
  hideTime = false,
  center = false,
  icon,
  className,
  children,
  disabled,
  onClick,
  ...rest
}: TimeCardProps): JSX.Element {
  const timeSensor = useEntity("sensor.time", {
    returnNullIfNotFound: true,
  });
  const dateSensor = useEntity("sensor.date", {
    returnNullIfNotFound: true,
  });
  const [formatted, amOrPm] = useMemo(() => {
    const parts = convertTo12Hour(timeSensor?.state ?? "00:00");
    const hour = parts.find((part) => part.type === "hour");
    const minute = parts.find((part) => part.type === "minute");
    const amOrPm = parts.find((part) => part.type === "dayPeriod");
    return [`${hour?.value}:${minute?.value}`, amOrPm?.value];
  }, [timeSensor?.state]);
  const hasOnClick = typeof onClick === "function";
  if (!dateSensor || !timeSensor) {
    return <Warning />;
  }
  return (
    <Card
      className={`${className ?? ""} time-card`}
      whileTap={{ scale: disabled || !hasOnClick ? 1 : 0.9 }}
      disableActiveState={rest.disableActiveState ?? !hasOnClick}
      disableRipples={rest.disableRipples ?? !hasOnClick}
      onClick={(_: unknown, event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (hasOnClick) {
          onClick?.(timeSensor, event);
        }
      }}
      {...rest}
    >
      <Contents>
        <Column className="column" gap="0.5rem" alignItems={center ? "center" : "flex-start"} fullHeight wrap="nowrap">
          {(!hideIcon || !hideTime) && (
            <Row className="row" gap="0.5rem" alignItems="center" wrap="nowrap">
              {!hideIcon && <Icon className="icon primary-icon" icon={icon || dateSensor.attributes.icon || "mdi:calendar"} />}
              {!hideTime && (
                <>
                  <Time className="time">{formatted}</Time>
                  <AmOrPm className="time-suffix">{amOrPm}</AmOrPm>
                </>
              )}
            </Row>
          )}
          {!hideDate && <Row>{formatDate(dateSensor.state)}</Row>}
        </Column>
        {children && <div className="children">{children}</div>}
      </Contents>
    </Card>
  );
}
/** There's no required props on this component, by default it retrieves information from the time and date sensor from your home assistant information and the dates are formatted by the timezone specified in your home assistant settings. */
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
      <_TimeCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
