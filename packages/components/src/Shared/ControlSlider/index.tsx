import { useRef, useEffect, useCallback } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useGesture } from "@use-gesture/react";
import { fallback, mq } from "@components";
import { ErrorBoundary } from "react-error-boundary";

export interface ControlSliderProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  /** the orientation of the slider @default true */
  vertical?: boolean;
  /** hide the handle on the slider @default false */
  showHandle?: boolean;
  /** the value of the slider, this should equal to or between the min/max values */
  value: number;
  /** the mode of the slider @default start */
  mode?: "start" | "end" | "cursor";
  /** the minimum value of the slider @default 0 */
  min?: number;
  /** the max value of the slider @default 100 */
  max?: number;
  /** the thickness of the slider @default 40 */
  thickness?: number;
  /** the border radius of the slider @default 10 */
  borderRadius?: number;
  /** the step increment of the slider @default 1 */
  step?: number;
  /** should the slider be disabled @default false*/
  disabled?: boolean;
  /** the colour to theme the slider, this should be in rgb format or a css color value [number, number, number] @default [70, 70, 70] */
  sliderColor?: [number, number, number] | string;
  /** called when the slider is being dragged around @default undefined */
  onChange?: (value: number) => void;
  /** called when the user has finished interacting with the slider @default undefined */
  onChangeApplied?: (value: number) => void;
}

const Slider = styled.div<Pick<ControlSliderProps, "disabled" | "sliderColor" | "vertical" | "showHandle" | "thickness" | "borderRadius">>`
  ${(props) => {
    const defaultColor = [70, 70, 70];
    let color = `rgb(${defaultColor.join(", ")})`;
    if (!props.disabled) {
      if (typeof props.sliderColor === "string") {
        color = props.sliderColor;
      } else {
        color = `rgb(${(props.sliderColor || defaultColor).join(",")})`;
      }
    }
    return `
      
      touch-action: none;
      --ha-slider-control-thickness: ${props.thickness || 40}px;
      --ha-slider-control-border-radius: ${props.borderRadius || 10}px;
      --ha-slider-control-handle-size: 4px;
      --ha-slider-control-handle-margin: calc(var(--ha-slider-control-thickness) / 8);
      --ha-slider-control-slider-size: ${
        props.showHandle ? "calc(100% - 2 * var(--ha-slider-control-handle-margin) - var(--ha-slider-control-handle-size))" : "100%"
      };
      
      border-radius: var(--ha-slider-control-border-radius);
      outline: 0px;
      &:focus-visible {
        box-shadow: 0 0 0 2px ${color};
      }
      &:not([vertical]) {
        width: 100%;
        height: var(--ha-slider-control-thickness);
        max-width: 420px;
        min-width: 320px;
      }
      &[vertical] {
        width: var(--ha-slider-control-thickness);
        height: 45vh;
        max-height: 320px;
        min-height: 200px;
        ${mq(
          ["xxs"],
          `
          min-height: 0;
          height: 35vh;
          max-height: 100%;
        `,
        )}
      }
      .slider {
        position: relative;
        height: 100%;
        width: 100%;
        border-radius: var(--ha-slider-control-border-radius);
        transform: translateZ(0px);
        overflow: hidden;
        cursor: pointer;
      }
      .slider * {
        pointer-events: none;
      }
      .slider-track-background {
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
        background: ${color};
        opacity: 0.2;
      }
      .slider-track-bar {
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: ${color};
        transition: transform 180ms ease-in-out, background-color 180ms ease-in-out;                
        &:after {
          display: ${props.showHandle ? "block" : "none"};
          content: "";
          position: absolute;
          margin: auto;
          border-radius: var(--ha-slider-control-handle-size);
          background-color: white;
        }
      }
      .slider-track-cursor {
        position: absolute;
        background-color: ${color};
        border-radius: var(--ha-slider-control-handle-size);
        transition:
          left 180ms ease-in-out,
          bottom 180ms ease-in-out;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }
      &.horizontal {
        .slider-track-bar {
          top: 0;
          left: 0;
          transform: translate3d(
            calc((var(--value, 0) - 1) * var(--ha-slider-control-slider-size)),
            0,
            0
          );
          border-radius: 0 var(--ha-slider-control-border-radius) var(--ha-slider-control-border-radius) 0;
          &:after {
            top: 0;
            bottom: 0;
            right: var(--ha-slider-control-handle-margin);
            height: 50%;
            width: var(--ha-slider-control-handle-size);
          }
          &.end {
            right: 0;
            left: initial;
            transform: translate3d(
              calc(var(--value, 0) * var(--ha-slider-control-slider-size)),
              0,
              0
            );
            border-radius: var(--ha-slider-control-border-radius) 0 0 var(--ha-slider-control-border-radius);
            &:after {
              right: initial;
              left: var(--ha-slider-control-handle-margin);
            }
          }
        }
        .slider-track-cursor {
          top: 0;
          bottom: 0;
          left: calc(var(--value, 0) * (100% - calc(var(--ha-slider-control-thickness) / 4)));
          width: calc(var(--ha-slider-control-thickness) / 4);
          right: 0;
          height: calc(var(--ha-slider-control-thickness) / 4)
          &:after {
            height: 50%;
            width: var(--ha-slider-control-handle-size);
          }
        }
      }
      &.vertical {
        .slider-track-bar {
          bottom: 0;
          left: 0;
          transform: translate3d(
            0,
            calc((1 - var(--value, 0)) * var(--ha-slider-control-slider-size)),
            0
          );
          border-radius: var(--ha-slider-control-border-radius) var(--ha-slider-control-border-radius) 0 0;
          &:after {
            top: var(--ha-slider-control-handle-margin);
            right: 0;
            left: 0;
            bottom: initial;
            width: 50%;
            height: var(--ha-slider-control-handle-size);
          }
          &.end {
            top: 0;
            bottom: initial;
            transform: translate3d(
              0,
              calc((0 - var(--value, 0)) * var(--ha-slider-control-slider-size)),
              0
            );
            border-radius: 0 0 var(--ha-slider-control-border-radius) var(--ha-slider-control-border-radius);
            &:after {
              top: initial;
              bottom: var(--ha-slider-control-handle-margin);
            }
          }
        }
        .slider-track-cursor {
          top: initial;
          right: 0;
          left: 0;
          bottom: calc(var(--value, 0) * (100% - calc(var(--ha-slider-control-thickness) / 4)));
          height: calc(var(--ha-slider-control-thickness) / 4);
          width: 100%;
          &:after {
            width: 50%;
            height: var(--ha-slider-control-handle-size);
          }
        }
      }
      &[dragging] .slider-track-bar,
      &[dragging] .slider-track-cursor {
        transition: none;
      }
      &.disabled {
        cursor: not-allowed;
        > * {
          cursor: not-allowed;
        }
      }
    `;
  }}
`;

const SliderHolder = styled.div``;
const SliderTrackBackground = styled.div``;
const SliderTrackBar = styled.div``;

function _ControlSlider({
  vertical = true,
  disabled = false,
  showHandle = true,
  min = 0,
  max = 100,
  step = 1,
  value,
  mode = "start",
  thickness,
  borderRadius,
  sliderColor = [70, 70, 70],
  onChangeApplied,
  onChange,
  cssStyles,
  className,
  ...rest
}: ControlSliderProps) {
  const trackBarRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const inlineValue = useRef(value);
  const timerRef = useRef<NodeJS.Timeout | undefined>();
  const boundedValue = useCallback(
    (value: number) => {
      return Math.min(Math.max(value, min), max);
    },
    [min, max],
  );

  const valueToPercentage = useCallback(
    (value: number) => {
      return (boundedValue(value) - min) / (max - min);
    },
    [min, max, boundedValue],
  );

  const percentageToValue = useCallback(
    (value: number) => {
      return (max - min) * value + min;
    },
    [min, max],
  );

  const steppedValue = useCallback(
    (value: number) => {
      return Math.round(value / step) * step;
    },
    [step],
  );

  const triggerOnChange = useCallback(
    (updatedValue: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (updatedValue === value || typeof onChangeApplied !== "function") return;
      timerRef.current = setTimeout(() => {
        onChangeApplied(updatedValue);
      }, 100);
    },
    [onChangeApplied, value],
  );

  const _getPercentageFromEvent = useCallback(
    (xy: [number, number], target: HTMLElement) => {
      const [x, y] = xy;
      if (vertical) {
        const offset = target.getBoundingClientRect().top;
        const total = target.clientHeight;
        return Math.max(Math.min(1, 1 - (y - offset) / total), 0);
      }
      const offset = target.getBoundingClientRect().left;
      const total = target.clientWidth;
      return Math.max(Math.min(1, (x - offset) / total), 0);
    },
    [vertical],
  );
  const setValue = useCallback(
    (updatedValue: number) => {
      if (!trackBarRef.current) return;
      inlineValue.current = updatedValue;
      trackBarRef.current.style.setProperty(
        "--value",
        disabled ? (mode === "start" ? `${min}` : mode === "end" ? `${max}` : "0") : `${valueToPercentage(updatedValue)}`,
      );
    },
    [valueToPercentage, disabled, min, max, mode],
  );

  useEffect(() => {
    setValue(value);
  }, [value, setValue]);

  useEffect(() => {
    if (!parentRef.current) return;
    if (vertical) {
      parentRef.current.setAttribute("vertical", "");
    } else {
      parentRef.current.removeAttribute("vertical");
    }
  }, [vertical]);

  const setPressed = function (pressed: boolean) {
    if (!parentRef.current) return;
    if (pressed) {
      parentRef.current.setAttribute("dragging", "");
    } else {
      parentRef.current.removeAttribute("dragging");
    }
  };

  const bind = useGesture(
    {
      onDrag: (state) => {
        if (disabled) return;
        const percentage = _getPercentageFromEvent(state.values, state.target as HTMLElement);
        setPressed(state.dragging === true);
        setValue(percentageToValue(percentage));
        if (typeof onChange === "function") onChange(inlineValue.current);
      },
      onDragStart: () => {
        if (disabled) return;
        setPressed(true);
        setValue(inlineValue.current);
      },
      onDragEnd: (state) => {
        if (disabled) return;
        setPressed(false);
        const percentage = _getPercentageFromEvent(state.values, state.target as HTMLElement);
        setValue(steppedValue(percentageToValue(percentage)));
        triggerOnChange(inlineValue.current);
      },
      onClick: (state) => {
        if (disabled) return;
        const x = state.event.clientX;
        const y = state.event.clientY;
        const percentage = _getPercentageFromEvent([x, y], state.event.target as HTMLElement);
        setValue(steppedValue(percentageToValue(percentage)));
        triggerOnChange(inlineValue.current);
      },
    },
    {
      drag: {
        filterTaps: true,
      },
    },
  );

  return (
    <Slider
      ref={parentRef}
      className={`${className ?? ""} slider-host ${disabled ? "disabled" : ""} ${vertical ? "vertical" : "horizontal"}`}
      css={css`
        ${cssStyles ?? ""}
      `}
      showHandle={showHandle && !disabled}
      sliderColor={sliderColor}
      vertical={vertical}
      thickness={thickness}
      borderRadius={borderRadius}
      disabled={disabled}
      {...bind()}
      {...rest}
    >
      <SliderHolder ref={sliderRef} className="slider">
        <SliderTrackBackground className="slider-track-background" />
        {mode === "cursor" ? (
          inlineValue.current != null ? (
            <div className="slider-track-cursor" ref={trackBarRef}></div>
          ) : null
        ) : (
          <SliderTrackBar className={`slider-track-bar ${mode}`} ref={trackBarRef} />
        )}
      </SliderHolder>
    </Slider>
  );
}

/** A interactive slider to control values ranging between two other values, eg brightness on a light, or curtain position etc.. */
export function ControlSlider(props: ControlSliderProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ControlSlider" })}>
      <_ControlSlider {...props} />
    </ErrorBoundary>
  );
}
