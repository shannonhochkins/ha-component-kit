import styled from "@emotion/styled";
import { useMemo, useEffect, useState } from "react";
import { useEntity, useHass } from "@hakit/core";
import { Icon } from "@iconify/react";
import { Row, Column } from "@components";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";

const Card = styled(motion.div)`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: var(--ha-device-time-card-width);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  cursor: default;
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s cubic-bezier(0.06, 0.67, 0.37, 0.99);
  &:hover {
    background-color: var(--ha-primary-background-hover);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`;

const StyledIcon = styled(Icon)`
  color: var(--ha-primary-active);
  font-size: 30px;
`;

const Time = styled.h4`
  all: unset;
  font-size: 2rem;
  color: var(--ha-primary-color);
  font-weight: 400;
`;
const AmOrPm = styled.h4`
  all: unset;
  font-size: 2rem;
  color: var(--ha-secondary-color);
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

function formatDate(dateString: string, timeZone: string): string {
  // Create a new Date object
  const date = new Date(dateString);

  // Use Intl.DateTimeFormat to format the date
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
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
type Extendable = MotionProps & React.ComponentPropsWithoutRef<'div'>;
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
/** There's no required props on this component, by default it retrieves information from the time and date sensor from your home assistant information and the dates are formatted by the timezone specified in your home assistant settings. */
export function TimeCard({
  includeDate = true,
  includeIcon = true,
  center = false,
  icon,
  ...rest
}: TimeCardProps): JSX.Element {
  const { getConfig } = useHass();
  const [timeZone, setTimeZone] = useState<string>("UTC");
  const sensor = useEntity("sensor.time");
  const dateSensor = useEntity("sensor.date");
  const parts = convertTo12Hour(sensor.state);
  const [formatted, amOrPm] = useMemo(() => {
    const hour = parts.find((part) => part.type === "hour");
    const minute = parts.find((part) => part.type === "minute");
    const amOrPm = parts.find((part) => part.type === "dayPeriod");
    return [`${hour?.value}:${minute?.value}`, amOrPm?.value];
  }, [parts]);
  useEffect(() => {
    async function getTimeZone() {
      const config = await getConfig();
      if (config) {
        setTimeZone(config.time_zone);
      }
    }
    getTimeZone();
  });
  return (
    <Card {...rest}>
      <Column gap="0.5rem" alignItems={center ? "center" : "flex-start"}>
        <Row gap="0.5rem" alignItems="center" wrap="nowrap">
          {includeIcon && (
            <StyledIcon
              icon={icon || dateSensor.attributes.icon || "mdi:calendar"}
            />
          )}
          <Time>{formatted}</Time>
          <AmOrPm>{amOrPm}</AmOrPm>
        </Row>
        {includeDate && <Row>{formatDate(dateSensor.state, timeZone)}</Row>}
      </Column>
    </Card>
  );
}
