import { useState, useRef, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { useIcon } from "@hakit/core";
import { fallback } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { css } from "@emotion/react";

const Switch = styled.div`
  display: block;
  --ha-control-switch-on-color: var(--ha-A400);
  --ha-control-switch-off-color: rgb(70, 70, 70);
  --ha-control-switch-background-opacity: 0.2;
  --ha-control-switch-thickness: 100px;
  --ha-control-switch-border-radius: 12px;
  --ha-control-switch-padding: 4px;
  --mdc-icon-size: 20px;
  box-sizing: border-box;
  user-select: none;
  cursor: pointer;
  border-radius: var(--ha-control-switch-border-radius);
  outline: none;
  transition: box-shadow 180ms ease-in-out;
  -webkit-tap-highlight-color: transparent;
  &:focus-visible {
    box-shadow: 0 0 0 2px var(--ha-control-switch-off-color);
  }
  &[checked="true"]:focus-visible {
    box-shadow: 0 0 0 2px var(--ha-control-switch-on-color);
  }
  .switch {
    box-sizing: border-box;
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: var(--ha-control-switch-border-radius);
    overflow: hidden;
    padding: var(--ha-control-switch-padding);
    display: flex;
  }
  .switch .background {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--ha-control-switch-off-color);
    transition: background-color 180ms ease-in-out;
    opacity: var(--ha-control-switch-background-opacity);
  }
  .switch .button {
    width: 50%;
    height: 100%;
    background: lightgrey;
    border-radius: calc(var(--ha-control-switch-border-radius) - var(--ha-control-switch-padding));
    transition:
      transform 180ms ease-in-out,
      background-color 180ms ease-in-out;
    background-color: var(--ha-control-switch-off-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &[checked="true"] .switch .background {
    background-color: var(--ha-control-switch-on-color);
  }
  &[checked="true"] .switch .button {
    transform: translateX(100%);
    background-color: var(--ha-control-switch-on-color);
  }
  &[reversed="true"] .switch {
    flex-direction: row-reverse;
  }
  &[reversed="true"][checked="true"] .switch .button {
    transform: translateX(-100%);
  }
  &[vertical="false"] {
    height: var(--ha-control-switch-thickness);
    max-width: 420px;
    min-width: 320px;
  }
  &[vertical="true"] {
    width: var(--ha-control-switch-thickness);
    height: 45vh;
    max-height: 320px;
    min-height: 200px;
  }
  &[vertical="true"][checked="true"] .switch .button {
    transform: translateY(100%);
  }
  &[vertical="true"] .switch .button {
    width: 100%;
    height: 50%;
  }
  &[vertical="true"][reversed="true"] .switch {
    flex-direction: column-reverse;
  }
  &[vertical="true"][reversed="true"][checked="true"] .switch .button {
    transform: translateY(-100%);
  }
  &[disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const Background = styled.div``;
const Button = styled.div``;

export interface ControlToggleProps extends Omit<React.ComponentPropsWithoutRef<"div">, "checked" | "onChange"> {
  /** should the switch be disabled */
  disabled?: boolean;
  /** should the switch be vertical or horizontal @default true */
  vertical?: boolean;
  /** should you reverse the order of the switch by default @default false */
  reversed?: boolean;
  /** If the switch is checked */
  checked?: boolean;
  /** the thickness of the switch @default 40 */
  thickness?: number;
  /** the icon to use when the switch is on @default mdi:power */
  onIcon?: string;
  /** the icon to use when the switch is off @default mdi:power-off */
  offIcon?: string;
  /** called when the switch is toggled */
  onChange?: (checked: boolean) => void;
  /** switch color as a css value, rgb, rgba, hex etc.. */
  color?: string;
}

const _ControlToggle = ({
  disabled = false,
  vertical = true,
  reversed = false,
  thickness = 100,
  checked: propChecked = false,
  onIcon: _onIcon,
  offIcon: _offIcon,
  onChange,
  className,
  cssStyles,
  id,
  style,
  color,
  ...rest
}: ControlToggleProps) => {
  const [checked, setChecked] = useState(propChecked);
  const switchRef = useRef<HTMLDivElement>(null);
  const onIcon = useIcon(typeof _onIcon === "string" ? _onIcon : "mdi:power");
  const offIcon = useIcon(typeof _offIcon === "string" ? _offIcon : "mdi:power-off");

  const _toggle = useCallback(() => {
    if (disabled) return;
    setChecked(!checked);
    if (onChange) onChange(!checked);
  }, [disabled, checked, onChange]);

  useEffect(() => {
    if (!switchRef.current) return;
    switchRef.current.setAttribute("role", "switch");
    if (!switchRef.current.hasAttribute("tabindex")) {
      switchRef.current.setAttribute("tabindex", "0");
    }
  }, []);

  useEffect(() => {
    if (!switchRef.current) return;
    switchRef.current.setAttribute("aria-checked", checked ? "true" : "false");
  }, [checked]);

  useEffect(() => {
    setChecked(propChecked);
  }, [propChecked]);

  useEffect(() => {
    if (!switchRef.current) return;
    switchRef.current.style.setProperty("--ha-control-switch-thickness", `${thickness}px`);
    switchRef.current.setAttribute("vertical", vertical ? "true" : "false");
    switchRef.current.setAttribute("reversed", reversed ? "true" : "false");
    switchRef.current.setAttribute("disabled", disabled ? "true" : "false");
    switchRef.current.setAttribute("checked", checked ? "true" : "false");
    switchRef.current.style.setProperty("--ha-control-switch-on-color", color ?? "var(--ha-A400)");
  }, [checked, vertical, disabled, reversed, thickness, color]);

  return (
    <Switch
      ref={switchRef}
      onClick={_toggle}
      id={id ?? ""}
      css={css`
        ${cssStyles ?? ""}
      `}
      className={`control-switch ${className ?? ""}`}
      style={{
        ...(style ?? {}),
      }}
      {...rest}
    >
      <div className="switch">
        <Background className={`${checked ? "checked" : ""} background`} />
        <Button aria-hidden="true" className="button">
          {checked ? onIcon : offIcon}
        </Button>
      </div>
    </Switch>
  );
};

/** A simple control switch similar to home assistant switches, used in the popup for switch entities, you can reverse the order, change orientation, all you need to set is your desired width/height depending on the orientation
 * Note: If you want to use this directly with an element to call the toggle service, you can use the SwitchControls component.
 */
export function ControlToggle(props: ControlToggleProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ControlToggle" })}>
      <_ControlToggle {...props} />
    </ErrorBoundary>
  );
}
