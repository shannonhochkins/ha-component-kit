import { useState, useEffect, useRef, ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useDebouncedCallback } from "use-debounce";
import { fallback, mq } from "@components";
import { ErrorBoundary } from "react-error-boundary";

const StyledRange = styled.div<{
  handleSize: number;
}>`
  ${(props) => `
    min-width: 6rem;
    width: 100%;
    position: relative;
    isolation: isolate;

    ${mq(
      ["xxs", "xs", "sm"],
      `
      min-width: 0;
    `,
    )}

    z-index: 1;

    .range-slider-range {
      position: relative;
      -webkit-appearance: none;
      width: 100%;
      height: 0.7rem;
      border-radius: 5px;
      background: var(--ha-S400);
      outline: none;
      padding: 0;
      margin: 0;
      z-index: 1;

      &::-webkit-slider-thumb {
        appearance: none;
        width: ${props.handleSize}px;
        height: ${props.handleSize}px;
        border-radius: 50%;
        background: var(--ha-A400);
        cursor: pointer;
        transition: background var(--ha-transition-duration) var(--ha-easing);
        position: relative;
        z-index: 1;

        &:hover {
          background: var(--ha-A200);
        }
      }

      &:active::-webkit-slider-thumb {
        background: var(--ha-A400);
      }

      &::-moz-range-thumb {
        width: ${props.handleSize}px;
        height: ${props.handleSize}px;
        border: 0;
        border-radius: 50%;
        background: var(--ha-A400);
        cursor: pointer;
        transition: background var(--ha-transition-duration) var(--ha-easing);
        z-index: 1;

        &:hover {
          background: var(--ha-A200);
        }
      }

      &:active::-moz-range-thumb {
        background: var(--ha-A400);
      }
      
      &:focus {
        &::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px var(--ha-A100);
        }
      }
    }

    // Firefox Overrides
    ::-moz-range-track {
        background: var(--ha-S400);
        border: 0;
    }

    input::-moz-focus-inner,
    input::-moz-focus-outer { 
      border: 0; 
    }

    
    &:hover, &.active {
      .tooltip-holder {
        > div {
          transform: translate(-50%, -1rem) rotate(-45deg) scale(1);
          opacity: 1;
        }
      }
    }
  `}
`;

const Tooltip = styled.div<{
  size: number;
}>`
  opacity: 0;
  position: absolute;
  bottom: 100%;
  width: ${({ size }) => `${size}rem`};
  height: ${({ size }) => `${size}rem`};
  border-radius: 50% 50% 50% 0;
  left: 0;
  transform: translate(-50%, 1rem) rotate(-45deg) scale(0);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: transform, opacity;
  background-color: var(--ha-A400);
  white-space: nowrap;
  pointer-events: none;
  z-index: 0;
  &:after {
    content: attr(data-title);
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transform: rotate(45deg);
    position: absolute;
    inset: 0;
    border-radius: 50%;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--ha-S50-contrast);
`;

const Description = styled.span`
  display: block;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  color: var(--ha-S500-contrast);
`;

export interface RangeSliderProps extends Omit<React.ComponentPropsWithoutRef<"input">, "onInput" | "onChange"> {
  /** The minimum value for the input @default 0 */
  min?: number;
  /** The maximum value for the input @default 100 */
  max?: number;
  /** The step value for the input @default 1 */
  step?: number;
  /** The value for the input @default 0 */
  value?: number;
  /** The handle size in px for the input @default 15 */
  handleSize?: number;
  /** The label for the input @default undefined */
  onChange?: (value: number) => void;
  /** The label for the input @default undefined */
  label?: ReactNode;
  /** The description for the input @default undefined */
  description?: ReactNode;
  /** should the tooltip value be hidden @default false */
  hideTooltip?: boolean;
  /** function to format the value displayed in the tooltip */
  formatTooltipValue?: (value: number) => string;
  /** tooltip size, increase/decrease the size of the tooltip, value should be a number representing rems @default 2 */
  tooltipSize?: number;
}

function _RangeSlider({
  value: _value,
  onChange,
  formatTooltipValue,
  hideTooltip,
  label,
  description,
  className,
  style,
  tooltipSize = 2,
  handleSize = 15,
  min: _min = 0,
  max: _max = 100,
  step: _step = 1,
  cssStyles,
  ...rest
}: RangeSliderProps) {
  const [value, setValue] = useState(_value ?? 0);
  const [active, setActive] = useState(false);
  const rangeRef = useRef<HTMLInputElement>(null);
  const parentRangeRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof _value === "number") {
      setValue(_value);
    }
  }, [_value]);

  useEffect(() => {
    if (!rangeRef.current || hideTooltip) return;
    const min = parseFloat(`${_min ?? 0}`);
    const max = parseFloat(`${_max ?? 100}`);
    const step = parseFloat(`${_step ?? 1}`);
    const roundedValue = parseFloat(rangeRef.current.valueAsNumber.toFixed(step < 1 ? Math.abs(Math.log10(step)) : 0));
    const percentage = ((rangeRef.current.valueAsNumber - min) / (max - min)) * 100;

    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${percentage}%`;
      const tooltipValue = typeof formatTooltipValue === "function" ? formatTooltipValue(roundedValue) : roundedValue;
      tooltipRef.current.setAttribute("data-title", `${tooltipValue}`);
    }
  }, [value, _min, _max, _step, formatTooltipValue, hideTooltip]);

  const debouncedOnChange = useDebouncedCallback((value: number) => {
    if (typeof onChange === "function") {
      onChange(value);
    }
    setActive(false);
  }, 300);

  return (
    <div
      className={`${className ?? ""} ${active ? "active" : ""} range-slider`}
      style={{ position: "relative", ...(style ?? {}) }}
      css={css`
        ${cssStyles ?? ""}
      `}
    >
      {label && <Label className="label">{label}</Label>}
      {description && <Description className="description">{description}</Description>}
      <StyledRange ref={parentRangeRef} handleSize={handleSize} className={`range-slider-inner ${active ? "active" : ""}`}>
        <input
          {...rest}
          min={_min}
          max={_max}
          step={_step}
          ref={rangeRef}
          type="range"
          className="range-slider-range"
          value={value}
          onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
            setValue(event.target.valueAsNumber);
            if (!active) setActive(true);
          }}
          onChange={(event) => {
            debouncedOnChange(event.target.valueAsNumber);
          }}
        />
        {!hideTooltip && (
          <div
            className="tooltip-holder"
            style={{
              position: "absolute",
              top: 0,
              left: handleSize / 2,
              right: handleSize / 2,
            }}
          >
            <Tooltip size={tooltipSize} ref={tooltipRef} />
          </div>
        )}
      </StyledRange>
    </div>
  );
}

/** The RangeSlider is a simple component that allows you to provide a slider to extract a value and do something with it */
export function RangeSlider(props: RangeSliderProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "RangeSlider" })}>
      <_RangeSlider {...props} />
    </ErrorBoundary>
  );
}
