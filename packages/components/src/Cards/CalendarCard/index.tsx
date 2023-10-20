import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type {
  CalendarOptions,
  CalendarApi,
  EventClickArg,
  MoreLinkArg,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Icon } from "@iconify/react";
import { isUnavailableState, useHass } from "@hakit/core";
import type { FilterByDomain, EntityName } from "@hakit/core";
import { HassEntity } from "home-assistant-js-websocket";
import { useResizeDetector } from "react-resize-detector";
import { Row, Column, fallback, mq, Modal, ButtonGroup } from "@components";
import type { MotionProps } from "framer-motion";
import { motion } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { useRef, useEffect, useState, useCallback } from "react";

export const enum CalendarEntityFeature {
  CREATE_EVENT = 1,
  DELETE_EVENT = 2,
  UPDATE_EVENT = 4,
}

const StyledCalendarCard = styled(motion.div)`
  all: unset;
  padding: 0;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  cursor: pointer;
  background-color: var(--ha-S300);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, box-shadow;
  flex-shrink: 1;
  &:active {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }

  ${mq(
    ["mobile"],
    `
    width: 100%;
  `,
  )}
  ${mq(
    ["tablet", "smallScreen"],
    `
    width: calc(50% - var(--gap, 0rem) / 2);
  `,
  )}
  ${mq(
    ["desktop", "mediumScreen"],
    `
    width: calc((100% - 1 * var(--gap, 0rem)) / 2);
  `,
  )}
  ${mq(
    ["largeDesktop"],
    `
    width: calc((100% - 2 * var(--gap, 0rem)) / 3);
  `,
  )}

  > .calendar > * {
    flex-grow: 1;
    background-color: var(--ha-S300);
    min-height: 400px;
    --fc-neutral-bg-color: var(--ha-S300);
    --fc-list-event-hover-bg-color: var(--ha-S300);
    --fc-theme-standard-border-color: var(--ha-S500);
    --fc-border-color: var(--ha-S500);
    --fc-page-bg-color: var(--ha-S300);
  }

  a {
    color: inherit !important;
  }

  .fc-theme-standard .fc-scrollgrid {
    border: 1px solid var(--ha-S500);
    border-radius: 0.5rem;
  }

  .fc-theme-standard td {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }

  .fc-scrollgrid-section-header td {
    border: none;
  }

  th.fc-col-header-cell.fc-day {
    background-color: var(--ha-S200);
    color: var(--ha-S200-contrast);
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .fc-daygrid-dot-event:hover {
    background-color: inherit;
  }

  .fc-daygrid-day-top {
    text-align: center;
    padding-top: 0.25rem;
    justify-content: center;
  }

  table.fc-scrollgrid-sync-table tbody tr:first-of-type .fc-daygrid-day-top {
    padding-top: 0;
  }

  a.fc-daygrid-day-number {
    font-size: 0.8rem;
    cursor: pointer;
  }

  .fc .fc-daygrid-day-number {
  }
  .fc .fc-daygrid-more-link {
    font-size: 0.7rem;
    float: none;
  }
  .fc-daygrid-day-bottom {
    width: 100%;
    text-align: center;
    &:before,
    &:after {
      display: none;
    }
  }

  .fc .fc-daygrid-day.fc-day-today {
    background: inherit;
  }

  td.fc-day-today .fc-daygrid-day-number {
    height: 1.5rem;
    width: 1.5rem;
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    border-radius: 50%;
    text-align: center;
    white-space: nowrap;
    background-color: var(--ha-A400);
    color: var(--ha-A400-contrast);
    line-height: 1.5rem;
    padding: 0;
    align-items: center;
    justify-content: center;
  }

  .fc-event {
    border-radius: 4px;
    line-height: 1.7;
    cursor: pointer;
  }

  .fc-daygrid-block-event .fc-event-main {
    padding: 0 1px;
  }

  .fc-day-past .fc-daygrid-day-events {
    opacity: 0.5;
  }

  .fc-popover {
    background-color: var(--primary-background-color) !important;
  }

  .fc-popover-header {
    background-color: var(--secondary-background-color) !important;
  }

  .fc-theme-standard .fc-list-day-frame {
    background-color: transparent;
  }

  .fc-list.fc-view,
  .fc-list-event.fc-event td {
    border: none;
  }

  .fc-list-day.fc-day th {
    border-bottom: none;
    border-top: 1px solid var(--fc-theme-standard-border-color, #ddd) !important;
  }

  .fc-list-day-text {
    font-size: 16px;
    font-weight: 400;
  }

  .fc-list-day-side-text {
    font-weight: 400;
    font-size: 16px;
    color: var(--primary-color);
  }
  .fc-list-day-cushion {
    background-color: var(--ha-S200);
    color: var(--ha-S200-contrast);
  }

  .fc-list-table td,
  .fc-list-day-frame {
    padding-top: 12px;
    padding-bottom: 12px;
  }
  &.narrow .fc-list-table {
    table-layout: fixed;
    tr th,
    tr td {
      &:first-of-type {
        box-sizing: border-box;
        width: 30%;
        overflow-wrap: break-word;
        white-space: pre-wrap;
        font-size: 0.8rem;
      }
      &[aria-hidden="true"] {
        box-sizing: border-box;
        width: 5%;
      }
      &:last-of-type {
        box-sizing: border-box;
        width: 65%;
        overflow-wrap: break-word;
        white-space: pre-wrap;
        font-size: 0.8rem;
      }
    }
  }

  .fc-dayGridMonth-view {
    .fc-event-time,
    .fc-event-title {
      display: none;
    }
    .fc-daygrid-event-harness {
      margin-top: 0 !important;
    }
    .fc-daygrid-day-events {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      position: relative;
      margin-top: 0;
    }
  }

  .fc-dayGridDay-view {
    .fc-event-title {
      &:before {
        content: "- ";
      }
    }
    th.fc-col-header-cell.fc-day {
      font-size: 16px;
      font-weight: 400;
      .fc-col-header-cell-cushion {
        padding: 8px 14px;
        text-transform: none;
      }
    }
  }

  &.narrow {
    .fc-dayGridMonth-view .fc-scrollgrid-sync-table {
      overflow: hidden;
    }
    .fc .fc-col-header-cell-cushion {
      padding: 0.4rem;
    }
    .monthly-toggle-view {
      display: none;
    }
  }

  .fc-header-toolbar,
  .fc .fc-toolbar {
    display: none;
  }
`;

const Header = styled.div`
  padding: 1rem;
`;

const EventBody = styled.div`
  overflow-wrap: break-word;
  color: var(--ha-S200-contrast);
`;

type Extendable = Omit<React.ComponentProps<"div">, "onClick" | "ref"> &
  MotionProps;

/** Object used to render a calendar event in fullcalendar. */
export interface CalendarEvent {
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  calendar: string;
  eventData: CalendarEventData;
}

/** Data returned from the core APIs. */
export interface CalendarEventData {
  uid?: string;
  recurrence_id?: string;
  summary: string;
  dtstart: string;
  dtend: string;
  start: string;
  end?: string;
  rrule?: string;
  description?: string;
}

export interface CalendarEventWithEntity extends CalendarEvent {
  entity: HassEntity;
}

export interface CalendarCardProps extends Extendable {
  /** The names of your calendar entities */
  entities: FilterByDomain<EntityName, "calendar">[];
  /** if need be, you can provide a timezone to display time in a specific timezone */
  timeZone?: string;
  /** the default rendered view @default "dayGridMonth" */
  view?: "dayGridMonth" | "listWeek" | "dayGridDay";
}

const getCalendarDate = (
  dateObj?:
    | string
    | {
        dateTime?: string;
        date?: string;
      },
): string | undefined => {
  if (typeof dateObj === "string") {
    return dateObj;
  }

  if (dateObj?.dateTime) {
    return dateObj.dateTime;
  }

  if (dateObj?.date) {
    return dateObj.date;
  }

  return undefined;
};

const urlRegex = /(https?:\/\/[^\s]+)/g;

function formatDate(dateString: string) {
  const optionsDate: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const date = new Date(dateString);

  const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(
    date,
  );
  const formattedStartTime = new Intl.DateTimeFormat(
    "en-US",
    optionsTime,
  ).format(date);

  // Assume event is 15 minutes long for this example
  const eventEndTime = new Date(date.getTime() + 15 * 60000);
  const formattedEndTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
    eventEndTime,
  );

  return `${formattedDate} ${formattedStartTime} - ${formattedEndTime}`;
}

const defaultFullCalendarConfig: CalendarOptions = {
  headerToolbar: false,
  plugins: [dayGridPlugin, listPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  dayMaxEventRows: true,
  height: "parent",
  eventDisplay: "list-item",
  views: {
    listWeek: {
      type: "list",
      duration: { days: 7 },
    },
  },
  eventTimeFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  },
};

function _CalendarCard({
  entities,
  className,
  id,
  cssStyles,
  timeZone,
  view,
  ...rest
}: CalendarCardProps): JSX.Element {
  const { useStore } = useHass();
  const store = useStore();
  const calRef = useRef<FullCalendar>(null);
  const initialFetch = useRef(false);
  const [title, setTitle] = useState<string>("");
  const [narrow, setNarrow] = useState<boolean>(false);
  // const { width, ref } = useResizeDetector({
  //   refreshMode: "debounce",
  //   refreshRate: 500,
  // });
  const { callApi, getAllEntities } = useHass();
  const [currentEvent, setCurrentEvent] =
    useState<CalendarEventWithEntity | null>(null);
  const allEntities = getAllEntities();
  const [activeView, setActiveView] = useState<CalendarCardProps["view"]>(
    view ?? "dayGridMonth",
  );
  const calEntities = entities.map((entity) => allEntities[entity]);
  const _entities = calEntities.filter(
    (entity) => !isUnavailableState(entity?.state),
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const fetchEvents = useCallback(
    async (start: Date, end: Date) => {
      const params = encodeURI(
        `?start=${start.toISOString()}&end=${end.toISOString()}`,
      );
      const calEvents: CalendarEvent[] = [];
      const errors: string[] = [];
      const apiCalls = _entities.map((entity) =>
        callApi<CalendarEventData[]>(
          `/calendars/${entity.entity_id}${params}`,
          {
            method: "GET",
          },
        ).then(
          (result) => ({ result, error: null, entityId: entity.entity_id }),
          (error) => ({ error, result: null, entityId: entity.entity_id }),
        ),
      );
      const responses = await Promise.all(apiCalls);

      responses.forEach(({ result, error, entityId }) => {
        if (error || !result) {
          errors.push(entityId);
          return;
        }

        const cal = _entities.find((entity) => entity.entity_id === entityId);

        if (!cal) {
          return;
        }

        (result ?? []).forEach((ev) => {
          const eventStart = getCalendarDate(ev.start);
          const eventEnd = getCalendarDate(ev.end);
          if (!eventStart || !eventEnd) {
            return;
          }
          const eventData: CalendarEventData = {
            uid: ev.uid,
            summary: ev.summary,
            description: ev.description,
            dtstart: eventStart,
            dtend: eventEnd,
            start: ev.start,
            end: ev.end,
            recurrence_id: ev.recurrence_id,
            rrule: ev.rrule,
          };
          const event: CalendarEvent = {
            start: eventStart,
            end: eventEnd,
            title: ev.summary,
            calendar: cal.entity_id,
            eventData: eventData,
          };

          calEvents.push(event);
        });
      });
      setEvents(calEvents);
    },
    [callApi, _entities],
  );

  const measureCard = useCallback(
    (width: number) => {
      if (calRef.current) {
        const calendarApi = calRef.current.getApi();
        calRef.current.requestResize();
        if (width < 400 && calendarApi.view.type !== "listWeek") {
          calendarApi.setOption("eventDisplay", "auto");
          calendarApi.changeView("listWeek");
          setActiveView("listWeek");
          setTitle(calendarApi.view.title);
          if (!narrow) {
            setNarrow(true);
          }
        }
        if (width >= 400 && narrow) {
          setNarrow(false);
        }
      }
    },
    [narrow],
  );
  // console.log("width", width);
  // useEffect(() => {
  //   if (width) {
  //     console.log("widget", width);
  //     measureCard(width);
  //   }
  // }, [width, measureCard]);

  useEffect(() => {
    if (initialFetch.current || !calRef.current) {
      return;
    }
    initialFetch.current = true;
    const calendarApi = calRef.current.getApi();
    setTitle(calendarApi.view.title);
    fetchEvents(calendarApi.view.activeStart, calendarApi.view.activeEnd);
  }, [fetchEvents]);

  function changeView(fn: (api: CalendarApi) => void) {
    if (!calRef.current) return;
    const calendarApi = calRef.current.getApi();
    calendarApi.removeAllEventSources();
    fn(calendarApi);
    setTitle(calendarApi.view.title);
    fetchEvents(calendarApi.view.activeStart, calendarApi.view.activeEnd);
  }

  function _handleNext() {
    changeView((api) => api.next());
  }

  function _handlePrev() {
    changeView((api) => api.prev());
  }

  function _handleToday() {
    changeView((api) => api.today());
  }
  function _handleView(newView: CalendarCardProps["view"]): void {
    if (newView === activeView || !calRef.current) return;
    const eventDisplay = newView === "dayGridMonth" ? "list-item" : "auto";
    changeView((api) => {
      api.setOption("eventDisplay", eventDisplay);
      api.changeView(newView as string);
      setActiveView(newView);
    });
  }

  function _handleEventClick(info: EventClickArg): void {
    const entityStateObj = _entities.find(
      (entity) => entity.entity_id === info.event.extendedProps.calendar,
    );
    setCurrentEvent({
      ...info.event.extendedProps,
      entity: entityStateObj ?? null,
    } as CalendarEventWithEntity);
  }

  function _handleDateClick(info: DateClickArg | MoreLinkArg): void {
    if (info.view.type !== "dayGridMonth") {
      return;
    }
    changeView((api) => {
      api.gotoDate(info.date);
      api.changeView("dayGridDay");
      setActiveView("dayGridDay");
    });
  }
  return (
    <StyledCalendarCard
      id={id ?? ""}
      // ref={ref}
      cssStyles={css`
        ${cssStyles ?? ""}
      `}
      className={`calendar-card ${className ?? ""} ${narrow ? "narrow" : ""}`}
      {...rest}
    >
      <Header className="header">
        <Row justifyContent="space-between">
          <Column>
            <h3 className="title">{title}</h3>
          </Column>
          <ButtonGroup
            className="button-group-nav"
            buttons={[
              {
                icon: "mdi:navigate-before",
                size: 35,
                onClick: () => _handlePrev(),
                title: "Previous",
              },
              {
                icon: "mdi:navigate-next",
                size: 35,
                onClick: () => _handleNext(),
                title: "Next",
              },
            ]}
          />
        </Row>
        <Row justifyContent="flex-end">
          <ButtonGroup
            className="button-group-views"
            buttons={[
              {
                size: 35,
                onClick: () => _handleToday(),
                title: "Today",
                children: <>TODAY</>,
              },
              {
                icon: "mdi:view-module",
                size: 35,
                onClick: () => _handleView("dayGridMonth"),
                title: "Monthly View",
                className: "monthly-toggle-view",
                active: activeView === "dayGridMonth",
              },
              {
                icon: "mdi:view-week",
                size: 35,
                onClick: () => _handleView("listWeek"),
                title: "7 day View",
                active: activeView === "listWeek",
              },
              {
                icon: "mdi:view-day",
                size: 35,
                onClick: () => _handleView("dayGridDay"),
                title: "Daily View",
                active: activeView === "dayGridDay",
              },
            ].filter((button) => button !== null)}
          />
        </Row>
      </Header>
      <div className="calendar">
        <FullCalendar
          dateClick={_handleDateClick}
          moreLinkClick={_handleDateClick}
          eventClick={_handleEventClick}
          ref={calRef}
          locale={store.config?.language}
          timeZone={timeZone ?? "local"}
          {...defaultFullCalendarConfig}
          events={events}
        />
      </div>
      {currentEvent && (
        <Modal
          title={currentEvent.eventData.summary}
          id={currentEvent.eventData.uid as string}
          description={
            <Row
              justifyContent="flex-start"
              gap="1rem"
              style={{
                textTransform: "lowercase",
              }}
            >
              {currentEvent.entity.attributes.friendly_name}
            </Row>
          }
          open
          onClose={() => {
            setCurrentEvent(null);
          }}
        >
          <Column justifyContent="flex-start" alignItems="flex-start">
            <Row justifyContent="flex-start" gap="1rem">
              <Icon
                style={{
                  fontSize: "1.5rem",
                }}
                icon="mdi:calendar-clock"
              />
              <span>{formatDate(currentEvent.eventData.dtstart)}</span>
            </Row>
            {currentEvent.eventData.description && (
              <EventBody
                dangerouslySetInnerHTML={{
                  __html: currentEvent.eventData.description
                    .replace(urlRegex, function (url: string) {
                      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
                    })
                    .replace(/\n/g, "<br/>"),
                }}
              />
            )}
          </Column>
        </Modal>
      )}
    </StyledCalendarCard>
  );
}
/** The CalendarCard is very similar to the home assistant calendar card, with the exception of not having delete/edit event functionality, the preview here contains only a month (the current month) of fake events to preview the functionality */
export function CalendarCard(props: CalendarCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "CalendarCard" })}>
      <_CalendarCard {...props} />
    </ErrorBoundary>
  );
}
