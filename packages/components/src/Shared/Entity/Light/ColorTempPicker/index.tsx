import { useRef, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  temperature2rgb,
  rgb2hex,
  rgb2hs,
  useEntity,
  useLightTemperature,
  ON,
  lightSupportsColorMode,
  LIGHT_COLOR_MODES,
} from "@hakit/core";
import type { EntityName, FilterByDomain } from "@hakit/core";
import { useGesture } from "@use-gesture/react";
import { fallback, mq } from "@components";
import { ErrorBoundary } from "react-error-boundary";

const RENDER_SIZE = 400;
const canvasSize = RENDER_SIZE * (typeof window === "undefined" ? 1 : window.devicePixelRatio);

type HueSaturation = [number, number];
type Rgb = [number, number, number];

export interface ColorPickerOutputColors {
  hex: string;
  rgb: Rgb;
  hs: HueSaturation;
}

export interface ColorTempPickerProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** if the picker should be disabled @default false */
  disabled?: boolean;
  /** the light entity to use with the ColorTempPicker */
  entity: FilterByDomain<EntityName, "light">;
  /** will provide the value when the user has finished interacting */
  onChangeApplied?: (kelvin: number, colors: ColorPickerOutputColors) => void;
  /** will provide the value as it's changing but not actually finished updating */
  onChange?: (kelvin: number, colors: ColorPickerOutputColors) => void;
}

const Picker = styled.div`
  ${() => {
    return `
    display: block;
    outline: none;
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
    touch-action: none;
    .container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
    }
    canvas {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 50%;
      transition: box-shadow 180ms ease-in-out;
      cursor: pointer;
    }
    :host(:focus-visible) canvas {
      box-shadow: 0 0 0 2px rgb(255, 160, 0);
    }
    svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    circle {
      fill: black;
      stroke: white;
      stroke-width: 2;
      filter: url(#marker-shadow);
    }
    &[pressed="touch"] {
      circle {
        transform: translate(0px, -${RENDER_SIZE / 16}px) scale(2.5),
      }
    }
    .cursor {
      --cx: ((var(--value-x, 0) + 1) * ${RENDER_SIZE}) / 2;
      --cy: ((var(--value-y, 0) + 1) * ${RENDER_SIZE}) / 2;
      transform: translate(calc(var(--cx) * 1px), calc(var(--cy) * 1px));
    }
    &[pressed] {
      circle {
        transform: translate(0px, 0px) scale(1.5);
      }
    }
    &:not([pressed]) circle {
      transition: transform 100ms ease-in-out, fill 100ms ease-in-out;
    }
    &:not([pressed]) {
      .cursor {
        transition: transform 200ms ease-in-out, opacity 200ms ease-in-out;
      }
    }
    .container.disabled {
      .cursor {
        opacity: 0;
      }
      cursor: not-allowed;
      > * {
        cursor: not-allowed;
      }
    }
    `;
  }}
`;

const SAFE_ZONE_FACTOR = 0.9;

function xy2polar(x: number, y: number) {
  const r = Math.sqrt(x * x + y * y);
  const phi = Math.atan2(y, x);
  return [r, phi];
}

function polar2xy(r: number, phi: number) {
  const x = Math.cos(phi) * r;
  const y = Math.sin(phi) * r;
  return [x, y];
}

function drawColorWheel(ctx: CanvasRenderingContext2D, minTemp: number, maxTemp: number) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const radius = ctx.canvas.width / 2;

  const min = Math.max(minTemp, 2000);
  const max = Math.min(maxTemp, 40000);

  for (let y = -radius; y < radius; y += 1) {
    const x = radius * Math.sqrt(1 - (y / radius) ** 2);

    const fraction = (y / (radius * SAFE_ZONE_FACTOR) + 1) / 2;

    const temperature = Math.max(Math.min(min + fraction * (max - min), max), min);

    const color = rgb2hex(temperature2rgb(temperature));

    ctx.fillStyle = color;
    ctx.fillRect(radius - x, radius + y - 0.5, 2 * x, 2);
    ctx.fill();
  }
}

function _ColorTempPicker({
  disabled = false,
  entity: _entity,
  onChangeApplied,
  onChange,
  className,
  cssStyles,
  ...rest
}: ColorTempPickerProps) {
  const entity = useEntity(_entity);
  const value = useLightTemperature(entity);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>();
  const _cursorPosition = useRef<[number, number]>([0, 0]);
  const min = entity.attributes.min_color_temp_kelvin || 2000;
  const max = entity.attributes.max_color_temp_kelvin || 10000;
  const isOn = entity.state === ON;
  const supportsColorTemp = lightSupportsColorMode(entity, LIGHT_COLOR_MODES.COLOR_TEMP);
  const getColoursFromTemperature = useCallback(
    (temperature: number) => {
      const rgb = temperature2rgb(temperature ?? Math.round((max + min) / 2));
      const hex = rgb2hex(rgb);
      const hs = rgb2hs(rgb);
      return {
        rgb,
        hex,
        hs,
      };
    },
    [max, min],
  );

  const updateColours = useCallback(
    (value: number) => {
      const { hex } = getColoursFromTemperature(value);
      if (gRef.current) {
        gRef.current.style.fill = hex;
      }
      if (circleRef.current) {
        circleRef.current.style.fill = hex;
        circleRef.current.style.visibility = _cursorPosition.current ? "" : "hidden";
      }
    },
    [getColoursFromTemperature],
  );

  const _generateColorWheel = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    drawColorWheel(ctx, min, max);
  }, [min, max]);

  const setPressed = function (pressed: string) {
    if (!parentRef.current) return;
    if (pressed !== "") {
      parentRef.current.setAttribute("pressed", pressed);
    } else {
      parentRef.current.removeAttribute("pressed");
    }
  };

  const _getValueFromCoord = useCallback(
    ([, y]: number[]): number => {
      const fraction = (y / SAFE_ZONE_FACTOR + 1) / 2;
      const temperature = Math.max(Math.min(min + fraction * (max - min), max), min);
      return Math.round(temperature);
    },
    [min, max],
  );

  const setValue = useCallback(
    (updatedValue?: [number, number]) => {
      if (!parentRef.current || !updatedValue) return;
      _cursorPosition.current = updatedValue;
      parentRef.current.style.setProperty("--value-x", disabled ? "0" : `${updatedValue[0]}`);
      parentRef.current.style.setProperty("--value-y", disabled ? "0" : `${updatedValue[1]}`);
      _localValue.current = _getValueFromCoord(_cursorPosition.current);
      updateColours(_localValue.current);
      return () => {
        if (!parentRef.current) return;
        parentRef.current.style.removeProperty("--value-x");
        parentRef.current.style.removeProperty("--value-y");
      };
    },
    [disabled, updateColours, _getValueFromCoord],
  );

  const _getCoordsFromValue = useCallback(
    (temperature?: number): [number, number] => {
      if (value === min) {
        return [0, -1];
      }
      if (value === max) {
        return [0, 1];
      }
      const fraction = ((temperature || 0) - min) / (max - min);
      const y = (2 * fraction - 1) * SAFE_ZONE_FACTOR;
      return [0, y];
    },
    [value, min, max],
  );

  const _localValue = useRef<number>(_getValueFromCoord(_getCoordsFromValue(value)));

  useEffect(() => {
    updateColours(_localValue.current);
  }, [updateColours]);

  useEffect(() => {
    const previousX = _cursorPosition.current[0];
    _cursorPosition.current = [previousX, _getCoordsFromValue(value)[1]];
    setValue(_cursorPosition.current);
  }, [setValue, value, _getCoordsFromValue]);

  const _getPositionFromEvent = useCallback((xy: [number, number], target: HTMLElement): [number, number] => {
    const [x, y] = xy;
    const boundingRect = target.getBoundingClientRect();
    const offsetX = boundingRect.left;
    const offsetY = boundingRect.top;
    const maxX = target.clientWidth;
    const maxY = target.clientHeight;

    const _x = (2 * (x - offsetX)) / maxX - 1;
    const _y = (2 * (y - offsetY)) / maxY - 1;

    const [r, phi] = xy2polar(_x, _y);
    const [__x, __y] = polar2xy(Math.min(1, r), phi);
    return [__x, __y];
  }, []);

  const triggerOnChange = useCallback(
    (updatedValue: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (updatedValue === value) return;
      timerRef.current = setTimeout(() => {
        if (typeof onChangeApplied === "function") {
          const colors = getColoursFromTemperature(updatedValue);
          onChangeApplied(updatedValue, colors);
        }
        entity.service.turnOn({
          kelvin: updatedValue,
        });
      }, 100);
    },
    [onChangeApplied, entity, value, getColoursFromTemperature],
  );

  useEffect(() => {
    if (!supportsColorTemp) return;
    _generateColorWheel();
  }, [_generateColorWheel, supportsColorTemp]);

  function renderSVGFilter() {
    return (
      <filter id="marker-shadow" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
        <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" floodColor="rgba(0, 0, 0, 1)" />
        <feDropShadow dx="0" dy="1" stdDeviation="3" floodOpacity="0.15" floodColor="rgba(0, 0, 0, 1)" />
      </filter>
    );
  }

  const bind = useGesture(
    {
      onDrag: (state) => {
        if (disabled) return;
        setValue(_getPositionFromEvent(state.xy, state.target as HTMLElement));
        if (typeof onChange === "function") {
          const colors = getColoursFromTemperature(_localValue.current);
          onChange(_localValue.current, colors);
        }
      },
      onDragStart: (state) => {
        if (disabled) return;
        setPressed(state.type);
        setValue(_cursorPosition.current);
      },
      onDragEnd: (state) => {
        if (disabled) return;
        setPressed("");
        setValue(_getPositionFromEvent(state.xy, state.target as HTMLElement));
        triggerOnChange(_localValue.current);
      },
      onClick: (state) => {
        const x = state.event.clientX;
        const y = state.event.clientY;
        setValue(_getPositionFromEvent([x, y], state.event.target as HTMLElement));
        triggerOnChange(_localValue.current);
      },
    },
    {
      drag: {
        filterTaps: true,
      },
    },
  );

  return supportsColorTemp ? (
    <Picker
      css={css`
        ${cssStyles ?? ""}
      `}
      className={`${className ?? ""} color-temp-picker`}
      ref={parentRef}
      {...bind()}
      {...rest}
    >
      <div className={`container ${disabled ? "disabled" : ""}`}>
        <canvas ref={canvasRef} width={canvasSize} height={canvasSize}></canvas>
        <svg id="interaction" viewBox={`0 0 ${RENDER_SIZE} ${RENDER_SIZE}`} overflow="visible" aria-hidden="true">
          <defs>{renderSVGFilter()}</defs>
          <g
            ref={gRef}
            className="cursor"
            style={{
              visibility: typeof value === "undefined" || !isOn ? "hidden" : "visible",
            }}
          >
            <circle ref={circleRef} cx="0" cy="0" r="16"></circle>
          </g>
        </svg>
      </div>
    </Picker>
  ) : null;
}

/** This color picker was designed to easily retrieve a value from a colour wheel based on values provided from a light entity, you can click or drag on the picker to pick a value */
export function ColorTempPicker(props: ColorTempPickerProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ColorTempPicker" })}>
      <_ColorTempPicker {...props} />
    </ErrorBoundary>
  );
}
