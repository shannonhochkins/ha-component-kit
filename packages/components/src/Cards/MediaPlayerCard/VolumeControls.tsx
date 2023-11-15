import { EntityName, FilterByDomain, supportsFeatureFromAttributes, useEntity, useService } from "@hakit/core";
import { useCallback, useRef, useState } from "react";
import { mq, RangeSlider } from "@components";
import styled from "@emotion/styled";
import { DEFAULT_FAB_SIZE, Layout, StyledFab, VolumeLayout } from "./index.tsx";

const VolumeSlider = styled.label<{
  layout: Layout;
}>`
  display: inline-block;
  width: auto;
  color: rgba(0, 0, 0, 0.87);
  font-size: 1rem;
  line-height: 1.5;
  ${mq(
    ["xxs"],
    `
    width: 40%;
  `,
  )}

  ${mq(
    ["xs", "sm"],
    `
    width: 60%;
  `,
  )}
`;

interface VolumeProps {
  entity: FilterByDomain<EntityName, "media_player">;
  volumeLayout: VolumeLayout;
  hideMute: boolean;
  disabled: boolean;
  allEntityIds?: string[];
  layout: Layout;
}

export function VolumeControls({ entity: _entity, volumeLayout, hideMute, disabled, allEntityIds, layout }: VolumeProps) {
  const entity = useEntity(_entity);
  const { volume_level, is_volume_muted } = entity.attributes;
  const [volume, _setVolume] = useState(volume_level);
  const mp = useService("mediaPlayer");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const supportsVolumeSet = supportsFeatureFromAttributes(entity.attributes, 4);
  const supportsVolumeMute = supportsFeatureFromAttributes(entity.attributes, 8);
  const setVolume = useCallback(
    (volume: number) => {
      _setVolume(volume);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        mp.volumeSet(allEntityIds ?? _entity, {
          volume_level: volume,
        });
      }, 500);
    },
    [mp, allEntityIds, _setVolume],
  );

  return (
    <>
      {!hideMute && supportsVolumeMute && (
        <StyledFab
          iconColor={`var(--ha-S200-contrast)`}
          className={`volume-mute ${is_volume_muted ? "muted" : "not-muted"}`}
          disabled={disabled}
          size={DEFAULT_FAB_SIZE}
          icon={is_volume_muted ? "mdi:volume-off" : "mdi:volume-high"}
          onClick={() => {
            mp.volumeMute(allEntityIds ?? _entity, {
              is_volume_muted: !is_volume_muted,
            });
          }}
        />
      )}
      {volumeLayout === "buttons" && supportsVolumeSet && (
        <>
          <StyledFab
            iconColor={`var(--ha-S200-contrast)`}
            className="volume-down"
            disabled={disabled}
            size={DEFAULT_FAB_SIZE}
            icon="mdi:volume-minus"
            onClick={() => mp.volumeDown(allEntityIds ?? _entity)}
          />
          <StyledFab
            iconColor={`var(--ha-S200-contrast)`}
            className="volume-up"
            disabled={disabled}
            size={DEFAULT_FAB_SIZE}
            icon="mdi:volume-plus"
            onClick={() => mp.volumeUp(allEntityIds ?? _entity)}
          />
        </>
      )}
      {volumeLayout === "slider" && supportsVolumeSet && (
        <VolumeSlider className="volume-slider" layout={layout}>
          <RangeSlider
            type="range"
            min={0}
            max={1}
            disabled={disabled}
            step={0.02}
            value={is_volume_muted ? 0 : volume}
            formatTooltipValue={(value) => `${Math.round(value * 100)}%`}
            tooltipSize={2.2}
            onChange={(value) => setVolume(value)}
          />
        </VolumeSlider>
      )}
    </>
  );
}
