import styled from "@emotion/styled";
import React, { useMemo, useEffect, useCallback, useRef, useState, CSSProperties, Key } from "react";
import { useEntity } from "@hakit/core";
import { Icon } from "@iconify/react";
import { fallback, Row, Column, CardBase, type CardBaseProps, type AvailableQueries } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { ReactComponent as GarbageBin } from "./garbage-bin.svg";

const ASPECT_RATIO = 77.41 / 123.36;

const Card = styled(CardBase)``;
const Contents = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
`;

const Bin = styled.div<{
  textColor?: CSSProperties["color"];
  iconColor?: CSSProperties["color"];
}>`
  position: relative;
  .vertical-text {
    position: absolute;
    inset: 0;
    margin-top: 40%;
    margin-left: 5%;
    text {
      transition: opacity var(--ha-transition-duration) var(--ha-easing);
      opacity: 0;
    }
    ${(props) => typeof props.textColor === "string" && `color: ${props.textColor};`}
  }
  .bin-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-65%, -60%, 0);
    ${(props) => typeof props.iconColor === "string" && `color: ${props.iconColor};`}
  }
`;

const BinBox = styled(Column)`
  background: var(--ha-S500);
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: 50%;
  &:nth-of-type(2n) {
    margin-left: 1rem;
  }
  .collection-time {
    font-size: 0.8rem;
    color: var(--ha-S500-contrast);
  }
  .collection-title {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    color: var(--ha-S300-contrast);
  }
`;

const Title = styled.div`
  font-size: 1rem;
  color: var(--ha-S50-contrast);
`;
const Description = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: var(--ha-S500-contrast);
`;

interface VerticalTextProps {
  height: number;
  text: string;
}
function VerticalText({ height, text }: VerticalTextProps) {
  const newWidth = height / ASPECT_RATIO / 2;
  const newHeight = height / 1.3;
  const textRef = useRef<SVGTextElement>(null);
  const [fontSize, setFontSize] = useState(newHeight);

  useEffect(() => {
    const resizeText = () => {
      if (textRef.current) {
        const textLength = textRef.current.getComputedTextLength();
        if (textLength > newHeight) {
          setFontSize((oldFontSize) => oldFontSize * (newHeight / textLength));
        }
        textRef.current.style.opacity = "1";
      }
    };
    resizeText();
  }, [newHeight, text]);
  return (
    <svg width={newWidth} height={newHeight} className="vertical-text">
      <text
        ref={textRef}
        x="0"
        y="0"
        transform={`translate(${newWidth / 2}, ${newHeight / 2}) rotate(90)`}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="currentColor"
        fontSize={fontSize}
      >
        {text}
      </text>
    </svg>
  );
}

interface SvgProperties {
  color: CSSProperties["color"];
  /** If the name is provided, this color will apply to the text of the bin @default rgba(0,0,0,0.6) */
  textColor?: CSSProperties["color"];
  /** the color of the icon if provided to any of the bins @default rgba(0,0,0,0.6) */
  iconColor?: CSSProperties["color"];
  /** the size of the rendered default svg @default 45 */
  size?: number;
}
interface BinProperties extends SvgProperties {
  /** the name of the bin @default "''" */
  name?: string;
  /** the icon name from iconify to display over the bin, if provided as well as name, the display may look odd */
  icon?: string;
  /** if provided, the default garbage bin will not be rendered and you can render your own */
  render?: (bin: BinProperties, key: Key) => React.ReactElement;
}

type WeekConfig = Array<BinProperties | CSSProperties["color"]> | null;
type Day = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

interface Schedule {
  /** optional title to appear in each schedule */
  title?: React.ReactNode;
  /** on what day does your garbage get collected */
  day: Day;
  /** as there's (usually) 4 weeks in a month, provide a config for each week, if you only have your garbage collected once a month, on a tuesday, specify null for the weeks that aren't relevant */
  weeks: [WeekConfig, WeekConfig, WeekConfig, WeekConfig];
  /** how often is your garbage collected */
  frequency: "weekly" | "fortnightly" | "monthly";
  /** hide the next collection time @default false */
  hideNextCollection?: boolean;
}
type OmitProperties =
  | "onClick"
  | "as"
  | "title"
  | "ref"
  | "entity"
  | "children"
  | "disabled"
  | "active"
  | "service"
  | "serviceData"
  | "modalProps"
  | "longPressCallback"
  | "disableActiveState"
  | "disableScale"
  | "disableRipples"
  | "rippleProps";
export interface GarbageCollectionCardProps extends Omit<CardBaseProps, OmitProperties> {
  /** The title of the card @default 'Garbage Collection' */
  title?: React.ReactNode;
  /** The description of the card @default undefined */
  description?: React.ReactNode;
  /** the schedule(s) for your garbage collection */
  schedules: Schedule[];
  /** the styles to apply globally to the garbage bin svg, this can be overwritten per week */
  svg?: SvgProperties;
  /** fired when the card is clicked */
  onClick?: () => void;
}

function _GarbageCollectionCard({
  schedules,
  svg,
  title = "Garbage Collection",
  description,
  className,
  ...rest
}: GarbageCollectionCardProps): JSX.Element {
  const dateSensor = useEntity("sensor.date", {
    returnNullIfNotFound: true,
  });
  const defaultSVGProperties = useMemo<Required<SvgProperties>>(
    () => ({
      size: 45,
      color: "#484848",
      textColor: "rgba(0,0,0,0.6)",
      iconColor: "rgba(0,0,0,0.6)",
      ...(svg ?? {}),
    }),
    [svg],
  );
  const today = useMemo(() => {
    const date = dateSensor === null ? new Date() : new Date(dateSensor.state);
    // 0 (Sunday) - 6 (Saturday)
    return date.getDay();
  }, [dateSensor]);
  const currentWeek = Math.floor(new Date().getDate() / 7);
  const dayNames = useMemo(() => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], []);

  const renderBin = useCallback(
    (bin: CSSProperties["color"] | BinProperties | undefined, key: Key) => {
      if (typeof bin === "object" && typeof bin.render === "function") return bin.render(bin, key);
      const size = typeof bin === "string" ? defaultSVGProperties.size : bin?.size ?? defaultSVGProperties.size;
      const color = typeof bin === "string" ? bin : bin?.color ?? defaultSVGProperties.color;
      const textColor = typeof bin === "string" ? defaultSVGProperties.textColor : bin?.textColor ?? defaultSVGProperties.textColor;
      const iconColor = typeof bin === "string" ? defaultSVGProperties.iconColor : bin?.iconColor ?? defaultSVGProperties.iconColor;
      const icon = typeof bin === "string" ? undefined : bin?.icon;
      return (
        <Bin className="bin-group" key={key} textColor={textColor} iconColor={iconColor}>
          {typeof bin !== "string" && typeof bin !== "undefined" && typeof bin.name === "string" && (
            <VerticalText height={size} text={bin.name} />
          )}
          {typeof icon === "string" && (
            <Icon
              className="icon bin-icon"
              icon={icon}
              style={{
                fontSize: size / 2.7,
              }}
            />
          )}
          <GarbageBin
            className="garbage-bin"
            style={{
              color,
              width: size,
            }}
          />
        </Bin>
      );
    },
    [defaultSVGProperties],
  );

  const formatTimeDisplay = useCallback((days: number) => {
    return days === 0 ? "Today" : days === 1 ? "Tomorrow" : `in ${days} days`;
  }, []);

  const findNextNonNullWeek = useCallback((weeks: WeekConfig[], startWeek: number): number => {
    for (let i = 0; i < weeks.length; i++) {
      const index = (startWeek + i) % weeks.length;
      if (weeks[index] !== null) {
        return index;
      }
    }
    return -1; // return an invalid index if no non-null weeks are found
  }, []);

  const collections = useMemo(
    () =>
      schedules.flatMap((schedule) => {
        const scheduleDay = dayNames.map((x) => x.toLowerCase()).indexOf(schedule.day.toLowerCase());
        const daysUntilCollection = (scheduleDay - today + 7) % 7;

        const futureDate = new Date();
        futureDate.setDate(new Date().getDate() + daysUntilCollection);

        const bins = schedule.weeks[currentWeek];
        let nextWeekIndex = (currentWeek + 1) % schedule.weeks.length;

        // Find next non-null week for non-weekly frequencies
        if (schedule.frequency !== "weekly") {
          nextWeekIndex = findNextNonNullWeek(schedule.weeks, currentWeek);
        }

        const nextBins = schedule.weeks[nextWeekIndex];
        const timeUntilCollection = formatTimeDisplay(daysUntilCollection);
        // ignore next week if null (no collection)
        if (schedule.hideNextCollection || nextBins === null) {
          return [
            {
              schedule,
              timeUntilCollection,
              bins,
            },
          ];
        }

        const nextFutureDate = new Date(futureDate);
        let incrementDays;

        switch (schedule.frequency) {
          case "weekly":
            incrementDays = 7;
            break;
          case "fortnightly":
            incrementDays = 14;
            break;
          case "monthly":
            incrementDays = 28; // Closest approximation to average days in a month
            break;
          default:
            incrementDays = 7;
        }

        nextFutureDate.setDate(futureDate.getDate() + incrementDays);

        const daysUntilNextCollection = daysUntilCollection + incrementDays;

        const nextCollectionTime = formatTimeDisplay(daysUntilNextCollection);
        return [
          {
            schedule,
            timeUntilCollection,
            bins,
          },
          {
            schedule,
            timeUntilCollection: nextCollectionTime,
            bins: nextBins,
          },
        ];
      }),
    [currentWeek, dayNames, schedules, today, findNextNonNullWeek, formatTimeDisplay],
  );
  return (
    <Card disableActiveState disableRipples disableScale className={`garbage-collection-card ${className ?? ""}`} {...rest}>
      <Contents>
        <Column alignItems="flex-start" fullWidth>
          <Title className="title">{title}</Title>
          {typeof description !== "undefined" && <Description className="description">{description}</Description>}
        </Column>
        <Row
          className="row"
          fullWidth
          wrap="nowrap"
          justifyContent="space-between"
          style={{
            marginTop: "0.5rem",
          }}
        >
          {collections
            .filter((collection) => collection.bins !== null)
            .map((collection, index) => {
              return (
                <BinBox className="bin-box" key={index}>
                  {typeof collection.schedule.title !== "undefined" && <div className="collection-title">{collection.schedule.title}</div>}
                  <Row className="row" wrap="nowrap" gap="1rem">
                    {collection.bins && collection.bins.map((bin, index) => renderBin(bin, index))}
                  </Row>
                  <div className="collection-time">{collection.timeUntilCollection}</div>
                </BinBox>
              );
            })}
        </Row>
      </Contents>
    </Card>
  );
}
/**
 * This card is useful to remind you of schedule of the pickup of our rubbish bins, it's very simple, yet highly customizable.
 *
 * It uses the current date (either provided by home assistant sensor.date or via javascript to determine the current day of the week, and then calculates the next collection date based on the schedule provided.
 *
 * You can change the color of the bin, by simply providing a css color property or providing an object will allow you to change colors, size of the bin, text, textColors, icon or even a custom render function.
 *
 * It will also allow you to create multiple schedules if you need to.
 *
 * You can also hide the "next" collection by passing through hideNextCollection on the schedule.
 *
 * WARNING: If the approach I've taken for schedules doesn't work for you, reach out on github an open an new issue with some details on what isn't working for you!
 *
 * Here's an example of some of the customization achievable:
 * */
export function GarbageCollectionCard(props: GarbageCollectionCardProps) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "GarbageCollectionCard" })}>
      <_GarbageCollectionCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
