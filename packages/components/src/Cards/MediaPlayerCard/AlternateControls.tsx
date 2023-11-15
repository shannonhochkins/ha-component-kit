import { Row, RowProps } from "@components";
import { EntityName, FilterByDomain, isUnavailableState, OFF, supportsFeatureFromAttributes, useEntity, useService } from "@hakit/core";
import { DEFAULT_FAB_SIZE, StyledFab } from "./index.tsx";
import styled from "@emotion/styled";

const SmallText = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 1);
`;

interface AlternateControlsProps extends RowProps {
  entity: FilterByDomain<EntityName, "media_player">;
  disabled: boolean;
  allEntityIds: string[];
  onSpeakerGroupClick: () => void;
  layoutId: string;
}

export function AlternateControls({ entity: _entity, disabled, allEntityIds, onSpeakerGroupClick, layoutId }: AlternateControlsProps) {
  const entity = useEntity(_entity);
  const mp = useService("mediaPlayer");
  const supportsGrouping = supportsFeatureFromAttributes(entity.attributes, 524288);
  const groups = entity.attributes.group_members ?? [];
  const isOff = entity.state === OFF;
  const isUnavailable = isUnavailableState(entity.state);
  const supportsTurnOn = supportsFeatureFromAttributes(entity.attributes, 128);
  const supportsTurnOff = supportsFeatureFromAttributes(entity.attributes, 256);

  return (
    <Row gap="0.5rem" wrap="nowrap" className="row">
      {supportsGrouping && (
        <StyledFab
          layoutId={layoutId}
          className="speaker-group"
          iconColor={`var(--ha-S200-contrast)`}
          active={groups.length > 0}
          disabled={disabled}
          size={DEFAULT_FAB_SIZE}
          icon={groups.length === 0 ? "mdi:speaker-off" : "mdi:speaker-multiple"}
          onClick={() => {
            onSpeakerGroupClick();
          }}
        />
      )}
      {(isUnavailable || isOff) && <SmallText>{entity.state}</SmallText>}
      <StyledFab
        className="media-player-power"
        iconColor={`var(--ha-S200-contrast)`}
        active={!isOff && !isUnavailable}
        disabled={disabled || !supportsTurnOn || !supportsTurnOff}
        size={DEFAULT_FAB_SIZE}
        icon="mdi:power"
        onClick={() => {
          if (isOff) {
            mp.turnOn(allEntityIds);
          } else {
            mp.turnOff(allEntityIds);
          }
        }}
      />
    </Row>
  );
}
