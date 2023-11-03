import styled from "@emotion/styled";
import type { CalendarOptions, CalendarApi, EventClickArg, MoreLinkArg, EventSourceFuncArg, EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Icon } from "@iconify/react";
import { isUnavailableState, useHass, getColorByIndex } from "@hakit/core";
import type { FilterByDomain, EntityName } from "@hakit/core";
import { HassEntity } from "home-assistant-js-websocket";
import { useResizeDetector } from "react-resize-detector";
import Autolinker from "autolinker";
import {
  Row,
  Column,
  fallback,
  Modal,
  ButtonBar,
  Alert,
  ButtonBarButton,
  CardBase,
  type CardBaseProps,
  type AvailableQueries,
} from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { useRef, useEffect, useState, useCallback } from "react";

export const enum CalendarEntityFeature {
  CREATE_EVENT = 1,
  DELETE_EVENT = 2,
  UPDATE_EVENT = 4,
}

const StyledCalendarCard = styled(CardBase)`
  .contents .calendar > * {
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
    color: var(--ha-900-contrast);
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
  padding: 1rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const StyledAlert = styled(Alert)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 4;
  &:after {
    border-radius: 0;
  }
`;

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
  start?: string;
  end?: string;
  rrule?: string;
  description?: string;
}

export interface CalendarEventWithEntity extends CalendarEvent {
  entity: HassEntity;
}
type OmitProperties =
  | "modalProps"
  | "onClick"
  | "children"
  | "active"
  | "as"
  | "title"
  | "disabled"
  | "entity"
  | "service"
  | "serviceData"
  | "ref"
  | "longPressCallback"
  | "disableRipples"
  | "disableScale"
  | "disableActiveState";
export interface CalendarCardProps extends Omit<CardBaseProps<"div", EntityName>, OmitProperties> {
  /** The names of your calendar entities */
  entities: FilterByDomain<EntityName, "calendar">[];
  /** if need be, you can provide a timezone to display time in a specific timezone */
  timeZone?: string;
  /** the default rendered view @default "dayGridMonth" */
  view?: "dayGridMonth" | "listWeek" | "dayGridDay";
  /** include the header controls @default true */
  includeHeader?: boolean;
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

  const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(date);
  const formattedStartTime = new Intl.DateTimeFormat("en-US", optionsTime).format(date);

  // Assume event is 15 minutes long for this example
  const eventEndTime = new Date(date.getTime() + 15 * 60000);
  const formattedEndTime = new Intl.DateTimeFormat("en-US", optionsTime).format(eventEndTime);

  return `${formattedDate} ${formattedStartTime} - ${formattedEndTime}`;
}

const defaultFullCalendarConfig: CalendarOptions = {
  headerToolbar: false,
  plugins: [dayGridPlugin, listPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  dayMaxEventRows: true,
  height: "parent",
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

function _CalendarCard({ entities, className, timeZone, view, includeHeader = true, ...rest }: CalendarCardProps): JSX.Element {
  const { useStore } = useHass();
  const config = useStore((store) => store.config);
  const calRef = useRef<FullCalendar>(null);
  const initialRequest = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [narrow, setNarrow] = useState<boolean>(false);
  const { width, ref: widthRef } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 500,
  });
  const { callApi, getAllEntities } = useHass();
  const [currentEvent, setCurrentEvent] = useState<CalendarEventWithEntity | null>(null);
  const allEntities = getAllEntities();
  const [activeView, setActiveView] = useState<CalendarCardProps["view"]>(view ?? "dayGridMonth");
  const calEntities = entities.map((entity) => allEntities[entity]);
  const calendars = calEntities.filter((entity) => !isUnavailableState(entity?.state));
  const fetchEvents = useCallback(
    async (info: EventSourceFuncArg, successCallback: (events: EventInput[]) => void): Promise<void> => {
      setError(null);
      const params = encodeURI(`?start=${info.start.toISOString()}&end=${info.end.toISOString()}`);
      const calEvents: CalendarEvent[] = [];
      const errors: string[] = [];
      const apiCalls = entities.map(async (entity) =>
        callApi<CalendarEventData[]>(`/calendars/${entity}${params}`, {
          method: "GET",
        }).then(
          (result) => ({
            result: result,
            error: result.status === "error" ? result.data : null,
            entityId: entity,
          }),
          (error) => ({ error, result: null, entityId: entity }),
        ),
      );
      const responses = await Promise.all(apiCalls);
      responses.forEach(({ result, error, entityId }, index) => {
        const backgroundColor = getColorByIndex(index);
        if (error || !result || result.status === "error") {
          errors.push(`${entityId} - ${error}`);
          return;
        }
        (result.data ?? []).forEach((ev) => {
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
            recurrence_id: ev.recurrence_id,
            rrule: ev.rrule,
          };
          const event: CalendarEvent = {
            start: eventStart,
            end: eventEnd,
            title: ev.summary,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            calendar: entities[index],
            eventData: eventData,
          };

          calEvents.push(event);
        });
      });
      if (errors.length > 0) {
        setError(`Error retrieving events for: "${errors.join(", ")}".`);
        successCallback([]);
      } else {
        successCallback(calEvents);
      }
      initialRequest.current = true;
    },
    [callApi, entities],
  );

  const changeView = useCallback(
    (fn: (api: CalendarApi) => void) => {
      if (!calRef.current) return;
      const calendarApi = calRef.current.getApi();
      // @ts-expect-error - this does exist.
      calendarApi.batchRendering(() => {
        calendarApi.removeAllEventSources();
        fn(calendarApi);
        calendarApi.addEventSource(fetchEvents);
        setTitle(calendarApi.view.title);
      });
    },
    [fetchEvents],
  );

  const measureCard = useCallback(
    (width: number) => {
      if (calRef.current) {
        const calendarApi = calRef.current.getApi();
        calRef.current.requestResize();
        if (width < 400 && calendarApi.view.type !== "listWeek") {
          changeView((api) => {
            api.setOption("eventDisplay", "auto");
            api.changeView("listWeek");
            setActiveView("listWeek");
          });
          if (!narrow) {
            setNarrow(true);
          }
        }
        if (width >= 400 && narrow) {
          setNarrow(false);
        }
      }
    },
    [narrow, changeView],
  );
  useEffect(() => {
    if (width) {
      measureCard(width);
    }
  }, [width, measureCard]);

  const _handleNext = useCallback(() => {
    changeView((api) => api.next());
  }, [changeView]);

  const _handlePrev = useCallback(() => {
    changeView((api) => api.prev());
  }, [changeView]);

  const _handleToday = useCallback(() => {
    changeView((api) => api.today());
  }, [changeView]);
  const _handleView = useCallback(
    (newView: CalendarCardProps["view"]): void => {
      if (newView === activeView || !calRef.current) return;
      const eventDisplay = newView === "dayGridMonth" ? "list-item" : "auto";
      changeView((api) => {
        api.setOption("eventDisplay", eventDisplay);
        api.changeView(newView as string);
        setActiveView(newView);
      });
    },
    [activeView, changeView],
  );

  const _handleEventClick = useCallback(
    (info: EventClickArg): void => {
      const entityStateObj = calendars.find((entity) => entity.entity_id === info.event.extendedProps.calendar);
      setCurrentEvent({
        ...info.event.extendedProps,
        entity: entityStateObj ?? null,
      } as CalendarEventWithEntity);
    },
    [calendars],
  );

  const _handleDateClick = useCallback(
    (info: DateClickArg | MoreLinkArg): void => {
      if (info.view.type !== "dayGridMonth") {
        return;
      }
      changeView((api) => {
        api.gotoDate(info.date);
        api.changeView("dayGridDay");
        setActiveView("dayGridDay");
      });
    },
    [changeView],
  );

  useEffect(() => {
    if (initialRequest.current) return;
    // initially request the events
    if (!view) {
      const defaultView = "dayGridMonth";
      const eventDisplay = defaultView === "dayGridMonth" ? "list-item" : "auto";
      changeView((api) => {
        api.setOption("eventDisplay", eventDisplay);
        api.changeView(defaultView as string);
        setActiveView(defaultView);
      });
    } else {
      changeView((api) => {
        api.changeView(view);
      });
    }
  }, [changeView, view]);

  return (
    <StyledCalendarCard
      disableScale
      disableActiveState
      disableRipples
      className={`calendar-card ${className ?? ""} ${narrow ? "narrow" : ""}`}
      {...rest}
    >
      {includeHeader && (
        <Header className="header">
          <Row justifyContent="space-between">
            <Column>
              <h3 className="title">{title}</h3>
            </Column>
            <ButtonBar className="button-group-nav">
              <ButtonBarButton
                title="Previous"
                size={35}
                disabled={loading}
                onClick={() => {
                  _handlePrev();
                }}
                icon="mdi:navigate-before"
              />
              <ButtonBarButton
                title="Next"
                size={35}
                disabled={loading}
                onClick={() => {
                  _handleNext();
                }}
                icon="mdi:navigate-next"
              />
            </ButtonBar>
          </Row>
          <Row justifyContent="flex-end">
            <ButtonBar className="button-group-views">
              <ButtonBarButton
                title="Today"
                size={35}
                disabled={loading}
                onClick={() => {
                  _handleToday();
                }}
                noIcon
              >
                TODAY
              </ButtonBarButton>
              <ButtonBarButton
                className="monthly-toggle-view"
                title="Monthly View"
                active={activeView === "dayGridMonth"}
                size={35}
                disabled={loading}
                onClick={() => {
                  _handleView("dayGridMonth");
                }}
                icon="mdi:view-module"
              />
              <ButtonBarButton
                title="7 day View"
                size={35}
                disabled={loading}
                onClick={() => {
                  _handleView("listWeek");
                }}
                icon="mdi:view-week"
              />
              <ButtonBarButton
                title="Daily View"
                size={35}
                disabled={loading}
                onClick={() => {
                  _handleView("dayGridDay");
                }}
                icon="mdi:view-day"
              />
            </ButtonBar>
          </Row>
        </Header>
      )}
      <div className="calendar" ref={widthRef}>
        <FullCalendar
          dateClick={_handleDateClick}
          moreLinkClick={_handleDateClick}
          eventClick={_handleEventClick}
          editable={false}
          ref={calRef}
          loading={(isLoading) => {
            setLoading(isLoading);
          }}
          locale={config?.language}
          timeZone={timeZone ?? "local"}
          progressiveEventRendering
          {...defaultFullCalendarConfig}
        />
      </div>
      {loading && <StyledAlert className={"loading"} description="Loading..." />}
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
                  __html: Autolinker.link(currentEvent.eventData.description.replace(/\n/g, "<br/>"), {
                    newWindow: true,
                    stripPrefix: false,
                  }),
                }}
              />
            )}
          </Column>
        </Modal>
      )}
      {error && (
        <Alert title="Event Retrieval" type="error">
          {error}
        </Alert>
      )}
    </StyledCalendarCard>
  );
}

/**
 * The CalendarCard is very similar to the home assistant calendar card, with the exception of not having delete/edit event functionality, the preview here contains only a month (the current month) of fake events to preview the functionality
 *
 * This component uses the REST API to retrieve events from home assistant, ensure you've followed the instructions [here](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/hooks-usehass-callapi--docs)
 * */
export function CalendarCard(props: CalendarCardProps) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 8,
    sm: 6,
    md: 6,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "CalendarCard" })}>
      <_CalendarCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
