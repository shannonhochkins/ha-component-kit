import { HassEntity, HassServices } from "home-assistant-js-websocket";
import styled from "@emotion/styled";
import { Row, fallback } from "@components";
import { css } from "@emotion/react";
import { useRef, useCallback, useState, useEffect, ComponentPropsWithoutRef } from "react";
import {
  useLogs,
  useHass,
  computeDomain,
  createHistoricState,
  localizeStateMessage,
  localizeTriggerSource,
  timeAgo,
  localize,
  ON,
  type EntityRegistryEntry,
  type LogbookEntry,
  type EntityName,
  type UseLogOptions,
} from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";

const Wrapper = styled.div`
  --divider-color: rgba(225, 225, 225, 0.12);
  display: block;
  height: 100%;
  width: 100%;

  .entry-container {
    width: 100%;
  }

  .entry {
    position: relative;
    display: flex;
    width: 100%;
    line-height: 1.6rem;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    border-top: 1px solid var(--divider-color);
    justify-content: space-between;
    align-items: center;
  }

  .indicator {
    background-color: var(--disabled-color);
    height: 0.5rem;
    width: 0.5rem;
    border-radius: 0.25rem;
    flex-shrink: 0;
    margin-right: 0.7rem;
    margin-inline-start: initial;
    margin-inline-end: 0.7rem;
  }

  .entry:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }

  .message-relative_time {
    display: flex;
    flex-direction: column;
  }

  .secondary {
    font-size: 0.8rem;
    line-height: 1.7;
    display: flex;
    gap: 0.25rem;
  }

  .secondary a {
    color: var(--ha-S300-contrast);
  }

  .date {
    margin: 0.5rem 0;
    padding: 0 1rem;
  }

  .icon-message {
    display: flex;
    align-items: center;
  }

  .no-entries {
    text-align: center;
    color: var(--ha-S300-contrast);
    width: 100%;
    display: block;
    padding: 0.5rem;
  }

  .message {
    color: var(--ha-S100-contrast);
    span {
      padding-right: 0.15rem;
    }
  }

  .message span:first-of-type {
    &:first-letter {
      text-transform: capitalize;
    }
  }

  button.link {
    color: var(--ha-A100);
    text-decoration: none;
    background: 0px 0px;
    border: none;
    padding: 0px;
    font: inherit;
    text-align: left;
    text-decoration: underline;
    cursor: pointer;
    outline: 0px;
    margin-right: 0.15rem;
  }
`;

const triggerDomains = ["script", "automation"];

const hasContext = (item: LogbookEntry) => item.context_event_type || item.context_state || item.context_message;
const stripEntityId = (message: string, entityId?: string) => (entityId ? message.replace(entityId, " ") : message);

export interface LogBookRendererProps extends ComponentPropsWithoutRef<"div"> {
  /** the entity id to retrieve log information */
  entity: EntityName;
  /** options to pass to the useLog hook */
  options?: UseLogOptions;
  /** hide the header with the show more button @default false */
  hideHeader?: boolean;
  /** Whether to show an indicator next to each log row. @default false */
  hideIndicator?: boolean;
}

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

function _LogBookRenderer({
  entity,
  hideIndicator = false,
  hideHeader = false,
  options,
  className,
  cssStyles,
  id,
  style,
  ...rest
}: LogBookRendererProps) {
  const logs = useLogs(entity, options);
  const { useStore, getServices, joinHassUrl } = useHass();
  const entities = useStore((state) => state.entities);
  const connection = useStore((state) => state.connection);
  const requestedServices = useRef(false);
  const [services, setServices] = useState<HassServices | null>(null);

  useEffect(() => {
    if (requestedServices.current) return;
    requestedServices.current = true;
    getServices().then((services) => setServices(services));
  }, [services, getServices]);

  const getDeviceId = useCallback(
    async (entity: string) => {
      if (!connection) return;
      try {
        const response = await connection.sendMessagePromise<EntityRegistryEntry>({
          type: "config/entity_registry/get",
          entity_id: entity,
        });
        return response;
      } catch (e) {
        // ignore, just won't be able to link to HA
      }
    },
    [connection],
  );

  const _entityClicked = useCallback(
    async (entityId: string | undefined) => {
      if (!entityId) {
        return;
      }
      const device = await getDeviceId(entityId);
      if (device && device.device_id) {
        window.open(joinHassUrl(`config/devices/device/${device.device_id}`), "_blank");
      }
    },
    [getDeviceId, joinHassUrl],
  );

  const showMoreLogs = useCallback(() => {
    window.open(joinHassUrl(`/logbook?entity_id=${entity}`), "_blank");
  }, [entity, joinHassUrl]);

  const _renderEntity = useCallback(
    (entityId: string | undefined, entityName: string | undefined) => {
      const hasState = entityId && entityId in entities;
      const displayName = entityName || (hasState ? entities[entityId].attributes.friendly_name || entityId : entityId);
      if (!hasState) {
        return <span className="entity-name">{displayName}</span>;
      }
      return (
        <button className="link entity-name" onClick={() => _entityClicked(entityId)}>
          {displayName}
        </button>
      );
    },
    [entities, _entityClicked],
  );

  // 9:15:24 PM || 21:15:24
  const formatTimeWithSecondsMem = useCallback(
    (dateObj: Date) =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h12",
      }).format(dateObj),
    [],
  );

  const _formatMessageWithPossibleEntity = useCallback(
    (message: string, seenEntities: string[], possibleEntity?: string) => {
      //
      // As we are looking at a log(book), we are doing entity_id
      // "highlighting"/"colorizing". The goal is to make it easy for
      // the user to access the entity that caused the event.
      //
      // If there is an entity_id in the message that is also in the
      // state machine, we search the message for the entity_id and
      // replace it with _renderEntity
      //
      if (message.indexOf(".") !== -1) {
        const messageParts = message.split(" ");
        for (let i = 0, size = messageParts.length; i < size; i++) {
          if (messageParts[i] in entities) {
            const entityId = messageParts[i];
            if (seenEntities.includes(entityId)) {
              return null;
            }
            seenEntities.push(entityId);
            const messageEnd = messageParts.splice(i);
            messageEnd.shift(); // remove the entity
            return (
              <>
                <span className="triggered-by-state">{messageParts.join(" ")}</span>
                {_renderEntity(entityId, entities[entityId].attributes.friendly_name)}
                <span className="message-suffix">{messageEnd.join(" ")}</span>
              </>
            );
          }
        }
      }
      //
      // When we have a message that has a specific entity_id attached to
      // it, and the entity_id is not in the message, we look
      // for the friendly name of the entity and replace that with
      // _renderEntity if its there so the user can quickly get to
      // that entity.
      //
      if (possibleEntity && possibleEntity in entities) {
        const possibleEntityName = entities[possibleEntity].attributes.friendly_name;
        if (possibleEntityName && message.endsWith(possibleEntityName)) {
          if (seenEntities.includes(possibleEntity)) {
            return null;
          }
          seenEntities.push(possibleEntity);
          message = message.substring(0, message.length - possibleEntityName.length);
          return (
            <>
              <span className="message-entity">{message}</span>
              {_renderEntity(possibleEntity, possibleEntityName)}
            </>
          );
        }
      }
      return <span className="message-entity">{message}</span>;
    },
    [entities, _renderEntity],
  );

  const formatDateMem = useCallback(
    (dateObject: Date) =>
      new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: undefined,
      }).format(dateObject),
    [],
  );

  const _renderIndicator = useCallback((item: LogbookEntry) => {
    const style = {
      backgroundColor: item.state === ON ? `var(--ha-A400)` : `var(--ha-S300-contrast)`,
    };
    return <div className="indicator" style={style}></div>;
  }, []);

  const _renderUnseenContextSourceEntity = useCallback(
    (item: LogbookEntry, seenEntityIds: string[]) => {
      if (!item.context_entity_id || seenEntityIds.includes(item.context_entity_id!)) {
        return "";
      }
      // We don't know what caused this entity
      // to be included since its an integration
      // described event.
      return <>({_renderEntity(item.context_entity_id, item.context_entity_id_name)})</>;
    },
    [_renderEntity],
  );

  const _renderContextMessage = useCallback(
    (item: LogbookEntry, seenEntityIds: string[]) => {
      // State change
      if (item.context_state) {
        const historicStateObj =
          item.context_entity_id && item.context_entity_id in entities
            ? createHistoricState(entities[item.context_entity_id], item.context_state)
            : undefined;
        return (
          <>
            <span className="triggered-by">{localize("triggered_by_state_of")}</span>
            {_renderEntity(item.context_entity_id, item.context_entity_id_name)}
            <span>
              {historicStateObj
                ? localizeStateMessage(item.context_state, historicStateObj, computeDomain(item.context_entity_id as EntityName))
                : item.context_state}
            </span>
          </>
        );
      }
      // Service call
      if (item.context_event_type === "call_service") {
        return (
          <>
            <span className="triggered-by">{localize("triggered_by_service")}</span>
            {item.context_domain && item.context_service ? (
              <span className="service-trigger-details">
                {item.context_domain}:{" "}
                {services ? services[item.context_domain]?.[item.context_service]?.name || item.context_service : item.context_service}
              </span>
            ) : null}
          </>
        );
      }
      if (!item.context_message || seenEntityIds.includes(item.context_entity_id!)) {
        return null;
      }
      // Automation or script
      if (item.context_event_type === "automation_triggered" || item.context_event_type === "script_started") {
        // context_source is available in 2022.6 and later
        const triggerMsg = item.context_source ? item.context_source : item.context_message.replace("triggered by ", "");
        const contextTriggerSource = localizeTriggerSource(triggerMsg);
        return (
          <>
            <span className="triggered-by">
              {localize(item.context_event_type === "automation_triggered" ? "triggered_by_automation" : "triggered_by_script")}
            </span>
            {_renderEntity(item.context_entity_id, item.context_entity_id_name)}
            {item.context_message ? _formatMessageWithPossibleEntity(contextTriggerSource, seenEntityIds, undefined) : null}
          </>
        );
      }
      // Generic externally described logbook platform
      // These are not localizable
      return (
        <>
          <span className="triggered-by">{localize("triggered_by")}</span>
          <span className="trigger-name">{item.context_name}</span>
          {_formatMessageWithPossibleEntity(item.context_message, seenEntityIds, item.context_entity_id)}
          {_renderUnseenContextSourceEntity(item, seenEntityIds)}
        </>
      );
    },
    [_formatMessageWithPossibleEntity, _renderEntity, _renderUnseenContextSourceEntity, entities, services],
  );

  const _renderMessage = useCallback(
    (item: LogbookEntry, seenEntityIds: string[], domain?: string, historicStateObj?: HassEntity) => {
      if (item.entity_id) {
        if (item.state) {
          return (
            <span className="message-state">
              {historicStateObj ? localizeStateMessage(item.state, historicStateObj, domain!) : item.state}
            </span>
          );
        }
      }

      const itemHasContext = hasContext(item);
      let message = item.message;
      if (triggerDomains.includes(domain!) && item.source) {
        if (itemHasContext) {
          // These domains include the trigger source in the message
          // but if we have the context we want to display that instead
          // as otherwise we display duplicate triggers
          return null;
        }
        message = item.source;
      }
      return message
        ? _formatMessageWithPossibleEntity(
            itemHasContext ? stripEntityId(message, item.context_entity_id) : message,
            seenEntityIds,
            undefined,
          )
        : null;
    },
    [_formatMessageWithPossibleEntity],
  );
  const _renderLogbookItem = useCallback(
    (item: LogbookEntry, index: number) => {
      if (!item || index === undefined) {
        return null;
      }
      const previous = logs[index - 1] as LogbookEntry | undefined;
      const seenEntityIds: string[] = [];
      const currentStateObj = item.entity_id ? entities[item.entity_id] : undefined;
      const historicStateObj = currentStateObj ? createHistoricState(currentStateObj, item.state!) : undefined;
      const domain = item.entity_id
        ? computeDomain(item.entity_id as EntityName)
        : // Domain is there if there is no entity ID.
          item.domain!;
      const then = new Date(item.when * 1000);
      const relativeTime = timeAgo.format(then);

      return (
        <div key={index} className="entry-container">
          {index === 0 ||
          (item?.when && previous?.when && new Date(item.when * 1000).toDateString() !== new Date(previous.when * 1000).toDateString()) ? (
            <h4 className="date">{formatDateMem(new Date(item.when * 1000))}</h4>
          ) : null}

          <div className={`entry ${!item.entity_id ? "no-entity" : ""}`}>
            <div className="icon-message">
              {!hideIndicator ? _renderIndicator(item) : ""}
              <div className="message-relative_time">
                <div className="message">
                  {_renderMessage(item, seenEntityIds, domain, historicStateObj)}
                  {_renderContextMessage(item, seenEntityIds)}
                </div>
                <div className="secondary">
                  <span>{formatTimeWithSecondsMem(new Date(item.when * 1000))}</span>-<span className="relative-time">{relativeTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
    [_renderContextMessage, _renderIndicator, _renderMessage, entities, formatDateMem, formatTimeWithSecondsMem, logs, hideIndicator],
  );

  return (
    <Wrapper
      id={id ?? ""}
      css={css`
        ${cssStyles ?? ""}
      `}
      className={`logbook-renderer ${className ?? ""}`}
      style={{
        ...(style ?? {}),
      }}
      {...rest}
    >
      {!logs.length ? (
        <span className="no-entries">No logbook events found.</span>
      ) : (
        <Header>
          {!hideHeader && (
            <Row fullWidth justifyContent="space-between">
              <h3>Logbook</h3>
              <button className="link" onClick={showMoreLogs}>
                Show More
              </button>
            </Row>
          )}
          {logs.map((log, index) => {
            return _renderLogbookItem(log, index);
          })}
        </Header>
      )}
    </Wrapper>
  );
}

/** A component to render logs for an entity as a list, the list is updated automatically via a websocket listening to updates for the entity.
 * This is currently used for all popups for the cards and accessible via the button next to the close button. */
export function LogBookRenderer(props: LogBookRendererProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "LogBookRenderer" })}>
      <_LogBookRenderer {...props} />
    </ErrorBoundary>
  );
}
