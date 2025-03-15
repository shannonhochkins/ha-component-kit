import { useGesture } from "@use-gesture/react";
import { svgArc } from "./svg-arc";
import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import styled from "@emotion/styled";
import { clamp, isNumber } from "lodash";
import { fallback } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { useDebouncedCallback, useThrottledCallback } from "use-debounce";

const Wrapper = styled.div`
  --ha-control-slider-track-bg: #464646;
  --ha-control-slider-track-bg-opacity: 0.3;
  --ha-control-slider-clear: black;
  touch-action: none;
  width: 320px;
  display: block;

  &:after {
    display: block;
    content: "";
    position: absolute;
    top: -10%;
    left: -10%;
    right: -10%;
    bottom: -10%;
    background: radial-gradient(50% 50% at 50% 50%, var(--ha-control-slider-color, transparent) 0%, transparent 100%);
    opacity: 0.15;
    pointer-events: none;
  }
  svg {
    width: 100%;
    display: block;
  }
  .slider {
    outline: none;
  }
  .interaction {
    display: flex;
    fill: none;
    stroke: transparent;
    stroke-linecap: round;
    stroke-width: calc(24px + 2 * 12px);
    cursor: pointer;
  }
  .display {
    pointer-events: none;
  }
  :host([disabled]) #interaction,
  :host([readonly]) #interaction {
    cursor: initial;
  }

  .background {
    fill: none;
    stroke: var(--ha-control-slider-track-bg);
    opacity: var(--ha-control-slider-track-bg-opacity);
    transition:
      stroke 180ms ease-in-out,
      opacity 180ms ease-in-out;
    stroke-linecap: round;
    stroke-width: 24px;
  }

  .arc {
    fill: none;
    stroke-linecap: round;
    stroke-width: 24px;
    transition:
      stroke-width 300ms ease-in-out,
      stroke-dasharray 300ms ease-in-out,
      stroke-dashoffset 300ms ease-in-out,
      stroke 180ms ease-in-out,
      opacity 180ms ease-in-out;
  }

  .target {
    fill: none;
    stroke-linecap: round;
    stroke-width: 18px;
    stroke: white;
    transition:
      stroke-width 300ms ease-in-out,
      stroke-dasharray 300ms ease-in-out,
      stroke-dashoffset 300ms ease-in-out,
      stroke 180ms ease-in-out,
      opacity 180ms ease-in-out;
  }

  .target-border {
    fill: none;
    stroke-linecap: round;
    stroke-width: 24px;
    stroke: white;
    transition:
      stroke-width 300ms ease-in-out,
      stroke-dasharray 300ms ease-in-out,
      stroke-dashoffset 300ms ease-in-out,
      stroke 180ms ease-in-out,
      opacity 180ms ease-in-out;
  }

  .current {
    fill: none;
    stroke-linecap: round;
    stroke-width: 8px;
    stroke: var(--ha-500-contrast);
    opacity: 0.5;
    transition:
      stroke-width 300ms ease-in-out,
      stroke-dasharray 300ms ease-in-out,
      stroke-dashoffset 300ms ease-in-out,
      stroke 180ms ease-in-out,
      opacity 180ms ease-in-out;
  }

  .arc-current {
    stroke: var(--ha-control-slider-clear);
  }

  .arc-clear {
    stroke: var(--ha-control-slider-clear);
  }
  .arc-colored {
    opacity: 0.5;
  }
  .arc-active {
    outline: none;
  }
  .arc-active:focus-visible {
    stroke-width: 28px;
  }

  .pressed .arc,
  .pressed .target,
  .pressed .target-border,
  .pressed .current {
    transition:
      stroke-width 300ms ease-in-out,
      stroke 180ms ease-in-out,
      opacity 180ms ease-in-out;
  }

  .inactive .arc,
  .inactive .arc-current {
    opacity: 0;
  }

  .value {
    stroke: var(--ha-control-slider-color);
  }

  .low {
    stroke: var(--ha-control-slider-low-color);
  }

  .high {
    stroke: var(--ha-control-slider-high-color);
  }
`;

const MAX_ANGLE = 270;
const ROTATE_ANGLE = 360 - MAX_ANGLE / 2 - 90;
const RADIUS = 145;

function xy2polar(x: number, y: number) {
  const r = Math.sqrt(x * x + y * y);
  const phi = Math.atan2(y, x);
  return [r, phi];
}

function rad2deg(rad: number) {
  return (rad / (2 * Math.PI)) * 360;
}

type ActiveSlider = "low" | "high" | "value";

export type ControlCircularSliderMode = "start" | "end" | "full";

export interface ControlSliderCircularProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  /** the value of the slider */
  value?: number;
  /** the low end value if low/high values are supported */
  low?: number;
  /** the high end value if low/high values are supported */
  high?: number;
  /** should the slider become disabled @default false */
  disabled?: boolean;
  /** should the slider become readonly @default false */
  readonly?: boolean;
  /** should the slider support dual values @default false */
  dual?: boolean;
  /** the mode of the slider */
  mode?: ControlCircularSliderMode;
  /** should the slider become inactive @default false */
  inactive?: boolean;
  /** the label of the slider used for screen readers */
  label?: string;
  /** the current value of the slider which places a dot on the slider */
  current?: number;
  /** the step of the slider @default 1 */
  step?: number;
  /** the minimum value of the slider @default 0 */
  min?: number;
  /** the maximum value of the slider @default 100 */
  max?: number;
  /** the colors of the slider, if single value, just use color, else use high and low color */
  colors?: {
    color?: string;
    lowColor?: string;
    highColor?: string;
  };
  /** called whenever the value changes, you should not use this to update state but rather display the value visually using refs for example, updates are throttled to 20ms */
  onChange?: (value: number, type: ActiveSlider) => void;
  /** called whenever the value changes and the user has finished interacting with the slider */
  onChangeApplied?: (value: number, type: ActiveSlider) => void;
}

function InternalControlSliderCircular({
  step = 1,
  inactive,
  label,
  readonly = false,
  value,
  low,
  high,
  min = 0,
  max = 100,
  dual,
  disabled = false,
  mode,
  current,
  colors = {
    color: "tomato",
    lowColor: "blue",
    highColor: "tomato",
  },
  onChange,
  onChangeApplied,
  ...rest
}: ControlSliderCircularProps) {
  const _sliderRef = useRef<HTMLDivElement>(null);
  const _svgRef = useRef<SVGSVGElement>(null);
  const _activeSlider = useRef<ActiveSlider | undefined>(undefined);
  const _lastSlider = useRef<ActiveSlider | undefined>(undefined);
  const [localValue, setLocalValue] = useState<number | undefined>(value);
  const [localLow, setLocalLow] = useState<number | undefined>(low);
  const [localHigh, setLocalHigh] = useState<number | undefined>(high);

  const trackPath = useMemo(
    () =>
      svgArc({
        x: 0,
        y: 0,
        start: 0,
        end: MAX_ANGLE,
        r: RADIUS,
      }),
    [],
  );

  const lowValue = dual ? localLow : localValue;
  const highValue = localHigh;

  useEffect(() => {
    if (isNumber(value)) setLocalValue(value);
    if (isNumber(low)) setLocalLow(low);
    if (isNumber(high)) setLocalLow(high);
  }, [value, low, high]);

  const _setActiveValue = useCallback((value: number) => {
    switch (_activeSlider.current) {
      case "high":
        setLocalHigh(value);
        break;
      case "low":
        setLocalLow(value);
        break;
      case "value":
        setLocalValue(value);
        break;
    }
  }, []);

  useEffect(() => {
    if (!_sliderRef.current) return;
    if (colors.color) _sliderRef.current.style.setProperty("--ha-control-slider-color", colors.color);
    if (colors.lowColor) _sliderRef.current.style.setProperty("--ha-control-slider-low-color", colors.lowColor);
    if (colors.highColor) _sliderRef.current.style.setProperty("--ha-control-slider-high-color", colors.highColor);
  }, [colors]);

  const _valueToPercentage = useCallback(
    (value: number) => {
      return (clamp(value, min, max) - min) / (max - min);
    },
    [max, min],
  );

  const _percentageToValue = useCallback(
    (value: number) => {
      return (max - min) * value + min;
    },
    [max, min],
  );

  const _steppedValue = useCallback(
    (value: number) => {
      return Math.round(value / step) * step;
    },
    [step],
  );

  const _strokeDashArc = useCallback(
    (from: number, to: number): [string, string] => {
      const start = _valueToPercentage(from);
      const end = _valueToPercentage(to);

      const track = (RADIUS * 2 * Math.PI * MAX_ANGLE) / 360;
      const arc = Math.max((end - start) * track, 0);
      const arcOffset = start * track - 0.5;

      const strokeDasharray = `${arc} ${track - arc}`;
      const strokeDashOffset = `-${arcOffset}`;
      return [strokeDasharray, strokeDashOffset];
    },
    [_valueToPercentage],
  );

  const _strokeCircleDashArc = useCallback(
    (value: number): [string, string] => {
      return _strokeDashArc(value, value);
    },
    [_strokeDashArc],
  );

  const currentStroke = current ? _strokeCircleDashArc(current) : undefined;

  const _boundedValue = useCallback(
    (value: number) => {
      const _min = _activeSlider.current === "high" ? Math.min(localLow ?? max) : min;
      const _max = _activeSlider.current === "low" ? Math.max(localHigh ?? min) : max;
      return Math.min(Math.max(value, _min), _max);
    },
    [localLow, max, min, localHigh],
  );

  const renderArc = useCallback(
    (id: string, value: number | undefined, mode: ControlCircularSliderMode) => {
      if (disabled) return null;

      const path = svgArc({
        x: 0,
        y: 0,
        start: 0,
        end: MAX_ANGLE,
        r: RADIUS,
      });

      const limit = mode === "end" ? max : min;

      const _current = current ?? limit;
      const target = value ?? limit;

      const showActive = mode === "end" ? target <= _current : mode === "start" ? _current <= target : false;

      const showTarget = value != null;

      const activeArc = showTarget
        ? showActive
          ? mode === "end"
            ? _strokeDashArc(target, _current)
            : _strokeDashArc(_current, target)
          : _strokeCircleDashArc(target)
        : undefined;

      const coloredArc =
        mode === "full" ? _strokeDashArc(min, max) : mode === "end" ? _strokeDashArc(target, limit) : _strokeDashArc(limit, target);

      const targetCircle = showTarget ? _strokeCircleDashArc(target) : undefined;

      const currentCircle =
        current != null && current <= max && current >= min && (showActive || mode === "full") ? _strokeCircleDashArc(current) : undefined;

      return (
        <g className={`${inactive ? "inactive" : ""}`}>
          <path className="arc arc-clear" d={path} strokeDasharray={coloredArc[0]} strokeDashoffset={coloredArc[1]} />
          <path className={`arc arc-colored ${id}`} d={path} strokeDasharray={coloredArc[0]} strokeDashoffset={coloredArc[1]} />
          {activeArc ? (
            <path
              d={path}
              className={`arc arc-active ${id}`}
              strokeDasharray={activeArc[0]}
              strokeDashoffset={activeArc[1]}
              role="slider"
              tabIndex={0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={localValue != null ? _steppedValue(localValue) : undefined}
              aria-disabled={disabled}
              aria-readonly={readonly}
              aria-label={label}
            />
          ) : null}
          {currentCircle ? (
            <path className="current arc-current" d={path} strokeDasharray={currentCircle[0]} strokeDashoffset={currentCircle[1]} />
          ) : null}
          {targetCircle ? (
            <>
              <path className={`target-border ${id}`} d={path} strokeDasharray={targetCircle[0]} strokeDashoffset={targetCircle[1]} />
              <path className="target" d={path} strokeDasharray={targetCircle[0]} strokeDashoffset={targetCircle[1]} />
            </>
          ) : null}
        </g>
      );
    },
    [_steppedValue, _strokeCircleDashArc, _strokeDashArc, current, disabled, inactive, label, localValue, max, min, readonly],
  );

  const _getPercentageFromEvent = useCallback((xy: [number, number]) => {
    if (!_sliderRef.current) return 0;
    const bound = _sliderRef.current.getBoundingClientRect();
    const x = (2 * (xy[0] - bound.left - bound.width / 2)) / bound.width;
    const y = (2 * (xy[1] - bound.top - bound.height / 2)) / bound.height;

    const [, phi] = xy2polar(x, y);

    const offset = (360 - MAX_ANGLE) / 2;

    const angle = ((rad2deg(phi) + offset - ROTATE_ANGLE + 360) % 360) - offset;

    return Math.max(Math.min(angle / MAX_ANGLE, 1), 0);
  }, []);

  const _findActiveSlider = useCallback(
    (value: number): ActiveSlider => {
      if (!dual) return "value";
      const low = Math.max(localLow ?? min, min);
      const high = Math.min(localHigh ?? max, max);
      if (low >= value) {
        return "low";
      }
      if (high <= value) {
        return "high";
      }
      const lowDistance = Math.abs(value - low);
      const highDistance = Math.abs(value - high);
      return lowDistance <= highDistance ? "low" : "high";
    },
    [dual, localHigh, localLow, max, min],
  );

  const triggerOnChangeApplied = useDebouncedCallback((updatedValue: number, type: ActiveSlider) => {
    if (typeof onChangeApplied !== "function") return;
    onChangeApplied(updatedValue, type);
  }, 100, {
    trailing: true,
    leading: true,
  });

  const triggerOnChange = useThrottledCallback((updatedValue: number, type: ActiveSlider) => {
    if (typeof onChange !== "function") return;
    onChange(updatedValue, type);
  }, 20, {
    trailing: true,
    leading: true,
  });

  const bind = useGesture(
    {
      onDrag: (state) => {
        if (disabled || readonly) return;
        const { first, last } = state;
        // 'movement' contains the delta of the drag
        if (!first && !last) {
          // Add your 'panmove' logic here
          const values = state.values;
          const [x, y] = values;
          const percentage = _getPercentageFromEvent([x, y]);
          const raw = _percentageToValue(percentage);
          const bounded = _boundedValue(raw);
          _setActiveValue(bounded);
          const stepped = _steppedValue(bounded);
          const type = _findActiveSlider(raw);
          triggerOnChange(stepped, type);
        }
      },
      onDragStart: (state) => {
        if (disabled || readonly) return;
        const values = state.values;
        const [x, y] = values;
        const percentage = _getPercentageFromEvent([x, y]);
        const raw = _percentageToValue(percentage);
        _activeSlider.current = _findActiveSlider(raw);
        _lastSlider.current = _activeSlider.current;
        if (_svgRef.current) {
          _svgRef.current.focus();
        }
      },
      onDragEnd: (state) => {
        if (disabled) return;
        const values = state.values;
        const [x, y] = values;
        const percentage = _getPercentageFromEvent([x, y]);
        const raw = _percentageToValue(percentage);
        const bounded = _boundedValue(raw);
        const stepped = _steppedValue(bounded);
        _setActiveValue(stepped);
        _activeSlider.current = _findActiveSlider(raw);
        triggerOnChange(stepped, _activeSlider.current);
        triggerOnChangeApplied(stepped, _activeSlider.current);
        _activeSlider.current = undefined;
      },
      onPointerDown: (state) => {
        state.event.stopPropagation();
        state.event.preventDefault();
        if (disabled || readonly) return;
        const percentage = _getPercentageFromEvent([state.event.clientX, state.event.clientY]);
        const raw = _percentageToValue(percentage);
        _activeSlider.current = _findActiveSlider(raw);
        const bounded = _boundedValue(raw);
        const stepped = _steppedValue(bounded);
        _setActiveValue(bounded);
        triggerOnChange(stepped, _activeSlider.current);
      },
      onPointerUp: (state) => {
        if (disabled || readonly) return;
        state.event.stopPropagation();
        state.event.preventDefault();
        if (disabled || readonly) return;
        const percentage = _getPercentageFromEvent([state.event.clientX, state.event.clientY]);
        const raw = _percentageToValue(percentage);
        _activeSlider.current = _findActiveSlider(raw);
        const bounded = _boundedValue(raw);
        const stepped = _steppedValue(bounded);
        triggerOnChange(stepped, _activeSlider.current);
        triggerOnChangeApplied(stepped, _activeSlider.current);
        _activeSlider.current = undefined;
      },
    },
    {
      drag: {
        filterTaps: true,
      },
    },
  );

  return (
    <Wrapper className="control-slider-circular" ref={_sliderRef} {...bind()} {...rest}>
      <svg
        ref={_svgRef}
        viewBox="0 0 320 320"
        overflow="visible"
        className={`slider ${_activeSlider.current ? "pressed" : ""}`}
        tabIndex={_lastSlider.current ? 0 : -1}
      >
        <g className="container" transform={`translate(160 160) rotate(${ROTATE_ANGLE})`}>
          <g className="interaction">
            <path d={trackPath} />
          </g>
          <g className="display">
            <path className="background" d={trackPath} />
            {currentStroke ? (
              <path className="current" d={trackPath} strokeDasharray={currentStroke[0]} strokeDashoffset={currentStroke[1]} />
            ) : null}
            {lowValue != null || mode === "full" ? renderArc(dual ? "low" : "value", lowValue, (!dual && mode) || "start") : null}
            {dual && highValue != null ? renderArc("high", highValue, "end") : null}
          </g>
        </g>
      </svg>
    </Wrapper>
  );
}

/** A interactive slider similar to the home assistant circular slider to control climate & humidifier entities */
export function ControlSliderCircular(props: ControlSliderCircularProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ControlSliderCircular" })}>
      <InternalControlSliderCircular {...props} />
    </ErrorBoundary>
  );
}
