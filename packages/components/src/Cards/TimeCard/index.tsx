import styled from "@emotion/styled";
import { useMemo } from "react";
import { useEntity } from "@hakit/core";
import { Icon } from "@iconify/react";
import { Row, Column, fallback, Alert, mq } from "@components";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

const Card = styled(motion.div)`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: calc(100% - 2rem);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  cursor: default;
  background-color: var(--ha-S300);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s cubic-bezier(0.06, 0.67, 0.37, 0.99);
  flex-shrink: 1;

  &:hover {
    background-color: var(--ha-S400);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
  ${mq(
    ["mobile"],
    `
    width: calc(100% - 2rem);
  `,
  )}
  ${mq(
    ["tablet", "smallScreen"],
    `
    width: calc((50% - var(--gap, 0rem) / 2) - 2rem);
  `,
  )}
  ${mq(
    ["desktop"],
    `
    width: calc(((100% - 2 * var(--gap, 0rem)) / 3) - 2rem);
  `,
  )}
  ${mq(
    ["desktop", "mediumScreen"],
    `
    width: calc(((100% - 2 * var(--gap, 0rem)) / 3) - 2rem);
  `,
  )}
  ${mq(
    ["largeDesktop"],
    `
    width: calc(((100% - 3 * var(--gap, 0rem)) / 4) - 2rem);
  `,
  )}
`;

const StyledIcon = styled(Icon)`
  color: var(--ha-A200);
  font-size: 30px;
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
type Extendable = MotionProps & React.ComponentPropsWithoutRef<"div">;
export interface TimeCardProps extends Extendable {
  /** set this to false this if you do not want to include the date, @default true */
  includeDate?: boolean;
  /** remove the icon before the time, @default true */
  includeIcon?: boolean;
  /** the name of the icon, defaults to the sensor.date icon or mdi:calendar @default mdi:calendar */
  icon?: string;
  /** center everything instead of left aligned @default false */
  center?: boolean;
}

const Warning = () => (
  <Alert type="warning">
    <p>
      Time or Date sensor is unavailable, please add the <b>"time"</b> &{" "}
      <b>"date"</b> display options to the <b>"date_time"</b> sensor to your
      configuration.yaml in Home Assistant.
    </p>
    <p>
      You can follow the guide{" "}
      <a
        href="https://www.home-assistant.io/integrations/time_date/"
        target="_blank"
      >
        here
      </a>
      .
    </p>
  </Alert>
);
function _TimeCard({
  includeDate = true,
  includeIcon = true,
  center = false,
  icon,
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
  if (!dateSensor || !timeSensor) {
    return <Warning />;
  }
  return (
    <Card {...rest}>
      <Column
        gap="0.5rem"
        alignItems={center ? "center" : "flex-start"}
        fullHeight
      >
        <Row gap="0.5rem" alignItems="center" wrap="nowrap">
          {includeIcon && (
            <StyledIcon
              icon={icon || dateSensor.attributes.icon || "mdi:calendar"}
            />
          )}
          <Time>{formatted}</Time>
          <AmOrPm>{amOrPm}</AmOrPm>
        </Row>
        {includeDate && <Row>{formatDate(dateSensor.state)}</Row>}
      </Column>
    </Card>
  );
}
/** There's no required props on this component, by default it retrieves information from the time and date sensor from your home assistant information and the dates are formatted by the timezone specified in your home assistant settings. */
export function TimeCard(props: TimeCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "TimeCard" })}>
      <_TimeCard {...props} />
    </ErrorBoundary>
  );
}
