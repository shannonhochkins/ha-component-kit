import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useEffect, useState, CSSProperties, useRef } from "react";
import {
  localize,
  useHass,
  type AlarmMode,
  type AlarmPanelCardConfigState,
  type EntityName,
  type HassEntityWithService,
  type FilterByDomain,
  useEntity,
  LocaleKeys,
} from "@hakit/core";
import { fallback, ButtonGroup, ButtonGroupButton } from "@components";
import { motion, type MotionProps } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { TextField } from "../../../Form/TextField";
import { snakeCase } from "lodash";

import { _getActionLabel, _getActionColor, filterSupportedAlarmStates, ALARM_MODE_STATE_MAP, ALARM_MODES, DEFAULT_STATES } from "./shared";

const BUTTONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "clear"];
// split the buttons into 3 rows so we can render them like an input pad
const BUTTON_ROWS = BUTTONS.reduce((acc, _val, i) => {
  if (i % 3 === 0) {
    acc.push(BUTTONS.slice(i, i + 3));
  }
  return acc;
}, [] as string[][]);

const FORMAT_NUMBER = "number";

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Wrapper = styled(motion.div)`
  width: 100%;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
  }

  .loading-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 2;
  }

  .loading-indicator {
    position: absolute;
    inset: 0;
    animation: ${pulse} 1s infinite;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--ha-300-a1);
  }

  .keypad {
    .keypad-buttons {
      z-index: 1;
    }
    &:before {
      content: "";
      position: absolute;
      top: -10%;
      left: -10%;
      right: -10%;
      bottom: -10%;
      display: block;
      opacity: 0.25;
      z-index: 0;
      pointer-events: none;
      transition: var(--ha-transition-duration) var(--ha-easing);
      transition-property: background;
      background: radial-gradient(
        var(--ha-alarm-controls-size) at var(--ha-alarm-controls-position),
        var(--ha-alarm-controls-color, transparent) 0%,
        transparent 100%
      );
    }
  }

  .actions {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
`;

const ControlPanelSize = styled.div<{
  buttonSize: number;
  buttonGap: CSSProperties["gap"];
}>`
  ${(props) => {
    return `
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin: auto;
      width: 100%;
      direction: ltr;
      gap: ${props.buttonGap};
      position: relative;
      max-width: calc(${props.buttonSize}px * 3 + ${props.buttonGap} * 2);
      > * {
        width: 100%;
      }
      .button-group-parent:not(.vertical) {
        max-width: none;
        min-width: 0;
        width: 100%;
        gap: ${props.buttonGap};
      }
    `;
  }}
`;

interface Slot {
  position: "1" | "2" | "3" | "4";
  children: React.ReactNode;
}

type AlarmServices = keyof HassEntityWithService<"alarm_control_panel">["service"];
type Extendable = MotionProps & React.ComponentPropsWithoutRef<"div">;
export interface AlarmControlsProps extends Extendable {
  /** The alarm entity to control */
  entity: FilterByDomain<EntityName, "alarm_control_panel">;
  /** overwrite the default actions that are displayed, by default it will show what's supported by the entity */
  states?: AlarmPanelCardConfigState[];
  /** if you provide this the pin-code functionality will be hidden and you'll just be able to call disarm/arm without a pin-code input.  */
  defaultCode?: number;
  /** The size of the buttons for the keypad in pixels @default 80 */
  buttonSize?: number;
  /** The gap between each button @default '0.5rem' */
  buttonGap?: CSSProperties["gap"];
  /** hide the code input field, useful if you only want to show the keypad @default false */
  hideCodeInput?: boolean;
  /** hide the keypad, useful if you only want to show the action buttons or just the code input field @default false */
  hideKeypad?: boolean;
  /** use a custom color for the background gradient behind the keypad depending on the state, if you return undefined it will use the default */
  customActionColor?: (state: AlarmMode) => string | undefined;
  /** overwrite the labels used on the buttons by assigning the state value to a label, by default this will use the same values as home assistant */
  labelMap?: Record<AlarmPanelCardConfigState | "disarm", string>;
  /** you can customize and add in additional content/layout by inserting custom slots, this allows you to insert custom elements within the component layout. */
  slots?: Slot[];
}

function _AlarmControls({
  entity: _entity,
  states: _states,
  className,
  cssStyles,
  defaultCode,
  buttonSize = 80,
  buttonGap = "0.5rem",
  hideCodeInput = false,
  hideKeypad = false,
  customActionColor,
  labelMap,
  slots,
  ...rest
}: AlarmControlsProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inputVal, setInputVal] = useState<string>(defaultCode ? `${defaultCode}` : "");
  const entity = useEntity(_entity);
  const { useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);

  const states = _states || filterSupportedAlarmStates(entity, DEFAULT_STATES);

  const _handlePadClick = (val: string): void => {
    setInputVal(val === "clear" ? "" : inputVal + val);
  };

  const _handleActionClick = (state: AlarmPanelCardConfigState | "disarm"): void => {
    entity.service[snakeCase(`alarm_${state}`) as AlarmServices]({
      code: inputVal,
    });
    if (!defaultCode) {
      setInputVal("");
    }
  };

  useEffect(() => {
    if (defaultCode) {
      setInputVal(`${defaultCode}`);
    }
  }, [defaultCode]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    wrapperRef.current.style.setProperty("--ha-alarm-controls-position", "50% 50%");
    wrapperRef.current.style.setProperty("--ha-alarm-controls-size", "50% 50%");
    wrapperRef.current.style.setProperty("--ha-alarm-controls-color", _getActionColor(entity.state, customActionColor));
  }, [entity.state, customActionColor]);

  const localizeState = (): string => {
    if (entity.state === "triggered") return localize("pending");
    if (entity.state.includes("custom_bypass")) return localize("custom_bypass");
    if (entity.state.includes("armed_")) return localize("armed");
    return localize(entity.state as LocaleKeys);
  };

  const isLoading = ["pending", "triggered", "arming"].includes(entity.state);

  const showKeypad = entity.attributes.code_format === FORMAT_NUMBER && !defaultCode && !hideKeypad;
  const unpackSlot = (position: "1" | "2" | "3" | "4") => slots?.find((slot) => slot.position === position)?.children ?? null;

  return (
    <Wrapper
      ref={wrapperRef}
      className={`alarm-control-panel ${isLoading ? "is-loading" : ""} ${className ?? ""}`}
      cssStyles={`
          ${globalComponentStyle.alarmCard ?? ""}
          ${cssStyles ?? ""}
        `}
      {...rest}
    >
      {unpackSlot("1")}
      <ControlPanelSize className="actions-wrapper" buttonSize={buttonSize} buttonGap={buttonGap}>
        <ButtonGroup
          id="armActions"
          className="actions"
          orientation="horizontal"
          thickness={buttonSize}
          gap={buttonGap}
          maintainAspectRatio={false}
        >
          {(entity.state === "disarmed" ? states : (["disarm"] as const)).map((stateAction) => (
            <ButtonGroupButton
              key={stateAction}
              icon={stateAction in ALARM_MODE_STATE_MAP ? ALARM_MODES[ALARM_MODE_STATE_MAP[stateAction]].icon : ""}
              iconProps={{
                fontSize: "30px",
                style: {
                  marginBottom: "6px",
                },
              }}
              title={!inputVal ? localize("enter_code") : _getActionLabel(stateAction, labelMap)}
              placement="top"
              style={{
                flexDirection: "column",
                fontSize: "14px",
                aspectRatio: "unset",
              }}
              disabled={!inputVal || isLoading}
              onClick={() => _handleActionClick(stateAction)}
            >
              {_getActionLabel(stateAction, labelMap)}
            </ButtonGroupButton>
          ))}
        </ButtonGroup>
      </ControlPanelSize>
      {unpackSlot("2")}
      {!entity.attributes.code_format || defaultCode || hideCodeInput ? null : (
        <ControlPanelSize className="actions-wrapper-input" buttonSize={buttonSize} buttonGap={buttonGap}>
          <TextField value={inputVal} type="password" label={localize("code")} id="alarmCode" disabled={isLoading} />
        </ControlPanelSize>
      )}
      {unpackSlot("3")}
      {!showKeypad ? null : (
        <ControlPanelSize className="keypad" buttonSize={buttonSize} buttonGap={buttonGap}>
          {BUTTON_ROWS.map((buttons, index) => {
            return (
              <ButtonGroup key={index} orientation="horizontal" gap={buttonGap} thickness={buttonSize} className="keypad-buttons">
                {buttons.map((val, j) => {
                  return (
                    <ButtonGroupButton
                      key={`${index}-${j}`}
                      className={`keypad-button keypad-button-${val === "" ? "empty" : val} ${val !== "clear" ? "numberkey" : ""}`}
                      disabled={isLoading || val === ""}
                      disableScaleEffect={val === ""}
                      onClick={() => {
                        _handlePadClick(val);
                      }}
                      style={{
                        opacity: val === "" ? 0.2 : 1,
                        zIndex: val === "" ? -1 : undefined,
                        cursor: val === "" ? "default" : "pointer",
                      }}
                    >
                      <span>{val === "clear" ? localize("clear") : val}</span>
                    </ButtonGroupButton>
                  );
                })}
              </ButtonGroup>
            );
          })}
        </ControlPanelSize>
      )}
      {isLoading && (
        <>
          <ControlPanelSize className="loading-wrapper" buttonSize={buttonSize} buttonGap={buttonGap}>
            <div className="loading-indicator">
              <span>{localizeState()}</span>
            </div>
          </ControlPanelSize>
        </>
      )}
      {unpackSlot("4")}
    </Wrapper>
  );
}

/** This component will render controls for a an alarm system, it supports arm home, arm away, and disarm buttons.
 *  It has full keypad support for entering a pin code to arm/disarm the alarm system.
 *  You can bypass the keycode functionality and just retain the action buttons by providing a defaultCode value with the expected code to pass around
 */
export function AlarmControls(props: AlarmControlsProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "AlarmControls" })}>
      <_AlarmControls {...props} />
    </ErrorBoundary>
  );
}
