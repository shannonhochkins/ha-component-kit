import { useState, useEffect } from "react";
import { Column, RangeSlider, Row, FabCard, Tooltip, Alert } from "@components";
import styled from "@emotion/styled";
import { LIGHT, DARK, ACCENT, DEFAULT_THEME_OPTIONS } from "./constants";
import { useDebouncedCallback } from "use-debounce";

const Title = styled.span`
  font-size: 0.9rem;
  color: var(--ha-S100-contrast);
`;

const Pallette = styled(Row)`
  font-size: 0.8rem;
  width: 3.5rem;
  height: 3.5rem;
`;

const RangeSliderBox = styled.div`
  padding: 0.5rem;
  width: 100%;
  background-color: var(--ha-S100);
  border-radius: 0.5rem;
`;

export interface ThemeControlsProps {
  hue?: number;
  saturation?: number;
  lightness?: number;
  tint?: number;
  contrastThreshold?: number;
  darkMode?: boolean;
  onChange: (theme: Omit<ThemeControlsProps, "onChange">) => void;
}

export function ThemeControls({
  darkMode = DEFAULT_THEME_OPTIONS.darkMode,
  tint = DEFAULT_THEME_OPTIONS.tint,
  hue = DEFAULT_THEME_OPTIONS.hue,
  saturation = DEFAULT_THEME_OPTIONS.saturation,
  lightness = DEFAULT_THEME_OPTIONS.lightness,
  contrastThreshold = DEFAULT_THEME_OPTIONS.contrastThreshold,
  onChange,
}: ThemeControlsProps) {
  const [h, setHue] = useState(hue);
  const [l, setLight] = useState(lightness);
  const [t, setTint] = useState(tint);
  const [s, setSat] = useState(saturation);
  const [dark, setDark] = useState(darkMode);
  const [c, setContrastThreshold] = useState(contrastThreshold);

  const debouncedOnChange = useDebouncedCallback((_theme: Required<Omit<ThemeControlsProps, "onChange">>) => {
    if (typeof onChange === "function") {
      onChange(_theme);
    }
  }, 50);

  useEffect(() => {
    debouncedOnChange({
      hue: h,
      saturation: s,
      lightness: l,
      tint: t,
      contrastThreshold: c,
      darkMode: dark,
    });
  }, [c, contrastThreshold, dark, darkMode, h, hue, l, lightness, debouncedOnChange, s, saturation, t, tint]);

  return (
    <Column
      fullWidth
      gap="1rem"
      wrap="nowrap"
      style={{
        padding: "1rem 0",
      }}
    >
      <Row fullWidth gap="1rem" wrap="nowrap">
        <RangeSliderBox>
          <RangeSlider
            label="Shade Tint"
            description="Will change the hue tint for the shade colors"
            min={0}
            max={1}
            step={0.05}
            value={t}
            onChange={(value) => {
              setTint(value);
            }}
          />
        </RangeSliderBox>
        <RangeSliderBox>
          <RangeSlider
            label="Contrast Threshold"
            description="Changes output calculation for text color"
            min={0}
            max={100}
            step={1}
            value={c}
            onChange={(value) => {
              setContrastThreshold(value);
            }}
          />
        </RangeSliderBox>
      </Row>
      <Row fullWidth gap="1rem" wrap="nowrap">
        <RangeSliderBox>
          <RangeSlider
            label="Saturation"
            description="Control the saturation of the color"
            min={0}
            max={100}
            value={s}
            onChange={(value) => {
              setSat(value);
            }}
          />
        </RangeSliderBox>
        <RangeSliderBox>
          <RangeSlider
            label="Lightness"
            description="Control how bright the primary colors are"
            min={0}
            max={100}
            value={l}
            onChange={(value) => {
              setLight(value);
            }}
          />
        </RangeSliderBox>
      </Row>
      <RangeSliderBox>
        <RangeSlider
          label="Hue"
          description="Change the overall hue of the colors"
          min={0}
          max={360}
          value={h}
          onChange={(value) => {
            setHue(value);
          }}
        />
      </RangeSliderBox>

      <Row justifyContent="flex-start" fullWidth gap="1rem">
        <Title>Dark / Light mode</Title>
        <FabCard
          tooltipPlacement="right"
          title={dark ? "Change to light mode" : "Change to dark mode"}
          icon={!dark ? "ph:sun" : "ph:moon"}
          onClick={() => {
            setDark(!dark);
          }}
        />
      </Row>
      <Row justifyContent="flex-start" fullWidth>
        <Alert>Hover over the pallette's below to see the respective css variables.</Alert>
      </Row>
      <Row wrap="nowrap" fullWidth justifyContent="flex-start">
        {LIGHT.map((color, index) => {
          return (
            <Column gap="1rem" key={color}>
              <Title>{index === 0 ? "Primary" : <>&nbsp;</>}</Title>
              <Tooltip
                placement="top"
                title={
                  <Column alignItems="flex-start">
                    <span>background-color: var(--ha-{color});</span>
                    <span>color: var(--ha-{color}-contrast);</span>
                  </Column>
                }
              >
                <Pallette
                  style={{
                    color: `var(--ha-${color}-contrast)`,
                    backgroundColor: `var(--ha-${color})`,
                  }}
                >
                  {color}
                </Pallette>
              </Tooltip>
              <Title>{index === 0 ? "Shade" : <>&nbsp;</>}</Title>
              <Tooltip
                placement="top"
                title={
                  <Column alignItems="flex-start">
                    <span>background-color: var(--ha-S{color});</span>
                    <span>color: var(--ha-S{color}-contrast);</span>
                  </Column>
                }
              >
                <Pallette
                  style={{
                    color: `var(--ha-S${color}-contrast)`,
                    backgroundColor: `var(--ha-S${color})`,
                  }}
                >
                  S{color}
                </Pallette>
              </Tooltip>
            </Column>
          );
        })}
        <Column gap="1rem">
          <Title>{<>&nbsp;</>}</Title>
          <Tooltip
            placement="top"
            title={
              <Column alignItems="flex-start">
                <span>background-color: var(--ha-500);</span>
                <span>color: var(--ha-500-contrast);</span>
              </Column>
            }
          >
            <Pallette
              style={{
                transform: "scale(1.1)",
                transformOrigin: "bottom",
                color: `var(--ha-500-contrast)`,
                backgroundColor: `var(--ha-500)`,
              }}
            >
              500
            </Pallette>
          </Tooltip>
          <Title>{<>&nbsp;</>}</Title>
          <Tooltip
            placement="top"
            title={
              <Column alignItems="flex-start">
                <span>background-color: var(--ha-S500);</span>
                <span>color: var(--ha-S500-contrast);</span>
              </Column>
            }
          >
            <Pallette
              style={{
                transform: "scale(1.1)",
                transformOrigin: "top",
                color: `var(--ha-S500-contrast)`,
                backgroundColor: `var(--ha-S500)`,
              }}
            >
              S500
            </Pallette>
          </Tooltip>
        </Column>
        {DARK.map((color) => {
          return (
            <Column key={color} gap="1rem">
              <Title>{<>&nbsp;</>}</Title>
              <Tooltip
                placement="top"
                title={
                  <Column alignItems="flex-start">
                    <span>background-color: var(--ha-{color});</span>
                    <span>color: var(--ha-{color}-contrast);</span>
                  </Column>
                }
              >
                <Pallette
                  style={{
                    color: `var(--ha-${color}-contrast)`,
                    backgroundColor: `var(--ha-${color})`,
                  }}
                >
                  {color}
                </Pallette>
              </Tooltip>
              <Title>{<>&nbsp;</>}</Title>
              <Tooltip
                placement="top"
                title={
                  <Column alignItems="flex-start">
                    <span>background-color: var(--ha-S{color});</span>
                    <span>color: var(--ha-S{color}-contrast);</span>
                  </Column>
                }
              >
                <Pallette
                  style={{
                    color: `var(--ha-S${color}-contrast)`,
                    backgroundColor: `var(--ha-S${color})`,
                  }}
                >
                  S{color}
                </Pallette>
              </Tooltip>
            </Column>
          );
        })}
      </Row>
      <Row fullWidth justifyContent="flex-start">
        {ACCENT.map((color, index) => {
          return (
            <Column key={color} gap="1rem">
              <Title>{index === 0 ? "Accent" : <>&nbsp;</>}</Title>
              <Tooltip
                placement="top"
                title={
                  <Column alignItems="flex-start">
                    <span>background-color: var(--ha-{color});</span>
                    <span>color: var(--ha-{color}-contrast);</span>
                  </Column>
                }
              >
                <Pallette
                  style={{
                    color: `var(--ha-${color}-contrast)`,
                    backgroundColor: `var(--ha-${color})`,
                  }}
                >
                  {color}
                </Pallette>
              </Tooltip>
              <Title>{index === 0 ? "Shade" : <>&nbsp;</>}</Title>
              <Tooltip
                placement="top"
                title={
                  <Column alignItems="flex-start">
                    <span>background-color: var(--ha-S{color});</span>
                    <span>color: var(--ha-S{color}-contrast);</span>
                  </Column>
                }
              >
                <Pallette
                  style={{
                    color: `var(--ha-S${color}-contrast)`,
                    backgroundColor: `var(--ha-S${color})`,
                  }}
                >
                  S{color}
                </Pallette>
              </Tooltip>
            </Column>
          );
        })}
      </Row>
    </Column>
  );
}
