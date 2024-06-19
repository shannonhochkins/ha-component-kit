import { EntityName, FilterByDomain, OFF, supportsFeatureFromAttributes, useEntity, useService } from "@hakit/core";
import { Fab } from "../Fab";

export interface PlaybackControlsProps {
  entity: FilterByDomain<EntityName, "media_player">;
  disabled: boolean;
  allEntityIds: string[];
  size?: number;
  feature?: boolean;
}
export function PlaybackControls({ entity: _entity, size = 20, feature, disabled, allEntityIds }: PlaybackControlsProps) {
  const entity = useEntity(_entity);
  const mp = useService("mediaPlayer");
  const playing = entity.state === "playing";
  const isOff = entity.state === OFF;
  const supportsPreviousTrack = supportsFeatureFromAttributes(entity.attributes, 16);
  const supportsNextTrack = supportsFeatureFromAttributes(entity.attributes, 32);
  const supportsPlay = supportsFeatureFromAttributes(entity.attributes, 16384);
  return (
    <>
      <Fab
        className="skip-previous"
        disabled={disabled || isOff || !supportsPreviousTrack}
        size={size}
        iconProps={{
          color: `var(--ha-S200-contrast)`,
        }}
        icon="mdi:skip-previous"
        rippleProps={{
          preventPropagation: true,
        }}
        onClick={() => mp.mediaPreviousTrack(allEntityIds)}
      />
      <Fab
        className="play-pause"
        iconProps={{
          color: `var(--ha-S200-contrast)`,
        }}
        disabled={disabled || isOff || !supportsPlay}
        size={size * (feature ? 2 : 1)}
        rippleProps={{
          preventPropagation: true,
        }}
        icon={playing ? "mdi:pause" : "mdi:play"}
        onClick={() => {
          if (playing) {
            mp.mediaPause(allEntityIds);
          } else {
            mp.mediaPlay(allEntityIds);
          }
        }}
      />
      <Fab
        rippleProps={{
          preventPropagation: true,
        }}
        className="skip-next"
        iconProps={{
          color: `var(--ha-S200-contrast)`,
        }}
        disabled={disabled || isOff || !supportsNextTrack}
        size={size}
        icon="mdi:skip-next"
        onClick={() => mp.mediaNextTrack(allEntityIds)}
      />
    </>
  );
}
