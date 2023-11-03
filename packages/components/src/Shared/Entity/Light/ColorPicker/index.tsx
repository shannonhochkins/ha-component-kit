import { useRef, useCallback, useEffect } from "react";
import { css } from "@emotion/react";
import { useGesture } from "@use-gesture/react";
import styled from "@emotion/styled";
import {
  rgbw2rgb,
  rgbww2rgb,
  hsv2rgb,
  hs2rgb,
  rgb2hex,
  hex2rgb,
  lightSupportsColorMode,
  useEntity,
  useLightColor,
  lightSupportsColor,
  LIGHT_COLOR_MODES,
  ON,
} from "@hakit/core";
import type { LightColor, EntityName, FilterByDomain } from "@hakit/core";
import { fallback, mq } from "@components";
import { ErrorBoundary } from "react-error-boundary";

const RENDER_SIZE = 400;

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

function rad2deg(rad: number) {
  return (rad / (2 * Math.PI)) * 360;
}

function deg2rad(deg: number) {
  return (deg / 360) * 2 * Math.PI;
}

function adjustRgb(rgb: [number, number, number], wv?: number, cw?: number, ww?: number, minKelvin?: number, maxKelvin?: number) {
  if (wv != null) {
    return rgbw2rgb([...rgb, wv] as [number, number, number, number]);
  }
  if (cw != null && ww !== null) {
    return rgbww2rgb([...rgb, cw, ww] as [number, number, number, number, number], minKelvin, maxKelvin);
  }
  return rgb;
}

function drawColorWheel(
  ctx: CanvasRenderingContext2D,
  colorBrightness = 255,
  wv?: number,
  cw?: number,
  ww?: number,
  minKelvin?: number,
  maxKelvin?: number,
) {
  const radius = ctx.canvas.width / 2;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();

  const cX = ctx.canvas.width / 2;
  const cY = ctx.canvas.width / 2;
  for (let angle = 0; angle < 360; angle += 1) {
    const startAngle = deg2rad(angle - 0.5);
    const endAngle = deg2rad(angle + 1.5);

    ctx.beginPath();
    ctx.moveTo(cX, cY);
    ctx.arc(cX, cY, radius, startAngle, endAngle);
    ctx.closePath();

    const gradient = ctx.createRadialGradient(cX, cY, 0, cX, cY, radius);
    const start = rgb2hex(adjustRgb(hsv2rgb([angle, 0, colorBrightness]), wv, cw, ww, minKelvin, maxKelvin));
    const end = rgb2hex(adjustRgb(hsv2rgb([angle, 1, colorBrightness]), wv, cw, ww, minKelvin, maxKelvin));
    gradient.addColorStop(0, start);
    gradient.addColorStop(1, end);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}
const ColorPickerWrapper = styled.div`
  ${() => {
    const markerPosition = `calc((var(--value-x, 0) + 1) * (${RENDER_SIZE} / 2) * 1px), calc((var(--value-y, 0) + 1) * (${RENDER_SIZE} / 2) * 1px)`;

    return `
    touch-action: none;
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
      cursor: pointer;
    }
    svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .cursor {
      will-change: transform;
      transform: translate(${markerPosition});
    }
    circle {
      fill: black;
      stroke: white;
      stroke-width: 2;
      filter: url(#marker-shadow);
    }
    &:not([pressed]) circle {
      transition:
        transform 100ms ease-in-out,
        fill 100ms ease-in-out;
      translate(0px, 0px) scale(1);
    }
    &:not([pressed]) .cursor {
      transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
    }
    &[pressed="pointerdown"] circle {
      translate(0px, -${RENDER_SIZE / 16}px) scale(1.5);
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

type HueSaturation = [number, number];
type Rgb = [number, number, number];

export interface ColorPickerOutputColors {
  hex: string;
  rgb: Rgb;
  hs?: HueSaturation;
}

export interface ColorPickerProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  disabled?: boolean;
  /** the name of the light entity to control */
  entity: FilterByDomain<EntityName, "light">;
  /** will provide the color output options when the user has finished interacting */
  onChangeApplied?: (colors: ColorPickerOutputColors) => void;
  /** will provide the color output as it's changing but not actually finished updating, the value may also trigger initially once the color calculations have been applied */
  onChange?: (colors: ColorPickerOutputColors) => void;
}
function _ColorPicker({ disabled = false, entity: _entity, onChange, onChangeApplied, className, cssStyles }: ColorPickerProps) {
  const entity = useEntity(_entity);
  const lightColors = useLightColor(entity);
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const hex = useRef<string>();
  const circleRef = useRef<SVGCircleElement>(null);
  const _pressed = useRef<string>();
  const _cursorPosition = useRef<[number, number]>();
  const _localValue = useRef<[number, number]>();
  const canvasSize = RENDER_SIZE * (typeof window === "undefined" ? 1 : window.devicePixelRatio);
  const minKelvin = entity.attributes.min_color_temp_kelvin;
  const maxKelvin = entity.attributes.max_color_temp_kelvin;
  const isOn = entity.state === ON;
  const supportsColor = lightSupportsColor(entity);
  const _generateColorWheel = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    drawColorWheel(ctx, lightColors.colorBrightness, lightColors.white, lightColors.coolWhite, lightColors.warmWhite, minKelvin, maxKelvin);
  }, [lightColors.colorBrightness, lightColors.white, lightColors.coolWhite, lightColors.warmWhite, minKelvin, maxKelvin]);

  useEffect(() => {
    if (!supportsColor) return;
    _generateColorWheel();
  }, [_generateColorWheel, supportsColor]);

  const _getCoordsFromValue = useCallback((value: [number, number]): [number, number] => {
    const phi = deg2rad(value[0]);
    const r = Math.min(value[1], 1);
    const [x, y] = polar2xy(r, phi);
    return [x, y];
  }, []);

  const _getValueFromCoord = useCallback((x: number, y: number): [number, number] => {
    const [r, phi] = xy2polar(x, y);
    const deg = Math.round(rad2deg(phi)) % 360;
    const hue = (deg + 360) % 360;
    const saturation = Math.round(Math.min(r, 1) * 100) / 100;
    return [hue, saturation];
  }, []);

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

  const _resetPosition = useCallback(() => {
    if (lightColors.hs === undefined) {
      _cursorPosition.current = undefined;
      _localValue.current = undefined;
      return;
    }
    _cursorPosition.current = _getCoordsFromValue(lightColors.hs);
    _localValue.current = lightColors.hs;
  }, [_getCoordsFromValue, lightColors.hs]);

  useEffect(() => {
    if (!supportsColor) return;
    _resetPosition();
  }, [lightColors.hs, _resetPosition, supportsColor]);

  const setPressed = function (pressed: boolean, type?: string) {
    _pressed.current = type;
    if (!parentRef.current) return;
    if (pressed) {
      parentRef.current.setAttribute("pressed", "");
    } else {
      parentRef.current.removeAttribute("pressed");
    }
  };
  const updateColours = useCallback(() => {
    const rgb =
      _localValue.current !== undefined
        ? adjustRgb(
            hsv2rgb([_localValue.current[0], _localValue.current[1], lightColors.colorBrightness ?? 255]),
            lightColors.white,
            lightColors.coolWhite,
            lightColors.warmWhite,
          )
        : ([255, 255, 255] as [number, number, number]);
    hex.current = rgb2hex(rgb);
    if (circleRef.current) {
      circleRef.current.style.fill = hex.current;
      circleRef.current.style.visibility = _cursorPosition.current ? "" : "hidden";
    }
    if (gRef.current) {
      gRef.current.style.fill = hex.current;
    }
  }, [lightColors.colorBrightness, lightColors.white, lightColors.coolWhite, lightColors.warmWhite]);

  const setValue = useCallback(
    (updatedValue?: [number, number]) => {
      if (!parentRef.current || !updatedValue) return;
      _cursorPosition.current = updatedValue;
      parentRef.current.style.setProperty("--value-x", disabled ? "0" : `${updatedValue[0]}`);
      parentRef.current.style.setProperty("--value-y", disabled ? "0" : `${updatedValue[1]}`);
      _localValue.current = _getValueFromCoord(..._cursorPosition.current);
      updateColours();
      if (typeof onChange === "function")
        onChange({
          hex: hex.current as string,
          rgb: hex2rgb(hex.current as string),
          hs: _localValue.current,
        });
    },
    [disabled, _getValueFromCoord, onChange, updateColours],
  );

  useEffect(() => {
    const ref = parentRef.current;
    return () => {
      if (!ref) return;
      ref.style.removeProperty("--value-x");
      ref.style.removeProperty("--value-y");
    };
  }, []);

  useEffect(() => {
    if (!supportsColor || lightColors.hs === undefined) return;
    _cursorPosition.current = _getCoordsFromValue(lightColors.hs);
    setValue(_cursorPosition.current);
  }, [lightColors.hs, supportsColor, setValue, _getCoordsFromValue]);

  const _applyColor = useCallback(
    (
      color: LightColor,
      params?: {
        brightness_pct: number;
      },
    ) => {
      entity.service.turnOn({
        ...color,
        ...params,
      });
    },
    [entity],
  );

  const _setRgbWColor = useCallback(
    (rgbColor: [number, number, number]) => {
      if (lightSupportsColorMode(entity, LIGHT_COLOR_MODES.RGBWW)) {
        const rgbwwColor: [number, number, number, number, number] = entity.attributes.rgbww_color
          ? [...entity.attributes.rgbww_color]
          : [0, 0, 0, 0, 0];
        const rgbww_color = rgbColor.concat(rgbwwColor.slice(3)) as [number, number, number, number, number];
        _applyColor({ rgbww_color });
      } else if (lightSupportsColorMode(entity, LIGHT_COLOR_MODES.RGBW)) {
        const rgbwColor: [number, number, number, number] = entity.attributes.rgbw_color ? [...entity.attributes.rgbw_color] : [0, 0, 0, 0];
        const rgbw_color = rgbColor.concat(rgbwColor.slice(3)) as [number, number, number, number];
        _applyColor({ rgbw_color });
      }
    },
    [entity, _applyColor],
  );

  const _adjustColorBrightness = useCallback((rgbColor: [number, number, number], value?: number, invert = false) => {
    const isBlack = rgbColor.every((c) => c === 0);
    if (isBlack) {
      rgbColor[0] = 255;
      rgbColor[1] = 255;
      rgbColor[2] = 255;
    }
    if (value !== undefined && value !== 255) {
      let ratio = value / 255;
      if (invert) {
        ratio = 1 / ratio;
      }
      rgbColor[0] = Math.min(255, Math.round(rgbColor[0] * ratio));
      rgbColor[1] = Math.min(255, Math.round(rgbColor[1] * ratio));
      rgbColor[2] = Math.min(255, Math.round(rgbColor[2] * ratio));
    }
    return rgbColor;
  }, []);

  const _updateColor = useCallback(
    (value?: [number, number]) => {
      if (!value) return;
      const hs_color = [value![0], value![1] * 100] as [number, number];
      const rgb_color = hs2rgb(value!);

      if (lightSupportsColorMode(entity, LIGHT_COLOR_MODES.RGBWW) || lightSupportsColorMode(entity, LIGHT_COLOR_MODES.RGBW)) {
        _setRgbWColor(
          lightColors.colorBrightness ? _adjustColorBrightness(rgb_color, (lightColors.colorBrightness * 255) / 100) : rgb_color,
        );
      } else if (lightSupportsColorMode(entity, LIGHT_COLOR_MODES.RGB)) {
        if (lightColors.brightnessAdjusted) {
          const brightnessAdjust = (lightColors.brightnessAdjusted / 255) * 100;
          const brightnessPercentage = Math.round(((entity.attributes.brightness || 0) * brightnessAdjust) / 255);
          const ajustedRgbColor = _adjustColorBrightness(rgb_color, lightColors.brightnessAdjusted, true);
          _applyColor({ rgb_color: ajustedRgbColor }, { brightness_pct: brightnessPercentage });
        } else {
          _applyColor({ rgb_color });
        }
      } else {
        _applyColor({ hs_color });
      }
    },
    [entity, _setRgbWColor, lightColors.colorBrightness, lightColors.brightnessAdjusted, _adjustColorBrightness, _applyColor],
  );

  const bind = useGesture(
    {
      onDrag: (state) => {
        if (disabled) return;
        _cursorPosition.current = _getPositionFromEvent(state.values, state.target as HTMLElement);
        setValue(_cursorPosition.current);
      },
      onDragStart: (state) => {
        if (disabled) return;
        setPressed(true, state.type);
        setValue(_cursorPosition.current);
      },
      onDragEnd: (state) => {
        if (disabled) return;
        setPressed(false, state.type);
        _cursorPosition.current = _getPositionFromEvent(state.values, state.target as HTMLElement);
        setValue(_cursorPosition.current);
        if (typeof onChangeApplied === "function")
          onChangeApplied({
            hex: hex.current as string,
            rgb: hex2rgb(hex.current as string),
            hs: _localValue.current,
          });
        _updateColor(_localValue.current);
      },
      onClick: (state) => {
        if (disabled) return;
        setPressed(false, undefined);
        const x = state.event.clientX;
        const y = state.event.clientY;
        _cursorPosition.current = _getPositionFromEvent([x, y], state.event.target as HTMLElement);
        setValue(_cursorPosition.current);
        if (typeof onChangeApplied === "function")
          onChangeApplied({
            hex: hex.current as string,
            rgb: hex2rgb(hex.current as string),
            hs: _localValue.current,
          });
        _updateColor(_localValue.current);
      },
    },
    {
      drag: {
        filterTaps: true,
      },
    },
  );

  return supportsColor ? (
    <ColorPickerWrapper
      css={css`
        ${cssStyles ?? ""}
      `}
      className={`${className ?? ""} color-picker`}
      ref={parentRef}
      {...bind()}
    >
      <div className={`container ${disabled ? "disabled" : ""}`}>
        <canvas ref={canvasRef} width={canvasSize} height={canvasSize}></canvas>
        <svg id="interaction" viewBox={`0 0 ${RENDER_SIZE} ${RENDER_SIZE}`} overflow="visible">
          <defs>
            <filter id="marker-shadow" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" floodColor="rgba(0, 0, 0, 1)" />
              <feDropShadow dx="0" dy="1" stdDeviation="3" floodOpacity="0.15" floodColor="rgba(0, 0, 0, 1)" />
            </filter>
          </defs>
          <g
            ref={gRef}
            className="cursor"
            style={{
              visibility: !isOn ? "hidden" : "visible",
            }}
          >
            <circle ref={circleRef} cx="0" cy="0" r="16"></circle>
          </g>
        </svg>
      </div>
    </ColorPickerWrapper>
  ) : null;
}

/** This color picker was designed to easily retrieve a value from a color wheel based on values provided from a light entity, you can click or drag on the picker to pick a value, once applied the color wheel will automatically update your light entity, if the light entity provided does not support color it will not render at all */
export function ColorPicker(props: ColorPickerProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ColorPicker" })}>
      <_ColorPicker {...props} />
    </ErrorBoundary>
  );
}
