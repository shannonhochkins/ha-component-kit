import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import styled from "@emotion/styled";

export interface TextFieldProps extends React.ComponentPropsWithoutRef<"div"> {
  type?: string;
  value?: string;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  helperText?: string;
  charCounter?: boolean;
  disabled?: boolean;
  inputProps?: React.ComponentPropsWithoutRef<"input">;
}

const TextFieldBase = styled.div`
  --padding-horizontal: 14px;
  --padding-horizontal-icon: 8px;
  --padding-vertical: 16px;
  --floating-label-padding-horizontal: 4px;
  --margin-vertical: 16px;
  --transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  --transition-duration: 0.4s;
  --border-width: 1px;
  --border-width-active: 2px;
  --icon-size: 24px;
  --icon-margin: 12px;
  --border-radius: 4px;
  --font-size: 16;
  --label-font-size-active: 12;
  --label-scale-factor: calc(var(--label-font-size-active) / var(--font-size));
  --label-scale-width: calc((100% - var(--padding-horizontal) * 2 - var(--floating-label-padding-horizontal)) / var(--label-scale-factor));

  margin: var(--margin-vertical) 0;

  &:disabled,
  &.disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }

  .field-wrapper {
    align-items: center;
    display: flex;
    flex-direction: row;
    position: relative;
  }

  .field-wrapper input,
  .field-wrapper label {
    font-size: calc(var(--font-size) * 1px);
  }

  .field-wrapper input {
    background: transparent;
    border: none;
    color: var(--ha-S200-contrast);
    padding: var(--padding-vertical) var(--padding-horizontal);
    outline: none;
    width: 100%;
  }

  .field-wrapper input:-moz-ui-invalid {
    box-shadow: none !important;
  }

  .field-wrapper i {
    color: var(--ha-S200-contrast);
    margin: 0 var(--icon-margin);
    pointer-events: none;
    width: var(--icon-size);
  }

  .field-wrapper label {
    color: var(--ha-S400-contrast);
    pointer-events: none;
  }

  .field-wrapper label.floating {
    left: var(--padding-horizontal);
    line-height: calc((var(--label-font-size-active) * 1px) * 1.45);
    max-width: calc(100% - var(--padding-horizontal) * 2);
    overflow: hidden;
    position: absolute;
    text-overflow: ellipsis;
    transition-duration: var(--transition-duration);
    transform-origin: 0 0;
    transition-property: color, font-size, padding, transform, max-width, left;
    transition-timing-function: var(--transition-timing-function);
    white-space: nowrap;
  }

  .field-wrapper label.reference {
    max-width: var(--label-scale-width);
    padding: 0 var(--floating-label-padding-horizontal) 0 0;
    transform: scale3d(var(--label-scale-factor), var(--label-scale-factor), 1);
  }

  .field-wrapper._leading-icon,
  .field-wrapper._trailing-icon label.floating:not(.reference) {
    max-width: calc(100% - var(--icon-size) + (var(--icon-margin) * 2) + var(--padding-horizontal));
  }

  .field-wrapper._leading-icon._trailing-icon label.floating:not(.reference) {
    max-width: calc(100% - ((var(--icon-size) + (var(--icon-margin) * 2)) * 2));
  }

  .field-wrapper._leading-icon input {
    padding-left: 0;
  }

  .field-wrapper._leading-icon label.floating:not(.reference) {
    left: calc(var(--icon-size) + (var(--icon-margin) * 2));
  }

  .field-wrapper._trailing-icon input {
    padding-right: 0;
  }

  .borders {
    display: flex;
    flex-direction: row;
    height: 100%;
    pointer-events: none;
    position: absolute;
    width: 100%;
  }

  .borders .border {
    border-color: var(--ha-S300);
    border-style: solid;
    transition-duration: var(--transition-duration);
    transition-property: border-color, width;
    transition-timing-function: var(--transition-timing-function);
  }

  .borders .middle {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }

  .borders .middle .top-borders {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .borders .middle .top-borders .border {
    border-width: var(--border-width) 0 0;
    flex: unset;
  }

  .borders .middle .top-borders .border.start {
    width: calc(var(--label-active-width) / 2);
  }

  .borders .middle .border {
    flex: 1 1 auto;
    width: 100%;
  }

  .borders .middle .border.bottom {
    border-width: 0 0 var(--border-width) 0;
  }

  .borders .left,
  .borders .right {
    width: calc(var(--padding-horizontal) - var(--floating-label-padding-horizontal) - var(--border-width));
  }

  .borders .left {
    border-radius: var(--border-radius) 0 0 var(--border-radius);
    border-width: var(--border-width) 0 var(--border-width) var(--border-width);
  }

  .borders .right {
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    border-width: var(--border-width) var(--border-width) var(--border-width) 0;
  }

  .field-wrapper._floating-label._focused .borders .top-borders .start,
  .field-wrapper._floating-label._has-value .borders .top-borders .start {
    width: 0;
  }

  .field-wrapper._floating-label._focused .borders .top-borders .end,
  .field-wrapper._floating-label._has-value .borders .top-borders .end {
    width: calc(100% - var(--label-active-width, 0) - var(--floating-label-padding-horizontal));
  }

  .field-wrapper._floating-label._focused label.floating:not(.reference),
  .field-wrapper._floating-label._has-value label.floating:not(.reference) {
    left: var(--padding-horizontal);
    max-width: var(--label-scale-width);
    padding: 0 var(--floating-label-padding-horizontal) 0 0;
    transform: translate3d(0, calc(-100% - var(--label-font-size-active) * 0.5px), 0)
      scale3d(var(--label-scale-factor), var(--label-scale-factor), 1);
  }

  .field-wrapper._focused label.floating {
    color: var(--ha-300);
  }

  .field-wrapper._focused .borders .top-borders .border {
    border-width: var(--border-width-active) 0 0;
  }

  .field-wrapper._focused .borders .border {
    border-color: var(--ha-300);
  }

  .field-wrapper._focused .borders .border.bottom {
    border-width: 0 0 var(--border-width-active) 0;
  }

  .field-wrapper._focused .borders .border.left {
    border-width: var(--border-width-active) 0 var(--border-width-active) var(--border-width-active);
  }

  .field-wrapper._focused .borders .border.right {
    border-width: var(--border-width-active) var(--border-width-active) var(--border-width-active) 0;
  }

  .field-wrapper._invalid .borders .border {
    border-color: var(--ha-alert-error-color);
  }

  .field-wrapper._invalid label.floating {
    color: var(--ha-alert-error-color);
  }

  .hints {
    color: var(--ha-S400-contrast);
    display: flex;
    flex-direction: row;
    font-size: 12px;
    margin: 4px 12px 0 12px;
  }

  .hints .messages {
    flex: 1 1 auto;
  }

  .hints .error {
    color: var(--ha-alert-error-color);
  }

  .hints .char-counter {
    margin: 0 0 0 12px;
  }
`;

export const TextField: React.FC<TextFieldProps> = ({
  type = "text",
  value: initialValue = "",
  errorMessage: initialErrorMessage = null,
  label,
  placeholder,
  leadingIcon,
  trailingIcon,
  minLength,
  maxLength,
  min,
  max,
  helperText,
  charCounter,
  inputProps,
  className,
  disabled,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState<string | null>(initialValue);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage);
  const [valid, setValid] = useState(true);

  const container = useRef<HTMLDivElement>(null);
  const floatingLabelRef = useRef<HTMLLabelElement>(null);
  const inputField = useRef<HTMLInputElement>(null);

  const setLabelWidthStyleProperty = () => {
    if (floatingLabelRef.current && container.current) {
      const dims = floatingLabelRef.current.getBoundingClientRect();
      container.current.style.setProperty("--label-active-width", `${dims.width}px`);
    } else if (container.current) {
      container.current.style.setProperty("--label-active-width", "0px");
    }
  };

  useEffect(() => {
    setLabelWidthStyleProperty();
    window.addEventListener("resize", setLabelWidthStyleProperty);
    return () => {
      window.removeEventListener("resize", setLabelWidthStyleProperty);
    };
  }, []);

  const focusField = () => {
    inputField.current?.focus();
  };

  const onFocus = () => {
    setFocused(true);
    setLabelWidthStyleProperty();
  };

  const onBlur = () => {
    setFocused(false);
  };

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    updateValidity();
  };

  const updateValidity = () => {
    if (!inputField.current) return;
    setValid(inputField.current.checkValidity());
  };

  const getStyleClasses = () => {
    const classes = [];
    if (label) classes.push("_floating-label");
    if (leadingIcon) classes.push("_leading-icon");
    if (trailingIcon) classes.push("_trailing-icon");
    if (!valid) classes.push("_invalid");
    if (value) classes.push("_has-value");
    if (focused) classes.push("_focused");
    if (disabled) classes.push("disabled");
    return classes.join(" ");
  };

  const showHintContainer = () => {
    return errorMessage || helperText || charCounter;
  };

  const setError = (errorMessage: string) => {
    if (!inputField.current) return;
    inputField.current.setCustomValidity(errorMessage);
    setValid(false);
    setErrorMessage(errorMessage);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (!valid) {
      setError("This field is required");
    }
  }, [valid]);

  return (
    <TextFieldBase className={`outline-input ${className ?? ""}`} {...rest} ref={container}>
      <div className={`field-wrapper ${getStyleClasses()}`} onClick={focusField}>
        {label ? <label className="floating">{label}</label> : null}
        {label ? (
          <label
            ref={floatingLabelRef}
            className="floating reference"
            style={{ opacity: 0, pointerEvents: "none", visibility: "hidden", zIndex: -9999999999 }}
          >
            {label}
          </label>
        ) : null}
        {leadingIcon ? (
          <Icon
            className={"icon leading"}
            icon={leadingIcon}
            style={{
              color: `var(--ha-500-contrast)`,
            }}
          />
        ) : null}
        <input
          ref={inputField}
          type={type}
          minLength={minLength}
          maxLength={maxLength}
          min={min}
          max={max}
          placeholder={focused && label ? placeholder : placeholder}
          value={value || ""}
          onChange={updateValue}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          {...inputProps}
        />
        {trailingIcon ? (
          <Icon
            className={"icon trailing"}
            icon={trailingIcon}
            style={{
              color: `var(--ha-500-contrast)`,
            }}
          />
        ) : null}
        <div className="borders">
          <div className="border left" />
          <div className="middle">
            <div className="top-borders">
              <div className="border start" />
              <div className="border end" />
            </div>
            <div className="border bottom" />
          </div>
          <div className="border right" />
        </div>
      </div>
      {showHintContainer() ? (
        <div className="hints">
          {errorMessage || helperText ? (
            <div className="messages">
              {!valid && errorMessage ? <div className="error">{errorMessage}</div> : null}
              {valid && helperText ? <div className="helper">{helperText}</div> : null}
            </div>
          ) : null}
          {maxLength ? (
            <div className="char-counter">
              {value ? value.length : 0}/{maxLength}
            </div>
          ) : null}
        </div>
      ) : null}
    </TextFieldBase>
  );
};
