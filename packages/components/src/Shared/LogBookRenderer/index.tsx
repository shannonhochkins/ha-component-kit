
import styled from '@emotion/styled';
import { useRef, useCallback, useState, useEffect, useMemo } from "react";
import { useLogs, useEntity, createHistoricState, type LogbookEntry, type EntityName } from '@hakit/core';
import { Icon } from '@iconify/react';

const Wrapper = styled.div`
  display: block;
  height: 100%;

  .entry-container {
    width: 100%;
  }

  .entry {
    position: relative;
    display: flex;
    width: 100%;
    line-height: 2em;
    padding: 8px 16px;
    box-sizing: border-box;
    border-top: 1px solid var(--divider-color);
    justify-content: space-between;
    align-items: center;
  }

  .indicator {
    background-color: var(--disabled-color);
    height: 8px;
    width: 8px;
    border-radius: 4px;
    flex-shrink: 0;
    margin-right: 12px;
    margin-inline-start: initial;
    margin-inline-end: 12px;
    direction: var(--direction);
  }

  ha-icon-next {
    color: var(--secondary-text-color);
  }

  .clickable {
    cursor: pointer;
  }

  :not(.clickable) .entry.no-entity,
  :not(.clickable) .no-name .entry {
    cursor: default;
  }

  .entry:hover {
    background-color: rgba(var(--rgb-primary-text-color), 0.04);
  }

  .narrow:not(.no-icon) .time {
    margin-left: 32px;
    margin-inline-start: 32px;
    margin-inline-end: initial;
    direction: var(--direction);
  }

  .message-relative_time {
    display: flex;
    flex-direction: column;
  }

  .secondary {
    font-size: 12px;
    line-height: 1.7;
  }

  .secondary a {
    color: var(--secondary-text-color);
  }

  .date {
    margin: 8px 0;
    padding: 0 16px;
  }

  .icon-message {
    display: flex;
    align-items: center;
  }

  .no-entries {
    text-align: center;
    color: var(--secondary-text-color);
  }

  state-badge {
    margin-right: 16px;
    margin-inline-start: initial;
    flex-shrink: 0;
    color: var(--state-icon-color);
    margin-inline-end: 16px;
    direction: var(--direction);
  }

  .message {
    color: var(--primary-text-color);
  }

  .no-name .message:first-letter {
    text-transform: capitalize;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
  }

  button.link {
    color: var(--paper-item-icon-color);
    text-decoration: none;
  }

  .container {
    max-height: var(--logbook-max-height);
  }

  .container,
  lit-virtualizer {
    height: 100%;
  }

  lit-virtualizer {
    contain: size layout !important;
  }

  .narrow .entry {
    line-height: 1.5;
  }

  .narrow .icon-message state-badge {
    margin-left: 0;
    margin-inline-start: 0;
    margin-inline-end: 8px;
    margin-right: 8px;
    direction: var(--direction);
  }
`;

const triggerDomains = ["script", "automation"];

const hasContext = (item: LogbookEntry) =>
  item.context_event_type || item.context_state || item.context_message;
const stripEntityId = (message: string, entityId?: string) =>
  entityId ? message.replace(entityId, " ") : message;

export interface LogBookRendererProps {
  /**
   * Whether to use a narrow layout.
   * @default false
   */
  narrow?: boolean;
  /**
   * Whether to show an indicator.
   * @default false
   */
  showIndicator?: boolean;

  /**
   * Whether to hide the icon.
   * @default false
   */
  noIcon?: boolean;

  /**
   * Whether to hide the name.
   * @default false
   */
  noName?: boolean;

  /**
   * Whether to use relative time.
   * @default false
   */
  relativeTime?: boolean;
  entity: EntityName;
}

export function LogBookRenderer({
  entity,
  noIcon,
  showIndicator,
  noName,
  relativeTime,
  narrow,
}: LogBookRendererProps) {
  const _savedScrollPos = useRef<number | undefined>(undefined);
  const logs = useLogs(entity);
  console.log('logs', logs)
  const _entity = useEntity(entity);

  const _handleClick = useCallback(() => {
    
  }, []);

  // const _renderEntity = useCallback((
  //   entityId: string | undefined,
  //   entityName: string | undefined,
  //   noLink?: boolean
  // ) {
  //   const hasState = entityId && entityId in this.hass.states;
  //   const displayName =
  //     entityName ||
  //     (hasState
  //       ? this.hass.states[entityId].attributes.friendly_name || entityId
  //       : entityId);
  //   if (!hasState) {
  //     return displayName;
  //   }
  //   return noLink
  //     ? displayName
  //     : html`<button
  //         class="link"
  //         @click=${this._entityClicked}
  //         .entityId=${entityId}
  //       >
  //         ${displayName}
  //       </button>`;
  // }, []);

  // const _renderIndicator = useCallback((item: LogbookEntry) => {
  //   return null;
    // const stateObj = this.hass.states[item.entity_id!] as
    //   | HassEntity
    //   | undefined;
    // const computedStyles = getComputedStyle(this);

    // const color =
    //   item.state !== undefined
    //     ? computeTimelineColor(item.state, computedStyles, stateObj)
    //     : undefined;

    // const style = {
    //   backgroundColor: color,
    // };

    // return html` <div class="indicator" style=${styleMap(style)}></div> `;
  // }, []);

  // const _renderLogbookItem = useCallback((item: LogbookEntry, index: number) => {
  //   if (!item || index === undefined) {
  //     return nothing;
  //   }
  //   const previous = logs[index - 1] as LogbookEntry | undefined;
  //   const seenEntityIds: string[] = [];

  //   const historicStateObj = _entity
  //     ? createHistoricState(_entity, item.state!)
  //     : undefined;
  //   console.log('historicStateObj', historicStateObj);
  //   const domain = item.entity_id
  //     ? computeDomain(item.entity_id)
  //     : // Domain is there if there is no entity ID.
  //       item.domain!;
  //   const _renderMessage = useCallback((
  //     item: LogbookEntry,
  //     seenEntityIds: string[],
  //     domain?: string,
  //     historicStateObj?: HassEntity,
  //     noLink?: boolean
  //   ) => {
  //     if (item.entity_id) {
  //       if (item.state) {
  //         return historicStateObj
  //           ? localizeStateMessage(
  //               this.hass,
  //               this.hass.localize,
  //               item.state,
  //               historicStateObj,
  //               domain!
  //             )
  //           : item.state;
  //       }
  //     }
  
  //     const itemHasContext = hasContext(item);
  //     let message = item.message;
  //     if (triggerDomains.includes(domain!) && item.source) {
  //       if (itemHasContext) {
  //         // These domains include the trigger source in the message
  //         // but if we have the context we want to display that instead
  //         // as otherwise we display duplicate triggers
  //         return "";
  //       }
  //       message = localizeTriggerSource(this.hass.localize, item.source);
  //     }
  //     return message
  //       ? this._formatMessageWithPossibleEntity(
  //           itemHasContext
  //             ? stripEntityId(message, item.context_entity_id)
  //             : message,
  //           seenEntityIds,
  //           undefined,
  //           noLink
  //         )
  //       : "";
  //   }, []);
  //   return <div
  //       className="entry-container"
  //       onClick={_handleClick}
  //     >
  //       {index === 0 ||
  //       (item?.when &&
  //         previous?.when &&
  //         new Date(item.when * 1000).toDateString() !==
  //           new Date(previous.when * 1000).toDateString())
  //         ? <h4 className="date">
  //             TODO
  //               {/* ${formatDate(
  //                 new Date(item.when * 1000),
  //                 this.hass.locale,
  //                 this.hass.config
  //               )} */}
  //             </h4>
  //         : null}

  //       <div className={`entry ${!item.entity_id ? "no-entity": ''}`}>
  //         <div className="icon-message">
  //           {!noIcon && item.icon ? <Icon icon={item.icon} /> : null}
  //           {showIndicator ? _renderIndicator(item) : null}
  //           <div className="message-relative_time">
  //             <div className="message">
  //               {!noName // Used for more-info panel (single entity case)
  //                 ? _renderEntity(item.entity_id, item.name)
  //                 : null}
  //               {_renderMessage(
  //                 item,
  //                 seenEntityIds,
  //                 domain,
  //                 historicStateObj,
  //               )}
  //               {_renderContextMessage(item, seenEntityIds)}
  //             </div>
  //             <div className="secondary">
  //               <span
  //                 >{formatTimeWithSeconds(
  //                   new Date(item.when * 1000),
  //                   this.hass.locale,
  //                   this.hass.config
  //                 )}</span
  //               >
  //               -
  //               <ha-relative-time
  //                 .hass=${this.hass}
  //                 .datetime=${item.when * 1000}
  //                 capitalize
  //               ></ha-relative-time>
  //               ${item.context_user_id ? html`${this._renderUser(item)}` : ""}
  //               ${hasTrace
  //                 ? `- ${this.hass.localize(
  //                     "ui.components.logbook.show_trace"
  //                   )}`
  //                 : ""}
  //             </div>
  //           </div>
  //         </div>
  //         ${hasTrace ? html`<ha-icon-next></ha-icon-next>` : ""}
  //       </div>
  //     </div>
  //   `;
  // }. []);

  return <Wrapper>
    {!logs.length ? 'not found' : logs.map((log) => {
      return log.message
    })}
  </Wrapper>
}